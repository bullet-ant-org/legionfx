import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/security")({ ssr: false, component: () => <ComingSoon title="Security" description="Manage password, 2FA, login history, active devices, withdrawal PIN and security logs." /> });
