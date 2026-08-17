import { useMemo, useState } from "react";
import { Loader2, Sparkles, Download, RotateCcw } from "lucide-react";
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
import {
  CATEGORIES,
  FONT_STYLES,
  LANGUAGES,
  TEMPLATES,
  TONES,
  generateAssignment,
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
  const [result, setResult] = useState<Assignment | null>(null);

  const font = useMemo(
    () => FONT_STYLES.find((f) => f.id === state.fontId) ?? FONT_STYLES[0],
    [state.fontId],
  );

  const set = <K extends keyof GeneratorState>(key: K, value: GeneratorState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const run = async () => {
    if (!state.topic.trim()) {
      toast.error("Give your assignment a topic first.");
      return;
    }
    setBusy(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setResult(generateAssignment(state));
    setBusy(false);
    toast.success("Draft composed.");
  };

  const download = () => {
    if (!result) return;
    const text = [
      result.title,
      result.meta,
      "",
      ...result.sections.map((s) => `${s.heading}\n${s.body}\n`),
      result.references.length ? "References" : "",
      ...result.references,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
      <div className="surface-card p-6 sm:p-7">
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
              <span className="font-mono text-sm text-primary">{state.pages} pages</span>
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
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {busy ? "Composing…" : "Generate"}
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
        </div>
      </div>

      <div className="surface-card relative min-h-[520px] overflow-hidden p-6 sm:p-9">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-brass)]" />
        {!result && !busy && (
          <div className="flex h-full min-h-[440px] flex-col items-center justify-center text-center">
            <Sparkles className="h-8 w-8 animate-shimmer text-primary" />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your composed draft will appear here, set in your chosen typeface and template.
            </p>
          </div>
        )}

        {busy && (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 animate-shimmer rounded bg-muted"
                style={{ width: `${95 - i * 9}%`, animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
        )}

        {result && (
          <article className="animate-rise" style={{ fontFamily: font?.stack }}>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-primary">
              {TEMPLATES.find((t) => t.id === state.template)?.name}
            </p>
            <h3 className="mt-3 text-3xl leading-tight sm:text-4xl">{result.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{result.meta}</p>
            <div className="mt-7 space-y-6">
              {result.sections.map((s, i) => (
                <div
                  key={s.heading}
                  className="animate-rise border-l-2 border-border pl-4"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <h4 className="text-lg text-primary">{s.heading}</h4>
                  <p className="mt-1 text-[15px] leading-relaxed text-foreground/85">{s.body}</p>
                </div>
              ))}
            </div>
            {result.references.length > 0 && (
              <div className="mt-8 border-t border-border pt-5">
                <h4 className="text-lg">References</h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {result.references.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={download} variant="outline" className="mt-8 rounded-full">
              <Download className="h-4 w-4" /> Download draft
            </Button>
          </article>
        )}
      </div>

      <div className="lg:col-span-2">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => set("template", t.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-all duration-400 ${
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
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
