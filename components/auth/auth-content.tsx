"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function AuthContent() {
  const { user, isLoading } = useAuth();

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Your Personal Movie & TV Tracker
          </h2>
          <p className="text-xl text-muted-foreground">
            Discover, track, and organize your favorite movies and TV shows
            all in one place.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto" />
            <div className="flex gap-4 justify-center">
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <p className="text-lg">
              Welcome back,{" "}
              <span className="font-semibold">
                {user.name || user.email}
              </span>
              !
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/movies">Browse Movies</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/tv">Browse TV Shows</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Sign up to start building your personal collection
            </p>
            <Button size="lg" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        )}

        {/* Auth Status Debug Info */}
        <div className="mt-12 p-4 bg-muted rounded-lg text-left">
          <h3 className="font-semibold mb-2">Auth Status:</h3>
          {isLoading ? (
            <p className="text-sm">🔄 Loading...</p>
          ) : user ? (
            <div className="space-y-1 text-sm">
              <p>✅ Logged in</p>
              <p>User ID: {user.id}</p>
              <p>Email: {user.email}</p>
              <p>Name: {user.name || "Not set"}</p>
              <p>Avatar: Email-based</p>
            </div>
          ) : (
            <p className="text-sm">❌ Not logged in</p>
          )}
        </div>
      </div>
    </main>
  );
}
