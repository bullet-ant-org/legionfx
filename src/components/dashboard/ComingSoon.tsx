import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";

export function ComingSoon({ title, description, eta = "Phase 2" }: { title: string; description: string; eta?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass-strong rounded-3xl p-10 md:p-14 max-w-xl text-center relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-triad-violet/20 blur-3xl" />
        <div className="relative">
          <div className="h-14 w-14 mx-auto rounded-2xl brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Sparkles size={22} /></div>
          <div className="mt-5 text-[10px] uppercase tracking-[0.2em] text-brand">Shipping in {eta}</div>
          <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">{description}</p>
          <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium hover:opacity-90">
            Back to overview <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
