<div align="center">

# 🌸 GlowQuest AI

### **Your Personal AI-Powered Wellness & Glow-Up Companion**

*Smarter skincare. Better fitness. Healthier habits. Personalized by AI.*

<p align="center">
  <a href="https://glow-quest-companion.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-FF69B4?style=for-the-badge&logo=vercel&logoColor=white"/>
  </a>
  <a href="https://github.com/Areebanaeemsatti/glow-quest-companion">
    <img src="https://img.shields.io/github/stars/Areebanaeemsatti/glow-quest-companion?style=for-the-badge"/>
  </a>
  <img src="https://img.shields.io/github/license/Areebanaeemsatti/glow-quest-companion?style=for-the-badge"/>
</p>

<p align="center">
<img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/TanStack_Start-6B4EFF?style=for-the-badge"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/TailwindCSS-v4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white"/>
<img src="https://img.shields.io/badge/Google-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/AI-Powered-CDB4FF?style=for-the-badge"/>
</p>

### 🌐 **Live Demo**

### https://glow-quest-companion.vercel.app/

---

*"Track your habits. Talk to your coach. Watch yourself glow."*

</div>

---

# ✨ Overview

GlowQuest AI is an AI-powered wellness platform that combines **skincare**, **fitness**, **nutrition**, **habit tracking**, and **mental wellness** into one beautiful experience.

Unlike traditional wellness apps that overwhelm users with generic plans, GlowQuest AI learns about each user's lifestyle, skin type, fitness goals, available time, and budget to generate truly personalized recommendations.

Whether you're building healthier habits, improving your skincare routine, becoming more active, or simply taking better care of yourself, GlowQuest AI acts as your personal wellness companion available anytime.

---

# 🎯 The Problem

Today's wellness apps usually solve **one** problem.

- A skincare app knows nothing about your workouts.
- A workout app ignores your sleep.
- A nutrition app doesn't consider your skincare goals.
- Habit trackers rarely provide meaningful guidance.

Users end up juggling multiple apps while receiving generic advice that doesn't match their lifestyle.

---

# 💡 The Solution

GlowQuest AI brings everything together.

Instead of switching between different wellness apps, users receive one personalized AI experience that understands their complete lifestyle.

The AI adapts recommendations based on:

- Skin type
- Fitness goals
- Daily schedule
- Available budget
- Experience level
- Lifestyle
- Progress history
- Journal reflections

Every recommendation evolves as the user grows.

---

# 🚀 Features

## 🔐 Authentication

- Secure Sign Up & Sign In
- Forgot Password
- Password Reset
- Protected Routes
- Supabase Authentication

---

## 👤 Personalized Onboarding

A beautiful 6-step onboarding flow collects:

- Personal Information
- Fitness Goal
- Skin Type
- Skin Concerns
- Lifestyle
- Daily Available Time
- Budget
- Experience Level

These preferences personalize every AI response.

---

## 📊 Dashboard

- Premium Glassmorphism UI
- Daily Glow Score
- Animated Glow Ring
- Habit Completion Cards
- Weekly Analytics
- Progress Charts
- Streak Tracking
- Today's AI Wellness Tip

---

## 💧 Habit Tracking

Track daily wellness activities including:

- Water Intake
- Workout
- Skincare Routine
- Sleep

Glow Score updates instantly after every completed habit.

---

## 📔 Journal

Keep track of your journey with:

- Mood Logging
- Energy Tracking
- Daily Notes
- Edit Entries
- Delete Entries
- Search History

---

## 🌙 Beautiful UI

- Mobile-first Design
- Responsive Layout
- Sidebar Navigation
- Dark Mode
- Glassmorphism
- Soft Feminine Theme
- Smooth Animations

---

# 🤖 AI Features

Powered by **Google Gemini** through the **Lovable AI Gateway**.

### 🧴 AI Skincare Planner

Creates routines based on:

- Skin Type
- Concerns
- Budget
- Daily Time

---

### 🏋️ Workout Planner

Generates personalized weekly workouts based on:

