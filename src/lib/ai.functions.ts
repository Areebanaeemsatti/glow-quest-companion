import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  SYSTEM_PROMPT,
  callGateway,
  contextToPromptBlock,
  loadProfileContext,
  safeParseJson,
  serverSupabase,
  type ChatMsg,
} from "./ai.server";

// -------- Generic markdown generator ----------
async function generateMarkdown(userInstruction: string, context: string): Promise<string> {
  const messages: ChatMsg[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `${context}\n\n${userInstruction}` },
  ];
  return callGateway(messages);
}

// -------- Skincare ----------
export const generateSkincarePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const content = await generateMarkdown(
      `Create a personalized skincare plan using markdown. Include:
## Morning Routine
## Night Routine
## Weekly Care
## Ingredients to Use
## Ingredients to Avoid
## Lifestyle Tips
## Product Recommendations (fit within their budget)
## General Advice

At the end include a line "ESTIMATED_TIME: <minutes>" and "DIFFICULTY: <easy|medium|advanced>".`,
      block,
    );
    return { content };
  });

// -------- Workout ----------
export const generateWorkoutPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const content = await generateMarkdown(
      `Create a personalized weekly workout plan using markdown. Include:
## Weekly Split
## Warm-Up (5 min)
## Main Workout (exercises with sets/reps/rest)
## Cardio
## Cooldown & Stretching
## Recovery Tips

End with "DURATION: <minutes>" and "DIFFICULTY: <easy|medium|advanced>".`,
      block,
    );
    return { content };
  });

// -------- Nutrition ----------
export const generateNutritionPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const content = await generateMarkdown(
      `Create a personalized nutrition plan using markdown. Include:
## Daily Targets (calories estimate, protein goal in grams, water target in liters)
## Breakfast Ideas
## Lunch Ideas
## Dinner Ideas
## Healthy Snacks
## Pre-Workout Meals
## Post-Workout Meals
## Healthy Habits
## Budget-Friendly Alternatives`,
      block,
    );
    return { content };
  });

// -------- Daily Quests ----------
export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  difficulty: "easy" | "medium" | "hard";
  estimatedMinutes: number;
  completed: boolean;
};

export const generateDailyQuests = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const messages: ChatMsg[] = [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `${block}\n\nGenerate 6-8 personalized daily wellness quests for today.
Return STRICT JSON only, no prose, matching:
{"quests":[{"title":"...","description":"...","xp":10,"difficulty":"easy|medium|hard","estimatedMinutes":10}]}`,
      },
    ];
    const raw = await callGateway(messages, { json: true });
    const parsed = safeParseJson<{ quests: Omit<Quest, "id" | "completed">[] }>(raw);
    const quests: Quest[] = (parsed?.quests ?? []).map((q, i) => ({
      id: `q_${Date.now()}_${i}`,
      title: q.title,
      description: q.description,
      xp: Number(q.xp) || 10,
      difficulty: (q.difficulty as Quest["difficulty"]) || "easy",
      estimatedMinutes: Number(q.estimatedMinutes) || 10,
      completed: false,
    }));
    // Persist today's quests
    const today = new Date().toISOString().slice(0, 10);
    await context.supabase
      .from("daily_glow_quests")
      .upsert(
        { user_id: context.userId, date: today, quests: quests as unknown as never },
        { onConflict: "user_id,date" },
      );
    return { quests, date: today };
  });

// -------- Weekly Review ----------
export const generateWeeklyReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const progressSummary = ctx.recentProgress
      .map((r) => `${r.date}: glow=${r.glow_score} water=${r.water} sleep=${r.sleep_hours}h workout=${r.workout_completed} skincare=${r.skincare_completed}`)
      .join("\n");
    const journalSummary = ctx.recentJournal
      .map((j) => `${j.date}: mood=${j.mood ?? "?"} energy=${j.energy ?? "?"} skin=${j.skin_condition ?? "?"} - ${j.notes ?? ""}`)
      .join("\n");
    const content = await generateMarkdown(
      `Create a weekly wellness review in markdown. Include:
## Achievements
## Areas for Improvement
## Motivational Message
## Focus for Next Week
## Healthy Habits to Build

Data from the past 7 days:
Progress:
${progressSummary || "(no data)"}

Journal:
${journalSummary || "(no entries)"}`,
      block,
    );
    // Save review keyed by Monday of current week
    const now = new Date();
    const day = now.getDay();
    const diff = (day + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    const week_start = monday.toISOString().slice(0, 10);
    await context.supabase
      .from("weekly_reviews")
      .upsert(
        { user_id: context.userId, week_start, content: { markdown: content } as unknown as never },
        { onConflict: "user_id,week_start" },
      );
    return { content, week_start };
  });

// -------- Journal AI insights ----------
export const generateJournalInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: entries } = await context.supabase
      .from("journal")
      .select("*")
      .eq("user_id", context.userId)
      .order("date", { ascending: false })
      .limit(30);
    if (!entries || entries.length < 3) {
      return { content: "Log at least 3 journal entries to unlock personalized AI insights.", enough: false };
    }
    const summary = entries
      .map((e) => `${e.date}: mood=${e.mood ?? "?"} energy=${e.energy ?? "?"} skin=${e.skin_condition ?? "?"} notes=${e.notes ?? ""}`)
      .join("\n");
    const content = await generateMarkdown(
      `Analyze these journal entries and produce markdown with sections:
## Mood Trends
## Energy Trends
## Skin Trends
## Positive Habits
## Recommendations

Entries:
${summary}`,
      "",
    );
    return { content, enough: true };
  });

// -------- Dashboard Tip ----------
export const generateDailyTip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = await loadProfileContext(context.supabase, context.userId);
    const block = contextToPromptBlock(ctx);
    const content = await generateMarkdown(
      "Give one short (max 3 sentences), motivating, personalized wellness tip for today. Plain text, no headings.",
      block,
    );
    return { content: content.trim() };
  });
