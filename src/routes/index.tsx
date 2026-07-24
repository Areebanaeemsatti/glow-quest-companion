import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles, Droplet, Dumbbell, Moon, HeartPulse, ArrowRight, Apple, Target,
  MessageCircleHeart, CalendarCheck, Activity, BookHeart, Check, Star, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "GlowQuest AI — Your AI Glow-Up Companion" },
      { name: "description", content: "Track hydration, workouts, skincare, sleep, and mood. Build glow-worthy habits with an AI wellness companion tailored to you." },
      { property: "og:title", content: "GlowQuest AI — Your AI Glow-Up Companion" },
      { property: "og:description", content: "A premium wellness platform for skincare, fitness, hydration, sleep and self-care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://glow-quest-companion.lovable.app/" }],
  }),
});

function Landing() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen bg-app-gradient text-foreground">
      <Nav />
      <Hero />
      <LogosStrip />
      <Features />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-glow-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold tracking-tight">GlowQuest AI</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition hover:text-foreground">Features</a>
          <a href="#how" className="transition hover:text-foreground">How it works</a>
          <a href="#testimonials" className="transition hover:text-foreground">Reviews</a>
          <a href="#faq" className="transition hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="hidden rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-block">
            Sign in
          </Link>
          <Link
            to="/auth"
            className="inline-flex items-center gap-1.5 rounded-full bg-glow-gradient px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-glow-gradient opacity-30 blur-[120px]" />
        <div className="absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-secondary opacity-40 blur-[120px]" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div className="animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/50 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-glow-gradient" />
            </span>
            AI-powered wellness · Now in beta
          </span>
          <h1 className="mt-6 font-display text-5xl leading-[1.02] font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Small rituals.
            <br />
            <span className="bg-glow-gradient bg-clip-text text-transparent">Radiant results.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            GlowQuest AI turns skincare, hydration, fitness, sleep and self-care into a gentle
            daily practice — with a glow score that grows with you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-full bg-glow-gradient px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.03] active:scale-[0.98]"
            >
              Start your glow-up
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="rounded-full border border-white/50 bg-white/50 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/80"
            >
              See how it works
            </a>
          </div>
          <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Free to start
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> No credit card
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Private by default
            </div>
          </div>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  return (
    <div className="relative animate-fade-in [animation-delay:150ms]">
      <div className="absolute -inset-4 -z-10 rounded-[3rem] bg-glow-gradient opacity-20 blur-2xl" />
      <div className="glass relative rounded-[2.25rem] p-6 shadow-soft">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-glow-gradient p-6 text-primary-foreground shadow-glow">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs tracking-wide uppercase opacity-80">Today's Glow Score</div>
              <div className="mt-2 font-display text-7xl leading-none font-semibold">87</div>
              <div className="mt-2 flex items-center gap-1.5 text-sm opacity-90">
                <Sparkles className="h-3.5 w-3.5" /> Streak · 12 days
              </div>
            </div>
            <GlowRing />
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { l: "Water", v: "7 / 8", icon: Droplet, tint: "from-sky-100 to-white" },
            { l: "Workout", v: "Done ✓", icon: Dumbbell, tint: "from-rose-100 to-white" },
            { l: "Skincare", v: "AM + PM", icon: Sparkles, tint: "from-violet-100 to-white" },
            { l: "Sleep", v: "7.5h", icon: Moon, tint: "from-indigo-100 to-white" },
          ].map((s) => (
            <div
              key={s.l}
              className="group rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <s.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="mt-1.5 font-semibold text-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <FloatingBadge className="-left-6 top-8" delay="0s">
        <Target className="h-4 w-4 text-primary" />
        <span>Quest complete +25 XP</span>
      </FloatingBadge>
      <FloatingBadge className="-right-4 bottom-16" delay=".4s">
        <HeartPulse className="h-4 w-4 text-primary" />
        <span>Mood: Radiant</span>
      </FloatingBadge>
    </div>
  );
}

function GlowRing() {
  const r = 30;
  const c = 2 * Math.PI * r;
  const pct = 0.87;
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20">
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="6" />
      <circle
        cx="40" cy="40" r={r} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 40 40)"
      />
    </svg>
  );
}

