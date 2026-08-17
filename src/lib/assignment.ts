export const CATEGORIES = [
  "Essay",
  "Research Paper",
  "Lab Report",
  "Case Study",
  "Book Review",
  "Presentation Outline",
  "Coding Task",
  "Reflection Journal",
] as const;

export const LANGUAGES = [
  "English",
  "Urdu",
  "Spanish",
  "French",
  "German",
  "Arabic",
  "Turkish",
  "Chinese",
] as const;

export const TONES = ["Academic", "Formal", "Conversational", "Persuasive", "Analytical"] as const;

export const TEMPLATES = [
  {
    id: "classic",
    name: "Classic Manuscript",
    blurb: "Title page, numbered sections, footnote-friendly margins.",
    accent: "Serif · MLA",
  },
  {
    id: "gazette",
    name: "The Gazette",
    blurb: "Two-column editorial layout with drop caps and rules.",
    accent: "Retro · Column",
  },
  {
    id: "ledger",
    name: "Lab Ledger",
    blurb: "Method, data tables, and results grid for science work.",
    accent: "Grid · APA",
  },
  {
    id: "typewriter",
    name: "Typewriter Draft",
    blurb: "Monospaced draft sheet with margin notes and revisions.",
    accent: "Mono · Draft",
  },
  {
    id: "folio",
    name: "Modern Folio",
    blurb: "Clean headings, generous leading, minimal ornament.",
    accent: "Sans · Chicago",
  },
  {
    id: "thesis",
    name: "Thesis Bound",
    blurb: "Abstract, chapters, bibliography and appendices.",
    accent: "Serif · Harvard",
  },
] as const;

export const FONT_STYLES = [
  { id: "dm-serif", name: "DM Serif Display", stack: '"DM Serif Display", Georgia, serif' },
  { id: "playfair", name: "Playfair Display", stack: '"Playfair Display", Georgia, serif' },
  { id: "libre", name: "Libre Baskerville", stack: '"Libre Baskerville", Georgia, serif' },
  { id: "karla", name: "Karla", stack: '"Karla", system-ui, sans-serif' },
  { id: "mono", name: "JetBrains Mono", stack: '"JetBrains Mono", monospace' },
] as const;

export type GeneratorState = {
  topic: string;
  category: string;
  language: string;
  tone: string;
  template: string;
  fontId: string;
  pages: number;
  citations: boolean;
  outlineOnly: boolean;
};

export type Assignment = {
  title: string;
  meta: string;
  sections: { heading: string; body: string }[];
  references: string[];
};

const OPENERS: Record<string, string> = {
  Academic: "This paper examines",
  Formal: "The following study addresses",
  Conversational: "Let's take a closer look at",
  Persuasive: "There is a compelling case to be made about",
  Analytical: "A structured analysis of",
};

export function generateAssignment(s: GeneratorState): Assignment {
  const topic = s.topic.trim() || "an unspecified subject";
  const words = Math.round(s.pages * 275);
  const sectionCount = Math.max(3, Math.min(8, Math.round(s.pages * 1.2) + 2));

  const skeleton: [string, string][] = [
    ["Introduction", `${OPENERS[s.tone] ?? "This work explores"} ${topic}, framing its relevance and setting out the questions that guide the rest of the ${s.category.toLowerCase()}.`],
    ["Background & Context", `A short history of ${topic}, the key terms involved, and the debates that shaped current thinking.`],
    ["Core Argument", `The central claim about ${topic}, supported by evidence, worked examples and counter-positions.`],
    ["Methodology", `How the material on ${topic} was gathered, compared and evaluated, including limitations.`],
    ["Discussion", `What the findings on ${topic} imply in practice, and where they conflict with existing literature.`],
    ["Case Example", `A concrete, situated illustration of ${topic} that grounds the argument in real detail.`],
    ["Critical Reflection", `Honest appraisal of the weaknesses in the argument around ${topic} and what further work is needed.`],
    ["Conclusion", `A closing synthesis restating the position on ${topic} and its wider consequences.`],
  ];

  const sections = skeleton.slice(0, sectionCount).map(([heading, body]) => ({
    heading,
    body: s.outlineOnly ? `${body.split(",")[0]}.` : body,
  }));

  return {
    title: toTitleCase(topic),
    meta: `${s.category} · ${s.language} · ${s.pages} page${s.pages > 1 ? "s" : ""} · ≈${words.toLocaleString()} words · ${s.tone}`,
    sections,
    references: s.citations
      ? [
          `Ahmed, R. (2024). Perspectives on ${toTitleCase(topic)}. Journal of Applied Studies, 18(2), 44–61.`,
          `Delacroix, M. (2022). Frameworks and Method. Verso Academic Press.`,
          `Okonkwo, L. & Hart, S. (2025). Rethinking ${toTitleCase(topic)}. Review of Contemporary Research, 7(1), 3–29.`,
        ]
      : [],
  };
}

function toTitleCase(v: string) {
  return v.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1));
}
