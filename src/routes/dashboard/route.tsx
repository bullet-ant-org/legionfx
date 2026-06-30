import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getSession()) {
      navigate({ to: "/login" });
      return;
    }
    setReady(true);
    const onAuth = () => { if (!getSession()) navigate({ to: "/login" }); };
    window.addEventListener("legionfx-auth", onAuth);
    return () => window.removeEventListener("legionfx-auth", onAuth);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-brand/40 border-t-brand animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-bg opacity-30" />
      <div aria-hidden className="fixed inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"}`}>
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="p-4 md:p-6 pb-12">
          <Outlet />
        </main>
        <footer className="px-4 md:px-6 py-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div>LEGIONFX Dashboard · v1.0</div>
          <div className="flex gap-4">
            <a href="/" className="hover:text-foreground">Privacy</a>
            <a href="/" className="hover:text-foreground">Terms</a>
            <a href="/contact" className="hover:text-foreground">Support</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
