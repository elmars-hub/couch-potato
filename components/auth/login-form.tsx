"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      setError(loginError.message || "Login failed");
    }
  };

  return (
    <div className="glass-panel p-8 rounded-2xl animate-scale-in shadow-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl cinematic-gradient flex items-center justify-center animate-glow">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">Couch Potato</h1>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back
        </h2>
        <p className="text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="glass-input h-12"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className="glass-input h-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 cinematic-gradient hover:opacity-90 transition-opacity text-white font-semibold text-base"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Sign In"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <p className="text-center text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
