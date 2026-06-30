import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/profile")({ ssr: false, component: () => <ComingSoon title="Profile" description="Personal information, verification status, uploaded documents and trading experience." /> });
