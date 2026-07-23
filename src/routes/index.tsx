import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Sparkles, Droplet, Dumbbell, Moon, HeartPulse, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "GlowQuest AI — Your AI Glow-Up Companion" },
      { name: "description", content: "Track hydration, workouts, skincare, sleep, and mood. Build glow-worthy habits with a premium wellness companion." },
      { property: "og:title", content: "GlowQuest AI — Your AI Glow-Up Companion" },
      { property: "og:description", content: "A premium wellness platform for skincare, fitness, hydration, sleep and self-care." },
    ],
  }),
});

function Landing() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  const features = [
    { icon: Droplet, title: "Hydration", desc: "Beautiful daily water tracking that keeps you sipping." },
    { icon: Dumbbell, title: "Movement", desc: "Log workouts and build consistency with streaks." },
    { icon: Sparkles, title: "Skincare", desc: "A ritual you'll actually keep. Simple, satisfying." },
    { icon: Moon, title: "Sleep", desc: "Track rest and watch your glow score rise." },
    { icon: HeartPulse, title: "Journal", desc: "Mood, energy, skin — reflect in seconds." },
  ];

  return (
    <div className="min-h-screen bg-app-gradient">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-glow-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold">GlowQuest AI</span>
        </div>
        <Link
          to="/auth"
          className="rounded-full border bg-card/70 px-5 py-2 text-sm font-medium backdrop-blur transition hover:bg-card"
        >
          Sign in
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-6 pt-10 pb-24">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-glow-gradient" />
              Your AI Glow-Up Companion
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] font-semibold sm:text-6xl">
              Small rituals.
              <br />
              <span className="bg-glow-gradient bg-clip-text text-transparent">Radiant results.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              GlowQuest AI turns skincare, hydration, fitness, sleep and self-care into a
              gentle daily practice — with a glow score that grows with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-glow-gradient px-7 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                Start your glow-up <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth"
                className="rounded-full border bg-card/70 px-7 py-3 text-sm font-semibold backdrop-blur"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="glass rounded-[2rem] p-6 shadow-soft">
              <div className="rounded-3xl bg-glow-gradient p-6 text-primary-foreground shadow-glow">
                <div className="text-sm/none opacity-80">Today's Glow Score</div>
                <div className="mt-2 font-display text-6xl font-semibold">87</div>
                <div className="mt-1 text-sm opacity-90">Streak · 12 days ✨</div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { l: "Water", v: "7 / 8" },
                  { l: "Workout", v: "Done" },
                  { l: "Skincare", v: "AM + PM" },
                  { l: "Sleep", v: "7.5h" },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border bg-card p-4">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className="mt-1 font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24">
          <h2 className="font-display text-3xl font-semibold">Everything for your glow, in one place</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((f) => (
              <div key={f.title} className="rounded-3xl border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-glow-gradient text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold">{f.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t bg-card/50 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GlowQuest AI · Built with love
      </footer>
    </div>
  );
}
