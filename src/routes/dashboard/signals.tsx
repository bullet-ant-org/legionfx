import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  TrendingUp, TrendingDown, Target, Percent, Activity, Bell, Copy, Filter,
  ChevronRight, Zap, Award, Signal,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { signals, performance } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/signals")({
  ssr: false,
  component: SignalsPage,
});

const feed = [
  ...signals,
  { pair: "US30", direction: "BUY", entry: 38240, sl: 38100, tp: 38500, confidence: 88, status: "Active" },
  { pair: "USD/JPY", direction: "SELL", entry: 158.42, sl: 158.9, tp: 157.2, confidence: 84, status: "Active" },
  { pair: "SPX500", direction: "BUY", entry: 5478, sl: 5450, tp: 5540, confidence: 79, status: "Active" },
  { pair: "AUD/USD", direction: "SELL", entry: 0.6684, sl: 0.6712, tp: 0.6620, confidence: 76, status: "TP Hit" },
];

const providers = [
  { name: "Marcus Vale", role: "Head Analyst", accuracy: 92, signals: 240, subscribers: 3200 },
  { name: "Elena Cross", role: "SMC Specialist", accuracy: 88, signals: 180, subscribers: 2100 },
  { name: "AI Quant Desk", role: "Automated", accuracy: 84, signals: 640, subscribers: 5400 },
];

const filters = ["All", "Forex", "Metals", "Crypto", "Indices"] as const;

function SignalsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return feed;
    return feed.filter((s) => {
      if (filter === "Forex") return s.pair.includes("/") && !["BTC/USD"].includes(s.pair);
      if (filter === "Metals") return s.pair === "XAU/USD";
      if (filter === "Crypto") return s.pair === "BTC/USD";
      if (filter === "Indices") return ["US30", "SPX500", "NAS100"].includes(s.pair);
      return true;
    });
  }, [filter]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Signals</h1>
          <p className="text-sm text-muted-foreground mt-1">Live premium signals with entry, stop, target and confidence — across every market.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2"><Bell size={14} /> Alerts On</button>
          <button className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Copy Trade</button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Signal Accuracy" value={90} suffix="%" delta="Last 30 days" icon={<Percent size={14} />} />
        <StatCard label="Active Signals" value={filtered.filter(s => s.status === "Active").length} delta="Live now" icon={<Signal size={14} />} />
        <StatCard label="TP Hit This Week" value={18} delta="+4 vs last week" icon={<Target size={14} />} />
        <StatCard label="Avg RRR" value={2.4} decimals={1} suffix=":1" delta="Reward:Risk" icon={<Award size={14} />} />
      </div>

      {/* Live feed */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">Live Signal Feed <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /></div>
            <div className="text-xs text-muted-foreground">Updated in real time</div>
          </div>
          <div className="flex gap-1 p-1 glass rounded-xl">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-2.5 py-1.5 text-[11px] rounded-lg transition ${filter === f ? "brand-gradient text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover:bg-white/[0.05] transition">
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
                  <div className="text-xs font-semibold mt-0.5">{s.entry.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <div className="text-[9px] text-muted-foreground uppercase">SL</div>
                  <div className="text-xs font-semibold mt-0.5 text-rose-400">{s.sl.toLocaleString()}</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-2">
                  <div className="text-[9px] text-muted-foreground uppercase">TP</div>
                  <div className="text-xs font-semibold mt-0.5 text-emerald-400">{s.tp.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] mb-1"><span className="text-muted-foreground">Confidence</span><span className="text-brand font-semibold">{s.confidence}%</span></div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full brand-gradient" style={{ width: `${s.confidence}%` }} /></div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded-lg brand-gradient text-brand-foreground text-[11px] font-medium inline-flex items-center justify-center gap-1"><Zap size={10} /> Copy Trade</button>
                <button className="p-1.5 rounded-lg glass hover:bg-white/10 text-muted-foreground"><Copy size={11} /></button>
                <button className="p-1.5 rounded-lg glass hover:bg-white/10 text-muted-foreground"><Bell size={11} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Analytics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Signal Performance" subtitle="Cumulative pips · 30 days" />
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
          <SectionTitle title="Accuracy by Market" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: "Forex", v: 92 }, { name: "Metals", v: 88 }, { name: "Crypto", v: 78 }, { name: "Indices", v: 85 },
              ]}>
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
        <SectionTitle title="Signal Providers" subtitle="Your subscribed analysts" />
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
              <button className="mt-3 w-full py-2 rounded-xl glass hover:bg-white/10 text-xs font-medium">View Profile</button>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
