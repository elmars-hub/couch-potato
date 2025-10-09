/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signupSchema, SignupSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Film } from "lucide-react";
import { Spinner } from "../ui/spinner";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function SignupForm() {
  const { signUp, authLoading } = useAuth();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupSchema) {
    try {
      await signUp(values.email, values.password, values.name);
      toast.success("Signed up successfully!");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up. Please try again.");
    }
  }

  return (
    <div className="glass-panel p-8 rounded-2xl animate-scale-in shadow-2xl">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-glow">
            <Film className="w-7 h-7 text-[#E50914]" />
          </div>
          <h1 className="text-3xl font-bold text-[#E50914]">Couch Potato</h1>
        </div>
      </div>

      <div className="text-center mb-3">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Create Account
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Full Name */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      {...field}
                      className="glass-input h-12"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-base" />
                </FormItem>
              )}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="glass-input h-12"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-base" />
                </FormItem>
              )}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="glass-input h-12"
                    />
                  </FormControl>
                  <FormMessage className="mt-1 text-base" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#E50914] hover:bg-[#E50914]/70 cursor-pointer transition-colors duration-300 text-white font-semibold text-base"
            disabled={authLoading}
          >
            {authLoading ? <Spinner className="size-6" /> : "Sign Up"}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
