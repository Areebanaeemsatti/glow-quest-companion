import { createFileRoute } from "@tanstack/react-router";
import { PlanGenerator } from "@/components/plan-generator";
import { generateNutritionPlan } from "@/lib/ai.functions";
import { Apple } from "lucide-react";

export const Route = createFileRoute("/_authenticated/nutrition-planner")({
  head: () => ({ meta: [
    { title: "Nutrition Planner · GlowQuest AI" },
    { name: "description", content: "AI-generated nutrition plan tailored to your goals, budget, and lifestyle." },
    { property: "og:title", content: "Nutrition Planner · GlowQuest AI" },
    { property: "og:description", content: "AI-generated nutrition plan tailored to you." },
  ] }),
  component: () => <PlanGenerator title="Nutrition Planner" icon={Apple} generateFn={generateNutritionPlan} savedTable="saved_nutrition_plans" savedLabel="Nutrition plan" />,
});
