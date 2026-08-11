import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Target, Percent, Bell, Copy, Zap, Award, Signal,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { performance } from "@/lib/demo-data";
import { useDashboardData } from "@/lib/dashboard-data";
import type { ApiSignal } from "@/lib/api";

export const Route = createFileRoute("/dashboard/signals")({
  ssr: false,
  component: SignalsPage,
});

// No provider/analyst backend model exists yet — kept illustrative.
const providers = [
  { name: "Marcus Vale", role: "Head Analyst", accuracy: 92, signals: 240, subscribers: 3200 },
  { name: "Elena Cross", role: "SMC Specialist", accuracy: 88, signals: 180, subscribers: 2100 },
  { name: "AI Quant Desk", role: "Automated", accuracy: 84, signals: 640, subscribers: 5400 },
];

const filters = ["All", "Forex", "Metals", "Crypto", "Indices"] as const;

function categoryOf(pair: string): (typeof filters)[number] {
  if (pair === "XAU/USD" || pair === "XAG/USD") return "Metals";
  if (pair.includes("BTC") || pair.includes("ETH") || pair.includes("crypto".toUpperCase())) return "Crypto";
  if (["US30", "SPX500", "NAS100", "UK100", "GER40"].includes(pair)) return "Indices";
  if (pair.includes("/")) return "Forex";
  return "All";
}

function alertsKey(userId?: string) {
  return `legionfx_signal_alerts:${userId ?? "anon"}`;
}

