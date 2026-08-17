import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Feather, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
          "Log in or create a Scriptorium account to save assignment drafts, templates and typeface presets.",
      },
      { property: "og:title", content: "Sign in · Scriptorium" },
      { property: "og:description", content: "Access your assignment drafts and saved templates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = Route.useNavigate();
  const isSignup = mode === "signup";
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    await new Promise((r) => setTimeout(r, 800));
    setBusy(false);
    toast.success(isSignup ? "Account created (demo)" : "Welcome back (demo)");
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
      <div className="absolute inset-0 bg-background/80" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24">
        <div className="surface-card w-full max-w-md animate-rise p-8">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Feather className="h-5 w-5" />
            <span className="font-display text-lg">Scriptorium</span>
          </Link>

          <h1 className="mt-6 text-4xl">{isSignup ? "Create account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup
              ? "Save drafts, templates and typeface presets to your desk."
              : "Pick up your drafts exactly where you left them."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {isSignup && (
              <div className="space-y-2 animate-rise">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Ada Lovelace" required className="h-11" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@campus.edu" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required className="h-11" />
            </div>
            <Button type="submit" disabled={busy} className="h-11 w-full rounded-full">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSignup ? "Create account" : "Log in"}
            </Button>
          </form>

          <button
            onClick={() => navigate({ search: { mode: isSignup ? "login" : "signup" } })}
            className="mt-6 w-full text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
          >
            {isSignup ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </div>
      </div>
    </main>
  );
}
