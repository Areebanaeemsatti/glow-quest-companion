import { createFileRoute } from "@tanstack/react-router";
import { PlanGenerator } from "@/components/plan-generator";
import { generateWorkoutPlan } from "@/lib/ai.functions";
import { Dumbbell } from "lucide-react";

export const Route = createFileRoute("/_authenticated/workout-planner")({
  head: () => ({ meta: [
    { title: "Workout Planner · GlowQuest AI" },
    { name: "description", content: "AI-generated weekly workouts personalized to your goals and time." },
    { property: "og:title", content: "Workout Planner · GlowQuest AI" },
    { property: "og:description", content: "AI-generated weekly workouts personalized to you." },
  ] }),
  component: () => <PlanGenerator title="Workout Planner" icon={Dumbbell} generateFn={generateWorkoutPlan} savedTable="saved_workout_plans" savedLabel="Workout plan" />,
});
