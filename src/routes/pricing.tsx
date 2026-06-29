import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Signal, GraduationCap, Wallet, Bot, ChevronDown, Sparkles } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — LEGIONFX" },
      { name: "description", content: "Transparent pricing for premium signals, mentorship, prop firm challenges and trading bots." },
    ],
  }),
  component: PricingPage,
});

const TABS = [
  { id: "signals", label: "Signals", icon: Signal },
  { id: "mentorship", label: "Mentorship", icon: GraduationCap },
  { id: "propfirm", label: "Prop Firm", icon: Wallet },
  { id: "bots", label: "Bots", icon: Bot },
];

function PricingPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand"><Sparkles size={12}/> Transparent Pricing</div>
          <h1 className="mt-5 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            Choose the perfect plan for your <span className="text-gradient">trading journey.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto">
            Premium signals, one-on-one mentorship, funded account assistance and advanced automation — flexible pricing for every level.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Get Started</Link>
            <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Sales</Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
            {["7+ Years","5,000+ Traders","500+ Mentored","Trusted Worldwide"].map(t => (
              <div key={t} className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full"><Check size={12} className="text-brand"/> {t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <Section className="!py-6">
        <div className="flex flex-wrap justify-center gap-2 glass p-2 rounded-2xl max-w-2xl mx-auto">
          {TABS.map(t => (
            <a key={t.id} href={`#${t.id}`} className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition">
              <t.icon size={14}/> {t.label}
            </a>
          ))}
        </div>
      </Section>

      {/* Signals */}
      <Section id="signals">
        <SectionHeader eyebrow="Premium Signals" title="Trade With Confidence" subtitle="Carefully analyzed trading opportunities backed by professional market analysis." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card name="Weekly VIP" price="$9" period="/wk" features={["Premium Signals","Entry Price","Stop Loss","Take Profit","Market Analysis","Community Access"]} cta="Start Weekly"/>
          <Card name="Monthly VIP" price="$24" period="/mo" badge="Most Popular" featured features={["Everything in Weekly","Priority Updates","Daily Market Outlook","VIP Community"]} cta="Go Monthly"/>
          <Card name="Quarterly VIP" price="$59" period="/qt" features={["Everything in Monthly","Extended Savings","Priority Support","Exclusive Webinars"]} cta="Choose Quarterly"/>
          <Card name="Lifetime VIP" price="$149" period=" once" badge="Best Value" features={["Lifetime Access","Future Updates","Premium Community","Priority Support","Exclusive Content"]} cta="Get Lifetime"/>
        </div>
      </Section>

      {/* Mentorship */}
      <Section id="mentorship">
        <SectionHeader eyebrow="Mentorship" title="Learn From Experienced Traders" subtitle="Structured mentorship programs designed to accelerate your trading journey." />
        <div className="grid md:grid-cols-3 gap-5 items-center">
          <Card name="1-on-1 Session" price="$30" period="/hr" features={["Private Coaching","Chart Review","Personal Guidance","Risk Assessment"]} cta="Book Session"/>
          <Card name="Premium Mentorship" price="$199" period="/8wk" badge="Most Popular" featured features={["Everything Included","VIP Signals","Private Support","Personal Mentorship","Advanced Strategies","Trading Reviews","Priority Assistance"]} cta="Become Elite"/>
          <Card name="Group Mentorship" price="$99" period="/8wk" features={["Live Classes","Assignments","Trading Psychology","Community Support","Risk Management"]} cta="Join Group"/>
        </div>
      </Section>

      {/* Prop Firm */}
      <Section id="propfirm">
        <SectionHeader eyebrow="Prop Firm Challenge Accounts" title="Get Funded Faster" subtitle="Choose your preferred evaluation type." />
        {[
          { t: "One-Step Evaluation", note: "Fastest path", rows: [["$10K","$49"],["$25K","$89"],["$50K","$149"],["$100K","$249"]] },
          { t: "Two-Step Evaluation", note: "Most Popular · Best Balance", featured: true, rows: [["$10K","$39"],["$25K","$79"],["$50K","$129"],["$100K","$219"]] },
          { t: "Five-Step Evaluation", note: "Budget Friendly", rows: [["$10K","$29"],["$25K","$59"],["$50K","$99"],["$100K","$179"]] },
        ].map(g => (
          <div key={g.t} className={`mt-6 rounded-3xl p-6 md:p-8 ${g.featured ? "glass-strong shadow-glow border-brand/30" : "glass"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h3 className="text-xl font-semibold">{g.t}</h3>
              <span className="text-xs px-3 py-1 rounded-full bg-brand/15 text-brand">{g.note}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {g.rows.map(([acc,price]) => (
                <div key={acc} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 hover-lift">
                  <div className="text-sm text-muted-foreground">{acc} Account</div>
                  <div className="text-3xl font-bold text-gradient mt-1">{price}</div>
                  <button className="mt-4 w-full py-2 rounded-xl glass hover:bg-white/10 text-sm">Purchase</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* Bots */}
      <Section id="bots">
        <SectionHeader eyebrow="Trading Bots" title="Automate Your Trading" subtitle="Powerful bots executing disciplined strategies while reducing emotional decisions." />
        <div className="grid md:grid-cols-3 gap-5">
          <Card name="Monthly" price="$39" period="/mo" features={["Latest Bot Version","Monthly Updates","Email Support"]} cta="Subscribe"/>
          <Card name="Quarterly" price="$99" period="/qt" badge="Most Popular" featured features={["Everything Included","Priority Updates","Savings","Premium Support"]} cta="Choose Quarterly"/>
          <Card name="Yearly" price="$299" period="/yr" badge="Best Value" features={["Full-Year Access","Priority Support","Free Updates","Future Improvements","VIP Community"]} cta="Go Yearly"/>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Frequently Asked Questions" />
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            ["Which pricing plan is best for beginners?","Start with Monthly VIP signals or Group Mentorship — both give you structure without a large commitment."],
            ["Can I upgrade my membership later?","Yes, you can upgrade at any time and we'll prorate the difference."],
            ["Are there recurring payments?","Weekly, Monthly, Quarterly and Yearly plans renew automatically. Lifetime is a one-time payment."],
            ["How do the Prop Firm Challenges work?","Pick an evaluation type and account size. Hit the profit target within risk rules to get funded."],
            ["What trading platforms are supported?","MT4, MT5, cTrader and Match Trader, with select Binance and Bybit integrations."],
            ["Are trading bots updated regularly?","Yes — strategy improvements and platform updates ship continuously."],
            ["Can I combine mentorship with signals?","Absolutely — the Premium Mentorship plan includes VIP signals."],
          ].map(([q,a]) => <FAQ key={q} q={q} a={a}/>)}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[32px] glass-strong p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to level up your trading?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands of traders who trust LEGIONFX for education, tools, funding and automation.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
            <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Our Team</Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function Card({ name, price, period, features, cta, badge, featured }: { name: string; price: string; period: string; features: string[]; cta: string; badge?: string; featured?: boolean }) {
  return (
    <div className={`relative rounded-3xl p-7 transition ${featured ? "glass-strong shadow-glow border-brand/40 md:scale-105 z-10" : "glass hover-lift"}`}>
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold ${featured ? "brand-gradient text-brand-foreground" : "bg-white/10 text-foreground"}`}>{badge}</div>
      )}
      <div className="text-sm text-muted-foreground">{name}</div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold text-gradient">{price}</span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </div>
      <ul className="mt-5 space-y-2.5">
        {features.map(f => (
          <li key={f} className="flex gap-2 text-sm text-muted-foreground"><Check size={15} className="text-brand mt-0.5 shrink-0"/>{f}</li>
        ))}
      </ul>
      <Link to="/login" className={`mt-6 block text-center py-3 rounded-xl transition ${featured ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>{cta}</Link>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o=>!o)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown size={18} className={`transition-transform ${open?"rotate-180 text-brand":"text-muted-foreground"}`}/>
      </button>
      <div className={`grid transition-all duration-300 ${open?"grid-rows-[1fr]":"grid-rows-[0fr]"}`}>
        <div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-muted-foreground">{a}</p></div>
      </div>
    </div>
  );
}
