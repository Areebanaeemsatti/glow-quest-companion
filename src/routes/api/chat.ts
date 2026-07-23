import { createFileRoute } from "@tanstack/react-router";
import {
  SYSTEM_PROMPT,
  contextToPromptBlock,
  loadProfileContext,
  serverSupabase,
  streamGateway,
  type ChatMsg,
} from "@/lib/ai.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        if (!token) return new Response("Unauthorized", { status: 401 });
        const supabase = serverSupabase(token);
        const { data: userData, error: userErr } = await supabase.auth.getUser();
        if (userErr || !userData.user) return new Response("Unauthorized", { status: 401 });

        const body = (await request.json()) as { messages?: ChatMsg[] };
        const history = Array.isArray(body.messages) ? body.messages : [];
        const ctx = await loadProfileContext(supabase, userData.user.id);
        const messages: ChatMsg[] = [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: contextToPromptBlock(ctx) },
          ...history.filter((m) => m.role === "user" || m.role === "assistant"),
        ];
        return streamGateway(messages);
      },
    },
  },
});
