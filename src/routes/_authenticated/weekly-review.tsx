import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { generateWeeklyReview } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, CalendarCheck } from "lucide-react";
import { MarkdownView } from "@/components/markdown-view";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/weekly-review")({
  head: () => ({ meta: [
    { title: "Weekly Review · GlowQuest AI" },
    { name: "description", content: "Your AI-powered weekly wellness recap with insights and next-week focus." },
    { property: "og:title", content: "Weekly Review · GlowQuest AI" },
    { property: "og:description", content: "AI-powered weekly recap and next-week focus." },
  ] }),
  component: WeeklyReview,
});

function WeeklyReview() {
  const { user } = useAuth();
  const gen = useServerFn(generateWeeklyReview);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("weekly_reviews").select("content").eq("user_id", user.id)
      .order("week_start", { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => {
        const c = (data?.content as { markdown?: string } | null)?.markdown;
        if (c) setContent(c);
      });
  }, [user]);

  const onGenerate = async () => {
    setLoading(true);
    try {
      const res = (await gen({ data: {} })) as { content: string };
      setContent(res.content);
      toast.success("Weekly review ready!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoading(false); }
  };

  const onExport = () => {
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>Weekly Review</title>
      <style>body{font-family:ui-sans-serif,system-ui;max-width:720px;margin:40px auto;padding:0 20px;color:#333;line-height:1.6}h1,h2{color:#7c4dff}pre{white-space:pre-wrap}</style>
      </head><body><h1>GlowQuest Weekly Review</h1><pre>${content.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!))}</pre>
      <script>window.onload=()=>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl border-0 bg-glow-gradient text-primary-foreground shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-2xl">
            <CalendarCheck className="h-6 w-6" /> Weekly Review
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button onClick={onGenerate} disabled={loading} variant="secondary" className="rounded-full">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {content ? "Regenerate" : "Generate weekly review"}
          </Button>
          {content && <Button onClick={onExport} variant="secondary" className="rounded-full">Export PDF</Button>}
        </CardContent>
      </Card>
      {content ? (
        <Card className="rounded-3xl"><CardContent className="p-6"><MarkdownView content={content} /></CardContent></Card>
      ) : !loading && (
        <Card className="rounded-3xl border-dashed"><CardContent className="p-8 text-center text-muted-foreground">
          Generate your first AI weekly review based on your last 7 days of progress and journal entries.
        </CardContent></Card>
      )}
    </div>
  );
}
