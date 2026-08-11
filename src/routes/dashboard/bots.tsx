import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar,
} from "recharts";
import {
  Bot, Play, Pause, DollarSign, Cpu, Target, Search, Zap,
} from "lucide-react";
import {
  GlassCard, StatCard, SectionTitle, StatusPill, Modal,
} from "@/components/dashboard/primitives";
import { performance } from "@/lib/demo-data";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError, type ApiUserBot } from "@/lib/api";

export const Route = createFileRoute("/dashboard/bots")({
  ssr: false,
  component: BotsPage,
});

type CatalogBot = { _id: string; name: string; pair: string; risk: string; description: string };

function uptimeSince(iso?: string) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days >= 1) return `${days}d`;
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs >= 1) return `${hrs}h`;
  return `${Math.max(1, Math.floor(diffMs / 60000))}m`;
}

function BotsPage() {
  const { bots, loading, refresh } = useDashboardData();
  const [catalog, setCatalog] = useState<CatalogBot[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBot, setSelectedBot] = useState<ApiUserBot | null>(null);
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    api.getBotCatalog()
      .then((r) => setCatalog(r.bots))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load the bot marketplace"))
      .finally(() => setCatalogLoading(false));
  }, []);

  const totalProfit = bots.reduce((a, b) => a + (b.profit || 0), 0);
  const runningCount = bots.filter((b) => b.status === "Running").length;
  const avgWinRate = bots.length ? Math.round(bots.reduce((a, b) => a + (b.winRate || 0), 0) / bots.length) : 0;
  const activeBotIds = new Set(bots.map((b) => b.bot?._id).filter(Boolean));

  const filteredCatalog = useMemo(
    () => catalog.filter((m) => `${m.name} ${m.pair} ${m.risk}`.toLowerCase().includes(search.toLowerCase())),
    [catalog, search],
  );

  const deploy = async (botId: string) => {
    setDeployingId(botId);
    try {
      await api.activateBot(botId);
      toast.success("Bot deployed");
      refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not deploy this bot");
    } finally {
      setDeployingId(null);
    }
  };

  const toggleStatus = async (userBot: ApiUserBot) => {
    const next = userBot.status === "Running" ? "Paused" : "Running";
    setTogglingId(userBot._id);
    try {
      await api.setUserBotStatus(userBot._id, next);
      toast.success(`Bot ${next === "Running" ? "resumed" : "paused"}`);
      refresh();
      if (selectedBot?._id === userBot._id) setSelectedBot({ ...userBot, status: next });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update bot status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Trading Bots Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Deploy, monitor and control your automated trading systems.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl glass animate-pulse" />)
        ) : (
          <>
            <StatCard label="Active Bots" value={runningCount} delta={`${bots.length} total`} icon={<Bot size={14} />} />
            <StatCard label="Total Bot Profit" value={totalProfit} prefix="$" decimals={2} icon={<DollarSign size={14} />} />
            <StatCard label="Avg Win Rate" value={avgWinRate} suffix="%" icon={<Target size={14} />} />
            <StatCard label="Bots Deployed" value={bots.length} icon={<Cpu size={14} />} />
          </>
        )}
      </div>

      {/* Active bots */}
      <div>
        <SectionTitle title="Your Active Bots" subtitle="Real-time status of every deployed strategy" />
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : bots.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <Bot size={22} className="mx-auto text-brand" />
            <div className="mt-3 text-sm font-medium">No bots deployed yet</div>
            <div className="text-xs text-muted-foreground mt-1">Deploy a strategy from the marketplace below to get started.</div>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((b, i) => (
              <motion.div key={b._id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="p-5 hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Bot size={18} /></div>
                      <div>
                        <div className="text-sm font-semibold">{b.bot?.name ?? "Bot"}</div>
                        <div className="text-[10px] text-muted-foreground">{b.bot?.pair ?? "—"} · {b.bot?.risk ?? "—"} Risk</div>
                      </div>
                    </div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="rounded-lg bg-white/[0.03] py-2">
                      <div className="text-[9px] text-muted-foreground uppercase">Profit</div>
                      <div className="text-sm font-semibold text-emerald-400">+${(b.profit ?? 0).toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] py-2">
                      <div className="text-[9px] text-muted-foreground uppercase">Win Rate</div>
                      <div className="text-sm font-semibold">{b.winRate ?? 0}%</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] py-2">
                      <div className="text-[9px] text-muted-foreground uppercase">Uptime</div>
                      <div className="text-sm font-semibold">{uptimeSince(b.startedAt)}</div>
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
                    <button
                      onClick={() => toggleStatus(b)}
                      disabled={togglingId === b._id || b.status === "Stopped"}
                      className="p-2 rounded-lg glass hover:bg-white/10 text-muted-foreground disabled:opacity-40"
                      aria-label={b.status === "Running" ? "Pause bot" : "Resume bot"}
                    >
                      {b.status === "Running" ? <Pause size={13} /> : <Play size={13} />}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics */}
      {bots.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-4">
          <GlassCard className="p-5 lg:col-span-2">
            <SectionTitle title="Aggregate Performance" subtitle="Illustrative trend across your active bots" />
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
                <BarChart data={bots.map((b) => ({ name: (b.bot?.name ?? "Bot").split(" ")[0], wins: b.winRate ?? 0, losses: 100 - (b.winRate ?? 0) }))}>
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
      )}

      {/* Marketplace */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-4 flex-wrap">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">Bot Marketplace</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Battle-tested strategies from the LEGIONFX quant desk</p>
          </div>
          <div className="relative w-64 max-w-full">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search strategies..." className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/[0.03] border border-white/10 focus:border-brand/50 outline-none" />
          </div>
        </div>
        {catalogLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-56 rounded-2xl glass animate-pulse" />)}
          </div>
        ) : filteredCatalog.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <Zap size={22} className="mx-auto text-brand" />
            <div className="mt-3 text-sm font-medium">No strategies match your search</div>
          </GlassCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCatalog.map((m) => {
              const active = activeBotIds.has(m._id);
              return (
                <GlassCard key={m._id} className="p-5 hover-lift">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl glass grid place-items-center text-brand"><Zap size={16} /></div>
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-[10px] text-muted-foreground">{m.pair} · {m.risk} Risk</div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.description || "No description provided."}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{active ? "Already deployed" : "Free to deploy"}</span>
                    <button
                      onClick={() => deploy(m._id)}
                      disabled={active || deployingId === m._id}
                      className="px-3 py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium disabled:opacity-50"
                    >
                      {active ? "Deployed" : deployingId === m._id ? "Deploying…" : "Deploy"}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Bot detail modal */}
      <Modal open={!!selectedBot} onClose={() => setSelectedBot(null)} title={selectedBot?.bot?.name ?? ""} size="lg">
        {selectedBot && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[["Profit", `+$${(selectedBot.profit ?? 0).toLocaleString()}`, "text-emerald-400"], ["Win Rate", `${selectedBot.winRate ?? 0}%`, ""], ["Uptime", uptimeSince(selectedBot.startedAt), ""]].map(([k, v, c]) => (
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
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Trading Pair</div><div className="font-semibold mt-1">{selectedBot.bot?.pair ?? "—"}</div></div>
              <div className="rounded-xl bg-white/[0.03] p-3"><div className="text-muted-foreground">Risk Level</div><div className="font-semibold mt-1">{selectedBot.bot?.risk ?? "—"}</div></div>
              <div className="rounded-xl bg-white/[0.03] p-3 col-span-2"><div className="text-muted-foreground">Description</div><div className="font-medium mt-1">{selectedBot.bot?.description || "No description provided."}</div></div>
            </div>
            <button
              onClick={() => toggleStatus(selectedBot)}
              disabled={togglingId === selectedBot._id || selectedBot.status === "Stopped"}
              className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-50"
            >
              {togglingId === selectedBot._id ? "Updating…" : selectedBot.status === "Running" ? "Pause Bot" : "Resume Bot"}
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
