import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Sparkles, LayoutDashboard, Activity, BookHeart, User, Settings, LogOut, Moon, Sun, Bell, Menu,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/progress", label: "Daily Progress", icon: Activity },
  { to: "/journal", label: "Journal", icon: BookHeart },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle } = useTheme();
  const [fullName, setFullName] = useState<string>("");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setFullName(data?.full_name ?? ""));
  }, [user]);

  const onLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  const initials = (fullName || user?.email || "?")
    .split(/\s+/).map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="mx-auto flex max-w-[1400px] gap-6 p-4 md:p-6">
        {/* Sidebar - desktop */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl border bg-sidebar p-5 shadow-soft lg:flex">
          <SidebarInner pathname={pathname} onLogout={onLogout} />
        </aside>

        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border bg-card/70 p-3 shadow-soft backdrop-blur">
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 border-r bg-sidebar p-5">
                  <SidebarInner pathname={pathname} onLogout={onLogout} />
                </SheetContent>
              </Sheet>
              <div className="lg:hidden flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-glow-gradient shadow-glow">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-display font-semibold">GlowQuest</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="ml-1 flex items-center gap-2 rounded-full border bg-card px-2 py-1">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-glow-gradient text-xs text-primary-foreground">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden pr-2 text-sm font-medium sm:inline">{fullName || user?.email}</span>
              </div>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarInner({ pathname, onLogout }: { pathname: string; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/dashboard" className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-glow-gradient shadow-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold">GlowQuest</div>
          <div className="text-[11px] text-muted-foreground">AI Companion</div>
        </div>
      </Link>
      <nav className="mt-8 flex flex-col gap-1">
        {nav.map((n) => {
          const active = pathname === n.to;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " +
                (active
                  ? "bg-glow-gradient text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent")
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition hover:bg-sidebar-accent"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </div>
  );
}
