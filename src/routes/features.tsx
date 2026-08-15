import { createFileRoute, Link } from "@tanstack/react-router";
import {
  LayoutDashboard, Wallet, Bot, Trophy, GraduationCap, LineChart, Users, Shield,
  LifeBuoy, ArrowRight, Bell, CreditCard, CheckCircle2, Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { DashboardMockup } from "@/components/site/DashboardMockup";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Everything Inside LEGIONFX" },
      { name: "description", content: "A tour of every tool inside your LEGIONFX dashboard — wallet, trading bots, prop firm challenges, academy, signals, referrals and security." },
    ],
  }),
  component: FeaturesPage,
});

const CORE_FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    desc: "One command center for your entire trading operation — wallet balance, active bots, prop firm progress, academy completion, and the latest signals, all on a single screen.",
    points: ["Real-time portfolio snapshot", "Recent transactions & activity feed", "Personalized referral summary"],
  },
  {
    icon: Wallet,
    title: "Wallet & Crypto Deposits",
    desc: "Deposit via crypto, track every transaction, and move funds between your main balance, bots, prop firm and academy wallets — all from one secure ledger.",
    points: ["Cryptocurrency deposit checkout", "Full transaction history & filtering", "Instant internal transfers"],
  },
  {
    icon: Bot,
    title: "Trading Bots Marketplace",
    desc: "Deploy automated strategies matched to your risk appetite, monitor live performance, and pause or resume any bot in a click.",
    points: ["Marketplace of vetted strategies", "Live profit & win-rate tracking", "One-click pause / resume"],
  },
  {
    icon: Trophy,
    title: "Prop Firm Challenges",
    desc: "Buy into funded-account challenges, track your equity curve against drawdown limits, and progress through evaluation phases with full transparency.",
    points: ["Multiple account sizes & fee tiers", "Live drawdown & target tracking", "Phase-by-phase progress"],
  },
  {
    icon: GraduationCap,
    title: "Academy & Mentorship",
    desc: "Structured courses from foundations to advanced market structure, with lesson-by-lesson progress tracking and certificates on completion.",
    points: ["Self-paced course catalog", "Progress tracking per lesson", "Certificates on completion"],
  },
  {
    icon: LineChart,
    title: "Trading Signals",
    desc: "Daily entries with clear stop-loss, take-profit and confidence scores across forex, metals, indices and crypto — built for manual execution with your own broker.",
    points: ["Entry / SL / TP on every call", "Confidence scoring", "Filter by market"],
  },
  {
    icon: Users,
    title: "Referral Program",
    desc: "Share your unique referral link, track signups in real time, and watch your referral earnings accumulate in your wallet.",
    points: ["Personal referral link & code", "Real-time referral count", "Earnings tracked automatically"],
  },
  {
    icon: Shield,
    title: "Account Security",
    desc: "Stay in control of your account with password management, two-factor protection, and a running security score across your profile.",
    points: ["Password management", "Two-factor authentication", "Account security score"],
  },
  {
    icon: LifeBuoy,
    title: "Support Center",
    desc: "Search help articles or open a ticket with our team — track every conversation in one place until it's resolved.",
    points: ["Searchable FAQ library", "Ticketed support with replies", "Status tracking end to end"],
  },
];

const WORKFLOW = [
  ["Create your account", "Sign up in minutes and land straight in your personalized dashboard."],
  ["Fund your wallet", "Deposit via crypto and see your balance update in real time."],
  ["Choose your path", "Deploy a bot, buy a prop firm challenge, enroll in a course, or follow signals — or all four."],
  ["Track everything", "Every position, lesson, challenge and referral rolls up into one dashboard."],
];

function FeaturesPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-brand"><Sparkles size={12}/> Platform Features</div>
            <h1 className="mt-5 text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Everything You Can Do <span className="text-gradient">Inside LEGIONFX.</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-xl">
              One dashboard for your wallet, automated bots, funded challenges, education and signals — built so every part of your trading journey lives in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" className="px-6 py-3.5 rounded-xl brand-gradient text-brand-foreground font-medium shadow-glow inline-flex items-center gap-2">
                Explore the Dashboard <ArrowRight size={16}/>
              </Link>
              <Link to="/services" className="px-6 py-3.5 rounded-xl glass hover:bg-white/10">View Services</Link>
            </div>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: "150ms" }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <Section>
        <SectionHeader
          eyebrow="Core Features"
          title="Nine tools. One login."
          subtitle="Every feature below is a real, working part of your LEGIONFX dashboard — not a mockup."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-12 w-12 rounded-xl brand-gradient grid place-items-center text-brand-foreground shadow-glow">
                <f.icon size={20}/>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <ul className="mt-4 space-y-2">
                {f.points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 size={13} className="text-brand shrink-0 mt-0.5"/> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Workflow */}
      <Section className="py-0 pb-24">
        <div className="glass-strong rounded-3xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
          <SectionHeader eyebrow="How It Works" title="From sign-up to your first trade" center={false} />
          <div className="grid md:grid-cols-4 gap-6 relative">
            {WORKFLOW.map(([t, d], i) => (
              <div key={t} className="relative">
                <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground font-bold shadow-glow">{i + 1}</div>
                <h4 className="mt-4 font-semibold text-sm">{t}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Secondary features strip */}
      <Section className="pt-0">
        <div className="grid sm:grid-cols-3 gap-4">
          <MiniFeature icon={Bell} title="Real-time notifications" desc="In-app alerts for account activity, admin broadcasts and more." />
          <MiniFeature icon={CreditCard} title="Full transaction history" desc="Every deposit, withdrawal and transfer, searchable and filterable." />
          <MiniFeature icon={Shield} title="Admin-verified deposits" desc="Deposits and withdrawals are reviewed before funds move." />
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 brand-gradient text-brand-foreground text-center">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Ready to see it for yourself?</h2>
            <p className="mt-3 opacity-90">Create your account and every feature above is live in your dashboard immediately.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="px-6 py-3.5 rounded-xl bg-background text-foreground font-medium hover:opacity-90">Get Started Free</Link>
              <Link to="/contact" className="px-6 py-3.5 rounded-xl border border-background/30 font-medium hover:bg-background/10">Talk to Us</Link>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

function MiniFeature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl glass grid place-items-center text-brand shrink-0"><Icon size={16}/></div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{desc}</div>
      </div>
    </div>
  );
}