function SignalsPage() {
  const { signals, session } = useDashboardData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [alertsOn, setAlertsOn] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(alertsKey(session?.user?._id as string)) !== "off";
  });

  const filtered = useMemo(() => {
    if (filter === "All") return signals;
    return signals.filter((s) => categoryOf(s.pair) === filter);
  }, [filter, signals]);

  const activeCount = signals.filter((s) => s.status === "Active").length;
  const tpHitCount = signals.filter((s) => s.status === "TP Hit").length;
  const avgConfidence = signals.length ? Math.round(signals.reduce((a, s) => a + s.confidence, 0) / signals.length) : 0;
  const avgRRR = useMemo(() => {
    const ratios = signals
      .map((s) => {
        const entry = Number(s.entry), sl = Number(s.sl), tp = Number(s.tp);
        const risk = Math.abs(entry - sl);
        const reward = Math.abs(tp - entry);
        return risk > 0 ? reward / risk : null;
      })
      .filter((r): r is number => r !== null);
    return ratios.length ? ratios.reduce((a, r) => a + r, 0) / ratios.length : 0;
  }, [signals]);

  const accuracyByMarket = useMemo(() => {
    const groups: Record<string, number[]> = {};
    for (const s of signals) {
      const cat = categoryOf(s.pair);
      if (cat === "All") continue;
      (groups[cat] ??= []).push(s.confidence);
    }
    return filters.filter((f) => f !== "All").map((f) => ({
      name: f,
      v: groups[f]?.length ? Math.round(groups[f].reduce((a, c) => a + c, 0) / groups[f].length) : 0,
    }));
  }, [signals]);

  const copySignal = (s: ApiSignal) => {
    const text = `${s.pair} ${s.direction}\nEntry: ${s.entry}\nSL: ${s.sl}\nTP: ${s.tp}\nConfidence: ${s.confidence}%`;
    navigator.clipboard?.writeText(text);
    toast.success("Signal details copied — trade execution isn't automated yet, so enter it manually with your broker.");
  };

  const toggleAlerts = () => {
    const next = !alertsOn;
    setAlertsOn(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(alertsKey(session?.user?._id as string), next ? "on" : "off");
    }
    toast.success(next ? "Alerts enabled on this device" : "Alerts disabled on this device");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Signals</h1>
          <p className="text-sm text-muted-foreground mt-1">Live signals with entry, stop, target and confidence — across every market.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleAlerts} className={`px-4 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 ${alertsOn ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>
            <Bell size={14} /> Alerts {alertsOn ? "On" : "Off"}
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Avg Confidence" value={avgConfidence} suffix="%" delta={`${signals.length} signals`} icon={<Percent size={14} />} />
        <StatCard label="Active Signals" value={activeCount} delta="Live now" icon={<Signal size={14} />} />
        <StatCard label="TP Hit" value={tpHitCount} delta="All time" icon={<Target size={14} />} />
        <StatCard label="Avg RRR" value={avgRRR} decimals={1} suffix=":1" delta="Reward:Risk" icon={<Award size={14} />} />
      </div>

      {/* Live feed */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">Signal Feed <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /></div>
            <div className="text-xs text-muted-foreground">From the LEGIONFX analyst desk</div>
          </div>
          <div className="flex gap-1 p-1 glass rounded-xl">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1.5 text-[11px] rounded-lg transition ${filter === f ? "brand-gradient text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 flex flex-col items-center justify-center text-center gap-2">
            <Signal size={22} className="text-muted-foreground" />
            <div className="text-xs text-muted-foreground">No signals{filter !== "All" ? ` in ${filter}` : ""} right now — check back soon.</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {filtered.map((s, i) => (
              <motion.div key={s._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.05] transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl grid place-items-center ${s.direction === "BUY" ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>
                      {s.direction === "BUY" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold flex items-center gap-2">{s.pair} <span className={`text-[10px] px-1.5 py-0.5 rounded ${s.direction === "BUY" ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>{s.direction}</span></div>
                      <div className="text-[10px] text-muted-foreground">Confidence {s.confidence}%</div>
                    </div>
                  </div>
                  <StatusPill status={s.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <div className="text-[9px] text-muted-foreground uppercase">Entry</div>
                    <div className="text-xs font-semibold mt-0.5">{Number(s.entry).toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <div className="text-[9px] text-muted-foreground uppercase">SL</div>
                    <div className="text-xs font-semibold mt-0.5 text-rose-400">{Number(s.sl).toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2">
                    <div className="text-[9px] text-muted-foreground uppercase">TP</div>
                    <div className="text-xs font-semibold mt-0.5 text-emerald-400">{Number(s.tp).toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Confidence</span><span className="text-brand font-semibold">{s.confidence}%</span></div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${s.confidence}%` }} /></div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => copySignal(s)} className="flex-1 py-1.5 rounded-lg brand-gradient text-brand-foreground text-[11px] font-medium inline-flex items-center justify-center gap-1"><Zap size={10} /> Copy Trade</button>
                  <button onClick={() => copySignal(s)} className="p-1.5 rounded-lg glass hover:bg-white/10 text-muted-foreground" aria-label="Copy details"><Copy size={11} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Analytics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Signal Performance" subtitle="Illustrative trend" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance.monthly}>
                <defs>
                  <linearGradient id="sig" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="i" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill="url(#sig)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionTitle title="Avg Confidence by Market" subtitle="From your current signal feed" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={accuracyByMarket}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="v" fill="oklch(0.78 0.21 55)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Providers */}
      <div>
        <SectionTitle title="Signal Providers" subtitle="Illustrative — analyst profiles aren't wired up yet" />
        <div className="grid md:grid-cols-3 gap-4">
          {providers.map((p) => (
            <GlassCard key={p.name} className="p-5 hover-lift">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl brand-gradient grid place-items-center font-bold text-brand-foreground">{p.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{p.name}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.role}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-[9px] text-muted-foreground uppercase">Accuracy</div><div className="text-sm font-bold text-brand">{p.accuracy}%</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-[9px] text-muted-foreground uppercase">Signals</div><div className="text-sm font-bold">{p.signals}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-[9px] text-muted-foreground uppercase">Subs</div><div className="text-sm font-bold">{p.subscribers.toLocaleString()}</div></div>
              </div>
              <button onClick={() => toast.info("Analyst profiles are coming soon.")} className="mt-3 w-full py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium">View Profile</button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
