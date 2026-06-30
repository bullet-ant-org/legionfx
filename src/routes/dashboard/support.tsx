import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/support")({ ssr: false, component: () => <ComingSoon title="Support Tickets" description="Create tickets, browse the knowledge base and chat with the LEGIONFX support team in real time." /> });
