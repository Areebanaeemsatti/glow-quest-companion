import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/hooks/use-auth";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-app-gradient px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center shadow-soft">
        <h1 className="bg-glow-gradient bg-clip-text text-7xl font-bold text-transparent">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the glow</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page took a self-care day. Let's get you home.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-glow-gradient px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-gradient px-4">
      <div className="glass max-w-md rounded-3xl p-10 text-center shadow-soft">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try again or head home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-full bg-glow-gradient px-5 py-2 text-sm font-medium text-primary-foreground shadow-glow"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border px-5 py-2 text-sm font-medium">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GlowQuest AI — Your AI Glow-Up Companion" },
      { name: "description", content: "Build healthier habits with personalized skincare, fitness, hydration, nutrition and self-care in one beautiful place." },
      { property: "og:title", content: "GlowQuest AI — Your AI Glow-Up Companion" },
      { property: "og:description", content: "Track hydration, workouts, skincare, sleep and mood with a premium wellness companion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>{`
          html { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
          h1, h2, h3, .font-display { font-family: 'Fraunces', 'Inter', serif; letter-spacing: -0.01em; }
        `}</style>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}
