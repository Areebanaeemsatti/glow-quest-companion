import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  component: ResetPage,
  head: () => ({
    meta: [
      { title: "Reset password · GlowQuest AI" },
      { name: "description", content: "Choose a new password for your GlowQuest AI account." },
      { property: "og:title", content: "Reset password · GlowQuest AI" },
      { property: "og:description", content: "Choose a new password for your account." },
    ],
  }),
});

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

function ResetPage() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { password: "", confirm: "" } });

  const onSubmit = async (v: z.infer<typeof schema>) => {
    const { error } = await supabase.auth.updateUser({ password: v.password });
    if (error) return toast.error(error.message);
    toast.success("Password updated ✨");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-app-gradient p-6">
      <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-glow-gradient shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold">Set a new password</span>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" {...form.register("password")} />
            {form.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>}
          </div>
          <div>
            <Label htmlFor="cf">Confirm password</Label>
            <Input id="cf" type="password" {...form.register("confirm")} />
            {form.formState.errors.confirm && <p className="mt-1 text-xs text-destructive">{form.formState.errors.confirm.message}</p>}
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting} className="w-full rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
            {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
