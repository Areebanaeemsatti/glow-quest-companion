import type { Database } from "@/integrations/supabase/types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type DailyProgress = Database["public"]["Tables"]["daily_progress"]["Row"];
export type JournalEntry = Database["public"]["Tables"]["journal"]["Row"];

export function computeGlowScore(input: {
  water: number;
  waterGoal: number;
  workout: boolean;
  skincare: boolean;
  sleep: number;
  sleepGoal: number;
}) {
  const waterPct = Math.min(1, input.water / Math.max(1, input.waterGoal));
  const sleepPct = Math.min(1, input.sleep / Math.max(1, input.sleepGoal));
  const workout = input.workout ? 1 : 0;
  const skin = input.skincare ? 1 : 0;
  const score = Math.round((waterPct * 30 + sleepPct * 25 + workout * 25 + skin * 20));
  return Math.max(0, Math.min(100, score));
}

export function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export const QUOTES = [
  "You glow different when you take care of yourself.",
  "Small habits, big transformations.",
  "Progress, not perfection.",
  "Your future self is watching. Make her proud.",
  "Consistency is the real glow-up.",
  "Nourish. Move. Rest. Repeat.",
];

export function quoteOfTheDay() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}
