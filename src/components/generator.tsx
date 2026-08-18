import { useMemo, useState } from "react";
import { Loader2, Sparkles, Download, RotateCcw, Save, Copy } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { generateAssignmentFn, saveAssignmentFn } from "@/lib/assignment.functions";
import { exportAssignmentPdf } from "@/lib/assignment-pdf";
import { getTemplateStyle } from "@/lib/template-style";
import {
  CATEGORIES,
  FONT_STYLES,
  LANGUAGES,
  TEMPLATES,
  TONES,
  type Assignment,
  type GeneratorState,
} from "@/lib/assignment";

const initial: GeneratorState = {
  topic: "",
  category: "Essay",
  language: "English",
  tone: "Academic",
  template: "classic",
  fontId: "dm-serif",
  pages: 4,
  citations: true,
  outlineOnly: false,
};

export function Generator() {
  const [state, setState] = useState<GeneratorState>(initial);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<Assignment | null>(null);
  const { user } = useAuth();
  const generate = useServerFn(generateAssignmentFn);
  const save = useServerFn(saveAssignmentFn);

  const font = useMemo(
    () => FONT_STYLES.find((f) => f.id === state.fontId) ?? FONT_STYLES[0],
    [state.fontId],
  );
  const tpl = useMemo(() => getTemplateStyle(state.template), [state.template]);


  const set = <K extends keyof GeneratorState>(key: K, value: GeneratorState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const run = async () => {
    if (!state.topic.trim()) {
      toast.error("Give your assignment a topic first.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const assignment = await generate({ data: state });
      setResult(assignment);
      toast.success(`Written · ${assignment.wordCount?.toLocaleString() ?? ""} words`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not write the assignment.");
    } finally {
      setBusy(false);
    }
  };

  const plainText = (r: Assignment) =>
    [
      r.title,
      r.meta,
      "",
      r.abstract ? `Abstract\n${r.abstract}\n` : "",
      ...r.sections.map((s) => `${s.heading}\n${s.paragraphs.join("\n\n")}\n`),
      r.references.length ? "References" : "",
      ...r.references,
    ]
      .filter(Boolean)
      .join("\n");

  const download = () => {
    if (!result) return;
    exportAssignmentPdf(result, state);
    toast.success("PDF downloaded.");
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(plainText(result));
    toast.success("Copied to clipboard.");
  };

  const persist = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await save({ data: { state, assignment: result } });
      toast.success("Saved to your library.");
    } catch {
      toast.error("Could not save. Please log in again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="surface-card h-fit p-6 sm:p-7">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="The ethics of machine translation"
              value={state.topic}
              onChange={(e) => set("topic", e.target.value)}
              className="h-11 transition-all duration-300 focus-visible:ring-2"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Picker
                value={state.category}
                onChange={(v) => set("category", v)}
                options={[...CATEGORIES]}
              />
            </Field>
            <Field label="Language">
              <Picker
                value={state.language}
                onChange={(v) => set("language", v)}
                options={[...LANGUAGES]}
              />
            </Field>
            <Field label="Tone">
              <Picker value={state.tone} onChange={(v) => set("tone", v)} options={[...TONES]} />
            </Field>
            <Field label="Typeface">
              <Picker
                value={state.fontId}
                onChange={(v) => set("fontId", v)}
                options={FONT_STYLES.map((f) => f.id)}
                labels={Object.fromEntries(FONT_STYLES.map((f) => [f.id, f.name]))}
              />
            </Field>
          </div>

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <Label>Length</Label>
              <span className="font-mono text-sm text-primary">
                {state.pages} pages · ≈{(state.pages * 300).toLocaleString()} words
              </span>
            </div>
            <Slider
              min={1}
              max={20}
              step={1}
              value={[state.pages]}
              onValueChange={([v]) => set("pages", v ?? 1)}
            />
          </div>

          <Toggle
            label="Include references"
            checked={state.citations}
            onChange={(v) => set("citations", v)}
          />
          <Toggle
            label="Outline only"
            checked={state.outlineOnly}
            onChange={(v) => set("outlineOnly", v)}
          />

          <div className="flex gap-2 pt-1">
            <Button onClick={run} disabled={busy} className="h-11 flex-1 rounded-full">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {busy ? "Writing…" : "Write assignment"}
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-full"
              onClick={() => {
                setState(initial);
                setResult(null);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => set("template", t.id)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-all duration-300 ${
                  state.template === t.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card relative min-h-[520px] overflow-hidden p-6 sm:p-9">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-brass)]" />
        {!result && !busy && (
          <div className="flex h-full min-h-[440px] flex-col items-center justify-center text-center">
            <Sparkles className="h-8 w-8 animate-shimmer text-primary" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your full assignment — real paragraphs, evidence and citations — appears here.
            </p>
          </div>
        )}

        {busy && (
          <div className="space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              Researching and writing…
            </p>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-shimmer rounded bg-muted"
                style={{ width: `${96 - (i % 5) * 8}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {result && (
          <article className={`animate-rise ${tpl.wrap}`} style={{ fontFamily: font?.stack }}>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-primary">
              {TEMPLATES.find((t) => t.id === state.template)?.name}
            </p>
            <h3 className={`mt-3 leading-tight ${tpl.title}`}>{result.title}</h3>
            <p className={`mt-2 ${tpl.meta}`}>{result.meta}</p>
            {tpl.rule && <div className="mt-4 h-px w-full bg-[image:var(--gradient-brass)]" />}

            {result.abstract && (
              <div className="mt-6 rounded-lg border border-border bg-secondary/30 p-4">
                <h4 className="text-lg font-bold text-primary">Abstract</h4>
                <p className={`mt-1 ${tpl.body}`}>{result.abstract}</p>
              </div>
            )}

            <div className={`mt-7 space-y-7 ${tpl.columns ? "sm:columns-2 sm:gap-8" : ""}`}>
              {result.sections.map((s, i) => (
                <section
                  key={`${s.heading}-${i}`}
                  className={`animate-rise ${tpl.columns ? "break-inside-avoid" : ""}`}
                  style={{ animationDelay: `${Math.min(i, 6) * 80}ms` }}
                >
                  <h4 className={tpl.heading}>
                    {tpl.pdf.numbered ? `${i + 1}. ` : ""}
                    {s.heading}
                  </h4>
                  <div className="mt-2 space-y-3">
                    {s.paragraphs.map((p, j) => (
                      <p
                        key={j}
                        className={`${tpl.body} ${
                          tpl.dropCap && i === 0 && j === 0
                            ? "first-letter:float-left first-letter:mr-2 first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary"
                            : ""
                        }`}
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {result.references.length > 0 && (
              <div className="mt-8 border-t border-border pt-5">
                <h4 className={tpl.heading}>References</h4>
                <ul className="mt-2 space-y-2 text-[15px] font-medium text-muted-foreground">
                  {result.references.map((r, i) => (
                    <li key={i} className="pl-6 -indent-6 leading-relaxed">
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}


            <div className="mt-8 flex flex-wrap gap-2">
              <Button onClick={download} variant="outline" className="rounded-full">
                <Download className="h-4 w-4" /> Download
              </Button>
              <Button onClick={copy} variant="outline" className="rounded-full">
                <Copy className="h-4 w-4" /> Copy
              </Button>
              {user ? (
                <Button onClick={persist} disabled={saving} className="rounded-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save to library
                </Button>
              ) : (
                <Button asChild variant="ghost" className="rounded-full">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Log in to save
                  </Link>
                </Button>
              )}
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Picker({
  value,
  onChange,
  options,
  labels,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: Record<string, string>;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {labels?.[o] ?? o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors duration-300 hover:border-primary/40">
      <Label className="cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
