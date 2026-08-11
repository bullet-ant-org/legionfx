import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadialBarChart, RadialBar,
} from "recharts";
import {
  Trophy, TrendingUp, Calendar, DollarSign, CheckCircle2, Award,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { performance } from "@/lib/demo-data";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError } from "@/lib/api";

export const Route = createFileRoute("/dashboard/prop-firm")({
  ssr: false,
  component: PropFirmPage,
});

type Plan = { _id: string; size: number; price: number; profitSplit: number; popular: boolean };

function PropFirmPage() {
  const { challenges, loading, refresh } = useDashboardData();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useEffect(() => {
    api.getPropFirmPlans()
      .then((r) => setPlans(r.plans))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load challenge plans"))
      .finally(() => setPlansLoading(false));
  }, []);

  const primaryChallenge = challenges.find((c) => c.status !== undefined ? true : true) ?? challenges[0] ?? null;
  const activeChallenges = challenges.filter((c) => c.phase !== "Failed");
  const historyChallenges = challenges.filter((c) => c.phase === "Failed" || c.phase === "Funded");
  const totalCapital = challenges.reduce((a, c) => a + c.size, 0);
  const totalEquity = challenges.reduce((a, c) => a + c.currentEquity, 0);
  const passedCount = challenges.filter((c) => c.phase === "Phase 2" || c.phase === "Funded").length;
  const passRate = challenges.length ? Math.round((passedCount / challenges.length) * 100) : 0;

  const buy = async (planId: string) => {
    setBuyingId(planId);
    try {
      await api.buyChallenge(planId);
      toast.success("Challenge started — good luck!");
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not start challenge");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Prop Firm</h1>
          <p className="text-sm text-muted-foreground mt-1">Track evaluations, manage funded accounts, and unlock trading capital.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl glass animate-pulse" />)
        ) : (
          <>
            <StatCard label="Total Capital" value={totalCapital} prefix="$" delta={`${challenges.length} account${challenges.length === 1 ? "" : "s"}`} icon={<DollarSign size={14} />} />
            <StatCard label="Current Equity" value={totalEquity} prefix="$" icon={<TrendingUp size={14} />} />
            <StatCard label="Challenges Passed" value={passedCount} delta={`${passRate}% pass rate`} icon={<Trophy size={14} />} />
            <StatCard label="Active Challenges" value={activeChallenges.length} icon={<Award size={14} />} />
          </>
        )}
      </div>

      {/* Current challenge focus */}
      {primaryChallenge ? (
        <GlassCard className="p-6">
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 items-center">
            <div className="text-center">
              <div className="relative w-56 h-56 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ v: primaryChallenge.completion, fill: "oklch(0.78 0.21 55)" }]} startAngle={90} endAngle={-270}>
                    <RadialBar background={{ fill: "oklch(1 0 0 / 0.05)" }} dataKey="v" cornerRadius={20} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center text-center">
                  <div>
                    <div className="text-4xl font-bold text-gradient">{primaryChallenge.completion}%</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{primaryChallenge.phase}</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand">Active Challenge</div>
              <h2 className="text-2xl font-bold mt-2">${primaryChallenge.size.toLocaleString()} Account · {primaryChallenge.phase}</h2>
              <p className="text-sm text-muted-foreground mt-2">Reach ${primaryChallenge.profitTarget.toLocaleString()} profit while staying within drawdown limits.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <MetricBox label="Current Equity" value={`$${primaryChallenge.currentEquity.toLocaleString()}`} accent />
                <MetricBox label="Profit Target" value={`$${primaryChallenge.profitTarget.toLocaleString()}`} />
                <MetricBox label="Daily DD" value={`${primaryChallenge.dailyDrawdown}%`} sub="Max 5%" />
                <MetricBox label="Max DD" value={`${primaryChallenge.maxDrawdown}%`} sub="Max 10%" />
              </div>
            </div>
          </div>
        </GlassCard>
      ) : !loading ? (
        <GlassCard className="p-10 text-center">
          <Trophy size={22} className="mx-auto text-brand" />
          <div className="mt-3 text-sm font-medium">No active challenge</div>
          <div className="text-xs text-muted-foreground mt-1">Pick a plan below to start your first evaluation.</div>
        </GlassCard>
      ) : null}

      {/* Equity chart */}
      {primaryChallenge && (
        <GlassCard className="p-5">
          <SectionTitle title="Equity Curve" subtitle="Illustrative trend for your active challenge" />
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
      )}

      {/* Active challenges */}
      <div>
        <SectionTitle title="Your Challenges" />
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-56 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : activeChallenges.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-muted-foreground">No challenges yet — start one below.</GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChallenges.map((c) => (
              <GlassCard key={c._id} className="p-5 hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-muted-foreground">{c._id.slice(-8).toUpperCase()}</div>
                    <div className="text-lg font-bold">${c.size.toLocaleString()}</div>
                  </div>
                  <StatusPill status={c.phase} />
                </div>
                <div className="mt-3 text-xs text-brand font-semibold">{c.phase}</div>
                <div className="mt-2">
                  <div className="flex justify-between text-[10px] text-muted-foreground mb-1"><span>Progress</span><span>{c.completion}%</span></div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${c.completion}%` }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                  <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px] uppercase">Equity</div><div className="font-semibold">${c.currentEquity.toLocaleString()}</div></div>
                  <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px] uppercase">Target</div><div className="font-semibold">${c.profitTarget.toLocaleString()}</div></div>
                </div>
                {c.remainingDays != null && <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground"><Calendar size={10} /> {c.remainingDays} days left</div>}
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Buy new challenge */}
      <div>
        <SectionTitle title="Get Funded" subtitle="Choose your account size and start your evaluation" />
        {plansLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-72 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : plans.length === 0 ? (
          <GlassCard className="p-8 text-center text-sm text-muted-foreground">No challenge plans are configured yet.</GlassCard>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
            {plans.map((c) => (
              <GlassCard key={c._id} className={`p-5 relative ${c.popular ? "border-brand/40 shadow-glow" : ""}`}>
                {c.popular && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full brand-gradient text-brand-foreground font-semibold uppercase tracking-wider">Popular</span>}
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Account</div>
                  <div className="text-2xl font-bold text-gradient mt-1">${(c.size / 1000)}K</div>
                  <div className="mt-3 text-3xl font-bold">${c.price}</div>
                  <div className="text-[10px] text-muted-foreground">One-time fee, deducted from wallet</div>
                  <div className="mt-4 space-y-1.5 text-[11px] text-left">
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> {c.profitSplit}/{100 - c.profitSplit} profit split</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> 8% profit target</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> Unlimited time</div>
                    <div className="flex items-center gap-1.5"><CheckCircle2 size={10} className="text-brand" /> EA & bots allowed</div>
                  </div>
                  <button
                    onClick={() => buy(c._id)}
                    disabled={buyingId === c._id}
                    className={`mt-4 w-full py-2 rounded-xl text-xs font-medium disabled:opacity-60 ${c.popular ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}
                  >
                    {buyingId === c._id ? "Starting…" : "Start Challenge"}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* History + Rules */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Challenge History" />
          {historyChallenges.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">No completed or failed challenges yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 font-medium">ID</th>
                    <th className="text-left py-2 font-medium">Size</th>
                    <th className="text-left py-2 font-medium">Result</th>
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-right py-2 font-medium">Equity</th>
                  </tr>
                </thead>
                <tbody>
                  {historyChallenges.map((h) => (
                    <tr key={h._id} className="border-b border-white/5 last:border-0">
                      <td className="py-2.5 text-muted-foreground">{h._id.slice(-8).toUpperCase()}</td>
                      <td className="py-2.5">${h.size.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${h.phase === "Funded" ? "bg-brand/10 text-brand border-brand/20" : "bg-rose-400/10 text-rose-400 border-rose-400/20"}`}>{h.phase}</span>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{new Date(h.createdAt as string).toLocaleDateString()}</td>
                      <td className="py-2.5 text-right font-semibold">${h.currentEquity.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
