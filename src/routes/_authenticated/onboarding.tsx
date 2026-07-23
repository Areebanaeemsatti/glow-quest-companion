import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
  head: () => ({
    meta: [
      { title: "Welcome · GlowQuest AI" },
      { name: "description", content: "Personalize your GlowQuest experience in a few gentle steps." },
    ],
  }),
});

type Data = {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  fitness_goal?: string;
  skin_type?: string;
  skin_concerns: string[];
  daily_time?: string;
  budget?: string;
  water_goal: number;
  sleep_hours: number;
  meals_per_day: number;
  workout_experience?: string;
  workout_preference?: string;
};

const goals = ["Lose Weight", "Gain Muscle", "Maintain", "Improve Fitness"];
const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];
const concernsList = ["Acne", "Dark Spots", "Dryness", "Oiliness", "Fine Lines", "Redness"];
const genders = ["Female", "Male", "Non-binary", "Prefer not to say"];
const times = ["15 min", "30 min", "45 min", "60+ min"];
const budgets = ["$", "$$", "$$$", "$$$$"];
const experiences = ["Beginner", "Intermediate", "Advanced"];
const preferences = ["Home", "Gym", "Outdoor", "Yoga", "Pilates", "HIIT"];

const TOTAL = 6;

function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [d, setD] = useState<Data>({ skin_concerns: [], water_goal: 8, sleep_hours: 8, meals_per_day: 3 });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => setD((s) => ({ ...s, [k]: v }));
  const toggleConcern = (c: string) =>
    setD((s) => ({ ...s, skin_concerns: s.skin_concerns.includes(c) ? s.skin_concerns.filter((x) => x !== c) : [...s.skin_concerns, c] }));

  const next = () => setStep((s) => Math.min(TOTAL, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      age: d.age, gender: d.gender, height: d.height, weight: d.weight,
      fitness_goal: d.fitness_goal, skin_type: d.skin_type, skin_concerns: d.skin_concerns,
      budget: d.budget, daily_time: d.daily_time, water_goal: d.water_goal,
      sleep_hours: d.sleep_hours, meals_per_day: d.meals_per_day,
      workout_experience: d.workout_experience, workout_preference: d.workout_preference,
      onboarding_completed: true,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("You're all set ✨");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-app-gradient p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-glow-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold">GlowQuest AI</span>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} of {TOTAL}</span>
          <span>{Math.round((step / TOTAL) * 100)}%</span>
        </div>
        <Progress value={(step / TOTAL) * 100} className="mb-6 h-2 rounded-full" />

        <div className="rounded-3xl border bg-card p-6 shadow-soft sm:p-10">
          {step === 1 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-glow-gradient shadow-glow">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-semibold">Welcome to your glow-up ✨</h1>
              <p className="text-muted-foreground">
                A few gentle questions so we can shape your daily rituals. Takes about a minute.
              </p>
            </div>
          )}

          {step === 2 && (
            <Section title="Tell us about you" subtitle="This helps personalize your plan.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age"><Input type="number" value={d.age ?? ""} onChange={(e) => set("age", Number(e.target.value) || undefined)} /></Field>
                <Field label="Gender">
                  <SelectPills options={genders} value={d.gender} onChange={(v) => set("gender", v)} />
                </Field>
                <Field label="Height (cm)"><Input type="number" value={d.height ?? ""} onChange={(e) => set("height", Number(e.target.value) || undefined)} /></Field>
                <Field label="Weight (kg)"><Input type="number" value={d.weight ?? ""} onChange={(e) => set("weight", Number(e.target.value) || undefined)} /></Field>
              </div>
            </Section>
          )}

          {step === 3 && (
            <Section title="Your fitness goal" subtitle="What glow are you chasing?">
              <SelectPills options={goals} value={d.fitness_goal} onChange={(v) => set("fitness_goal", v)} />
            </Section>
          )}

          {step === 4 && (
            <Section title="Your skin type" subtitle="Pick the one that feels most like you.">
              <SelectPills options={skinTypes} value={d.skin_type} onChange={(v) => set("skin_type", v)} />
            </Section>
          )}

          {step === 5 && (
            <Section title="Skin concerns" subtitle="Select all that apply.">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {concernsList.map((c) => {
                  const active = d.skin_concerns.includes(c);
                  return (
                    <button key={c} type="button" onClick={() => toggleConcern(c)}
                      className={"rounded-2xl border px-4 py-3 text-sm font-medium transition " +
                        (active ? "border-transparent bg-glow-gradient text-primary-foreground shadow-glow" : "hover:bg-accent")}>
                      {active && <Check className="mr-1 inline h-4 w-4" />}{c}
                    </button>
                  );
                })}
              </div>
            </Section>
          )}

          {step === 6 && (
            <Section title="Your lifestyle" subtitle="Set your daily targets. You can change these anytime.">
              <div className="space-y-4">
                <Field label="Daily time available"><SelectPills options={times} value={d.daily_time} onChange={(v) => set("daily_time", v)} /></Field>
                <Field label="Budget"><SelectPills options={budgets} value={d.budget} onChange={(v) => set("budget", v)} /></Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Water (glasses)"><Input type="number" value={d.water_goal} onChange={(e) => set("water_goal", Number(e.target.value) || 0)} /></Field>
                  <Field label="Sleep (hours)"><Input type="number" step="0.5" value={d.sleep_hours} onChange={(e) => set("sleep_hours", Number(e.target.value) || 0)} /></Field>
                  <Field label="Meals / day"><Input type="number" value={d.meals_per_day} onChange={(e) => set("meals_per_day", Number(e.target.value) || 0)} /></Field>
                </div>
                <Field label="Workout experience"><SelectPills options={experiences} value={d.workout_experience} onChange={(v) => set("workout_experience", v)} /></Field>
                <Field label="Workout preference"><SelectPills options={preferences} value={d.workout_preference} onChange={(v) => set("workout_preference", v)} /></Field>
              </div>
            </Section>
          )}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="outline" className="rounded-full" onClick={prev} disabled={step === 1}>
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            {step < TOTAL ? (
              <Button onClick={next} className="rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish} disabled={saving} className="rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Finish
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SelectPills({ options, value, onChange }: { options: string[]; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={"rounded-full border px-4 py-2 text-sm font-medium transition " +
              (active ? "border-transparent bg-glow-gradient text-primary-foreground shadow-glow" : "hover:bg-accent")}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
