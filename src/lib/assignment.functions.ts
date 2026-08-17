import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { composeAssignment } from "./assignment.server";
import type { Assignment, GeneratorState } from "./assignment";

export const generateAssignmentFn = createServerFn({ method: "POST" })
  .inputValidator((data: GeneratorState) => data)
  .handler(async ({ data }): Promise<Assignment> => {
    if (!data?.topic?.trim()) throw new Error("A topic is required.");
    return composeAssignment({ ...data, pages: Math.min(20, Math.max(1, data.pages)) });
  });

export const saveAssignmentFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { state: GeneratorState; assignment: Assignment }) => data)
  .handler(async ({ data, context }) => {
    const { state, assignment } = data;
    const { data: row, error } = await context.supabase
      .from("assignments")
      .insert({
        user_id: context.userId,
        title: assignment.title,
        topic: state.topic,
        category: state.category,
        language: state.language,
        tone: state.tone,
        template: state.template,
        font_id: state.fontId,
        pages: state.pages,
        word_count: assignment.wordCount ?? 0,
        content: assignment.sections,
        references_list: assignment.references,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const listAssignmentsFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assignments")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

export const deleteAssignmentFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("assignments").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