function FloatingBadge({ children, className = "", delay = "0s" }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`absolute hidden animate-fade-in items-center gap-2 rounded-full border border-white/60 bg-white/90 px-3 py-2 text-xs font-medium shadow-soft backdrop-blur md:inline-flex ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------------- LOGOS ---------------- */
function LogosStrip() {
  const items = ["as seen in", "SELF-CARE WKLY", "GLOW MAG", "ROUTINE.CO", "MINDFUL TIMES", "RITUAL DAILY"];
  return (
    <section className="border-y border-white/30 bg-white/30 py-8 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-xs tracking-[0.2em] text-muted-foreground uppercase">
        {items.map((i, idx) => (
          <span key={i} className={idx === 0 ? "font-medium" : "font-display text-sm tracking-widest"}>{i}</span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const features = [
    { icon: MessageCircleHeart, title: "AI Coach", desc: "Chat with a supportive wellness coach that knows your goals." , tint: "from-violet-200/60" },
    { icon: Droplets, title: "Skincare Planner", desc: "AM & PM routines matched to your skin type and budget.", tint: "from-pink-200/60" },
    { icon: Dumbbell, title: "Workout Planner", desc: "Weekly plans tailored to your time, gear, and experience.", tint: "from-rose-200/60" },
    { icon: Apple, title: "Nutrition Planner", desc: "Balanced meals with realistic swaps for real life.", tint: "from-emerald-200/60" },
    { icon: Target, title: "Daily Glow Quests", desc: "Micro-habits with XP that build momentum, not pressure.", tint: "from-amber-200/60" },
    { icon: Activity, title: "Progress Tracking", desc: "See your streak, hydration and glow score climb.", tint: "from-sky-200/60" },
    { icon: BookHeart, title: "Journal Insights", desc: "AI reflects your mood, skin and energy trends back to you.", tint: "from-fuchsia-200/60" },
    { icon: CalendarCheck, title: "Weekly Review", desc: "A gentle recap and a focus for the week ahead.", tint: "from-indigo-200/60" },
  ];
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Features" title="Everything for your glow, in one place" subtitle="Eight thoughtful tools that work together — no more juggling five different apps." />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={f.title}
            style={{ animationDelay: `${i * 60}ms` }}
            className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/60 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.tint} to-transparent opacity-0 transition group-hover:opacity-100`} />
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-glow-gradient text-primary-foreground shadow-glow transition group-hover:scale-110">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="relative mt-5 font-display text-lg font-semibold">{f.title}</div>
            <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Droplets(props: React.SVGProps<SVGSVGElement>) {
  return <Droplet {...props} />;
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Tell us about you", desc: "A 60-second onboarding covers your skin, goals, time and budget.", icon: Sparkles },
    { n: "02", title: "Get your rituals", desc: "AI builds skincare, movement and nutrition plans built for your real life.", icon: HeartPulse },
    { n: "03", title: "Glow, day by day", desc: "Log tiny wins, keep your streak, and watch your glow score rise.", icon: Star },
  ];
  return (
    <section id="how" className="border-y border-white/30 bg-gradient-to-b from-white/40 to-transparent py-24 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="How it works" title="Three gentle steps to your glow-up" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute top-8 right-0 hidden h-px w-1/2 bg-gradient-to-r from-primary/40 to-transparent md:block" />
              )}
              <div className="glass rounded-3xl p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-semibold text-muted-foreground/50">{s.n}</span>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-glow-gradient text-primary-foreground shadow-glow">
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 font-display text-xl font-semibold">{s.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- SHOWCASE ---------------- */
function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="A closer look" title="Beautifully calming, quietly powerful" subtitle="Designed to feel like a moment for yourself — not another notification." />
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <ShowcaseCard title="Glow Score" tint="from-violet-100 via-white to-pink-50">
          <div className="grid place-items-center py-4">
            <BigRing value={87} label="Today" />
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">Water, sleep, skincare and movement — one gentle number.</p>
        </ShowcaseCard>
        <ShowcaseCard title="Daily Quests" tint="from-pink-100 via-white to-amber-50">
          <ul className="space-y-2">
            {[
              { t: "Drink 2 glasses before noon", xp: 10, done: true },
              { t: "5-minute AM cleanser + SPF", xp: 15, done: true },
              { t: "20-min walk after lunch", xp: 20, done: false },
              { t: "Screens off 30 min before bed", xp: 25, done: false },
            ].map((q) => (
              <li key={q.t} className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/70 p-3 text-sm backdrop-blur">
                <div className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${q.done ? "border-primary bg-glow-gradient text-primary-foreground" : "border-muted-foreground/30"}`}>
                  {q.done && <Check className="h-3.5 w-3.5" />}
                </div>
                <span className={`flex-1 ${q.done ? "text-muted-foreground line-through" : ""}`}>{q.t}</span>
                <span className="rounded-full bg-secondary/70 px-2 py-0.5 text-xs font-medium">+{q.xp}</span>
              </li>
            ))}
          </ul>
        </ShowcaseCard>
        <ShowcaseCard title="AI Coach" tint="from-sky-100 via-white to-violet-50">
          <div className="space-y-3">
            <Bubble side="user">My skin feels dry after workouts. Help?</Bubble>
            <Bubble side="ai">
              Try a gentle cleanser + hyaluronic serum right after — then a ceramide moisturizer. Want a full post-workout ritual?
            </Bubble>
            <Bubble side="user">Yes please ✨</Bubble>
          </div>
        </ShowcaseCard>
      </div>
    </section>
  );
}

function ShowcaseCard({ title, tint, children }: { title: string; tint: string; children: React.ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/60 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-glow">
      <div className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${tint} opacity-70`} />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">{title}</span>
          <span className="rounded-full border border-white/60 bg-white/70 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase backdrop-blur">Preview</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function BigRing({ value, label }: { value: number; label: string }) {
  const r = 60;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative">
      <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
        <defs>
          <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.79 0.11 300)" />
            <stop offset="100%" stopColor="oklch(0.85 0.09 10)" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth="12" />
        <circle cx="80" cy="80" r={r} fill="none" stroke="url(#lg)" strokeWidth="12" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-4xl font-semibold">{value}</div>
          <div className="text-[10px] tracking-wider text-muted-foreground uppercase">{label}</div>
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, children }: { side: "user" | "ai"; children: React.ReactNode }) {
  return (
    <div className={`flex ${side === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ${side === "user" ? "bg-glow-gradient text-primary-foreground" : "border border-white/60 bg-white/80 backdrop-blur"}`}>
        {children}
      </div>
    </div>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const t = [
    { q: "Finally, an app that doesn't shame me. My skin and my mood have never been better.", a: "Amelia R.", r: "Skincare devotee" },
    { q: "The daily quests are stupidly satisfying. I'm on a 47-day streak and I actually feel it.", a: "Priya S.", r: "Marathoner in training" },
    { q: "It reads like a coach who genuinely knows me. The weekly reviews are the highlight of my Sunday.", a: "Jules M.", r: "New mom, glowing" },
  ];
  return (
    <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Loved by our community" title="A softer approach to feeling your best" />
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {t.map((x) => (
          <figure key={x.a} className="glass flex h-full flex-col rounded-3xl p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 fill-current" />))}
            </div>
            <blockquote className="mt-4 flex-1 text-base leading-relaxed">"{x.q}"</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/40 pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-glow-gradient font-semibold text-primary-foreground">
                {x.a[0]}
              </div>
              <div>
                <div className="text-sm font-semibold">{x.a}</div>
                <div className="text-xs text-muted-foreground">{x.r}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const items = [
    { q: "Is GlowQuest AI really free?", a: "Yes — you can start free with the core habit tracker, glow score and daily quests. AI planners are included during the beta." },
    { q: "How does the AI personalize plans?", a: "It uses your onboarding info — skin type, goals, time, budget — plus your recent progress and journal notes to shape every plan." },
    { q: "Is my data private?", a: "Absolutely. Your entries are stored securely and never sold. You can export or delete your data at any time from settings." },
    { q: "Do I need to be an expert in wellness?", a: "Not at all — GlowQuest is designed for beginners and busy people. Every ritual is small, gentle, and easy to keep." },
    { q: "Does it work on my phone?", a: "Yes. GlowQuest is a beautifully responsive web app that works on phone, tablet and desktop." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="border-t border-white/30 bg-gradient-to-b from-transparent to-white/40 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title="Everything you might be wondering" />
        <div className="mt-12 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q} className="glass overflow-hidden rounded-2xl">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium transition hover:bg-white/40"
                >
                  <span>{it.q}</span>
                  <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>
                <div className={`grid overflow-hidden transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-glow-gradient p-12 text-center text-primary-foreground shadow-glow md:p-20">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
        <Sparkles className="mx-auto h-10 w-10 opacity-90" />
        <h2 className="mt-6 font-display text-4xl leading-tight font-semibold sm:text-5xl">
          Your softest era starts today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-90">
          Join thousands building calmer, glow-ier days — one tiny ritual at a time.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-foreground shadow-soft transition hover:scale-[1.03] active:scale-[0.98]"
          >
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/auth"
            className="rounded-full border border-white/50 bg-white/10 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20"
          >
            I already have one
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-white/30 bg-white/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-glow-gradient shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-semibold">GlowQuest AI</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              A gentle, AI-powered companion for skincare, movement, sleep and self-care.
              Built with love for people who are done with hustle wellness.
            </p>
          </div>
          <div>
            <div className="text-xs tracking-wider text-muted-foreground uppercase">Product</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground transition hover:text-foreground">Features</a></li>
              <li><a href="#how" className="text-muted-foreground transition hover:text-foreground">How it works</a></li>
              <li><a href="#faq" className="text-muted-foreground transition hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs tracking-wider text-muted-foreground uppercase">Get started</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/auth" className="text-muted-foreground transition hover:text-foreground">Sign up</Link></li>
              <li><Link to="/auth" className="text-muted-foreground transition hover:text-foreground">Sign in</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/40 pt-6 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} GlowQuest AI · Made with care.</div>
          <div className="flex gap-5">
            <a href="#" className="transition hover:text-foreground">Privacy</a>
            <a href="#" className="transition hover:text-foreground">Terms</a>
            <a href="#" className="transition hover:text-foreground">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- helpers ---------------- */
function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-3 py-1 text-[11px] font-medium tracking-widest text-primary uppercase backdrop-blur">
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
