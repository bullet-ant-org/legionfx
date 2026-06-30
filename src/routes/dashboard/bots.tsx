import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/bots")({ ssr: false, component: () => <ComingSoon title="Trading Bots Center" description="Create, monitor, edit, pause, and analyze your automated trading systems from one professional terminal." /> });
