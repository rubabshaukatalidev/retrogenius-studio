import { createFileRoute, Link } from "@tanstack/react-router";
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
import hero from "@/assets/hero.jpg";
import texture from "@/assets/texture.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Scriptorium · Retro-Modern Assignment Generator" },
      {
        name: "description",
        content:
          "Compose essays, lab reports and case studies with retro-serif templates, multilingual output, typeface presets and page-range control.",
      },
      { property: "og:title", content: "Scriptorium · Assignment Generator" },
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

  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <img
            src={hero}
            alt="Vintage study desk with manuscripts under a brass lamp"
            width={1600}
            height={1008}
            className="absolute inset-0 h-full w-full animate-kenburns object-cover"
          />
          <div className="absolute inset-0 bg-[image:var(--gradient-veil)]" />
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: `url(${texture})`, backgroundSize: "cover" }}
          />

          <div className="relative z-10 mx-auto w-[min(1180px,92vw)] pt-28">
            <p className="animate-rise font-mono text-xs uppercase tracking-[0.4em] text-primary">
              Assignment studio · est. 2026
            </p>
            <h1
              className="animate-rise mt-6 max-w-4xl text-5xl leading-[0.95] sm:text-7xl lg:text-8xl"
              style={{ animationDelay: "120ms" }}
            >
              Write assignments the way <span className="text-gradient-brass">good print</span> used
              to feel.
            </h1>
            <p
              className="animate-rise mt-6 max-w-xl text-lg text-muted-foreground"
              style={{ animationDelay: "240ms" }}
            >
              Choose a category, a language, a typeface and a page range. Scriptorium composes a
              structured draft in a layout worth handing in.
            </p>
            <div
              className="animate-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "360ms" }}
            >
              <Button asChild size="lg" className="h-12 rounded-full px-7">
                <a href="#generate">
                  <Wand2 className="h-4 w-4" /> Start composing
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7">
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
            <h2 className="text-4xl sm:text-5xl">The composing desk</h2>
            <p className="mt-3 text-muted-foreground">
              Every control updates the draft on the right — layout, typeface, language and depth.
            </p>
          </div>
          <div className="reveal mt-10">
            <Generator />
          </div>
        </section>

        {/* Templates */}
        <section
          id="templates"
          className="relative overflow-hidden border-y border-border py-24"
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: `url(${texture})`, backgroundSize: "cover" }}
          />
          <div className="relative mx-auto w-[min(1180px,92vw)]">
            <h2 className="reveal text-4xl sm:text-5xl">Templates</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((t, i) => (
                <article
                  key={t.id}
                  className="reveal surface-card hover-lift p-6"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                    {t.accent}
                  </p>
                  <h3 className="mt-3 text-2xl">{t.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Typefaces */}
        <section id="type" className="mx-auto w-[min(1180px,92vw)] py-24">
          <h2 className="reveal text-4xl sm:text-5xl">Typefaces</h2>
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
            <h2 className="reveal text-4xl sm:text-5xl">Everything on the desk</h2>
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
          <img
            src={hero}
            alt=""
            loading="lazy"
            width={1600}
            height={1008}
            className="absolute inset-0 h-full w-full animate-kenburns object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-background/70" />
          <div className="relative mx-auto w-[min(760px,92vw)] text-center">
            <h2 className="reveal text-4xl sm:text-6xl">Hand in something better</h2>
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
            <span className="font-display text-base text-foreground">Scriptorium</span>
            <span>© 2026 · Composed with care</span>
          </div>
        </footer>
      </main>
    </>
  );
}
