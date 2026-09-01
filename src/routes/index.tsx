import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  Globe2,
  Languages,
  LayoutTemplate,
  Quote,
  Ruler,
  Sparkles,
  Type,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { Generator } from "@/components/generator";
import { useReveal } from "@/hooks/use-reveal";
import { CATEGORIES, FONT_STYLES, LANGUAGES, TEMPLATES } from "@/lib/assignment";
import texture from "@/assets/texture.jpg";
import typingVideo from "@/assets/typing-loop.mp4.asset.json";
import templatesVideo from "@/assets/templates-loop.mp4.asset.json";
import ctaVideo from "@/assets/cta-loop.mp4.asset.json";
import { BackgroundVideo } from "@/components/background-video";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Easy Assign · Retro-Modern Assignment Generator" },
      {
        name: "description",
        content:
          "Compose essays, lab reports and case studies with retro-serif templates, multilingual output, typeface presets and page-range control.",
      },
      { property: "og:title", content: "Easy Assign · Assignment Generator" },
      {
        property: "og:description",
        content:
          "Retro-modern assignment studio: templates, typefaces, categories, languages and page range in one animated workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: LayoutTemplate, title: "Six layout templates", body: "From bound thesis to two-column gazette, each with its own rhythm." },
  { icon: Languages, title: "Eight languages", body: "Compose in English, Urdu, Arabic, Spanish and more without switching tools." },
  { icon: Ruler, title: "Page range control", body: "One page to twenty — section depth and word count scale with the slider." },
  { icon: Type, title: "Typeface presets", body: "Serif, display and monospace stacks previewed live in the draft pane." },
  { icon: Quote, title: "Citations on demand", body: "Reference lists generated alongside the body, or switched off entirely." },
  { icon: BookOpen, title: "Outline mode", body: "Collapse the draft into a skeleton you can expand on your own terms." },
];

function Index() {
  useReveal();
  const [activeTemplate, setActiveTemplate] = useState<string | undefined>(undefined);

  const pickTemplate = (id: string) => {
    setActiveTemplate(id);
    document.getElementById("generate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <BackgroundVideo
            src={typingVideo.url}
            poster={texture}
            overlay={45}
            kenburns
            rate={0.75}
          />
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-soft-light"
            style={{ backgroundImage: `url(${texture})`, backgroundSize: "cover" }}
          />

          <div className="relative z-10 mx-auto w-[min(1180px,92vw)] pt-28">
            <p className="animate-rise font-mono text-sm font-bold uppercase tracking-[0.4em] text-primary">
              Assignment studio · for university students
            </p>
            <h1
              className="animate-rise mt-6 max-w-5xl text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              Finish your assignment and{" "}
              <span className="text-gradient-brass">celebrate</span> the submission.
            </h1>
            <p
              className="animate-rise mt-7 max-w-2xl text-base font-medium text-foreground/85 sm:text-lg"
              style={{ animationDelay: "240ms" }}
            >
              Pick a category, language, typeface and page range — Easy Assign writes real academic
              prose, formats it in your template, and exports a print-ready PDF.
            </p>
            <div
              className="animate-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "360ms" }}
            >
              <Button asChild size="lg" className="h-13 rounded-full px-8 text-base font-bold">
                <a href="#generate">
                  <Wand2 className="h-5 w-5" /> Start composing
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-13 rounded-full px-8 text-base font-bold"
              >
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create an account
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="overflow-hidden border-y border-border bg-card/40 py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {[...CATEGORIES, ...LANGUAGES, ...CATEGORIES, ...LANGUAGES].map((t, i) => (
              <span key={`${t}-${i}`} className="flex items-center gap-10">
                {t} <Sparkles className="h-3 w-3 text-primary" />
              </span>
            ))}
          </div>
        </div>

        {/* Generator */}
        <section id="generate" className="mx-auto w-[min(1180px,92vw)] py-24">
          <div className="reveal max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">The composing desk</h2>
            <p className="mt-3 text-muted-foreground">
              Every control updates the draft on the right — layout, typeface, language and depth.
            </p>
          </div>
          <div className="reveal mt-10">
            <Generator activeTemplate={activeTemplate} onTemplateChange={setActiveTemplate} />
          </div>
        </section>

        {/* Templates */}
        <section
          id="templates"
          className="relative overflow-hidden border-y border-border py-24"
        >
          <BackgroundVideo src={templatesVideo.url} overlay={82} rate={0.6} />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url(${texture})`, backgroundSize: "cover" }}
          />
          <div className="relative mx-auto w-[min(1180px,92vw)]">
            <h2 className="reveal text-3xl sm:text-4xl">Templates</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((t, i) => (
                <button
                  key={t.id}
                  onClick={() => pickTemplate(t.id)}
                  className="reveal surface-card hover-lift p-6 text-left"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {t.accent}
                  </p>
                  <h3 className="mt-3 text-2xl">{t.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Typefaces */}
        <section id="type" className="mx-auto w-[min(1180px,92vw)] py-24">
          <h2 className="reveal text-3xl sm:text-4xl">Typefaces</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FONT_STYLES.map((f, i) => (
              <div
                key={f.id}
                className="reveal surface-card hover-lift p-6"
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <p className="text-4xl leading-none" style={{ fontFamily: f.stack }}>
                  Aa
                </p>
                <p className="mt-4 text-sm text-muted-foreground">{f.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border py-24">
          <div className="mx-auto w-[min(1180px,92vw)]">
            <h2 className="reveal text-3xl sm:text-4xl">Everything on the desk</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="reveal surface-card hover-lift p-6"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-xl">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden py-28">
          <BackgroundVideo
            src={ctaVideo.url}
            poster={texture}
            overlay={68}
            kenburns
            rate={0.7}
          />
          <div className="relative mx-auto w-[min(760px,92vw)] text-center">
            <h2 className="reveal text-3xl sm:text-5xl">Hand in something better</h2>
            <p className="reveal mt-4 text-muted-foreground">
              Free while in preview. Save drafts, templates and presets to your account.
            </p>
            <div className="reveal mt-8">
              <Button asChild size="lg" className="h-12 rounded-full px-8">
                <Link to="/auth" search={{ mode: "signup" }}>
                  <Globe2 className="h-4 w-4" /> Get started
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-8">
          <div className="mx-auto flex w-[min(1180px,92vw)] flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
            <span className="font-display text-base text-foreground">Easy Assign</span>
            <span>© 2026 · Composed with care</span>
          </div>
        </footer>
      </main>
    </>
  );
}
