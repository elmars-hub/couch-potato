import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/auth/user-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Film } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="h-6 w-6" />
            <h1 className="text-xl font-bold">Couch Potato</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu
                user={{
                  id: user.id,
                  email: user.email!,
                  name: user.user_metadata?.name || null,
                }}
              />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
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

          {user ? (
            <div className="space-y-4">
              <p className="text-lg">
                Welcome back,{" "}
                <span className="font-semibold">
                  {user.user_metadata?.name || user.email}
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
            {user ? (
              <div className="space-y-1 text-sm">
                <p>✅ Logged in</p>
                <p>User ID: {user.id}</p>
                <p>Email: {user.email}</p>
                <p>Name: {user.user_metadata?.name || "Not set"}</p>
              </div>
            ) : (
              <p className="text-sm">❌ Not logged in</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
