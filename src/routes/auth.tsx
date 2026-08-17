import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Feather, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/use-auth";
import hero from "@/assets/hero.jpg";

type Search = { mode?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    mode: search["mode"] === "signup" ? "signup" : "login",
  }),
  head: () => ({
    meta: [
      { title: "Sign in · Scriptorium Assignment Studio" },
      {
        name: "description",
        content:
          "Log in or create a Scriptorium account to write, save and revisit full university assignments.",
      },
      { property: "og:title", content: "Sign in · Scriptorium" },
      { property: "og:description", content: "Access your saved assignments and presets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const routeNavigate = Route.useNavigate();
  const navigate = useNavigate();
  const isSignup = mode === "signup";
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/library" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const fullName = String(form.get("name") ?? "");
    const university = String(form.get("university") ?? "");
    setBusy(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/library`,
            data: { full_name: fullName, university },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your inbox if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/library" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/library" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        src={hero}
        alt=""
        width={1600}
        height={1008}
        className="absolute inset-0 h-full w-full animate-kenburns object-cover"
      />
      <div className="absolute inset-0 bg-background/85" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="surface-card w-full max-w-md animate-rise p-8">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Feather className="h-5 w-5" />
            <span className="font-display text-lg">Scriptorium</span>
          </Link>

          <h1 className="mt-6 text-4xl">{isSignup ? "Create account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "Save every assignment you write to your own library."
              : "Pick up your assignments exactly where you left them."}
          </p>

          <Button
            type="button"
            variant="outline"
            onClick={google}
            className="mt-6 h-11 w-full rounded-full"
          >
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <>
                <div className="animate-rise space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" name="name" placeholder="Ada Lovelace" required className="h-11" />
                </div>
                <div className="animate-rise space-y-2">
                  <Label htmlFor="university">University</Label>
                  <Input
                    id="university"
                    name="university"
                    placeholder="University of Punjab"
                    className="h-11"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@campus.edu"
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={6}
                required
                className="h-11"
              />
            </div>
            <Button type="submit" disabled={busy} className="h-11 w-full rounded-full">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <button
            onClick={() => routeNavigate({ search: { mode: isSignup ? "login" : "signup" } })}
            className="mt-6 w-full text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            {isSignup ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </div>
      </div>
    </main>
  );
}
