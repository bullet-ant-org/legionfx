import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/messages")({ ssr: false, component: () => <ComingSoon title="Messages & Communication" description="Your unified messaging hub for mentors, support, prop firm desk, academy instructors, signal alerts and community channels." /> });
