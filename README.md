# 🌸 GlowQuest AI

> Your personal AI-powered wellness and glow-up coach — skincare, fitness, nutrition, sleep and healthy habits, all in one beautiful app.

![Made with TanStack Start](https://img.shields.io/badge/TanStack-Start-6B4EFF)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)
![License](https://img.shields.io/badge/license-MIT-CDB4FF)

---

## ✨ Tagline
*Track your habits. Talk to your coach. Watch yourself glow.*

## 🎯 Problem
Most wellness apps are either siloed (only skincare, only workouts) or overwhelming (generic content that ignores who you actually are). People give up because plans don't fit their skin, budget, time, or lifestyle.

## 💡 Solution
**GlowQuest AI** combines a delightful habit tracker with a specialized AI coach that is *only* trained to talk about wellness — using your real onboarding data (goals, skin type, experience, available time, budget) to generate genuinely personalized plans, quests and reviews.

---

## 🌟 Features
- 🔐 **Full authentication** — sign up, sign in, forgot & reset password (Supabase Auth)
- 🧭 **6-step onboarding** — personal info, fitness goal, skin concerns, lifestyle, budget & time
- 📊 **Premium dashboard** — animated Glow Ring, weekly Recharts, streaks, AI tip of the day
- 💧 **Daily progress tracker** — water, workout, skincare, sleep with instant Glow Score recompute
- 📓 **Journal** — full CRUD entries with mood, energy and notes
- 🌗 **Dark mode**, glassmorphism, feminine design system
- 📱 **Responsive** mobile-first layout with sidebar + sheet nav

## 🤖 AI Features (Google Gemini via Lovable AI Gateway)
- 💬 **AI Coach** — streaming chat, stays strictly in-character as a wellness coach
- 🧴 **Skincare Planner** — routines tailored to skin type, concerns & budget
- 🏋️ **Workout Planner** — weekly plan matched to experience & available time
- 🥗 **Nutrition Planner** — realistic meal plans respecting budget & goals
- 🎯 **Daily Glow Quests** — personalized XP-earning micro-tasks
- 📅 **Weekly Review** — narrative summary of your progress + next-week focus
- 📝 **Journal Insights** — gentle patterns from your recent entries

## 🏗️ Architecture
- **TanStack Start (React 19 + Vite 7)** — SSR, file-based routing, server functions
- **Supabase** — Postgres + Auth + RLS
- **Lovable AI Gateway** — Google Gemini access without exposing keys
- **shadcn/ui + Tailwind v4** — accessible primitives, design tokens in `src/styles.css`
- **Server functions** for one-shot AI generation; **server route** for streaming chat

## 📁 Folder Structure
```
src/
├── components/           # shadcn UI + shared (app-shell, plan-generator, markdown-view)
├── hooks/                # use-auth, use-theme, use-mobile
├── integrations/supabase # generated client + auth helpers (do not edit)
├── lib/                  # ai.server.ts, ai.functions.ts, glow score, utils
├── routes/
│   ├── __root.tsx
│   ├── index.tsx         # marketing landing
│   ├── auth.tsx / reset-password.tsx
│   ├── _authenticated/   # protected app: dashboard, onboarding, journal,
│   │                     # progress, quests, ai-coach, *-planner, weekly-review
│   └── api/chat.ts       # streaming AI chat endpoint
└── styles.css            # design tokens (OKLCH), glass utilities
supabase/                 # config
```

## 🧰 Tech Stack
TanStack Start · React 19 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · Supabase (Postgres, Auth, RLS) · Google Gemini via Lovable AI Gateway · React Hook Form · Zod · Recharts · Lucide · Sonner · react-markdown

## 🗄️ Supabase Setup
Tables (all with Row-Level Security scoped to `auth.uid()`):
- `profiles` — onboarding data & goals (auto-created via `handle_new_user` trigger)
- `daily_progress` — water/workout/skincare/sleep + computed `glow_score` & `current_streak`
- `journal` — mood, energy, notes
- `ai_conversations` — chat history
- `saved_skincare_plans` / `saved_workout_plans` / `saved_nutrition_plans`
- `daily_glow_quests` — personalized XP tasks
- `weekly_reviews`

Every public table has explicit `GRANT`s and RLS policies. `updated_at` is maintained by a shared `set_updated_at()` trigger.

## 🔑 Gemini Setup
GlowQuest AI calls Google Gemini through the **Lovable AI Gateway**, so you don't manage a raw Google API key. The gateway key `LOVABLE_API_KEY` is injected server-side. If self-hosting, replace the gateway call in `src/lib/ai.server.ts` with a direct `@google/generative-ai` client and set `GEMINI_API_KEY`.

## 🔐 Environment Variables
Server-only (never expose to the client):
```
LOVABLE_API_KEY=…              # AI Gateway (or GEMINI_API_KEY if self-hosted)
SUPABASE_URL=…
SUPABASE_PUBLISHABLE_KEY=…
SUPABASE_SERVICE_ROLE_KEY=…    # admin/webhook paths only
```
Client-safe (Vite):
```
VITE_SUPABASE_URL=…
VITE_SUPABASE_PUBLISHABLE_KEY=…
VITE_SUPABASE_PROJECT_ID=…
```

## 🚀 Installation
```bash
git clone <your-repo-url>
cd glowquest-ai
bun install    # or: npm install
```

## 🧪 Running Locally
```bash
bun run dev    # http://localhost:8080
```

## ☁️ Deployment
Standard TanStack Start build — deploys to any edge/serverless host.

**One-click Vercel:**
1. Push to GitHub.
2. Import the repo in Vercel.
3. Set the environment variables above.
4. Build command: `bun run build` (framework preset auto-detected).

Also runs on Cloudflare Workers (default target) and Netlify.

## 🖼️ Screenshots
> Add screenshots of the landing page, dashboard glow ring, AI coach chat, and weekly review to `/docs/screenshots/`.

## 🔮 Future Improvements
- Push notifications for daily quests
- Apple Health / Google Fit sync
- Community challenges & friend streaks
- Photo-based skin progress tracking
- Multi-language support

## 📄 License
MIT — free to use, modify and share.

## 👩‍💻 Author
Built with 💜 using [Lovable](https://lovable.dev).
