import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Bot, GraduationCap, Wallet, Signal, Check, Star, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { Counter } from "@/components/site/Counter";
import { DashboardMockup } from "@/components/site/DashboardMockup";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LEGIONFX — Trade Smarter. Get Funded. Build Wealth." },
      { name: "description", content: "Premium Forex education, prop firm funding, trading automation, and elite signals trusted by 5,000+ traders worldwide." },
    ],
  }),
  component: HomePage,
});

const PARTNERS = ["MetaTrader","TradingView","Match Trader","cTrader","DXtrade","Binance","Bybit","FTMO","FundedNext","The5ers"];

const SERVICES = [
  { icon: Wallet, title: "Prop Firm Funding", desc: "Pass funded account challenges and access professional capital without risking your own.", highlight: "70% Success Rate" },
  { icon: GraduationCap, title: "Forex Academy", desc: "Beginner-to-advanced education in market structure, risk, psychology and live trading.", highlight: "500+ Traders Trained" },
  { icon: Bot, title: "Trading Bots", desc: "Institutional-inspired automated systems engineered for consistency, speed and intelligent execution.", highlight: "90% Bot Accuracy" },
  { icon: Signal, title: "Premium Signals", desc: "Professional trade setups backed by expert analysis and disciplined risk frameworks.", highlight: "95% Signal Accuracy" },
];

const STATS = [
  { value: 7, suffix: "+", label: "Years of Excellence" },
  { value: 500, suffix: "+", label: "Pro Traders Mentored" },
  { value: 5000, suffix: "+", label: "Active Traders" },
  { value: 900, prefix: "$", suffix: "M+", label: "Trading Volume" },
  { value: 90, suffix: "%", label: "Bot Accuracy" },
  { value: 95, suffix: "%", label: "Signal Accuracy" },
  { value: 70, suffix: "%", label: "Prop Firm Success" },
];

