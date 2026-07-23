import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, RefreshCw, Copy, Trash2, Sparkles, MessageCircleHeart } from "lucide-react";
import { MarkdownView } from "@/components/markdown-view";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-coach")({
  head: () => ({ meta: [
    { title: "AI Coach · GlowQuest AI" },
    { name: "description", content: "Chat with your personal AI wellness coach for skincare, fitness, and habits." },
    { property: "og:title", content: "AI Coach · GlowQuest AI" },
    { property: "og:description", content: "Personalized wellness chat powered by AI." },
  ] }),
  component: AiCoach,
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Create today's glow-up routine",
  "Help me build healthy habits",
  "Improve my skincare",
  "Generate today's workout",
  "How do I stay consistent?",
  "My skin feels dry",
  "I only have 30 minutes today",
];

function AiCoach() {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (text: string, history?: Msg[]) => {
    if (!session) return;
    const base = history ?? messages;
    const next: Msg[] = [...base, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setStreaming(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const t = await res.text();
        throw new Error(t || `Request failed (${res.status})`);
      }
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally { setStreaming(false); }
  };

  const regenerate = async () => {
    // Drop last assistant and re-ask
    const idx = [...messages].reverse().findIndex((m) => m.role === "user");
    if (idx < 0) return;
    const cut = messages.length - 1 - idx;
    const lastUser = messages[cut];
    const history = messages.slice(0, cut);
    setMessages(history);
    await send(lastUser.content, history);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v || streaming) return;
    send(v);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
            <MessageCircleHeart className="h-6 w-6 text-primary" /> AI Coach
          </h1>
          <p className="text-sm text-muted-foreground">Personalized from your profile & progress.</p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => setMessages([])}>
            <Trash2 className="mr-1 h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      <Card className="flex min-h-0 flex-1 flex-col rounded-3xl">
        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="mx-auto max-w-md text-center space-y-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-glow-gradient shadow-glow">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Ask me anything about your glow-up journey.</p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {SUGGESTED.map((s) => (
                    <button key={s} onClick={() => send(s)}
                      className="rounded-full border bg-card px-3 py-1.5 text-xs hover:bg-accent transition">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={
                  "max-w-[85%] rounded-2xl px-4 py-3 " +
                  (m.role === "user"
                    ? "bg-glow-gradient text-primary-foreground shadow-glow"
                    : "bg-muted/60 backdrop-blur border")
                }>
                  {m.role === "assistant"
                    ? <MarkdownView content={m.content || "…"} />
                    : <p className="whitespace-pre-wrap text-sm">{m.content}</p>}
                  {m.role === "assistant" && m.content && !streaming && i === messages.length - 1 && (
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 rounded-full text-xs"
                        onClick={() => { navigator.clipboard.writeText(m.content); toast.success("Copied"); }}>
                        <Copy className="mr-1 h-3 w-3" /> Copy
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 rounded-full text-xs" onClick={regenerate}>
                        <RefreshCw className="mr-1 h-3 w-3" /> Regenerate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-muted/60 px-4 py-3 border">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
          <form onSubmit={onSubmit} className="border-t p-3 flex gap-2 items-end">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSubmit(e); } }}
              placeholder="Ask your AI coach…"
              rows={1}
              className="min-h-[44px] resize-none rounded-2xl"
              disabled={streaming}
            />
            <Button type="submit" disabled={streaming || !input.trim()} className="rounded-full h-11 w-11 p-0 bg-glow-gradient shadow-glow">
              {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
