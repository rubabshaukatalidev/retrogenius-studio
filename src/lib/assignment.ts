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

export type AssignmentSection = { heading: string; paragraphs: string[] };

export type Assignment = {
  title: string;
  abstract?: string;
  meta: string;
  sections: AssignmentSection[];
  references: string[];
  wordCount?: number;
};
