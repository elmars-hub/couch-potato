/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema, loginSchema } from "@/lib/validation";
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
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "../ui/spinner";

export function LoginForm() {
  const { signIn, authLoading } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginSchema) {
    try {
      await signIn(values.email, values.password);
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in. Please try again.");
    }
  }

  return (
    <div className="glass-panel p-8 rounded-2xl animate-scale-in shadow-2xl">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl  flex items-center justify-center animate-glow">
            <Film className="w-7 h-7 text-[#E50914]" />
          </div>
          <h1 className="text-3xl font-bold text-[#E50914]">Couch Potato</h1>
        </div>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome Back
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <Button
            type="submit"
            className="w-full h-12 bg-[#E50914] hover:bg-[#E50914]/70 cursor-pointer transition-colors duration-300 text-white font-semibold text-base"
            disabled={authLoading}
          >
            {authLoading ? <Spinner className="size-6" /> : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
