import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
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

  // Global "button feedback" delegation — any button without its own reaction
  // still confirms it was clicked. Opt out with data-no-toast.
  useEffect(() => {
    if (!ready) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest("button") as HTMLButtonElement | null;
      if (!btn) return;
      if (btn.closest("a")) return; // link wrappers
      if (btn.type === "submit" || btn.type === "reset") return;
      if (btn.hasAttribute("data-no-toast")) return;
      if (btn.disabled) return;
      // Skip buttons that opened a menu/dialog on this click (they have aria-expanded or data-state changes).
      if (btn.getAttribute("aria-haspopup") || btn.getAttribute("aria-expanded")) return;
      const label = (btn.getAttribute("aria-label") || btn.innerText || "").trim().replace(/\s+/g, " ");
      if (!label || label.length > 60) return;
      toast.success(label, { description: "Action completed" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [ready]);

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-brand/40 border-t-brand animate-spin" />
      </div>
    );
  }

  return (
    <ThemeProvider>
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
        <Toaster position="top-right" richColors closeButton />
      </div>
    </ThemeProvider>
  );
}
