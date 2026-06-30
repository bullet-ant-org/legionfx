import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/settings")({ ssr: false, component: () => <ComingSoon title="Settings" description="Theme, language, notification preferences and account configuration." /> });
