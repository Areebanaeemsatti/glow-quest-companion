import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { computeGlowScore, todayISO } from "@/lib/glow";
import { Droplet, Dumbbell, Sparkles, Moon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/progress")({
  component: ProgressPage,
  head: () => ({
    meta: [
      { title: "Daily Progress · GlowQuest AI" },
      { name: "description", content: "Log hydration, workouts, skincare and sleep to build your streak and grow your glow." },
    ],
  }),
});

function ProgressPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();
  const today = todayISO();

  const profileQ = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle()).data,
  });

  const todayQ = useQuery({
    queryKey: ["progress-today", uid],
    queryFn: async () => (await supabase.from("daily_progress").select("*").eq("user_id", uid).eq("date", today).maybeSingle()).data,
  });

  const yesterdayQ = useQuery({
    queryKey: ["progress-yesterday", uid],
    queryFn: async () => {
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      return (await supabase.from("daily_progress").select("*").eq("user_id", uid).eq("date", y).maybeSingle()).data;
    },
  });

  const upsert = useMutation({
    mutationFn: async (patch: { water?: number; workout_completed?: boolean; skincare_completed?: boolean; sleep_hours?: number }) => {
      const cur = todayQ.data ?? { water: 0, workout_completed: false, skincare_completed: false, sleep_hours: 0 };
      const next = { ...cur, ...patch };
      const glow = computeGlowScore({
        water: next.water,
        waterGoal: profileQ.data?.water_goal ?? 8,
        workout: next.workout_completed,
        skincare: next.skincare_completed,
        sleep: Number(next.sleep_hours ?? 0),
        sleepGoal: Number(profileQ.data?.sleep_hours ?? 8),
      });
      const prevStreak = yesterdayQ.data?.current_streak ?? 0;
      const streak = glow >= 60 ? prevStreak + (todayQ.data ? 0 : 1) : prevStreak;
      const finalStreak = todayQ.data ? (glow >= 60 ? Math.max(prevStreak + 1, todayQ.data.current_streak) : todayQ.data.current_streak) : streak;

      const { error } = await supabase.from("daily_progress").upsert(
        {
          user_id: uid,
          date: today,
          water: next.water,
          workout_completed: next.workout_completed,
          skincare_completed: next.skincare_completed,
          sleep_hours: next.sleep_hours,
          glow_score: glow,
          current_streak: finalStreak,
        },
        { onConflict: "user_id,date" },
      );
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["progress-today", uid] });
      qc.invalidateQueries({ queryKey: ["progress-week", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const t = todayQ.data;
  const p = profileQ.data;
  const water = t?.water ?? 0;
  const waterGoal = p?.water_goal ?? 8;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Daily Progress</h1>
        <p className="mt-1 text-muted-foreground">Log today's rituals — your glow score updates instantly.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card icon={Droplet} title="Hydration" subtitle={`${water} of ${waterGoal} glasses`}>
          <div className="mt-4 flex items-center gap-2">
            <Button size="icon" variant="outline" className="rounded-full" onClick={() => upsert.mutate({ water: Math.max(0, water - 1) })}><Minus className="h-4 w-4" /></Button>
            <div className="grid flex-1 grid-cols-8 gap-1.5">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div key={i} className={"h-8 rounded-lg transition " + (i < water ? "bg-glow-gradient shadow-glow" : "bg-muted")} />
              ))}
            </div>
            <Button size="icon" className="rounded-full bg-glow-gradient text-primary-foreground shadow-glow" onClick={() => upsert.mutate({ water: water + 1 })}><Plus className="h-4 w-4" /></Button>
          </div>
        </Card>

        <Card icon={Dumbbell} title="Workout" subtitle={t?.workout_completed ? "Completed today ✨" : "Not yet — you got this"}>
          <div className="mt-4 flex items-center justify-between rounded-2xl border bg-card p-4">
            <span className="text-sm font-medium">Mark as completed</span>
            <Switch checked={!!t?.workout_completed} onCheckedChange={(v) => upsert.mutate({ workout_completed: v })} />
          </div>
        </Card>

        <Card icon={Sparkles} title="Skincare" subtitle={t?.skincare_completed ? "Ritual complete" : "AM + PM ritual"}>
          <div className="mt-4 flex items-center justify-between rounded-2xl border bg-card p-4">
            <span className="text-sm font-medium">Mark as completed</span>
            <Switch checked={!!t?.skincare_completed} onCheckedChange={(v) => upsert.mutate({ skincare_completed: v })} />
          </div>
        </Card>

        <Card icon={Moon} title="Sleep" subtitle={`Goal: ${p?.sleep_hours ?? 8}h`}>
          <div className="mt-4 flex items-center gap-3">
            <Input
              type="number" step="0.5" min={0} max={24}
              defaultValue={t?.sleep_hours ?? 0}
              onBlur={(e) => upsert.mutate({ sleep_hours: Number(e.target.value) || 0 })}
              className="max-w-32"
            />
            <span className="text-sm text-muted-foreground">hours last night</span>
          </div>
        </Card>
      </div>

      <div className="rounded-3xl border bg-glow-gradient p-6 text-primary-foreground shadow-glow">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-sm opacity-90">Today's glow score</div>
            <div className="font-display text-5xl font-semibold">{t?.glow_score ?? 0}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Streak</div>
            <div className="font-display text-3xl font-semibold">{t?.current_streak ?? 0} days</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, children }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-glow-gradient text-primary-foreground shadow-glow"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="font-display text-lg font-semibold">{title}</div>
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