- Goal
- Experience
- Time Availability

---

### 🥗 Nutrition Planner

Creates realistic meal plans considering:

- Budget
- Fitness Goal
- Lifestyle

---

### 💬 AI Wellness Coach

A conversational AI coach that stays completely focused on wellness.

Users can ask anything related to:

- Fitness
- Nutrition
- Sleep
- Motivation
- Self Care
- Healthy Habits
- Skincare

---

### ⭐ Daily Glow Quests

AI generates personalized daily challenges that reward users with experience points and encourage consistency.

---

### 📈 Weekly Review

AI summarizes the user's progress, celebrates achievements, identifies weak areas, and recommends next week's priorities.

---

### 📝 Journal Insights

Analyzes recent journal entries to discover patterns in mood, energy, motivation, and wellness habits.

---

# 🏗️ Architecture

```
Client (React 19)
        │
        ▼
TanStack Start
        │
        ▼
Server Functions
        │
        ▼
Google Gemini
        │
        ▼
Supabase Database
        │
        ▼
Authentication + Storage
```

---

# 📁 Project Structure

```text
src
│
├── components
│   ├── ui
│   ├── dashboard
│   ├── journal
│   ├── onboarding
│   └── shared
│
├── hooks
│
├── integrations
│   └── supabase
│
├── lib
│   ├── ai
│   ├── utils
│   ├── glow-score
│   └── helpers
│
├── routes
│   ├── __root.tsx
│   ├── index.tsx
│   ├── auth.tsx
│   ├── reset-password.tsx
│   ├── _authenticated
│   └── api
│
└── styles.css

supabase/
```

---

# 🛠️ Tech Stack

### Frontend

- React 19
- TanStack Start
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- React Hook Form
- Zod

### Backend

- Supabase
- PostgreSQL
- Row Level Security
- Server Functions

### AI

- Google Gemini
- Lovable AI Gateway

### Charts & UI

- Recharts
- Lucide React
- Sonner
- React Markdown

---

# 🔒 Database

GlowQuest AI uses Supabase with Row-Level Security enabled.

### Tables

- profiles
- daily_progress
- journal
- ai_conversations
- saved_skincare_plans
- saved_workout_plans
- saved_nutrition_plans
- daily_glow_quests
- weekly_reviews

Each table includes secure RLS policies and automatic timestamps.

---

# 🔑 Environment Variables

## Server

```env
LOVABLE_API_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PUBLISHABLE_KEY=
```

## Client

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

---

# ⚙️ Installation

Clone the repository.

```bash
git clone https://github.com/Areebanaeemsatti/glow-quest-companion.git
```

Move into the project.

```bash
cd glow-quest-companion
```

Install dependencies.

```bash
bun install
```

or

```bash
npm install
```

---

# ▶️ Run Locally

```bash
bun run dev
```

or

```bash
npm run dev
```

Application will start at

```
http://localhost:8080
```

---

# 🚀 Deployment

GlowQuest AI is deployed on **Vercel**.

### Deploy Your Own

1. Fork this repository.
2. Create a Supabase project.
3. Configure the environment variables.
4. Import the repository into Vercel.
5. Deploy.

Build Command

```bash
bun run build
```

---

# 📸 Screenshots

## Landing Page

![Landing Page](docs/landing-page.png)

---

## Dashboard

![Dashboard](docs/dashboard.png)

---

## AI Coach

![AI Coach](docs/ai-coach.png)

# 🌱 Future Roadmap

- Apple Health Integration
- Google Fit Integration
- Smart Push Notifications
- AI Face & Skin Analysis
- Progress Photo Timeline
- Community Challenges
- Wearable Device Sync
- Voice AI Coach
- Multi-language Support
- AI Wellness Reports (PDF)

---

# 🤝 Contributing

Contributions are always welcome.

If you'd like to improve GlowQuest AI:

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

---

# 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

## 🌸 Built with ❤️ by Areeba Naeem

*"Helping people build healthier habits, one glow at a time."*

⭐ If you like this project, consider giving it a star!

</div>
