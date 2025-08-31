"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = getBrowserSupabase();

  const title = mode === "login" ? "Log in" : "Sign up";
  const description =
    mode === "login"
      ? "Access your dashboard with your email and password."
      : "Create an account to start using the dashboard.";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const redirectTo =
          (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL as string) ||
          `${window.location.origin}/dashboard`;

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;

        toast({
          title: "Check your inbox",
          description: "Confirm your email to complete sign up. You will be redirected after verification.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Authentication error",
        description: err?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-sm bg-gray-900/70 backdrop-blur-lg border border-transparent shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 rounded-xl"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-semibold shadow-md"
          >
            {loading ? (mode === "login" ? "Logging in…" : "Signing up…") : title}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}