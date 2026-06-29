import type { ReactNode } from "react";

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative mx-auto max-w-7xl px-4 py-24 ${className}`}>
      {children}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode; center?: boolean }) {
  return (
    <div className={`mb-14 ${center ? "text-center mx-auto max-w-3xl" : "max-w-3xl"}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-glow-pulse" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">{subtitle}</p>}
    </div>
  );
}
