import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopbar } from "@/components/admin/Topbar";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme";
import { getSession, refreshSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { navigate({ to: "/login" }); return; }
    if (s.role !== "admin") { navigate({ to: "/dashboard" }); return; }
    setReady(true);
    // Confirm the cached session is still valid against the backend (cookie
    // may have expired or been revoked server-side).
    refreshSession().then((cur) => {
      if (!cur) navigate({ to: "/login" });
      else if (cur.role !== "admin") navigate({ to: "/dashboard" });
    });
    const onAuth = () => {
      const cur = getSession();
      if (!cur) navigate({ to: "/login" });
      else if (cur.role !== "admin") navigate({ to: "/dashboard" });
    };
    window.addEventListener("legionfx-auth", onAuth);
    return () => window.removeEventListener("legionfx-auth", onAuth);
  }, [navigate]);

  useEffect(() => {
    if (!ready) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const btn = target.closest("button") as HTMLButtonElement | null;
      if (!btn) return;
      if (btn.closest("a")) return;
      if (btn.type === "submit" || btn.type === "reset") return;
      if (btn.hasAttribute("data-no-toast")) return;
      if (btn.disabled) return;
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

        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className={`transition-all duration-300 ${collapsed ? "lg:pl-[80px]" : "lg:pl-[280px]"}`}>
          <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
          <main className="p-4 md:p-6 pb-12">
            <Outlet />
          </main>
          <footer className="px-4 md:px-6 py-5 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
            <div>LEGIONFX Admin Console · v1.0</div>
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
