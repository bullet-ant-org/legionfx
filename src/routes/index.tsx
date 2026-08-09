import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Bot, GraduationCap, Wallet, Signal, ShieldCheck, Globe2, Clock4, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Counter } from "@/components/site/Counter";
import { DashboardMockup } from "@/components/site/DashboardMockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEGIONFX — Trade Smarter. Get Funded. Build Wealth." },
      { name: "description", content: "LEGIONFX is a global trading institution: funded accounts, professional education, automated execution and institutional research for serious traders." },
      { property: "og:title", content: "LEGIONFX — Trade Smarter. Get Funded. Build Wealth." },
      { property: "og:description", content: "Funded accounts, professional education, automated execution and institutional research for serious traders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const PARTNERS = ["MetaTrader", "TradingView", "Match-Trader", "cTrader", "DXtrade", "Binance", "Bybit", "Equinix LD4", "OneZero", "Sterling"];

const DESKS = [
  { icon: Wallet, k: "01", title: "Capital & Funding", desc: "Two-phase evaluations from $10K to $400K with transparent objectives, institutional risk limits and same-week payouts.", stat: "70%", statLabel: "Evaluation pass rate" },
  { icon: GraduationCap, k: "02", title: "Trader Development", desc: "A structured curriculum built on market structure, liquidity, risk engineering and the psychology of consistency.", stat: "500+", statLabel: "Traders mentored" },
  { icon: Bot, k: "03", title: "Systematic Execution", desc: "Latency-aware automation with defined drawdown ceilings, portfolio-level exposure control and full audit trails.", stat: "90%", statLabel: "System accuracy" },
  { icon: Signal, k: "04", title: "Research & Signals", desc: "Desk-grade briefings and trade plans with entry logic, invalidation and position sizing — never a naked alert.", stat: "95%", statLabel: "Plan accuracy" },
];

const NUMBERS = [
  { value: 7, suffix: "+", label: "Years operating" },
  { value: 5000, suffix: "+", label: "Active traders" },
  { value: 900, prefix: "$", suffix: "M+", label: "Volume routed" },
  { value: 42, suffix: "", label: "Countries served" },
];

const PILLARS = [
  { icon: ShieldCheck, title: "Segregated capital", desc: "Client funding, payout reserves and operating capital are held and reconciled separately. Every ledger entry is traceable." },
  { icon: Globe2, title: "Global infrastructure", desc: "Execution routed through tier-one liquidity in LD4, NY4 and TY3, with redundancy across three regions." },
  { icon: Clock4, title: "Answered in minutes", desc: "A real desk, staffed across sessions. Median first response on funded-account issues is under nine minutes." },
];

const VOICES = [
  { quote: "The evaluation was the first one I've taken that felt engineered rather than designed to fail. The objectives were the same on day forty as on day one.", name: "Daniel Osei", role: "Funded — $200K, London" },
  { quote: "I came for signals and stayed for the risk framework. My drawdown profile changed more in one quarter here than in three years alone.", name: "Amara Nwosu", role: "Prop trader, Lagos" },
  { quote: "Their automation desk let me run three strategies with real exposure limits. It reads like software written by people who have actually lost money.", name: "Marcus Feld", role: "Systematic trader, Frankfurt" },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 pt-8 pb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                <span className="h-px w-10 bg-brand" />
                Est. 2018 · Global trading institution
              </div>
              <h1 className="mt-7 text-[2.75rem] md:text-[4.5rem] leading-[0.98] tracking-tight font-semibold">
                Trade smarter.
                <br />
                <span className="font-serif-display italic text-brand">Get funded.</span> Build wealth
                <br />
                without limits.
              </h1>
              <p className="mt-7 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
                LEGIONFX operates the capital, the curriculum and the technology behind thousands of professional traders — one accountable institution instead of four disconnected vendors.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/services" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand text-brand-foreground font-medium hover:opacity-90 transition">
                  Open an evaluation <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:bg-foreground/5 transition">
                  Read the firm profile
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-px bg-border/70 border border-border/70 rounded-2xl overflow-hidden">
                {NUMBERS.map((n) => (
                  <div key={n.label} className="bg-background p-6">
                    <div className="text-3xl font-semibold mono tracking-tight">
                      <Counter to={n.value} prefix={n.prefix ?? ""} suffix={n.suffix} />
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">{n.label}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Figures reflect platform activity through the current fiscal year. Past performance is not indicative of future results.
              </p>
            </div>
          </div>

          {/* Terminal screenshot */}
          <div className="mt-20">
            <div className="flex items-end justify-between gap-6 mb-5">
              <div>
                <div className="text-[11px] uppercase tracking-[0.25em] text-brand">The terminal</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">One console for capital, systems and research.</h2>
              </div>
              <Link to="/login" className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
                View the client portal <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="rounded-3xl border border-border/70 bg-foreground/[0.02] p-3 md:p-5">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="border-b border-border/60 py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-6">Infrastructure & venue partners</div>
          <div className="relative overflow-hidden mask-fade">
            <div className="flex gap-14 animate-marquee whitespace-nowrap">
              {[...PARTNERS, ...PARTNERS].map((p, i) => (
                <div key={i} className="text-lg md:text-xl font-display font-medium text-muted-foreground/70 hover:text-foreground transition shrink-0">
                  {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DESKS */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="grid lg:grid-cols-12 gap-10 mb-14">
            <div className="lg:col-span-5">
              <div className="text-[11px] uppercase tracking-[0.25em] text-brand">Four desks</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                The full path from
                <br />
                <span className="font-serif-display italic">first chart to payout.</span>
              </h2>
            </div>
            <p className="lg:col-span-6 lg:col-start-7 text-muted-foreground leading-relaxed self-end">
              Most traders lose years assembling a career out of unrelated products. We run each function as a desk with its own mandate, its own risk oversight and one shared standard of accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border/70 border border-border/70 rounded-3xl overflow-hidden">
            {DESKS.map((d) => (
              <div key={d.title} className="group bg-background p-8 md:p-10 hover:bg-foreground/[0.02] transition">
                <div className="flex items-start justify-between">
                  <div className="h-11 w-11 rounded-xl border border-border grid place-items-center text-brand">
                    <d.icon size={19} />
                  </div>
                  <span className="mono text-xs text-muted-foreground/60">{d.k}</span>
                </div>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">{d.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">{d.desc}</p>
                <div className="mt-7 flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-semibold mono text-brand">{d.stat}</div>
                    <div className="text-[11px] text-muted-foreground mt-1">{d.statLabel}</div>
                  </div>
                  <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground group-hover:text-foreground transition">
                    Detail <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / MANIFESTO */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="text-[11px] uppercase tracking-[0.25em] text-brand">The firm</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
              Built by traders.
              <br />
              <span className="font-serif-display italic">Run like an institution.</span>
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              LEGIONFX was founded by a small group of desk traders who were tired of watching capable people fail for structural reasons — bad sizing, hostile evaluation rules, no feedback loop. Seven years later the thesis has not changed: give a disciplined trader real capital, real instruction and honest reporting, and the results take care of themselves.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-foreground/5 transition text-sm">
              Our history and leadership <ArrowRight size={15} />
            </Link>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 space-y-px bg-border/70 border border-border/70 rounded-3xl overflow-hidden">
            {PILLARS.map((p) => (
              <div key={p.title} className="bg-background p-7 flex gap-5">
                <div className="h-10 w-10 shrink-0 rounded-lg border border-border grid place-items-center text-brand">
                  <p.icon size={17} />
                </div>
                <div>
                  <h3 className="font-semibold tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VOICES */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="text-[11px] uppercase tracking-[0.25em] text-brand mb-3">Trader accounts</div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight max-w-2xl leading-[1.05]">
            What the desk sounds like from the other side.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-px bg-border/70 border border-border/70 rounded-3xl overflow-hidden">
            {VOICES.map((v) => (
              <figure key={v.name} className="bg-background p-8 flex flex-col">
                <Quote size={20} className="text-brand" />
                <blockquote className="mt-5 text-[15px] leading-relaxed flex-1">{v.quote}</blockquote>
                <figcaption className="mt-7 pt-5 border-t border-border/70">
                  <div className="text-sm font-medium">{v.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{v.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-24">
          <div className="rounded-3xl border border-border/70 p-10 md:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                The capital is ready.
                <br />
                <span className="font-serif-display italic text-brand">The question is whether you are.</span>
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Open an evaluation, join the academy, or speak to the desk before you commit a single dollar. We would rather turn away a trader who isn't ready than fund one who isn't.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand text-brand-foreground font-medium hover:opacity-90 transition">
                Create an account <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-border hover:bg-foreground/5 transition">
                Talk to the desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
