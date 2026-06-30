import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function GlassCard({
  children,
  className = "",
  hover = false,
}: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`glass rounded-2xl ${hover ? "hover-lift" : ""} ${className}`}>{children}</div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Counter({ to, prefix = "", suffix = "", decimals = 0, duration = 1200 }: { to: number; prefix?: string; suffix?: string; decimals?: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  const formatted = decimals > 0
    ? val.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(val).toLocaleString();
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
}

export function StatCard({
  label,
  value,
  prefix,
  suffix,
  delta,
  trend = "up",
  icon,
  decimals = 0,
}: {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: string;
  trend?: "up" | "down";
  icon?: ReactNode;
  decimals?: number;
}) {
  const Arrow = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-4 relative overflow-hidden hover-lift"
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
      <div className="flex items-start justify-between">
        <div className="text-xs text-muted-foreground">{label}</div>
        {icon && <div className="text-brand">{icon}</div>}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">
        <Counter to={value} prefix={prefix} suffix={suffix} decimals={decimals} />
      </div>
      {delta && (
        <div className={`mt-2 inline-flex items-center gap-1 text-[11px] ${trend === "up" ? "text-emerald-400" : "text-rose-400"}`}>
          <Arrow size={12} /> {delta}
        </div>
      )}
    </motion.div>
  );
}

export function Modal({ open, onClose, title, children, size = "md" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; size?: "md" | "lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 bg-background/70 backdrop-blur-sm animate-fade-up" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={`glass-strong rounded-3xl p-6 w-full ${size === "lg" ? "max-w-2xl" : "max-w-md"} shadow-card relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="block mt-1 text-[10px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition";

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Completed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Failed: "text-rose-400 bg-rose-400/10 border-rose-400/20",
    Running: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    Paused: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Active: "text-brand bg-brand/10 border-brand/20",
    "TP Hit": "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] border ${map[status] ?? "text-muted-foreground bg-white/5 border-white/10"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" /> {status}
    </span>
  );
}
