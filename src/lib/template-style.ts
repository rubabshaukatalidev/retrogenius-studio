import { FONT_STYLES } from "./assignment";

export type TemplateStyle = {
  /** wrapper classes for the preview article */
  wrap: string;
  title: string;
  meta: string;
  heading: string;
  body: string;
  columns: boolean;
  dropCap: boolean;
  rule: boolean;
  /** pdf metrics */
  pdf: {
    font: "times" | "helvetica" | "courier";
    title: number;
    heading: number;
    body: number;
    lineGap: number;
    margin: number;
    numbered: boolean;
  };
};

export const TEMPLATE_STYLES: Record<string, TemplateStyle> = {
  classic: {
    wrap: "",
    title: "text-4xl font-bold sm:text-5xl",
    meta: "text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground",
    heading: "text-2xl font-bold text-primary sm:text-[26px]",
    body: "text-[17px] font-medium leading-[1.9] text-foreground/90",
    columns: false,
    dropCap: false,
    rule: true,
    pdf: { font: "times", title: 24, heading: 16, body: 12, lineGap: 1.55, margin: 56, numbered: true },
  },
  gazette: {
    wrap: "border-y-4 border-double border-primary/60 py-6",
    title: "text-center text-5xl font-bold uppercase tracking-tight sm:text-6xl",
    meta: "text-center text-xs font-bold uppercase tracking-[0.4em] text-primary",
    heading: "text-xl font-bold uppercase tracking-wide text-primary",
    body: "text-[16px] font-medium leading-[1.8] text-foreground/90",
    columns: true,
    dropCap: true,
    rule: true,
    pdf: { font: "times", title: 26, heading: 15, body: 11.5, lineGap: 1.45, margin: 48, numbered: false },
  },
  ledger: {
    wrap: "rounded-lg border border-primary/30 bg-secondary/20 p-5",
    title: "text-3xl font-bold sm:text-4xl",
    meta: "font-mono text-xs font-bold uppercase tracking-[0.25em] text-accent",
    heading: "text-xl font-bold text-accent",
    body: "text-[16px] font-medium leading-[1.75] text-foreground/90",
    columns: false,
    dropCap: false,
    rule: false,
    pdf: { font: "helvetica", title: 22, heading: 15, body: 11.5, lineGap: 1.5, margin: 54, numbered: true },
  },
  typewriter: {
    wrap: "font-mono",
    title: "text-3xl font-bold uppercase tracking-tight sm:text-4xl",
    meta: "text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground",
    heading: "text-lg font-bold uppercase text-primary",
    body: "text-[15px] font-medium leading-[2] text-foreground/90",
    columns: false,
    dropCap: false,
    rule: true,
    pdf: { font: "courier", title: 20, heading: 14, body: 11, lineGap: 1.7, margin: 60, numbered: true },
  },
  folio: {
    wrap: "",
    title: "text-5xl font-bold tracking-tight sm:text-6xl",
    meta: "text-sm font-semibold text-muted-foreground",
    heading: "text-2xl font-bold sm:text-[28px]",
    body: "text-[18px] font-medium leading-[1.95] text-foreground/90",
    columns: false,
    dropCap: false,
    rule: false,
    pdf: { font: "helvetica", title: 26, heading: 17, body: 12.5, lineGap: 1.6, margin: 64, numbered: false },
  },
  thesis: {
    wrap: "",
    title: "text-center text-4xl font-bold sm:text-5xl",
    meta: "text-center text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground",
    heading: "text-2xl font-bold text-primary",
    body: "text-[17px] font-medium leading-[2] text-foreground/90",
    columns: false,
    dropCap: false,
    rule: true,
    pdf: { font: "times", title: 25, heading: 16.5, body: 12, lineGap: 1.75, margin: 68, numbered: true },
  },
};

export const getTemplateStyle = (id: string): TemplateStyle =>
  TEMPLATE_STYLES[id] ?? (TEMPLATE_STYLES["classic"] as TemplateStyle);

export const pdfFontForSelection = (
  templateId: string,
  fontId: string,
): "times" | "helvetica" | "courier" => {
  const font = FONT_STYLES.find((f) => f.id === fontId);
  if (!font) return getTemplateStyle(templateId).pdf.font;
  if (font.id === "mono") return "courier";
  if (font.id === "karla") return "helvetica";
  return "times";
};
