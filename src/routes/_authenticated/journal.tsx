import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BookHeart, Trash2, Pencil, Save, X } from "lucide-react";
import type { JournalEntry } from "@/lib/glow";

export const Route = createFileRoute("/_authenticated/journal")({
  component: JournalPage,
  head: () => ({
    meta: [
      { title: "Journal · GlowQuest AI" },
      { name: "description", content: "Reflect on your mood, energy, and skin. Build the self-awareness that fuels your glow." },
    ],
  }),
});

const moods = ["😊 Happy", "😌 Calm", "😐 Meh", "😔 Low", "😤 Stressed", "🥰 Grateful"];
const skinConds = ["Glowing", "Balanced", "Dry", "Oily", "Breakout"];

function JournalPage() {
  const { user } = useAuth();
  const uid = user!.id;
  const qc = useQueryClient();

  const listQ = useQuery({
    queryKey: ["journal", uid],
    queryFn: async () =>
      (await supabase.from("journal").select("*").eq("user_id", uid).order("date", { ascending: false })).data ?? [],
  });

  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [mood, setMood] = useState<string>("");
  const [energy, setEnergy] = useState<number>(5);
  const [skin, setSkin] = useState<string>("");
  const [notes, setNotes] = useState("");

  const reset = () => { setEditing(null); setMood(""); setEnergy(5); setSkin(""); setNotes(""); };

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("journal").update({
          mood, energy, skin_condition: skin, notes,
        }).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("journal").insert({
          user_id: uid, mood, energy, skin_condition: skin, notes,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Entry updated" : "Entry saved");
      reset();
      qc.invalidateQueries({ queryKey: ["journal", uid] });
      qc.invalidateQueries({ queryKey: ["journal-latest", uid] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journal").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Entry deleted");
      qc.invalidateQueries({ queryKey: ["journal", uid] });
    },
  });

  const startEdit = (e: JournalEntry) => {
    setEditing(e);
    setMood(e.mood ?? "");
    setEnergy(e.energy ?? 5);
    setSkin(e.skin_condition ?? "");
    setNotes(e.notes ?? "");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold flex items-center gap-2"><BookHeart className="h-5 w-5" /> {editing ? "Edit entry" : "New entry"}</h2>
          {editing && <Button variant="ghost" size="icon" className="rounded-full" onClick={reset}><X className="h-4 w-4" /></Button>}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Mood</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {moods.map((m) => (
                <button key={m} onClick={() => setMood(m)}
                  className={"rounded-full border px-3 py-1.5 text-sm transition " + (mood === m ? "border-transparent bg-glow-gradient text-primary-foreground shadow-glow" : "hover:bg-accent")}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Energy · {energy}/10</Label>
            <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(Number(e.target.value))} className="mt-2 w-full accent-primary" />
          </div>

          <div>
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Skin condition</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skinConds.map((s) => (
                <button key={s} onClick={() => setSkin(s)}
                  className={"rounded-full border px-3 py-1.5 text-sm transition " + (skin === s ? "border-transparent bg-glow-gradient text-primary-foreground shadow-glow" : "hover:bg-accent")}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-xs uppercase tracking-wide text-muted-foreground">Notes</Label>
            <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How are you feeling today?" maxLength={2000} />
          </div>

          <Button onClick={() => save.mutate()} disabled={save.isPending} className="w-full rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
            <Save className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Save entry"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-2xl font-semibold">Previous entries</h2>
        {(listQ.data ?? []).length === 0 && (
          <div className="rounded-3xl border bg-card p-8 text-center text-muted-foreground shadow-soft">No entries yet — your first reflection is a click away ✨</div>
        )}
        {(listQ.data ?? []).map((e) => (
          <div key={e.id} className="rounded-3xl border bg-card p-5 shadow-soft">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {new Date(e.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-sm">
                  {e.mood && <span className="rounded-full bg-accent px-3 py-1">{e.mood}</span>}
                  {e.energy != null && <span className="rounded-full bg-accent px-3 py-1">Energy {e.energy}/10</span>}
                  {e.skin_condition && <span className="rounded-full bg-accent px-3 py-1">Skin · {e.skin_condition}</span>}
                </div>
                {e.notes && <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">{e.notes}</p>}
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="rounded-full" onClick={() => startEdit(e)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="rounded-full text-destructive" onClick={() => remove.mutate(e.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
