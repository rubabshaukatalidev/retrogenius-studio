import { Link } from "@tanstack/react-router";
import { Feather } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export function SiteNav() {
  const { user } = useAuth();
  return (
    <header className="fixed inset-x-0 top-0 z-50">

      <div className="mx-auto mt-4 flex w-[min(1180px,92vw)] items-center justify-between rounded-full border border-border bg-background/60 px-4 py-2.5 backdrop-blur-xl transition-all duration-500">
        <Link to="/" className="flex items-center gap-2">
          <Feather className="h-5 w-5 text-primary" />
          <span className="font-display text-lg tracking-tight">Easy Assign</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="/#generate" className="transition-colors duration-300 hover:text-primary">
            Generator
          </a>
          <a href="/#templates" className="transition-colors duration-300 hover:text-primary">
            Templates
          </a>
          <a href="/#type" className="transition-colors duration-300 hover:text-primary">
            Typefaces
          </a>
          <a href="/#features" className="transition-colors duration-300 hover:text-primary">
            Features
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/library">My library</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full"
                onClick={() => supabase.auth.signOut()}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/auth" search={{ mode: "login" }}>
                  Log in
                </Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
