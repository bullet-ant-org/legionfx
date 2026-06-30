import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/dashboard/ComingSoon";
export const Route = createFileRoute("/dashboard/academy")({ ssr: false, component: () => <ComingSoon title="Academy & Mentorship" description="Courses, lessons, assignments, certificates and live mentorship sessions with the LEGIONFX education team." /> });
