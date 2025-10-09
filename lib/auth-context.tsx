/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth as useAuthActions } from "@/hooks/useAuth";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { signUp, signIn, signOut, updateProfile } = useAuthActions();
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();

  // fetch DB user via /api/users/me
  const { data, isLoading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      // get Supabase session
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) return null;

      // send token to API
      const { data } = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.user as AuthUser;
    },
    retry: false, // don’t retry if unauthenticated
  });

  // Keep React Query auth-user in sync with Supabase auth state
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (
          event === "SIGNED_IN" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
          await queryClient.refetchQueries({ queryKey: ["auth-user"] });
        }
        if (event === "SIGNED_OUT") {
          queryClient.setQueryData(["auth-user"], null);
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [supabase, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
}
