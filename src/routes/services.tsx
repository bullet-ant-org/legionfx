import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, GraduationCap, Bot, Signal, ArrowRight, Check, ChevronDown, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { Counter } from "@/components/site/Counter";
import { DashboardMockup } from "@/components/site/DashboardMockup";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — LEGIONFX Trading Ecosystem" },
      { name: "description", content: "Prop firm funding, Forex Academy, trading bots and premium signals — one complete trading ecosystem." },
    ],
  }),
  component: ServicesPage,
});

const FAQS = [
  ["Who are the Forex Academy courses designed for?", "Anyone — from total beginners to experienced traders looking to sharpen execution and risk frameworks."],
  ["Do I need previous trading experience?", "No. We start from fundamentals and progress to advanced market structure and prop firm preparation."],
  ["How does the Prop Firm mentorship work?", "You're paired with a senior trader who reviews your plan, monitors execution, and coaches you through evaluation phases."],
  ["What platforms do your trading bots support?", "MetaTrader 4/5, cTrader and Match Trader, with select Binance and Bybit integrations."],
  ["How often are trading signals provided?", "Daily, across major FX pairs, indices, gold and select crypto, with full risk parameters."],
  ["Is mentorship included with the academy?", "Group mentorship is included in the academy. 1-on-1 mentorship is available as an upgrade."],
  ["How do I get started with LEGIONFX?", "Pick a plan, create your account, and our team will guide you through onboarding within 24 hours."],
];

function ServicesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand"><Sparkles size={12}/> Our Services</div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Everything You Need To Become A <span className="text-gradient">Successful Trader.</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
              A complete trading ecosystem built to help you learn, grow, automate and scale — whether you're starting your first chart or securing funded capital.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
              <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Us</Link>
            </div>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[["7+","Years"],["5K+","Traders"],["$900M+","Volume"],["500+","Mentored"]].map(([v,l]) => (
                <div key={l} className="glass rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-gradient">{v}</div>
                  <div className="text-[10px] text-muted-foreground">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <DashboardMockup />
        </div>
      </section>

      {/* Overview */}
      <Section>
        <SectionHeader eyebrow="Ecosystem" title="Our Complete Trading Ecosystem" subtitle="Everything you need to learn, trade, automate and grow — all in one place." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: Wallet, t: "Prop Firm Funding", d: "Access professional capital through structured challenge support.", h: "#funding" },
            { i: GraduationCap, t: "Forex Academy", d: "Beginner to advanced education across the full trading curriculum.", h: "#academy" },
            { i: Bot, t: "Trading Bots", d: "Disciplined automation engineered for consistency and speed.", h: "#bots" },
            { i: Signal, t: "Premium Signals", d: "Professional trade setups with full risk parameters.", h: "#signals" },
          ].map(s => (
            <a key={s.t} href={s.h} className="group glass rounded-3xl p-6 hover-lift block">
              <div className="h-12 w-12 rounded-2xl brand-gradient grid place-items-center text-brand-foreground mb-5 shadow-glow"><s.i size={22}/></div>
              <h3 className="text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              <div className="mt-4 text-sm text-brand inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">Learn more <ArrowRight size={14}/></div>
            </a>
          ))}
        </div>
      </Section>

      <ServiceBlock
        id="funding"
        eyebrow="Service 01"
        title="Prop Firm Funding & Challenge Support"
        desc="We prepare traders to pass prop firm evaluations through structured mentorship, disciplined risk management and proven execution frameworks — building consistency, not reckless trading."
        features={["Challenge Preparation","Trading Plan Development","Risk Management Coaching","Performance Reviews","Evaluation Support","Scaling Guidance"]}
        stats={[["70%","Challenge Success Rate"],["7+","Years Experience"]]}
        cta="Apply for Funding"
      />
      <ServiceBlock
        id="academy"
        eyebrow="Service 02"
        reverse
        title="Professional Forex Academy"
        desc="A complete, structured education spanning fundamentals to advanced execution. Includes smart money concepts, liquidity, price action, psychology and live market sessions."
        features={["Beginner to Advanced","Recorded Lessons","Live Classes","Practical Assignments","Community Support","Lifetime Resources"]}
        stats={[["500+","Traders Mentored"],["5K+","Active Worldwide"]]}
        cta="Enroll Today"
      />
      <ServiceBlock
        id="bots"
        eyebrow="Service 03"
        title="Intelligent Trading Automation"
        desc="Automated systems built to execute disciplined strategies, reduce emotional decision making and monitor markets at machine speed."
        features={["Algorithmic Trading","Automated Entries","Auto Risk Management","Multi-Pair Support","Performance Analytics","Strategy Optimization"]}
        stats={[["90%","Average Bot Accuracy"]]}
        cta="Explore Trading Bots"
      />
      <ServiceBlock
        id="signals"
        eyebrow="Service 04"
        reverse
        title="Professional Trading Signals"
        desc="High-quality, analysis-backed trade setups across FX, metals, indices and crypto — delivered with full entry, stop and target parameters."
        features={["Daily Trade Setups","Entry Price","Stop Loss & Take Profit","Market Commentary","Risk Analysis","Major Pairs Covered"]}
        stats={[["95%","Average Signal Accuracy"]]}
        cta="Join Signal Channel"
      />

      {/* Process */}
      <Section>
        <SectionHeader eyebrow="Process" title="Your Journey With LEGIONFX" />
        <div className="grid md:grid-cols-4 gap-5">
          {[
            ["01","Learn","Build a strong trading foundation through structured education."],
            ["02","Practice","Apply proven strategies using disciplined risk management."],
            ["03","Scale","Prepare for funded evaluations and improve consistency."],
            ["04","Succeed","Leverage technology, mentorship and support to keep growing."],
          ].map(([n,t,d]) => (
            <div key={n} className="glass rounded-3xl p-6 hover-lift relative">
              <div className="text-5xl font-display font-bold text-gradient/30 opacity-60">{n}</div>
              <h4 className="mt-3 text-lg font-semibold">{t}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <SectionHeader eyebrow="Performance" title="Trusted By Traders Worldwide" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {[
            [7,"+","Years"],[500,"+","Mentored"],[5000,"+","Traders"],[900,"M+","Volume","$"],
            [90,"%","Bot Accuracy"],[95,"%","Signal Accuracy"],[70,"%","Funded Rate"],
          ].map(([v,s,l,p]) => (
            <div key={l as string} className="glass rounded-2xl p-5 text-center">
              <div className="text-3xl font-bold text-gradient">
                <Counter to={v as number} prefix={(p as string) ?? ""} suffix={s as string}/>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{l as string}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map(([q,a]) => <Accordion key={q} q={q} a={a}/>)}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[32px] glass-strong p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to start your trading journey?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Learn, get funded, automate, and grow — with everything in one ecosystem.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
            <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Our Team</Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function ServiceBlock({ id, eyebrow, title, desc, features, stats, cta, reverse }: {
  id: string; eyebrow: string; title: string; desc: string; features: string[]; stats: [string,string][]; cta: string; reverse?: boolean;
}) {
  return (
    <Section id={id}>
      <div className={`grid lg:grid-cols-2 gap-12 items-center ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
        <div className="relative">
          <div className="absolute -inset-8 -z-10 bg-brand/20 blur-3xl rounded-full" />
          <div className="glass-strong rounded-3xl p-6 aspect-[5/4] grid-bg relative overflow-hidden">
            <div className="absolute inset-6 rounded-2xl bg-background/60 border border-white/5 p-5 flex flex-col gap-3">
              <div className="text-xs text-muted-foreground">{eyebrow}</div>
              <div className="grid grid-cols-3 gap-2">
                {stats.map(([v,l]) => (
                  <div key={l} className="bg-white/[0.03] rounded-xl p-3">
                    <div className="text-lg font-bold text-gradient">{v}</div>
                    <div className="text-[10px] text-muted-foreground">{l}</div>
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-3">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  <defs>
                    <linearGradient id={`g-${id}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0.5"/>
                      <stop offset="100%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C30,40 60,55 90,30 C120,10 150,35 200,15 L200,80 L0,80 Z" fill={`url(#g-${id})`} />
                  <path d="M0,60 C30,40 60,55 90,30 C120,10 150,35 200,15" stroke="oklch(0.78 0.21 55)" strokeWidth="1.5" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand mb-4">{eyebrow}</div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2.5">
            {features.map(f => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground"><Check size={16} className="text-brand mt-0.5 shrink-0"/>{f}</li>
            ))}
          </ul>
          <Link to="/login" className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">
            {cta} <ArrowRight size={16}/>
          </Link>
        </div>
      </div>
    </Section>
  );
}

function Accordion({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o=>!o)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown size={18} className={`transition-transform ${open?"rotate-180 text-brand":"text-muted-foreground"}`}/>
      </button>
      <div className={`grid transition-all duration-300 ${open?"grid-rows-[1fr] opacity-100":"grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p></div>
      </div>
    </div>
  );
}
