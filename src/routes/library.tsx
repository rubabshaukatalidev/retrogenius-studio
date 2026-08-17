import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Trash2, FileText } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { useAuth } from "@/hooks/use-auth";
import { listAssignmentsFn, deleteAssignmentFn } from "@/lib/assignment.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "My library · Scriptorium Assignments" },
      {
        name: "description",
        content: "Every assignment you have written and saved — full text, references and word counts.",
      },
      { property: "og:title", content: "My library · Scriptorium" },
      { property: "og:description", content: "Your saved university assignments in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Library,
});

type Row = {
  id: string;
  title: string;
  category: string;
  language: string;
  pages: number;
  word_count: number;
  created_at: string;
  content: { heading: string; paragraphs: string[] }[];
  references_list: string[];
};

function Library() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const list = useServerFn(listAssignmentsFn);
  const remove = useServerFn(deleteAssignmentFn);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login" } });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    list()
      .then((d) => setRows(d as unknown as Row[]))
      .catch(() => toast.error("Could not load your library."));
  }, [user, list]);

  const del = async (id: string) => {
    await remove({ data: { id } });
    setRows((r) => (r ? r.filter((x) => x.id !== id) : r));
    toast.success("Deleted.");
  };

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-[min(1180px,92vw)] pb-24 pt-32">
        <h1 className="animate-rise text-4xl sm:text-5xl">My library</h1>
        <p className="mt-2 text-muted-foreground">Everything you have written and saved.</p>

        {!rows && (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {rows?.length === 0 && (
          <div className="surface-card mt-10 p-10 text-center">
            <FileText className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-4 text-muted-foreground">No assignments saved yet.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/">Write your first one</Link>
            </Button>
          </div>
        )}

        <div className="mt-10 space-y-4">
          {rows?.map((r) => (
            <article key={r.id} className="surface-card hover-lift p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl">{r.title}</h2>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {r.category} · {r.language} · {r.pages} pages · {r.word_count.toLocaleString()}{" "}
                    words
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setOpen(open === r.id ? null : r.id)}
                  >
                    {open === r.id ? "Hide" : "Read"}
                  </Button>
                  <Button variant="ghost" className="rounded-full" onClick={() => del(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {open === r.id && (
                <div className="animate-rise mt-6 space-y-6 border-t border-border pt-6">
                  {r.content.map((s, i) => (
                    <section key={i}>
                      <h3 className="text-lg text-primary">
                        {i + 1}. {s.heading}
                      </h3>
                      <div className="mt-2 space-y-3">
                        {s.paragraphs.map((p, j) => (
                          <p key={j} className="text-[15px] leading-[1.85] text-foreground/85">
                            {p}
                          </p>
                        ))}
                      </div>
                    </section>
                  ))}
                  {r.references_list?.length > 0 && (
                    <section>
                      <h3 className="text-lg">References</h3>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {r.references_list.map((x, i) => (
                          <li key={i} className="pl-6 -indent-6">
                            {x}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