function HomePage() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
              <Sparkles size={12} className="text-brand" />
              Trusted by Thousands of Traders Worldwide
            </div>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              Trade Smarter. <br />
              <span className="text-gradient">Get Funded.</span> <br />
              Build Wealth Without Limits.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              For over seven years, LEGIONFX has empowered traders through professional education, advanced technology, institutional-grade analysis and proven funding strategies — from first chart to scaled professional career.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/pricing" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow hover:opacity-90 transition">
                Start Your Journey <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass hover:bg-white/10 transition">
                Explore Our Services
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[{v:"7+",l:"Years"},{v:"5,000+",l:"Traders"},{v:"$900M+",l:"Volume"},{v:"70%",l:"Funded Rate"}].map(s => (
                <div key={s.l} className="glass rounded-2xl p-4">
                  <div className="text-2xl font-bold text-gradient">{s.v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <Section className="!py-16">
        <SectionHeader eyebrow="Industry Partners" title="Trusted Across The Trading Industry" subtitle="We work within the world's leading trading ecosystem." />
        <div className="relative overflow-hidden mask-fade">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="text-xl md:text-2xl font-display font-semibold text-muted-foreground/60 hover:text-brand transition shrink-0">
                {p}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="services">
        <SectionHeader eyebrow="Our Ecosystem" title="Everything You Need To Become A Profitable Trader" subtitle="LEGIONFX combines education, technology and funding into one complete ecosystem." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s) => (
            <div key={s.title} className="group glass rounded-3xl p-6 hover-lift relative overflow-hidden">
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-brand/20 blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="h-12 w-12 rounded-2xl brand-gradient grid place-items-center text-brand-foreground mb-5 shadow-glow">
                <s.icon size={22} />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <div className="mt-4 inline-flex px-2.5 py-1 rounded-full bg-brand/10 text-brand text-xs">{s.highlight}</div>
              <Link to="/services" className="mt-5 inline-flex items-center gap-1.5 text-sm text-brand group-hover:gap-2.5 transition-all">
                Learn more <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <Section>
        <SectionHeader eyebrow="By The Numbers" title="Numbers That Speak For Themselves" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 text-center hover-lift">
              <div className="text-3xl font-bold text-gradient">
                <Counter to={s.value} prefix={s.prefix ?? ""} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT PREVIEW */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -inset-6 bg-brand/10 blur-3xl rounded-3xl -z-10" />
            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-2xl aspect-[4/5] grid-bg" />
              <div className="space-y-4">
                <div className="glass rounded-2xl aspect-square grid place-items-center">
                  <div className="text-5xl font-bold text-gradient">7+</div>
                </div>
                <div className="glass rounded-2xl aspect-square brand-gradient/30 grid-bg" />
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand mb-5">About LEGIONFX</div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built By Traders. <br/><span className="text-gradient">Driven By Excellence.</span></h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              For more than seven years, LEGIONFX has stood for discipline, transparency, consistency and the long game. We don't sell shortcuts. We build traders — through structured education, intelligent technology and serious mentorship — until profitability becomes a habit, not a hope.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 transition">
              Learn More About LEGIONFX <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </Section>

      {/* PRICING TEASER */}
      <Section id="pricing">
        <SectionHeader eyebrow="Pricing" title="Choose Your Trading Journey" subtitle="Invest once. Trade for life." />
        <div className="grid md:grid-cols-3 gap-5 items-center">
          <PlanCard name="Starter" tagline="Ideal for Beginners" price="$24" features={["Premium Signals","Community Access","Daily Market Brief","Mobile App"]} />
          <PlanCard featured name="Professional" tagline="Most Popular" price="$99" features={["Everything in Starter","Group Mentorship","Risk Frameworks","Live Trading Sessions","Priority Support"]} />
          <PlanCard name="Elite" tagline="Ultimate Experience" price="$199" features={["Everything in Professional","1-on-1 Mentorship","Prop Firm Coaching","Bot Access","VIP Community"]} />
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeader eyebrow="Testimonials" title="Real Traders. Real Results." />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n:"Daniel R.", c:"United Kingdom", t:"Passed my $100K FTMO challenge in 18 days using the LEGIONFX risk framework. The mentorship is unreal." },
            { n:"Amara O.", c:"Nigeria", t:"From blowing accounts to consistent monthly payouts. The academy literally rewired how I see the market." },
            { n:"Liam K.", c:"Australia", t:"The signals plus bot combo is criminally good. 11 weeks green. Best investment I've made in trading." },
          ].map(r => (
            <div key={r.n} className="glass rounded-3xl p-7 hover-lift">
              <Quote className="text-brand mb-4" size={22}/>
              <p className="text-sm leading-relaxed text-muted-foreground">{r.t}</p>
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{r.n}</div>
                  <div className="text-xs text-muted-foreground">{r.c}</div>
                </div>
                <div className="flex gap-0.5 text-brand">{[...Array(5)].map((_,i)=><Star key={i} size={12} fill="currentColor"/>)}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[32px] glass-strong p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 -z-10 grid-bg opacity-50" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl mx-auto">Ready to take your trading to the next level?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands of traders who trust LEGIONFX for education, technology, mentorship, and funded account success.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
            <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Our Team</Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function PlanCard({ name, tagline, price, features, featured }: { name: string; tagline: string; price: string; features: string[]; featured?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-8 transition ${featured ? "glass-strong scale-100 md:scale-110 z-10 shadow-glow border-brand/40" : "glass hover-lift"}`}>
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full brand-gradient text-brand-foreground text-xs font-semibold">
          {tagline}
        </div>
      )}
      <div className="text-sm text-muted-foreground">{!featured && tagline}</div>
      <h3 className="text-2xl font-semibold mt-1">{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-5xl font-bold text-gradient">{price}</span>
        <span className="text-sm text-muted-foreground">/mo</span>
      </div>
      <ul className="mt-6 space-y-3">
        {features.map(f => (
          <li key={f} className="flex gap-2 text-sm text-muted-foreground">
            <Check size={16} className="text-brand mt-0.5 shrink-0"/> {f}
          </li>
        ))}
      </ul>
      <Link to="/login" className={`mt-7 block text-center py-3 rounded-xl transition ${featured ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>
        Get Started
      </Link>
    </div>
  );
}
