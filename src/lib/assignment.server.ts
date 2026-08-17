import type { GeneratorState, Assignment } from "./assignment";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function planFor(pages: number) {
  const words = Math.round(pages * 300);
  const sections = Math.max(3, Math.min(10, Math.round(pages * 1.1) + 2));
  return { words, sections, perSection: Math.round(words / sections) };
}

export async function composeAssignment(s: GeneratorState): Promise<Assignment> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured.");

  const { words, sections, perSection } = planFor(s.pages);

  const system = `You are a senior university academic writer. You write complete, submission-ready student assignments with real substance: concrete facts, named theories, scholars, dates, data, examples and critical analysis. Never write placeholders, never describe what a section "will" cover — actually write the content itself in full prose paragraphs.`;

  const user = `Write a complete university-level ${s.category} on the topic: "${s.topic}".

Requirements:
- Language: write ENTIRELY in ${s.language}.
- Tone/register: ${s.tone}.
- Length: about ${words} words total (${s.pages} pages), split across exactly ${sections} sections of roughly ${perSection} words each.
- Every section must contain ${s.outlineOnly ? "1 short summarising paragraph plus 3 bullet-style sentences" : "2-4 full developed paragraphs of 90-150 words each"}.
- Include specific evidence: real theories, scholars, studies, statistics, dates, cases or worked examples relevant to the topic.
- Structure must suit a ${s.category}: e.g. introduction with thesis, body sections with argument and evidence, critical discussion, conclusion.
${s.citations ? "- Include 6-9 realistic academic references in APA 7th style, and cite them inline in the text as (Author, Year)." : "- Do not include a reference list and do not use inline citations."}

Return ONLY valid JSON, no markdown fences, with this exact shape:
{"title": string, "abstract": string, "sections": [{"heading": string, "paragraphs": [string, ...]}], "references": [string, ...]}`;

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (res.status === 429) throw new Error("Too many requests right now. Please try again in a moment.");
  if (res.status === 402) throw new Error("AI credits exhausted. Please top up your workspace credits.");
  if (!res.ok) throw new Error(`Generation failed (${res.status}).`);

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = json.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("The model returned an unexpected response.");

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as {
    title?: string;
    abstract?: string;
    sections?: { heading?: string; paragraphs?: string[] }[];
    references?: string[];
  };

  const outSections = (parsed.sections ?? [])
    .filter((x) => x && (x.heading || x.paragraphs?.length))
    .map((x) => ({
      heading: x.heading ?? "Section",
      paragraphs: (x.paragraphs ?? []).filter(Boolean),
    }));

  if (outSections.length === 0) throw new Error("The model returned no content. Try again.");

  const wordCount = outSections
    .flatMap((x) => x.paragraphs)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title: parsed.title?.trim() || s.topic,
    abstract: parsed.abstract?.trim() ?? "",
    meta: `${s.category} · ${s.language} · ${s.pages} page${s.pages > 1 ? "s" : ""} · ${wordCount.toLocaleString()} words · ${s.tone}`,
    sections: outSections,
    references: s.citations ? (parsed.references ?? []).filter(Boolean) : [],
    wordCount,
  };
}
