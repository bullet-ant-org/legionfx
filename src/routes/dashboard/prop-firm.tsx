import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  Trophy, Target, TrendingUp, ShieldAlert, Calendar, DollarSign, Zap,
  CheckCircle2, Circle, ChevronRight, Award, Rocket,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { propFirm, performance } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/prop-firm")({
  ssr: false,
  component: PropFirmPage,
});

const challenges = [
  { size: 10000, phase1: 799, phase2: 799, funded: 799, split: "80/20", profitTarget: "8% / 5%" },
  { size: 25000, phase1: 189, phase2: 189, funded: 189, split: "80/20", profitTarget: "8% / 5%" },
  { size: 50000, phase1: 289, phase2: 289, funded: 289, split: "85/15", profitTarget: "8% / 5%", popular: true },
  { size: 100000, phase1: 489, phase2: 489, funded: 489, split: "90/10", profitTarget: "8% / 5%" },
  { size: 200000, phase1: 989, phase2: 989, funded: 989, split: "90/10", profitTarget: "8% / 5%" },
];

const activeChallenges = [
  { id: "PF-100K-2", size: 100000, phase: "Phase 2", progress: 72, equity: 105760, target: 108000, daysLeft: 14, status: "Active" },
  { id: "PF-50K-1", size: 50000, phase: "Funded", progress: 100, equity: 54200, target: 54000, daysLeft: null, status: "Active" },
  { id: "PF-25K-1", size: 25000, phase: "Phase 1", progress: 34, equity: 25680, target: 27000, daysLeft: 22, status: "Active" },
];

const history = [
  { id: "PF-100K-1", size: "$100,000", result: "Passed Phase 1", date: "May 12, 2026", profit: "+$8,240" },
  { id: "PF-50K-1", size: "$50,000", result: "Funded", date: "Apr 3, 2026", profit: "+$4,120" },
  { id: "PF-10K-2", size: "$10,000", result: "Failed", date: "Feb 18, 2026", profit: "-$540" },
  { id: "PF-10K-1", size: "$10,000", result: "Passed", date: "Jan 10, 2026", profit: "+$820" },
];

function PropFirmPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Prop Firm</h1>
          <p className="text-sm text-muted-foreground mt-1">Track evaluations, manage funded accounts, and unlock capital up to $2M.</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 shadow-glow"><Rocket size={15} /> New Challenge</button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Capital" value={175000} prefix="$" delta="3 active accounts" icon={<DollarSign size={14} />} />
        <StatCard label="Total Profit" value={12580} prefix="$" delta="+8.4% this month" icon={<TrendingUp size={14} />} />
        <StatCard label="Challenges Passed" value={4} delta="80% pass rate" icon={<Trophy size={14} />} />
        <StatCard label="Payout Split" value={90} suffix="%" delta="Elite tier" icon={<Award size={14} />} />
      </div>

      {/* Current challenge focus */}
      <GlassCard className="p-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-center">
          <div className="text-center">
            <div className="relative w-56 h-56 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: propFirm.completion, fill: "oklch(0.78 0.21 55)" }]} startAngle={90} endAngle={-270}>
                  <RadialBar background={{ fill: "oklch(1 0 0 / 0.05)" }} dataKey="v" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <div className="text-4xl font-bold text-gradient">{propFirm.completion}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{propFirm.phase}</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-brand">Active Challenge</div>
            <h2 className="text-2xl font-bold mt-2">${propFirm.size.toLocaleString()} Account · {propFirm.phase}</h2>
            <p className="text-sm text-muted-foreground mt-2">Reach {propFirm.profitTarget.toLocaleString()} profit while staying within drawdown limits.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <MetricBox label="Current Equity" value={`$${propFirm.currentEquity.toLocaleString()}`} accent />
              <MetricBox label="Profit Target" value={`$${propFirm.profitTarget.toLocaleString()}`} />
              <MetricBox label="Daily DD" value={`${propFirm.dailyDrawdown}%`} sub="Max 5%" />
              <MetricBox label="Max DD" value={`${propFirm.maxDrawdown}%`} sub="Max 10%" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <button className="px-4 py-2 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Continue Trading</button>
              <button className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm">View Rules</button>
              <button className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm">Trade Log</button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Equity chart */}
      <GlassCard className="p-5">
        <SectionTitle title="Equity Curve" subtitle="Live tracking of your challenge balance" />
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance.monthly}>
              <defs>
                <linearGradient id="pfEq" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
              <XAxis dataKey="i" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              <Area dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill="url(#pfEq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Active challenges */}
      <div>
        <SectionTitle title="Your Active Challenges" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeChallenges.map((c) => (
            <GlassCard key={c.id} className="p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground">{c.id}</div>
                  <div className="text-lg font-bold">${c.size.toLocaleString()}</div>
                </div>
                <StatusPill status={c.status} />
              </div>
              <div className="mt-3 text-xs text-brand font-semibold">{c.phase}</div>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Progress</span><span>{c.progress}%</span></div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${c.progress}%` }} /></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px] uppercase">Equity</div><div className="font-semibold">${c.equity.toLocaleString()}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px] uppercase">Target</div><div className="font-semibold">${c.target.toLocaleString()}</div></div>
              </div>
              {c.daysLeft && <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground"><Calendar size={10} /> {c.daysLeft} days left</div>}
              <button className="mt-3 w-full py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium">Manage</button>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Buy new challenge */}
      <div>
        <SectionTitle title="Get Funded" subtitle="Choose your account size and start your evaluation" />
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {challenges.map((c) => (
            <GlassCard key={c.size} className={`p-5 relative ${c.popular ? "border-brand/40 shadow-glow" : ""}`}>
              {c.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full brand-gradient text-brand-foreground font-semibold uppercase tracking-wider">Popular</span>}
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Account</div>
                <div className="text-2xl font-bold text-gradient mt-1">${(c.size / 1000)}K</div>
                <div className="mt-3 text-3xl font-bold">${c.phase1}</div>
                <div className="text-[10px] text-muted-foreground">One-time fee</div>
                <div className="mt-4 space-y-1.5 text-[11px] text-left">
                  <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> Split {c.split}</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> Target {c.profitTarget}</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> Unlimited time</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> EA & bots allowed</div>
                </div>
                <button className={`mt-4 w-full py-2 rounded-xl text-xs font-medium ${c.popular ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>Start Challenge</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* History + Rules */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Challenge History" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-white/5">
                  <th className="text-left py-2 font-medium">ID</th>
                  <th className="text-left py-2 font-medium">Size</th>
                  <th className="text-left py-2 font-medium">Result</th>
                  <th className="text-left py-2 font-medium">Date</th>
                  <th className="text-right py-2 font-medium">P&L</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-white/5 last:border-0">
                    <td className="py-2.5 text-muted-foreground">{h.id}</td>
                    <td className="py-2.5">{h.size}</td>
                    <td className="py-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${h.result === "Funded" ? "bg-brand/10 text-brand border-brand/20" : h.result === "Failed" ? "bg-rose-400/10 text-rose-400 border-rose-400/20" : "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"}`}>{h.result}</span>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{h.date}</td>
                    <td className={`py-2.5 text-right font-semibold ${h.profit.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}>{h.profit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionTitle title="Challenge Rules" />
          <div className="space-y-2 text-xs">
            {[
              ["Profit Target Phase 1", "8%"],
              ["Profit Target Phase 2", "5%"],
              ["Daily Drawdown", "5% max"],
              ["Max Drawdown", "10% max"],
              ["Min Trading Days", "5 days"],
              ["Weekend Holding", "Allowed"],
              ["News Trading", "Allowed"],
              ["EAs & Bots", "Allowed"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between p-2 rounded-lg bg-white/[0.03]">
                <span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function MetricBox({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-base font-bold mt-1 ${accent ? "text-brand" : ""}`}>{value}</div>
      {sub && <div className="text-[9px] text-muted-foreground">{sub}</div>}
    </div>
  );
}
