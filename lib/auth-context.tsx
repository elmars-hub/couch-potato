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
        queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(["auth-user"], null);
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
      try {
        const { data } = await axios.get("/api/auth/sync-user");
        return data.user;
      } catch (error) {
        console.error("Failed to sync user", error);
        return null;
      }
    },
    enabled: !!supabaseUser && isHydrated,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // 🔹 Mutations
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/");
      router.refresh();
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
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      router.push("/");
      router.refresh();
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      router.push("/");
      router.refresh();
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth-user"] }),
  });

  const authLoading =
    signInMutation.isPending ||
    signUpMutation.isPending ||
    signOutMutation.isPending ||
    updateProfileMutation.isPending;

  const contextValue: AuthContextType = {
    user: user ?? null,
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
