import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/pay")({ ssr: false, component: PayLayout });

function PayLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand grid place-items-center text-brand-foreground font-display font-bold">R</div>
            <div className="font-display font-semibold tracking-tight text-lg">rexa<span className="text-brand">pay</span></div>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock size={12} /> Secure checkout
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <div>RexaPay · Payment services for LEGIONFX</div>
          <div>PCI-DSS Level 1 · 256-bit TLS</div>
        </div>
      </footer>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
