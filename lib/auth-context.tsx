"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl?: string | null;
}

interface AuthError {
  message: string;
  status?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    name?: string;
  }) => Promise<{ error: AuthError | null }>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);

  // Fetch user from Supabase + sync with database
  const {
    data: user,
    isLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async (): Promise<AuthUser | null> => {
      if (!supabaseUser) return null;

      try {
        const res = await fetch("/api/auth/sync-user");
        if (!res.ok) throw new Error("Failed to sync user");
        const data = await res.json();
        return data.user;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    enabled: !!supabaseUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Listen for Supabase auth changes
  useEffect(() => {
    const supabase = createClient();
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

  // React Query mutations
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
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update profile");
      }
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth-user"] }),
  });

  // Context value
  const contextValue: AuthContextType = {
    user: user ?? null,
    isLoading,
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
    signOut: async () => await signOutMutation.mutateAsync(),
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
