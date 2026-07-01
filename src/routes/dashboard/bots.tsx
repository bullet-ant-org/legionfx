import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import {
  Bot, Play, Pause, Settings, TrendingUp, Zap, Shield, Sparkles, Plus, Check,
  ChevronRight, ChevronLeft, Star, Activity, DollarSign, Cpu, Target, Timer,
  X, Search,
} from "lucide-react";
import {
  GlassCard, StatCard, SectionTitle, StatusPill, Modal, Field, inputCls,
} from "@/components/dashboard/primitives";
import { activeBots, performance } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/bots")({
  ssr: false,
  component: BotsPage,
});

const marketplace = [
  { name: "Apex Trend Pro", type: "Trend Following", markets: "FX Majors", winRate: 78, roi: 42, risk: "Medium", price: 199, rating: 4.8, users: 1284 },
  { name: "Midas Gold v3", type: "Breakout", markets: "XAU/USD", winRate: 82, roi: 68, risk: "High", price: 249, rating: 4.9, users: 984 },
  { name: "Sentinel Scalper", type: "Scalping", markets: "GBP/JPY", winRate: 71, roi: 28, risk: "Low", price: 149, rating: 4.6, users: 2120 },
  { name: "Nova Grid AI", type: "Grid + AI", markets: "Crypto", winRate: 75, roi: 54, risk: "Medium", price: 299, rating: 4.7, users: 640 },
  { name: "Vanguard Hedge", type: "Hedging", markets: "Indices", winRate: 69, roi: 22, risk: "Low", price: 179, rating: 4.5, users: 512 },
  { name: "Titan Reversal", type: "Mean Reversion", markets: "FX + Metals", winRate: 74, roi: 38, risk: "Medium", price: 219, rating: 4.7, users: 890 },
];

const steps = [
  { title: "Strategy", desc: "Choose your trading style" },
  { title: "Market", desc: "Pick pairs & timeframes" },
  { title: "Risk", desc: "Position sizing & limits" },
  { title: "Entry", desc: "Signal & confirmation rules" },
  { title: "Exit", desc: "TP, SL, trailing logic" },
  { title: "Backtest", desc: "Validate on 3-year data" },
  { title: "Deploy", desc: "Review & launch" },
];

