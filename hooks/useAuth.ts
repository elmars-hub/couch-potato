"use client";

import { createClient as createBrowserClient } from "@/lib/supabase/client";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const supabase = createBrowserClient();
  const queryClient = useQueryClient();
  const [authLoading, setAuthLoading] = useState(false);
  const router = useRouter();

  const signUp = async (email: string, password: string, name?: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      // attach token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await axios.post(
          "/api/users/create",
          {},
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
      router.refresh();
      router.push("/login");
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        await axios.post(
          "/api/users/create",
          {},
          { headers: { Authorization: `Bearer ${session.access_token}` } }
        );
      }

      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      await queryClient.refetchQueries({ queryKey: ["auth-user"] });
      router.refresh();
      router.push("/");
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      queryClient.setQueryData(["auth-user"], null);
      router.refresh();
      router.push("/");
    } finally {
      setAuthLoading(false);
    }
  };

  const updateProfile = async (updates: { name?: string }) => {
    setAuthLoading(true);
    try {
      const { data } = await axios.patch("/api/profile", updates);

      queryClient.setQueryData(["auth-user"], (prev: any) => {
        if (!prev) return data.user ?? prev;
        return { ...prev, ...(data.user || {}), ...(updates || {}) };
      });

      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      return data;
    } finally {
      setAuthLoading(false);
    }
  };

  return { signUp, signIn, signOut, updateProfile, authLoading };
}
