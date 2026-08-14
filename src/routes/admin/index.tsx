import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, ArrowDownToLine, ArrowUpFromLine, DollarSign, ShieldCheck, Bell, Bot, GraduationCap, Trophy, LineChart, LifeBuoy, TrendingUp } from "lucide-react";
import { StatCard, GlassCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminMetrics, type AdminTransaction, type AdminAuditLog } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminOverview,
});

function AdminOverview() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [pendingDep, setPendingDep] = useState<AdminTransaction[]>([]);
  const [pendingWD, setPendingWD] = useState<AdminTransaction[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [ticketCount, setTicketCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminApi.getMetrics(),
      adminApi.listDeposits("Pending"),
      adminApi.listWithdrawals("Pending"),
      adminApi.listAuditLog(),
      adminApi.listTickets(),
    ]).then(([m, d, w, a, t]) => {
      if (m.status === "fulfilled") setMetrics(m.value);
      else toast.error(m.reason instanceof ApiError ? m.reason.message : "Could not load metrics");
      if (d.status === "fulfilled") setPendingDep(d.value.deposits);
      if (w.status === "fulfilled") setPendingWD(w.value.withdrawals);
      if (a.status === "fulfilled") setLogs(a.value.logs);
      if (t.status === "fulfilled") setTicketCount(t.value.tickets.length);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand inline-flex items-center gap-1"><ShieldCheck size={12}/> Admin Console</div>
            <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">Platform Overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Everything on LEGIONFX at a glance — approve, publish, and steer the ecosystem.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/deposits" className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium shadow-glow hover:opacity-90">Review Deposits</Link>
            <Link to="/admin/withdrawals" className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Approve Withdrawals</Link>
            <Link to="/admin/notify" className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Broadcast</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 rounded-2xl glass animate-pulse" />)
        ) : (
          <>
            <StatCard label="Total Users" value={metrics?.totalUsers ?? 0} icon={<Users size={16}/>} />
            <StatCard label="Active Users" value={metrics?.activeUsers ?? 0} icon={<TrendingUp size={16}/>} />
            <StatCard label="Verified Users" value={metrics?.verifiedUsers ?? 0} icon={<ShieldCheck size={16}/>} />
            <StatCard label="Open Tickets" value={metrics?.openTickets ?? 0} icon={<LifeBuoy size={16}/>} trend="down" />
            <StatCard label="Deposits" value={metrics?.totalDeposits ?? 0} prefix="$" icon={<ArrowDownToLine size={16}/>} />
            <StatCard label="Withdrawals" value={metrics?.totalWithdrawals ?? 0} prefix="$" icon={<ArrowUpFromLine size={16}/>} />
            <StatCard label="Pending Deposits" value={metrics?.pendingDeposits ?? 0} prefix="$" icon={<ArrowDownToLine size={16}/>} trend="down" />
            <StatCard label="Active Bots" value={metrics?.activeBots ?? 0} icon={<Bot size={16}/>} />
          </>
        )}
      </div>

      {/* Queues */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Pending Deposits" subtitle={`${pendingDep.length} awaiting`} action={<Link to="/admin/deposits" className="text-xs text-brand hover:underline">All →</Link>}/>
          {pendingDep.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-6">Nothing pending.</div>
          ) : (
            <ul className="space-y-2">
              {pendingDep.slice(0,5).map(d => (
                <li key={d._id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5">
                  <div className="min-w-0"><div className="truncate font-medium">{d.user?.name ?? "Unknown"}</div><div className="text-[10px] text-muted-foreground">{d.method} · {new Date(d.createdAt).toLocaleDateString()}</div></div>
                  <div className="text-right"><div className="font-semibold">${d.amount.toLocaleString()}</div><StatusPill status={d.status}/></div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Pending Withdrawals" subtitle={`${pendingWD.length} awaiting`} action={<Link to="/admin/withdrawals" className="text-xs text-brand hover:underline">All →</Link>}/>
          {pendingWD.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-6">Nothing pending.</div>
          ) : (
            <ul className="space-y-2">
              {pendingWD.slice(0,5).map(d => (
                <li key={d._id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5">
                  <div className="min-w-0"><div className="truncate font-medium">{d.user?.name ?? "Unknown"}</div><div className="text-[10px] text-muted-foreground">{d.method} · {new Date(d.createdAt).toLocaleDateString()}</div></div>
                  <div className="text-right"><div className="font-semibold">${Math.abs(d.amount).toLocaleString()}</div><StatusPill status={d.status}/></div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Recent Admin Activity" subtitle="Audit log" action={<Link to="/admin/audit" className="text-xs text-brand hover:underline">All →</Link>}/>
          {logs.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-6">No activity yet.</div>
          ) : (
            <ul className="space-y-2">
              {logs.slice(0,5).map((a) => (
                <li key={a._id} className="text-sm p-2 rounded-lg hover:bg-white/5">
                  <div className="truncate">{a.action}</div>
                  <div className="text-[10px] text-muted-foreground">{a.actor?.name ?? "System"} · {new Date(a.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      {/* Bottom shortcuts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ShortcutCard to="/admin/bots" icon={Bot} title="Trading Bots" desc="Manage marketplace, versions & risk" count={metrics?.activeBots ?? 0}/>
        <ShortcutCard to="/admin/academy" icon={GraduationCap} title="Academy" desc="Courses, mentors & enrollments" count={0}/>
        <ShortcutCard to="/admin/prop-firm" icon={Trophy} title="Prop Firm" desc="Challenges, sizes & fees" count={metrics?.activeChallenges ?? 0}/>
        <ShortcutCard to="/admin/signals" icon={LineChart} title="Signals" desc="Publish, track hits, revoke" count={0}/>
        <ShortcutCard to="/admin/notify" icon={Bell} title="Notify" desc="Broadcast in-app / email / push" count={0}/>
        <ShortcutCard to="/admin/payments" icon={ArrowDownToLine} title="Payments" desc="Enable rails, wallets & fees" count={0}/>
        <ShortcutCard to="/admin/pricing" icon={DollarSign} title="Pricing" desc="Plans, prices & features" count={0}/>
        <ShortcutCard to="/admin/support" icon={LifeBuoy} title="Support" desc="Tickets & SLA management" count={ticketCount}/>
      </div>
    </div>
  );
}

function ShortcutCard({ to, icon: Icon, title, desc, count }: { to: string; icon: any; title: string; desc: string; count: number }) {
  return (
    <Link to={to} className="glass rounded-2xl p-4 hover-lift flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center text-brand-foreground shrink-0"><Icon size={18}/></div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold truncate">{title}</div>
        <div className="text-[10px] text-muted-foreground truncate">{desc}</div>
      </div>
      <div className="text-xs text-brand font-semibold">{count}</div>
    </Link>
  );
}
