import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Droplet, Dumbbell, Sparkles, Moon, Flame, BookHeart, ArrowRight, Loader2, MessageCircleHeart, Target, Apple, Droplets } from "lucide-react";
import { quoteOfTheDay, todayISO } from "@/lib/glow";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { generateDailyTip } from "@/lib/ai.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard · GlowQuest AI" },
      { name: "description", content: "Your daily glow score, streak, hydration, workout, sleep and skincare — at a glance." },
    ],
  }),
});

function Dashboard() {
  const { user } = useAuth();
  const uid = user!.id;

  const profileQ = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle()).data,
  });

  const todayQ = useQuery({
    queryKey: ["progress-today", uid],
    queryFn: async () =>
      (await supabase.from("daily_progress").select("*").eq("user_id", uid).eq("date", todayISO()).maybeSingle()).data,
  });

  const weekQ = useQuery({
    queryKey: ["progress-week", uid],
    queryFn: async () => {
      const from = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
      const { data } = await supabase.from("daily_progress").select("*").eq("user_id", uid).gte("date", from).order("date", { ascending: true });
      return data ?? [];
    },
  });

  const journalQ = useQuery({
    queryKey: ["journal-latest", uid],
    queryFn: async () =>
      (await supabase.from("journal").select("*").eq("user_id", uid).order("date", { ascending: false }).limit(1)).data?.[0],
  });

  const profile = profileQ.data;
  const today = todayQ.data;
  const glow = today?.glow_score ?? 0;
  const streak = today?.current_streak ?? 0;

  const chartData = (weekQ.data ?? []).map((r) => ({
    day: new Date(r.date).toLocaleDateString(undefined, { weekday: "short" }),
    glow: r.glow_score,
  }));

  const first = (profile?.full_name || "").split(" ")[0] || "friend";

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-glow-gradient p-6 text-primary-foreground shadow-glow sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm/none opacity-90">Welcome back,</div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{first} ✨</h1>
            <p className="mt-2 max-w-md text-white/90">{quoteOfTheDay()}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Glow Score" value={glow} accent />
            <Stat label="Current Streak" value={`${streak}d`} accent icon={<Flame className="h-4 w-4" />} />
          </div>
        </div>
      </div>

      <AiTipCard />

      <div className="grid gap-2 sm:grid-cols-4">
        <QuickLink to="/ai-coach" icon={MessageCircleHeart} label="AI Coach" />
        <QuickLink to="/quests" icon={Target} label="Daily Quests" />
        <QuickLink to="/skincare-planner" icon={Droplets} label="Skincare" />
        <QuickLink to="/workout-planner" icon={Dumbbell} label="Workout" />
      </div>



      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Droplet} label="Water" value={`${today?.water ?? 0} / ${profile?.water_goal ?? 8}`} sub="glasses today" />
        <Metric icon={Dumbbell} label="Workout" value={today?.workout_completed ? "Complete" : "Pending"} sub="today" />
        <Metric icon={Sparkles} label="Skincare" value={today?.skincare_completed ? "Complete" : "Pending"} sub="today" />
        <Metric icon={Moon} label="Sleep" value={`${today?.sleep_hours ?? 0}h`} sub={`goal ${profile?.sleep_hours ?? 8}h`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold">Your glow this week</h3>
            <Link to="/progress" className="text-sm text-muted-foreground hover:text-foreground">
              Log today <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--glow)" />
                    <stop offset="100%" stopColor="var(--glow-soft)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--card)" }} />
                <Line type="monotone" dataKey="glow" stroke="url(#g)" strokeWidth={3} dot={{ r: 4, fill: "var(--glow)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <GlowRing score={glow} />
          <QuickActions />
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold flex items-center gap-2"><BookHeart className="h-5 w-5" /> Latest journal</h3>
          <Link to="/journal" className="text-sm text-muted-foreground hover:text-foreground">Open journal <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
        </div>
        {journalQ.data ? (
          <div>
            <div className="text-sm text-muted-foreground">{new Date(journalQ.data.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {journalQ.data.mood && <span className="rounded-full bg-accent px-3 py-1">Mood · {journalQ.data.mood}</span>}
              {journalQ.data.energy != null && <span className="rounded-full bg-accent px-3 py-1">Energy · {journalQ.data.energy}/10</span>}
              {journalQ.data.skin_condition && <span className="rounded-full bg-accent px-3 py-1">Skin · {journalQ.data.skin_condition}</span>}
            </div>
            {journalQ.data.notes && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{journalQ.data.notes}</p>}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No entries yet. Start reflecting today ✨</p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, icon, accent }: { label: string; value: React.ReactNode; icon?: React.ReactNode; accent?: boolean }) {
  return (
    <div className={"rounded-2xl px-4 py-3 " + (accent ? "bg-white/15 backdrop-blur" : "bg-card border")}>
      <div className="text-xs opacity-80">{label}</div>
      <div className="mt-1 flex items-center gap-1.5 font-display text-2xl font-semibold">{icon}{value}</div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; sub: string }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-glow-gradient text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="font-display text-lg font-semibold">Quick actions</div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link to="/progress" className="rounded-xl border bg-card px-3 py-2 text-sm hover:bg-accent">+ Water</Link>
        <Link to="/progress" className="rounded-xl border bg-card px-3 py-2 text-sm hover:bg-accent">Log workout</Link>
        <Link to="/progress" className="rounded-xl border bg-card px-3 py-2 text-sm hover:bg-accent">Skincare done</Link>
        <Link to="/journal" className="rounded-xl border bg-card px-3 py-2 text-sm hover:bg-accent">New journal</Link>
      </div>
    </div>
  );
}

function GlowRing({ score }: { score: number }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  const dash = c * (score / 100);
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="font-display text-lg font-semibold">Glow ring</div>
      <div className="mt-3 grid place-items-center">
        <svg width={160} height={160} viewBox="0 0 160 160">
          <defs>
            <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--glow)" />
              <stop offset="100%" stopColor="var(--glow-soft)" />
            </linearGradient>
          </defs>
          <circle cx="80" cy="80" r={r} stroke="var(--border)" strokeWidth="12" fill="none" />
          <circle cx="80" cy="80" r={r} stroke="url(#rg)" strokeWidth="12" fill="none"
            strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} transform="rotate(-90 80 80)" />
          <text x="80" y="86" textAnchor="middle" className="fill-foreground font-display" fontSize="30" fontWeight={600}>{score}</text>
        </svg>
      </div>
    </div>
  );
}

function AiTipCard() {
  const run = useServerFn(generateDailyTip);
  const [tip, setTip] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try {
      const r = (await run()) as { content: string };
      setTip(r.content);
    } finally { setLoading(false); }
  };
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-glow-gradient shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="font-display text-lg font-semibold">Today's AI Tip</div>
        </div>
        <Button size="sm" variant="ghost" className="rounded-full" onClick={load} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (tip ? "Refresh" : "Generate")}
        </Button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {tip || "Get a personalized wellness tip generated from your profile and progress."}
      </p>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function QuickLink({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="group flex items-center gap-2 rounded-2xl border bg-card p-3 shadow-soft hover:bg-accent transition">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-glow-gradient shadow-glow">
        <Icon className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="text-sm font-medium">{label}</span>
      <ArrowRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-60 transition" />
    </Link>
  );
}

