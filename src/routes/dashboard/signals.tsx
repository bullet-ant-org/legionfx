import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/signals")({ ssr: false, component: () => <ComingSoon title="Trading Signals" description="Live signal feed with entry, stop, target, confidence and historical accuracy across every market." /> });
