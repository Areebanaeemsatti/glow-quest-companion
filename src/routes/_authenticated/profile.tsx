import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile · GlowQuest AI" },
      { name: "description", content: "Update your body metrics, goals, skincare and workout preferences." },
    ],
  }),
});

const goals = ["Lose Weight", "Gain Muscle", "Maintain", "Improve Fitness"];
const skinTypes = ["Dry", "Oily", "Combination", "Normal", "Sensitive"];
const budgets = ["$", "$$", "$$$", "$$$$"];
const preferences = ["Home", "Gym", "Outdoor", "Yoga", "Pilates", "HIIT"];

function ProfilePage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, unknown>>({});

  const profileQ = useQuery({
    queryKey: ["profile", uid],
    queryFn: async () => (await supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle()).data,
  });

  useEffect(() => { if (profileQ.data) setForm(profileQ.data as Record<string, unknown>); }, [profileQ.data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update({
        full_name: form.full_name, height: form.height, weight: form.weight,
        fitness_goal: form.fitness_goal, skin_type: form.skin_type, budget: form.budget,
        workout_preference: form.workout_preference, water_goal: form.water_goal, sleep_hours: form.sleep_hours,
      }).eq("user_id", uid);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Profile saved"); qc.invalidateQueries({ queryKey: ["profile", uid] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (k: string, v: unknown) => setForm((s) => ({ ...s, [k]: v }));

  if (profileQ.isLoading) return <div className="grid place-items-center p-20"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Profile</h1>
        <p className="mt-1 text-muted-foreground">Update your details anytime — your plan adapts with you.</p>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><Input value={String(form.full_name ?? "")} onChange={(e) => set("full_name", e.target.value)} /></Field>
          <Field label="Email"><Input value={user?.email ?? ""} disabled /></Field>
          <Field label="Height (cm)"><Input type="number" value={String(form.height ?? "")} onChange={(e) => set("height", Number(e.target.value) || null)} /></Field>
          <Field label="Weight (kg)"><Input type="number" value={String(form.weight ?? "")} onChange={(e) => set("weight", Number(e.target.value) || null)} /></Field>
          <Field label="Water goal (glasses)"><Input type="number" value={String(form.water_goal ?? 8)} onChange={(e) => set("water_goal", Number(e.target.value))} /></Field>
          <Field label="Sleep goal (hours)"><Input type="number" step="0.5" value={String(form.sleep_hours ?? 8)} onChange={(e) => set("sleep_hours", Number(e.target.value))} /></Field>
          <Field label="Fitness goal"><Pills options={goals} value={String(form.fitness_goal ?? "")} onChange={(v) => set("fitness_goal", v)} /></Field>
          <Field label="Skin type"><Pills options={skinTypes} value={String(form.skin_type ?? "")} onChange={(v) => set("skin_type", v)} /></Field>
          <Field label="Budget"><Pills options={budgets} value={String(form.budget ?? "")} onChange={(v) => set("budget", v)} /></Field>
          <Field label="Workout preference"><Pills options={preferences} value={String(form.workout_preference ?? "")} onChange={(v) => set("workout_preference", v)} /></Field>
        </div>

        <Button onClick={() => save.mutate()} disabled={save.isPending} className="mt-6 rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
          {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save changes
        </Button>
      </div>
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

function Pills({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o} type="button" onClick={() => onChange(o)}
          className={"rounded-full border px-3 py-1.5 text-sm transition " + (value === o ? "border-transparent bg-glow-gradient text-primary-foreground shadow-glow" : "hover:bg-accent")}>
          {o}
        </button>
      ))}
    </div>
  );
}
