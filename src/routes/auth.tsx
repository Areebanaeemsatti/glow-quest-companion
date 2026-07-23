import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in · GlowQuest AI" },
      { name: "description", content: "Sign in or create your GlowQuest AI account to start your glow-up journey." },
      { property: "og:title", content: "Sign in · GlowQuest AI" },
      { property: "og:description", content: "Sign in or create your GlowQuest AI account." },
    ],
  }),
});

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters"),
});

const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Please enter a valid email").max(255),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

const forgotSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
});

function AuthPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard" });
  }, [session, loading, navigate]);

  return (
    <div className="grid min-h-screen bg-app-gradient lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <div className="absolute inset-8 rounded-[2.5rem] bg-glow-gradient p-10 text-primary-foreground shadow-glow">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-semibold">GlowQuest AI</span>
          </div>
          <div className="mt-24">
            <div className="text-sm/none opacity-80">Your daily companion</div>
            <h2 className="mt-3 font-display text-5xl font-semibold leading-tight">
              Small rituals become a radiant life.
            </h2>
            <p className="mt-4 max-w-md text-white/90">
              Track hydration, movement, skincare, sleep, and mood — beautifully.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
          <div className="rounded-3xl border bg-card p-8 shadow-soft">
            <Tabs value={mode === "forgot" ? "login" : mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 rounded-full">
                <TabsTrigger value="login" className="rounded-full">Sign in</TabsTrigger>
                <TabsTrigger value="signup" className="rounded-full">Create account</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                {mode === "forgot" ? <ForgotForm onBack={() => setMode("login")} /> : <LoginForm onForgot={() => setMode("forgot")} />}
              </TabsContent>
              <TabsContent value="signup" className="mt-6">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (v: z.infer<typeof loginSchema>) => {
    const { error } = await supabase.auth.signInWithPassword(v);
    if (error) {
      toast.error(error.message.includes("Invalid") ? "Incorrect email or password" : error.message);
      return;
    }
    toast.success("Welcome back ✨");
    navigate({ to: "/dashboard" });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" onClick={onForgot} className="text-xs text-muted-foreground hover:text-foreground">Forgot?</button>
        </div>
        <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
        {form.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full rounded-full bg-glow-gradient text-primary-foreground shadow-glow hover:opacity-90">
        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign in
      </Button>
    </form>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirm: "" },
  });

  const onSubmit = async (v: z.infer<typeof signupSchema>) => {
    const { data, error } = await supabase.auth.signUp({
      email: v.email,
      password: v.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { full_name: v.fullName },
      },
    });
    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("registered") || msg.includes("exists")) toast.error("This email is already registered");
      else if (msg.includes("weak") || msg.includes("password")) toast.error("Password is too weak");
      else toast.error(error.message);
      return;
    }
    if (!data.session) {
      toast.success("Check your email to verify your account, then sign in.");
      return;
    }
    toast.success("Welcome to GlowQuest ✨");
    navigate({ to: "/onboarding" });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...form.register("fullName")} />
        {form.formState.errors.fullName && <p className="mt-1 text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="s-email">Email</Label>
        <Input id="s-email" type="email" autoComplete="email" {...form.register("email")} />
        {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="s-password">Password</Label>
          <Input id="s-password" type="password" autoComplete="new-password" {...form.register("password")} />
          {form.formState.errors.password && <p className="mt-1 text-xs text-destructive">{form.formState.errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirm">Confirm</Label>
          <Input id="confirm" type="password" autoComplete="new-password" {...form.register("confirm")} />
          {form.formState.errors.confirm && <p className="mt-1 text-xs text-destructive">{form.formState.errors.confirm.message}</p>}
        </div>
      </div>
      <Button type="submit" disabled={form.formState.isSubmitting} className="w-full rounded-full bg-glow-gradient text-primary-foreground shadow-glow hover:opacity-90">
        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });
  const onSubmit = async (v: z.infer<typeof forgotSchema>) => {
    const { error } = await supabase.auth.resetPasswordForEmail(v.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Check your email for a reset link.");
  };
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-sm text-muted-foreground">Enter your email and we'll send a reset link.</div>
      <div>
        <Label htmlFor="f-email">Email</Label>
        <Input id="f-email" type="email" {...form.register("email")} />
        {form.formState.errors.email && <p className="mt-1 text-xs text-destructive">{form.formState.errors.email.message}</p>}
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={onBack}>Back</Button>
        <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1 rounded-full bg-glow-gradient text-primary-foreground shadow-glow">
          {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send link
        </Button>
      </div>
    </form>
  );
}
