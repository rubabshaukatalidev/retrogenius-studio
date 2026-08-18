import { jsPDF } from "jspdf";
import type { Assignment, GeneratorState } from "./assignment";
import { getTemplateStyle, pdfFontForSelection } from "./template-style";
import { TEMPLATES } from "./assignment";

export function exportAssignmentPdf(assignment: Assignment, state: GeneratorState) {
  const style = getTemplateStyle(state.template);
  const family = pdfFontForSelection(state.template, state.fontId);
  const { title: titleSize, heading: headingSize, body: bodySize, lineGap, margin, numbered } =
    style.pdf;

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const maxW = pageW - margin * 2;
  let y = margin;

  const nextPage = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    size: number,
    bold: boolean,
    opts: { align?: "left" | "center"; gap?: number; color?: [number, number, number] } = {},
  ) => {
    doc.setFont(family, bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? [17, 24, 39]));
    const lines = doc.splitTextToSize(text, maxW) as string[];
    const lh = size * (opts.gap ?? lineGap);
    for (const line of lines) {
      nextPage(lh);
      doc.text(line, opts.align === "center" ? pageW / 2 : margin, y, {
        align: opts.align ?? "left",
      });
      y += lh;
    }
  };

  const rule = () => {
    nextPage(14);
    doc.setDrawColor(120, 130, 150);
    doc.line(margin, y, pageW - margin, y);
    y += 14;
  };

  // Title block
  const centered = state.template === "thesis" || state.template === "gazette";
  write(assignment.title, titleSize, true, { align: centered ? "center" : "left", gap: 1.25 });
  y += 4;
  write(assignment.meta, bodySize - 1.5, false, {
    align: centered ? "center" : "left",
    color: [90, 100, 120],
  });
  const templateName = TEMPLATES.find((t) => t.id === state.template)?.name ?? "";
  write(
    `${templateName} · ${state.category} · ${state.language} · ${state.pages} page${state.pages > 1 ? "s" : ""}`,
    bodySize - 2,
    false,
    { align: centered ? "center" : "left", color: [120, 130, 150] },
  );
  y += 8;
  if (style.rule) rule();

  if (assignment.abstract) {
    write("Abstract", headingSize, true);
    y += 2;
    write(assignment.abstract, bodySize, false);
    y += 10;
  }

  assignment.sections.forEach((section, i) => {
    nextPage(headingSize * 3);
    y += 6;
    write(numbered ? `${i + 1}. ${section.heading}` : section.heading, headingSize, true);
    y += 4;
    section.paragraphs.forEach((p) => {
      write(p, bodySize, false);
      y += 6;
    });
  });

  if (assignment.references.length) {
    y += 10;
    if (style.rule) rule();
    write("References", headingSize, true);
    y += 4;
    assignment.references.forEach((r) => {
      write(r, bodySize - 0.5, false);
      y += 4;
    });
  }

  // Page numbers
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont(family, "normal");
    doc.setFontSize(9);
    doc.setTextColor(140, 150, 165);
    doc.text(`${p} / ${pages}`, pageW / 2, pageH - margin / 2, { align: "center" });
  }

  const name = `${assignment.title.toLowerCase().replace(/[^\w]+/g, "-").slice(0, 60) || "assignment"}.pdf`;
  doc.save(name);
}
