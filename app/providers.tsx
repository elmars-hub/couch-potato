"use client";

import type React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "@/lib/auth-context";
import { useState } from "react";
import type { AuthUser } from "@/types/auth";

export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser?: AuthUser | null;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Seed initial user into React Query cache so UI has immediate access
  if (initialUser !== undefined) {
    queryClient.setQueryData(["auth-user"], initialUser);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
