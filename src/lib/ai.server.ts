// Server-only AI Gateway helpers for GlowQuest.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const SYSTEM_PROMPT = `You are GlowQuest AI, a supportive wellness coach specializing in skincare, fitness, nutrition, hydration, sleep, and healthy habits.

Generate realistic, personalized plans using the user's profile, goals, skin type, lifestyle, workout experience, available time, budget, and previous progress.

Never diagnose diseases. Never recommend unsafe practices. Never encourage unhealthy weight loss. Always prioritize healthy, sustainable habits.

Be encouraging, supportive, and practical. Keep responses well structured with clear markdown headings (##) and bullet points.`;

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export function serverSupabase(token: string) {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type ProfileContext = {
  profile: Database["public"]["Tables"]["profiles"]["Row"] | null;
  recentProgress: Database["public"]["Tables"]["daily_progress"]["Row"][];
  recentJournal: Database["public"]["Tables"]["journal"]["Row"][];
};

export async function loadProfileContext(
  supabase: ReturnType<typeof serverSupabase>,
  userId: string,
): Promise<ProfileContext> {
  const [{ data: profile }, { data: progress }, { data: journal }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("daily_progress")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7),
    supabase
      .from("journal")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(7),
  ]);
  return { profile: profile ?? null, recentProgress: progress ?? [], recentJournal: journal ?? [] };
}

export function contextToPromptBlock(ctx: ProfileContext): string {
  const p = ctx.profile;
  if (!p) return "User profile: (unavailable)";
  const lines = [
    `Name: ${p.full_name ?? "(not set)"}`,
    `Age: ${p.age ?? "?"} | Gender: ${p.gender ?? "?"}`,
    `Height: ${p.height ?? "?"}cm | Weight: ${p.weight ?? "?"}kg`,
    `Fitness goal: ${p.fitness_goal ?? "?"} | Experience: ${p.workout_experience ?? "?"} | Prefers: ${p.workout_preference ?? "?"}`,
    `Skin type: ${p.skin_type ?? "?"} | Concerns: ${(p.skin_concerns ?? []).join(", ") || "none"}`,
    `Budget: ${p.budget ?? "?"} | Daily time: ${p.daily_time ?? "?"}`,
    `Water goal: ${p.water_goal ?? 8} cups | Sleep goal: ${p.sleep_hours ?? 8}h | Meals/day: ${p.meals_per_day ?? 3}`,
  ];
  if (ctx.recentProgress.length) {
    const avgGlow = Math.round(
      ctx.recentProgress.reduce((s, r) => s + (r.glow_score ?? 0), 0) / ctx.recentProgress.length,
    );
    lines.push(`Recent 7-day avg glow score: ${avgGlow}. Current streak: ${ctx.recentProgress[0]?.current_streak ?? 0}`);
  }
  if (ctx.recentJournal.length) {
    const moods = ctx.recentJournal.map((j) => j.mood).filter(Boolean).slice(0, 5).join(", ");
    if (moods) lines.push(`Recent moods: ${moods}`);
  }
  return `USER PROFILE & CONTEXT:\n${lines.join("\n")}`;
}

export type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

export async function callGateway(messages: ChatMsg[], opts?: { json?: boolean }): Promise<string> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const body: Record<string, unknown> = { model: MODEL, messages };
  if (opts?.json) body.response_format = { type: "json_object" };
  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    if (res.status === 429) throw new Error("AI rate limit reached. Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    throw new Error(`AI error (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export async function streamGateway(messages: ChatMsg[]): Promise<Response> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const upstream = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
  });
  if (!upstream.ok) {
    const text = await upstream.text();
    return new Response(text || "AI request failed", { status: upstream.status });
  }
  // Transform SSE -> plain text deltas
  const stream = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const raw of lines) {
            const line = raw.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (payload === "[DONE]") { controller.close(); return; }
            try {
              const j = JSON.parse(payload);
              const delta = j?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(new TextEncoder().encode(delta));
            } catch { /* ignore parse errors */ }
          }
        }
        controller.close();
      } catch (e) { controller.error(e); }
    },
  });
  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export function safeParseJson<T = unknown>(text: string): T | null {
  const cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
  try { return JSON.parse(cleaned) as T; } catch { /* fallthrough */ }
  const m = cleaned.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]) as T; } catch { /* ignore */ } }
  return null;
}
