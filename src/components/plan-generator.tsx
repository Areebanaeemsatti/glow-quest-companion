import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, RefreshCw, Save, Sparkles } from "lucide-react";
import { MarkdownView } from "@/components/markdown-view";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type SavedTable = "saved_skincare_plans" | "saved_workout_plans" | "saved_nutrition_plans";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PlanGenerator({ title, icon: Icon, generateFn, savedTable, savedLabel }: {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateFn: any;
  savedTable: SavedTable;
  savedLabel: string;
}) {
  const { user } = useAuth();
  const run = useServerFn(generateFn);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const res = (await run({ data: {} })) as { content: string };
      setContent(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to generate");
    } finally { setLoading(false); }
  };

  const onSave = async () => {
    if (!user || !content) return;
    setSaving(true);
    const { error } = await supabase.from(savedTable).insert({
      user_id: user.id,
      title: `${savedLabel} — ${new Date().toLocaleDateString()}`,
      content: { markdown: content },
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved to your library");
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-0 bg-glow-gradient text-primary-foreground shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl">
            <Icon className="h-6 w-6" /> {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={onGenerate} disabled={loading} variant="secondary" className="rounded-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {content ? "Regenerate" : "Generate my plan"}
          </Button>
          {content && (
            <Button onClick={onSave} disabled={saving} variant="secondary" className="rounded-full">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          )}
        </CardContent>
      </Card>

      {loading && !content && (
        <Card className="rounded-3xl"><CardContent className="p-8 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
          Crafting your personalized plan...
        </CardContent></Card>
      )}

      {content && (
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <MarkdownView content={content} />
          </CardContent>
        </Card>
      )}

      {!content && !loading && (
        <Card className="rounded-3xl border-dashed">
          <CardContent className="p-8 text-center text-muted-foreground">
            Click <strong>Generate my plan</strong> to create a personalized plan tailored from your profile.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
