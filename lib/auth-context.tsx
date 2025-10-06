"use client";

import type React from "react";
import axios, { type AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { AuthUser, AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      setIsHydrated(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSupabaseUser(session?.user ?? null);

      if (event === "SIGNED_IN") {
        // Optimistically set user data from Supabase metadata
        const optimisticUser: AuthUser = {
          id: session?.user?.id ?? "",
          email: session?.user?.email ?? "",
          name: session?.user?.user_metadata?.name ?? null,
          avatarUrl: session?.user?.user_metadata?.avatar_url ?? null,
          createdAt: new Date(session?.user?.created_at ?? Date.now()),
          updatedAt: new Date(),
        };
        queryClient.setQueryData(["auth-user"], optimisticUser);

        // Then fetch full user data in background
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(["auth-user"], null);
        queryClient.removeQueries({ queryKey: ["auth-user"] });
      }
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const {
    data: user,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async (): Promise<AuthUser | null> => {
      if (!supabaseUser) return null;
      const { data } = await axios.get("/api/auth/sync-user");
      return data.user;
    },
    enabled: !!supabaseUser && isHydrated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Use supabaseUser immediately, fallback to API user later
  const resolvedUser =
    user ??
    (supabaseUser
      ? {
          id: supabaseUser.id,
          email: supabaseUser.email ?? "",
          name: supabaseUser.user_metadata?.name ?? null,
          avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(),
        }
      : null);

  //  Mutations
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Set optimistic data immediately for instant UI update
      if (data.user) {
        const optimisticUser: AuthUser = {
          id: data.user.id,
          email: data.user.email ?? "",
          name: data.user.user_metadata?.name ?? null,
          avatarUrl: data.user.user_metadata?.avatar_url ?? null,
          createdAt: new Date(data.user.created_at),
          updatedAt: new Date(),
        };
        queryClient.setQueryData(["auth-user"], optimisticUser);
      }

      // Navigate immediately without waiting for API sync
      router.push("/");

      // Sync in background
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Navigate immediately
      router.push("/login");
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      // Clear data and navigate immediately
      queryClient.setQueryData(["auth-user"], null);
      router.push("/");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { name?: string }) => {
      try {
        const { data } = await axios.patch("/api/profile", updates);
        return data;
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        throw new Error(err.response?.data?.message || "Failed to update user");
      }
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["auth-user"] });

      // Snapshot previous value
      const previousUser = queryClient.getQueryData<AuthUser>(["auth-user"]);

      // Optimistically update
      if (previousUser) {
        queryClient.setQueryData<AuthUser>(["auth-user"], {
          ...previousUser,
          ...updates,
        });
      }

      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(["auth-user"], context.previousUser);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["auth-user"],
        exact: true,
      });
    },
  });

  const authLoading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    signOutMutation.isPending ||
    updateProfileMutation.isPending;

  const contextValue: AuthContextType = {
    user: resolvedUser,
    isLoading: !isHydrated || userLoading,
    authLoading,
    signIn: async (email, password) => {
      try {
        await signInMutation.mutateAsync({ email, password });
        return { error: null };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? { message: err.message }
              : { message: "Unknown error" },
        };
      }
    },
    signUp: async (email, password, name) => {
      try {
        await signUpMutation.mutateAsync({ email, password, name });
        return { error: null };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? { message: err.message }
              : { message: "Unknown error" },
        };
      }
    },
    signOut: async () => {
      try {
        await signOutMutation.mutateAsync();
        return { error: null };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? { message: err.message }
              : { message: "Unknown error" },
        };
      }
    },
    updateProfile: async (updates) => {
      try {
        await updateProfileMutation.mutateAsync(updates);
        return { error: null };
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? { message: err.message }
              : { message: "Unknown error" },
        };
      }
    },
    refetchUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