function BotsPage() {
  const [wizard, setWizard] = useState(false);
  const [step, setStep] = useState(0);
  const [selectedBot, setSelectedBot] = useState<(typeof activeBots)[number] | null>(null);

  const totalProfit = activeBots.reduce((a, b) => a + b.profit, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Bots Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Deploy, monitor and optimize your automated trading systems.</p>
        </div>
        <button onClick={() => { setWizard(true); setStep(0); }} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium shadow-glow inline-flex items-center gap-2">
          <Plus size={15} /> Create New Bot
        </button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Active Bots" value={activeBots.filter(b => b.status === "Running").length} delta="+1 this week" icon={<Bot size={14} />} />
        <StatCard label="Total Bot Profit" value={totalProfit} prefix="$" decimals={2} delta="+18% this month" icon={<DollarSign size={14} />} />
        <StatCard label="Avg Win Rate" value={77} suffix="%" delta="+2%" icon={<Target size={14} />} />
        <StatCard label="Uptime" value={99.8} suffix="%" decimals={1} delta="30-day avg" icon={<Cpu size={14} />} />
      </div>

      {/* Active bots */}
      <div>
        <SectionTitle title="Your Active Bots" subtitle="Real-time status of every deployed strategy" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeBots.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-5 hover-lift">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Bot size={18} /></div>
                    <div>
                      <div className="text-sm font-semibold">{b.name}</div>
                      <div className="text-[10px] text-muted-foreground">{b.pair} · {b.risk} Risk</div>
                    </div>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="rounded-lg bg-white/[0.03] py-2">
                    <div className="text-[9px] text-muted-foreground uppercase">Profit</div>
                    <div className="text-sm font-semibold text-emerald-400">+${b.profit.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] py-2">
                    <div className="text-[9px] text-muted-foreground uppercase">Win Rate</div>
                    <div className="text-sm font-semibold">{b.winRate}%</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] py-2">
                    <div className="text-[9px] text-muted-foreground uppercase">Uptime</div>
                    <div className="text-sm font-semibold">{b.uptime}</div>
                  </div>
                </div>
                <div className="h-16 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performance.weekly}>
                      <defs>
                        <linearGradient id={`b${i}`} x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill={`url(#b${i})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setSelectedBot(b)} className="flex-1 px-3 py-2 rounded-lg glass hover:bg-white/10 text-xs font-medium">Dashboard</button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground">
                    {b.status === "Running" ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button className="p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground"><Settings size={13} /></button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Aggregate Performance" subtitle="All bots combined · 30 days" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance.monthly}>
                <defs>
                  <linearGradient id="botPerf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="i" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill="url(#botPerf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionTitle title="Win vs Loss by Bot" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeBots.map(b => ({ name: b.name.split(" ")[0], wins: b.winRate, losses: 100 - b.winRate }))}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="wins" stackId="a" fill="oklch(0.78 0.21 55)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="losses" stackId="a" fill="oklch(0.62 0.22 25 / 0.5)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Marketplace */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">Bot Marketplace</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Battle-tested strategies from LEGIONFX quant desk</p>
          </div>
          <div className="relative w-64 max-w-full">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search strategies..." className={`${inputCls} pl-9 text-xs`} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketplace.map((m) => (
            <GlassCard key={m.name} className="p-5 hover-lift">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl glass grid place-items-center text-brand"><Zap size={16} /></div>
                  <div>
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-[10px] text-muted-foreground">{m.type} · {m.markets}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-400"><Star size={11} className="fill-current" /> {m.rating}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[["Win Rate", `${m.winRate}%`], ["Annual ROI", `${m.roi}%`], ["Risk", m.risk]].map(([k, v]) => (
                  <div key={k} className="rounded-lg bg-white/[0.03] px-2 py-1.5 text-center">
                    <div className="text-[9px] uppercase text-muted-foreground">{k}</div>
                    <div className="text-[11px] font-semibold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gradient">${m.price}<span className="text-[10px] text-muted-foreground font-normal">/mo</span></div>
                  <div className="text-[10px] text-muted-foreground">{m.users.toLocaleString()} active users</div>
                </div>
                <button className="px-3 py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Deploy</button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Bot detail modal */}
      <Modal open={!!selectedBot} onClose={() => setSelectedBot(null)} title={selectedBot?.name ?? ""} size="lg">
        {selectedBot && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[["Profit", `+$${selectedBot.profit}`, "text-emerald-400"], ["Win Rate", `${selectedBot.winRate}%`, ""], ["Uptime", selectedBot.uptime, ""]].map(([k, v, c]) => (
                <div key={k} className="rounded-xl bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] uppercase text-muted-foreground">{k}</div>
                  <div className={`text-base font-semibold mt-1 ${c}`}>{v}</div>
                </div>
              ))}
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance.monthly}>
                  <defs>
                    <linearGradient id="mdet" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area dataKey="v" stroke="oklch(0.78 0.21 55)" fill="url(#mdet)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Trading Pair</div><div className="font-semibold mt-1">{selectedBot.pair}</div></div>
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Risk Level</div><div className="font-semibold mt-1">{selectedBot.risk}</div></div>
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Total Trades</div><div className="font-semibold mt-1">184</div></div>
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Max Drawdown</div><div className="font-semibold mt-1 text-rose-400">-3.2%</div></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Edit Settings</button>
              <button className="flex-1 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{selectedBot.status === "Running" ? "Pause" : "Resume"} Bot</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Wizard */}
      <Modal open={wizard} onClose={() => setWizard(false)} title="Create New Trading Bot" size="lg">
        <div className="space-y-5">
          {/* Progress */}
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-[10px] font-semibold shrink-0 transition ${i <= step ? "brand-gradient text-brand-foreground" : "glass text-muted-foreground"}`}>
                  {i < step ? <Check size={12} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 ${i < step ? "bg-brand" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs text-brand uppercase tracking-wider">Step {step + 1} of {steps.length}</div>
            <div className="text-lg font-semibold mt-1">{steps[step].title}</div>
            <div className="text-xs text-muted-foreground">{steps[step].desc}</div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="min-h-[200px]">
              {step === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {[["Trend Following", TrendingUp], ["Scalping", Zap], ["Mean Reversion", Activity], ["Breakout", Target], ["Grid + AI", Cpu], ["Hedging", Shield]].map(([n, I]) => {
                    const Ico = I as typeof TrendingUp;
                    return (
                      <button key={n as string} className="rounded-xl glass hover:bg-white/10 p-4 text-left"><div className="text-brand"><Ico size={18} /></div><div className="text-sm font-semibold mt-2">{n as string}</div><div className="text-[10px] text-muted-foreground">Popular</div></button>
                    );
                  })}
                </div>
              )}
              {step === 1 && (
                <div className="grid gap-3">
                  <Field label="Trading Pair"><select className={inputCls}><option>XAU/USD</option><option>EUR/USD</option><option>GBP/JPY</option><option>BTC/USD</option></select></Field>
                  <Field label="Timeframe"><div className="flex gap-2 flex-wrap">{["1m","5m","15m","1h","4h","1D"].map(t => <button key={t} className="px-3 py-1.5 rounded-lg glass hover:bg-brand/20 text-xs">{t}</button>)}</div></Field>
                  <Field label="Session"><select className={inputCls}><option>All Sessions</option><option>London</option><option>New York</option></select></Field>
                </div>
              )}
              {step === 2 && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Risk per Trade"><input className={inputCls} defaultValue="1.0" /></Field>
                  <Field label="Max Daily Loss"><input className={inputCls} defaultValue="3.0" /></Field>
                  <Field label="Max Positions"><input className={inputCls} defaultValue="3" /></Field>
                  <Field label="Leverage"><input className={inputCls} defaultValue="10x" /></Field>
                </div>
              )}
              {step === 3 && <div className="grid gap-3"><Field label="Entry Signal"><select className={inputCls}><option>EMA 20/50 Crossover</option><option>RSI Divergence</option><option>SMC Order Block</option></select></Field><Field label="Confirmation"><input className={inputCls} defaultValue="Volume spike + candle close" /></Field></div>}
              {step === 4 && <div className="grid grid-cols-3 gap-3"><Field label="Take Profit"><input className={inputCls} defaultValue="2R" /></Field><Field label="Stop Loss"><input className={inputCls} defaultValue="1R" /></Field><Field label="Trailing"><select className={inputCls}><option>ATR</option><option>Fixed</option><option>None</option></select></Field></div>}
              {step === 5 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {[["Trades", "482"], ["Win Rate", "76.8%"], ["Profit Factor", "2.14"], ["Max DD", "-4.2%"], ["Sharpe", "1.68"], ["3yr ROI", "+128%"]].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-white/[0.03] p-3 text-center"><div className="text-[10px] text-muted-foreground uppercase">{k}</div><div className="text-sm font-semibold mt-1">{v}</div></div>
                    ))}
                  </div>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performance.yearly}>
                        <defs><linearGradient id="wz" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.5} /><stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} /></linearGradient></defs>
                        <Area dataKey="v" stroke="oklch(0.78 0.21 55)" fill="url(#wz)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              {step === 6 && (
                <div className="glass-strong rounded-2xl p-5 text-center">
                  <div className="h-14 w-14 mx-auto rounded-2xl brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Sparkles size={20} /></div>
                  <div className="mt-3 text-base font-semibold">Ready to deploy</div>
                  <div className="text-xs text-muted-foreground mt-1">Your bot will run 24/7 on the LEGIONFX cloud infrastructure with 99.99% uptime.</div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2 disabled:opacity-40"><ChevronLeft size={14} /> Back</button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2">Next <ChevronRight size={14} /></button>
            ) : (
              <button onClick={() => setWizard(false)} className="px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Play size={14} /> Deploy Bot</button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
