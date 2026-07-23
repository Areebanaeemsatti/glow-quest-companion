import { createFileRoute } from "@tanstack/react-router";
import { PlanGenerator } from "@/components/plan-generator";
import { generateSkincarePlan } from "@/lib/ai.functions";
import { Droplets } from "lucide-react";

export const Route = createFileRoute("/_authenticated/skincare-planner")({
  head: () => ({ meta: [
    { title: "Skincare Planner · GlowQuest AI" },
    { name: "description", content: "AI-generated skincare routine tailored to your skin type, concerns, and budget." },
    { property: "og:title", content: "Skincare Planner · GlowQuest AI" },
    { property: "og:description", content: "AI-generated skincare routine tailored to you." },
  ] }),
  component: () => <PlanGenerator title="Skincare Planner" icon={Droplets} generateFn={generateSkincarePlan} savedTable="saved_skincare_plans" savedLabel="Skincare routine" />,
});
