import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Target, Eye, Shield, Sparkles, Users, TrendingUp, Award, Zap, Globe } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { Counter } from "@/components/site/Counter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About LEGIONFX — Built By Traders. Driven By Excellence." },
      { name: "description", content: "Seven years building profitable traders through education, mentorship, automation and funded account guidance." },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { v: 7, s: "+", l: "Years of Experience" },
  { v: 500, s: "+", l: "Pro Traders Mentored" },
  { v: 5000, s: "+", l: "Active Traders" },
  { v: 900, p: "$", s: "M+", l: "Trading Volume" },
  { v: 90, s: "%", l: "Bot Accuracy" },
  { v: 95, s: "%", l: "Signal Accuracy" },
  { v: 70, s: "%", l: "Prop Firm Success" },
  { v: 24, s: "/7", l: "Community Support" },
];

const VALUES = [
  { icon: Shield, t: "Transparency", d: "Honest communication, realistic expectations, ethical trading practices." },
  { icon: Target, t: "Discipline", d: "Consistency and disciplined execution are the foundation of longevity." },
  { icon: Sparkles, t: "Innovation", d: "We continuously evolve our education, systems and technology stack." },
  { icon: Award, t: "Excellence", d: "We hold ourselves to the highest standard in every deliverable." },
  { icon: Users, t: "Community", d: "Trading is stronger together — we build supportive ecosystems." },
  { icon: TrendingUp, t: "Growth", d: "Every decision serves the continuous improvement of our traders." },
];

const TEAM = [
  ["Marcus Vale", "Founder & CEO"],
  ["Selene Ortiz", "Head Market Analyst"],
  ["Idris Kane", "Senior Trading Mentor"],
  ["Anya Park", "Prop Firm Specialist"],
  ["Theo Lambert", "Lead Software Engineer"],
  ["Naomi Chen", "Community Manager"],
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand">About LEGIONFX</div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Building Profitable <br/><span className="text-gradient">Traders Since Day One.</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
              For more than seven years LEGIONFX has helped aspiring and professional traders unlock their potential through world-class education, innovative technology, professional mentorship and proven funding strategies.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Join Our Community</Link>
              <Link to="/services" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Explore Our Services</Link>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute -inset-10 -z-10 bg-brand/30 blur-3xl rounded-full" />
            <div className="grid grid-cols-6 gap-3">
              <div className="col-span-4 aspect-video glass-strong rounded-3xl grid-bg" />
              <div className="col-span-2 row-span-2 glass rounded-3xl p-5 flex flex-col justify-between">
                <div className="text-xs text-muted-foreground">Live</div>
                <div className="text-3xl font-bold text-gradient">+12.4%</div>
                <div className="text-xs text-muted-foreground">Portfolio · 30d</div>
              </div>
              <div className="col-span-2 aspect-square glass rounded-3xl brand-gradient/20" />
              <div className="col-span-2 aspect-square glass rounded-3xl grid-bg" />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-3xl aspect-[4/5] grid-bg" />
            <div className="space-y-4">
              <div className="glass rounded-3xl aspect-square" style={{ background: "var(--gradient-hero)" }} />
              <div className="glass rounded-3xl aspect-square grid place-items-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gradient">500+</div>
                  <div className="text-xs text-muted-foreground mt-1">Mentored</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Our Story" title={<>Our <span className="text-gradient">Journey</span></>} center={false} subtitle="LEGIONFX was founded by traders who lived the frustration of fragmented education and unrealistic promises. After years of mentoring privately, we built the ecosystem we wished existed — where rigorous education, real technology and serious funding guidance work as one." />
            <p className="text-muted-foreground leading-relaxed">
              Since day one we've focused on the long game — discipline over hype, frameworks over signals, sustainability over speed. Today, thousands of traders across the world rely on the LEGIONFX ecosystem to build careers that compound.
            </p>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <SectionHeader eyebrow="Our Impact" title="Our Impact In Numbers" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.l} className="glass rounded-2xl p-6 text-center hover-lift">
              <div className="text-3xl font-bold text-gradient">
                <Counter to={s.v} prefix={s.p ?? ""} suffix={s.s} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-strong rounded-3xl p-10 hover-lift">
            <div className="h-12 w-12 rounded-2xl brand-gradient grid place-items-center text-brand-foreground shadow-glow mb-5"><Target size={22}/></div>
            <h3 className="text-2xl font-semibold">Our Mission</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              To empower traders worldwide through education, technology, discipline and professional funding opportunities — helping them build consistent, sustainable trading careers.
            </p>
          </div>
          <div className="glass-strong rounded-3xl p-10 hover-lift">
            <div className="h-12 w-12 rounded-2xl bg-triad-violet/30 border border-triad-violet/40 grid place-items-center text-triad-violet mb-5"><Eye size={22}/></div>
            <h3 className="text-2xl font-semibold">Our Vision</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              To become one of the world's most respected trading education and financial technology companies, transforming the lives of traders globally through innovation and integrity.
            </p>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader eyebrow="Core Values" title="The Principles That Drive Us" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {VALUES.map(v => (
            <div key={v.t} className="glass rounded-3xl p-7 hover-lift">
              <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-4 shadow-glow"><v.icon size={20}/></div>
              <h4 className="text-lg font-semibold">{v.t}</h4>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader eyebrow="Our Team" title="Meet The Experts Behind LEGIONFX" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TEAM.map(([n, r]) => (
            <div key={n} className="glass rounded-3xl p-6 hover-lift">
              <div className="aspect-square rounded-2xl overflow-hidden mb-5 relative" style={{ background: "linear-gradient(135deg, oklch(0.28 0.04 50), oklch(0.18 0.02 50))" }}>
                <div className="absolute inset-0 grid-bg opacity-40" />
                <div className="absolute inset-0 grid place-items-center text-5xl font-display font-bold text-gradient">
                  {n.split(" ").map(s => s[0]).join("")}
                </div>
              </div>
              <h4 className="font-semibold">{n}</h4>
              <p className="text-sm text-brand">{r}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section>
        <SectionHeader eyebrow="Why LEGIONFX" title="Why Thousands Of Traders Trust LEGIONFX" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            [Award,"7+ Years Experience"],[Users,"500+ Traders Trained"],[Globe,"5,000+ Community"],[Zap,"90% Bot Accuracy"],
            [Sparkles,"95% Signal Accuracy"],[Target,"70% Funded Success"],[Shield,"Risk Frameworks"],[TrendingUp,"Lifetime Learning"],
          ].map(([Icon, t]) => (
            <div key={t as string} className="glass rounded-2xl p-5 hover-lift">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground mb-3"><Icon as any size={18}/></div>
              <div className="text-sm font-medium">{t as string}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[32px] glass-strong p-12 md:p-20 text-center">
          <div className="absolute inset-0 -z-10 opacity-80" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Ready to take your trading to the next level?</h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Join thousands of traders building careers with LEGIONFX.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow">Start Trading</Link>
            <Link to="/contact" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">Contact Our Team</Link>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
