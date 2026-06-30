import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/prop-firm")({ ssr: false, component: () => <ComingSoon title="Prop Firm" description="Track every challenge, phase progress, funding milestones, evaluation results and profit splits." /> });
