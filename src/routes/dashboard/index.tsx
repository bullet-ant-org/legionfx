import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Wallet as WalletIcon, TrendingUp, ArrowDownToLine, ArrowUpFromLine, Bot, Target,
  GraduationCap, LineChart as LineIcon, Activity, Copy, ChevronRight, Trophy,
  Sparkles, Calendar as CalIcon, MessageSquare, Award, Users, Pause, Settings,
} from "lucide-react";
import { StatCard, GlassCard, SectionTitle, Counter, StatusPill } from "@/components/dashboard/primitives";
import { useDashboardData } from "@/lib/dashboard-data";
import {
  performance, academy, calendar, market, achievements,
} from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/")({
  ssr: false,
  component: OverviewPage,
});

type Range = "Daily" | "Weekly" | "Monthly" | "Yearly";

function OverviewPage() {
  const [range, setRange] = useState<Range>("Monthly");
  const { loading, error, session, wallet, bots, challenges, enrollments, signals, transactions, conversations, referral } = useDashboardData();

  const data = useMemo(() => {
    const map = { Daily: performance.daily, Weekly: performance.weekly, Monthly: performance.monthly, Yearly: performance.yearly };
    return map[range];
  }, [range]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  }, []);

  const firstName = (session?.name || "Trader").split(" ")[0];
  const plan = session?.user?.plan || "Starter";
  const lastLogin = session?.user?.lastLogin ? new Date(session.user.lastLogin as string).toLocaleString(undefined, { hour: "numeric", minute: "2-digit" }) : "—";

  const runningBots = bots.filter((b) => b.status === "Running").length;
  const totalBotProfit = bots.reduce((a, b) => a + (b.profit || 0), 0);
  const primaryChallenge = challenges[0] ?? null;
  const primaryEnrollment = enrollments[0] ?? null;

  const quickStats = [
    { label: "Wallet Balance", value: wallet?.available ?? 0, prefix: "$", delta: undefined, trend: "up" as const },
    { label: "Total Deposits", value: wallet?.totalDeposits ?? 0, prefix: "$", delta: undefined, trend: "up" as const },
    { label: "Total Profit", value: wallet?.totalProfit ?? 0, prefix: "$", delta: undefined, trend: (wallet?.totalProfit ?? 0) >= 0 ? "up" as const : "down" as const },
    { label: "Active Bots", value: runningBots, prefix: "", delta: undefined, trend: "up" as const },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs text-rose-300">
          {error}
        </div>
      )}
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-40 w-72 rounded-full bg-triad-violet/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">{greeting},</div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mt-1">
              {firstName} <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">Welcome back to LEGIONFX. Here's a snapshot of your trading universe today.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs">
            <Pill label="Plan" value={plan} />
            <Pill label="Bots" value={`${runningBots} Running`} />
            <Pill label="Last login" value={lastLogin} />
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-2xl glass animate-pulse" />)
        ) : (
          quickStats.map((s, i) => (
            <StatCard key={i} label={s.label} value={s.value} prefix={s.prefix} trend={s.trend} />
          ))
        )}
      </div>

      {/* Portfolio performance + Wallet summary */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold">Portfolio Performance</div>
              <div className="text-xs text-muted-foreground">Equity curve across deposits, withdrawals & bot profit</div>
            </div>
            <div className="flex gap-1 p-1 glass rounded-xl">
              {(["Daily", "Weekly", "Monthly", "Yearly"] as Range[]).map((t) => (
                <button key={t} onClick={() => setRange(t)} className={`px-3 py-1.5 text-xs rounded-lg transition ${range === t ? "brand-gradient text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="eq" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="i" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill="url(#eq)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Wallet Summary" />
          <div className="space-y-3">
            <WalletRow icon={<WalletIcon size={14} />} label="Available" value={wallet?.available ?? 0} />
            <WalletRow icon={<ArrowUpFromLine size={14} />} label="Pending Withdrawals" value={wallet?.pendingWithdrawals ?? 0} />
            <WalletRow icon={<ArrowDownToLine size={14} />} label="Total Deposits" value={wallet?.totalDeposits ?? 0} />
            <WalletRow icon={<Sparkles size={14} />} label="Bonus" value={wallet?.bonusBalance ?? 0} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Link to="/dashboard/wallet" className="py-2 text-xs text-center rounded-xl brand-gradient text-brand-foreground font-medium">Deposit</Link>
            <Link to="/dashboard/wallet" className="py-2 text-xs text-center rounded-xl glass hover:bg-white/10">Withdraw</Link>
            <Link to="/dashboard/wallet" className="py-2 text-xs text-center rounded-xl glass hover:bg-white/10">Transfer</Link>
          </div>
        </GlassCard>
      </div>

      {/* Active bots + Prop Firm */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <SectionTitle
            title="Active Trading Bots"
            subtitle="Real-time performance from your automation"
            action={<Link to="/dashboard/bots" className="text-xs text-brand hover:underline inline-flex items-center gap-1">View all <ChevronRight size={12} /></Link>}
          />
          {bots.length === 0 ? (
            <EmptyState icon={Bot} text="No bots activated yet." cta={{ to: "/dashboard/bots", label: "Browse bots" }} />
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {bots.map((b) => (
                <div key={b._id} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 hover-lift">
                  <div className="flex items-start justify-between">
                    <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><Bot size={16} /></div>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="mt-3 text-sm font-semibold">{b.bot?.name ?? "Bot"}</div>
                  <div className="text-[11px] text-muted-foreground">{b.bot?.pair ?? "—"} · {b.bot?.risk ?? "—"} risk</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="text-lg font-bold text-emerald-400">+${(b.profit ?? 0).toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">· {b.winRate ?? 0}% WR</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">Uptime {uptimeSince(b.startedAt)}</div>
                  <div className="mt-3 flex gap-1.5">
                    <button className="flex-1 py-1.5 text-[10px] rounded-lg glass hover:bg-white/10 flex items-center justify-center gap-1"><Pause size={10} /> Pause</button>
                    <button className="flex-1 py-1.5 text-[10px] rounded-lg glass hover:bg-white/10 flex items-center justify-center gap-1"><Settings size={10} /> Edit</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-brand/15 blur-3xl" />
          {primaryChallenge ? (
            <>
              <SectionTitle title="Prop Firm Challenge" subtitle={`$${(primaryChallenge.size / 1000)}K · ${primaryChallenge.phase}`} />
              <div className="relative">
                <div className="flex items-baseline gap-2">
                  <Counter to={primaryChallenge.completion} suffix="%" />
                  <div className="text-xs text-muted-foreground">to passing</div>
                </div>
                <div className="mt-3 h-2.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${primaryChallenge.completion}%` }} transition={{ duration: 1 }} className="h-full brand-gradient rounded-full" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <Mini label="Equity" value={`$${primaryChallenge.currentEquity.toLocaleString()}`} />
                  <Mini label="Target" value={`$${primaryChallenge.profitTarget.toLocaleString()}`} />
                  <Mini label="Daily DD" value={`${primaryChallenge.dailyDrawdown}%`} />
                  <Mini label="Max DD" value={`${primaryChallenge.maxDrawdown}%`} />
                  <Mini label="Status" value={primaryChallenge.status} />
                  <Mini label="Phase" value={primaryChallenge.phase} />
                </div>
                <Link to="/dashboard/prop-firm" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">
                  <Trophy size={14} /> Continue Challenge
                </Link>
              </div>
            </>
          ) : (
            <>
              <SectionTitle title="Prop Firm Challenge" />
              <EmptyState icon={Trophy} text="No active challenge." cta={{ to: "/dashboard/prop-firm", label: "Browse plans" }} />
            </>
          )}
        </GlassCard>
      </div>

      {/* Academy + Signals */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          {primaryEnrollment ? (
            <>
              <SectionTitle title="Academy Progress" subtitle={primaryEnrollment.course?.title ?? "Course"} />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold"><Counter to={primaryEnrollment.completion} suffix="%" /></span>
                <span className="text-xs text-muted-foreground">completion</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full brand-gradient rounded-full" style={{ width: `${primaryEnrollment.completion}%` }} />
              </div>
              <Link to="/dashboard/academy" className="mt-4 inline-flex items-center gap-2 text-xs text-brand hover:underline">Continue learning <ChevronRight size={12} /></Link>
            </>
          ) : (
            <>
              <SectionTitle title="Academy Progress" />
              <EmptyState icon={GraduationCap} text="Not enrolled in any course yet." cta={{ to: "/dashboard/academy", label: "Browse courses" }} />
            </>
          )}
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <SectionTitle
            title="Latest Trading Signals"
            subtitle="High-confidence calls from our analyst desk"
            action={<Link to="/dashboard/signals" className="text-xs text-brand hover:underline">View feed</Link>}
          />
          {signals.length === 0 ? (
            <EmptyState icon={LineIcon} text="No signals published yet." />
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {signals.slice(0, 4).map((s) => (
                <div key={s._id} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{s.pair}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded ${s.direction === "BUY" ? "bg-emerald-400/15 text-emerald-400" : "bg-rose-400/15 text-rose-400"}`}>{s.direction}</span>
                    </div>
                    <StatusPill status={s.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    <div><div className="text-muted-foreground">Entry</div><div className="font-medium text-sm">{s.entry}</div></div>
                    <div><div className="text-muted-foreground">SL</div><div className="font-medium text-sm text-rose-400">{s.sl}</div></div>
                    <div><div className="text-muted-foreground">TP</div><div className="font-medium text-sm text-emerald-400">{s.tp}</div></div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-[10px] text-muted-foreground">Confidence <span className="text-brand font-medium">{s.confidence}%</span></div>
                    <button className="text-[10px] px-3 py-1.5 rounded-lg glass hover:bg-white/10 inline-flex items-center gap-1"><Copy size={10} /> Copy</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      {/* Transactions + Calendar */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <SectionTitle
            title="Recent Transactions"
            action={<button className="text-xs text-brand hover:underline">Download statement</button>}
          />
          {transactions.length === 0 ? (
            <EmptyState icon={WalletIcon} text="No transactions yet." cta={{ to: "/dashboard/wallet", label: "Make a deposit" }} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr className="border-b border-white/5">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Type</th>
                    <th className="text-left py-2 font-medium">Reference</th>
                    <th className="text-right py-2 font-medium">Amount</th>
                    <th className="text-right py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 6).map((t) => (
                    <tr key={t._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                      <td className="py-2.5 text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="py-2.5">{t.type}</td>
                      <td className="py-2.5 text-muted-foreground">{t.ref}</td>
                      <td className={`py-2.5 text-right font-medium ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>{t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}</td>
                      <td className="py-2.5 text-right"><StatusPill status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Calendar" subtitle="Upcoming events" />
          <div className="space-y-3">
            {calendar.map((c) => (
              <div key={c.title} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div className="h-10 w-12 rounded-lg brand-gradient grid place-items-center text-brand-foreground text-[10px] font-semibold leading-tight text-center">
                  {c.date.split(" ").map((s, i) => <div key={i}>{s}</div>)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{c.title}</div>
                  <div className="text-[10px] text-muted-foreground">{c.type}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Market overview */}
      <div>
        <SectionTitle title="Market Overview" subtitle="Live snapshot across majors & crypto" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {market.map((m) => (
            <div key={m.symbol} className="glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">{m.symbol}</div>
                <Activity size={12} className="text-brand" />
              </div>
              <div className="text-[10px] text-muted-foreground">{m.name}</div>
              <div className="mt-2 text-base font-bold">{m.price.toLocaleString()}</div>
              <div className={`text-[10px] mt-0.5 ${m.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{m.change >= 0 ? "+" : ""}{m.change}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages + Achievements + Referral */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Recent Messages" action={<Link to="/dashboard/messages" className="text-xs text-brand hover:underline">View all</Link>} />
          {conversations.length === 0 ? (
            <EmptyState icon={MessageSquare} text="No conversations yet." cta={{ to: "/dashboard/messages", label: "Start a conversation" }} />
          ) : (
            <div className="space-y-3">
              {conversations.slice(0, 5).map((c) => {
                const other = c.participants.find((p) => p._id !== session?.user?._id) ?? c.participants[0];
                const label = other?.name ?? "Support";
                return (
                  <Link key={c._id} to="/dashboard/messages" className="flex items-start gap-3 rounded-xl hover:bg-white/[0.03] p-2 -mx-2 -my-0 cursor-pointer">
                    <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center text-brand-foreground text-xs font-semibold shrink-0">{label[0]?.toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-medium truncate">{label}</div>
                        <div className="text-[10px] text-muted-foreground shrink-0">{timeAgo(c.lastMessage?.createdAt ?? c.lastMessageAt)}</div>
                      </div>
                      <div className="text-[11px] text-muted-foreground truncate">{c.lastMessage?.body ?? "No messages yet"}</div>
                    </div>
                    {c.unreadCount > 0 && <span className="h-2 w-2 rounded-full bg-brand mt-2 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Achievements" subtitle="Milestones you've unlocked" />
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div key={a.label} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center text-center p-2 transition hover:scale-105 ${a.earned ? "border-brand/30 bg-brand/10" : "border-white/5 bg-white/[0.02] opacity-50"}`}>
                <Award size={22} className={a.earned ? "text-brand" : "text-muted-foreground"} />
                <div className="text-[9px] mt-2 leading-tight">{a.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-triad-violet/20 blur-3xl" />
          <SectionTitle title="Referral Program" subtitle="Earn 20% lifetime commission" />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="text-[10px] text-muted-foreground">Total Referrals</div>
              <div className="text-lg font-bold mt-0.5"><Counter to={referral?.total ?? 0} /></div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="text-[10px] text-muted-foreground">Earnings</div>
              <div className="text-lg font-bold mt-0.5 text-emerald-400">$<Counter to={referral?.earnings ?? wallet?.referralEarnings ?? 0} decimals={2} /></div>
            </div>
          </div>
          {referral?.code ? (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2 pl-3">
              <Users size={14} className="text-brand shrink-0" />
              <div className="text-[10px] truncate flex-1">{referralLink(referral.code)}</div>
              <button onClick={() => navigator.clipboard?.writeText(referralLink(referral.code!))} className="px-2 py-1 rounded-lg brand-gradient text-brand-foreground text-[10px] font-medium shrink-0">Copy</button>
            </div>
          ) : (
            <div className="mt-4 text-[11px] text-muted-foreground">Your referral link will appear here once your account finishes setting up.</div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function referralLink(code: string) {
  if (typeof window === "undefined") return `https://legionfx.space/login?ref=${code}`;
  return `${window.location.origin}/login?ref=${code}`;
}

function uptimeSince(iso?: string) {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86400000);
  if (days >= 1) return `${days}d`;
  const hrs = Math.floor(diffMs / 3600000);
  if (hrs >= 1) return `${hrs}h`;
  return `${Math.max(1, Math.floor(diffMs / 60000))}m`;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function EmptyState({ icon: Icon, text, cta }: { icon: any; text: string; cta?: { to: string; label: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 py-10 flex flex-col items-center justify-center text-center gap-2">
      <Icon size={22} className="text-muted-foreground" />
      <div className="text-xs text-muted-foreground">{text}</div>
      {cta && <Link to={cta.to} className="mt-1 text-xs text-brand hover:underline">{cta.label}</Link>}
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl px-3 py-2 text-center">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 px-3 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-semibold mt-0.5">{value}</div>
    </div>
  );
}

function WalletRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-2 text-muted-foreground">{icon} {label}</div>
      <div className="font-semibold">${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
    </div>
  );
}
