import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LogOut, Moon, Bell, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings · GlowQuest AI" },
      { name: "description", content: "Manage your theme, notifications and account." },
    ],
  }),
});

function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [notif, setNotif] = useState(true);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Tune GlowQuest to your vibe.</p>
      </div>

      <Row icon={Moon} title="Dark mode" desc="Softer visuals for evening rituals.">
        <Switch checked={theme === "dark"} onCheckedChange={toggle} />
      </Row>
      <Row icon={Bell} title="Notifications" desc="Gentle reminders for water, workouts and skincare.">
        <Switch checked={notif} onCheckedChange={setNotif} />
      </Row>
      <Row icon={UserIcon} title="Edit account" desc="Update your name, goals and preferences.">
        <Link to="/profile" className="rounded-full border px-4 py-2 text-sm font-medium hover:bg-accent">Edit</Link>
      </Row>

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <Button onClick={logout} variant="destructive" className="rounded-full">
          <LogOut className="mr-2 h-4 w-4" /> Log out
        </Button>
      </div>
    </div>
  );
}

function Row({ icon: Icon, title, desc, children }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-glow-gradient text-primary-foreground"><Icon className="h-5 w-5" /></div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
