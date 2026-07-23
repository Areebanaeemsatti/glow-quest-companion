import { createFileRoute, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { AppShell } from "@/components/app-shell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    return { userId: data.user.id };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [checkedOnboarding, setCheckedOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [session, loading, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      const done = !!data?.onboarding_completed;
      if (!done && pathname !== "/onboarding") {
        navigate({ to: "/onboarding" });
      } else if (done && pathname === "/onboarding") {
        navigate({ to: "/dashboard" });
      }
      setCheckedOnboarding(true);
    })();
    return () => { cancelled = true; };
  }, [session, pathname, navigate]);

  if (loading || !session || !checkedOnboarding) {
    return (
      <div className="grid min-h-screen place-items-center bg-app-gradient">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Onboarding renders full-screen without the shell
  if (pathname === "/onboarding") {
    return <Outlet />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
