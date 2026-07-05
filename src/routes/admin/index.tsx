import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, ArrowDownToLine, ArrowUpFromLine, DollarSign, ShieldCheck, Bell, Bot, GraduationCap, Trophy, LineChart, LifeBuoy, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { StatCard, GlassCard, SectionTitle, StatusPill } from "@/components/dashboard/primitives";
import { adminMetrics, growthSeries, revenueBySource, adminDeposits, adminWithdrawals, supportTickets, auditLog } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const pendingDep = adminDeposits.filter(d => d.status === "Pending" || d.status === "Under Review");
  const pendingWD = adminWithdrawals.filter(d => d.status === "Pending");

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
        <StatCard label="Total Users" value={adminMetrics.totalUsers} icon={<Users size={16}/>} delta="+184 this wk" />
        <StatCard label="Active Users" value={adminMetrics.activeUsers} icon={<TrendingUp size={16}/>} delta="+6.2%" />
        <StatCard label="Revenue (MTD)" value={adminMetrics.monthlyRevenue} prefix="$" icon={<DollarSign size={16}/>} delta="+18.4%" />
        <StatCard label="Total Revenue" value={adminMetrics.revenue} prefix="$" icon={<DollarSign size={16}/>} delta="All-time" />
        <StatCard label="Deposits" value={adminMetrics.totalDeposits} prefix="$" icon={<ArrowDownToLine size={16}/>} delta="+3.4% mo" />
        <StatCard label="Withdrawals" value={adminMetrics.totalWithdrawals} prefix="$" icon={<ArrowUpFromLine size={16}/>} delta="+2.1% mo" />
        <StatCard label="Open Tickets" value={adminMetrics.openTickets} icon={<LifeBuoy size={16}/>} delta="4 urgent" trend="down" />
        <StatCard label="Active Bots" value={adminMetrics.activeBots} icon={<Bot size={16}/>} delta="+12 wk" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Platform Growth" subtitle="30-day rolling — users, deposits, withdrawals" action={<Link to="/admin/users" className="text-xs text-brand hover:underline">View users →</Link>}/>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={growthSeries}>
                <defs>
                  <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.5}/><stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="oklch(0.72 0.14 190)" stopOpacity={0.5}/><stop offset="100%" stopColor="oklch(0.72 0.14 190)" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="i" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false}/>
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ background: "rgba(20,20,28,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}/>
                <Area type="monotone" dataKey="deposits" stroke="oklch(0.78 0.21 55)" fill="url(#ga)" strokeWidth={2}/>
                <Area type="monotone" dataKey="withdrawals" stroke="oklch(0.72 0.14 190)" fill="url(#gb)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Revenue by Source" subtitle="Last 30 days"/>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={revenueBySource} innerRadius={60} outerRadius={95} dataKey="value" nameKey="name" paddingAngle={2}>
                  {revenueBySource.map(s => <Cell key={s.name} fill={s.color}/>)}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 10 }}/>
                <Tooltip contentStyle={{ background: "rgba(20,20,28,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Queues */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Pending Deposits" subtitle={`${pendingDep.length} awaiting`} action={<Link to="/admin/deposits" className="text-xs text-brand hover:underline">All →</Link>}/>
          <ul className="space-y-2">
            {pendingDep.slice(0,5).map(d => (
              <li key={d.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5">
                <div className="min-w-0"><div className="truncate font-medium">{d.user}</div><div className="text-[10px] text-muted-foreground">{d.method} · {d.date}</div></div>
                <div className="text-right"><div className="font-semibold">${d.amount.toLocaleString()}</div><StatusPill status={d.status === "Under Review" ? "Pending" : d.status}/></div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Pending Withdrawals" subtitle={`${pendingWD.length} awaiting`} action={<Link to="/admin/withdrawals" className="text-xs text-brand hover:underline">All →</Link>}/>
          <ul className="space-y-2">
            {pendingWD.slice(0,5).map(d => (
              <li key={d.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-white/5">
                <div className="min-w-0"><div className="truncate font-medium">{d.user}</div><div className="text-[10px] text-muted-foreground">{d.method} · {d.date}</div></div>
                <div className="text-right"><div className="font-semibold">${d.amount.toLocaleString()}</div><StatusPill status={d.status}/></div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Recent Admin Activity" subtitle="Audit log" action={<Link to="/admin/audit" className="text-xs text-brand hover:underline">All →</Link>}/>
          <ul className="space-y-2">
            {auditLog.slice(0,5).map((a,i) => (
              <li key={i} className="text-sm p-2 rounded-lg hover:bg-white/5">
                <div className="truncate">{a.action}</div>
                <div className="text-[10px] text-muted-foreground">{a.actor} · {a.time}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Bottom shortcuts */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ShortcutCard to="/admin/bots" icon={Bot} title="Trading Bots" desc="Manage marketplace, versions & risk" count={adminMetrics.activeBots}/>
        <ShortcutCard to="/admin/academy" icon={GraduationCap} title="Academy" desc="Courses, mentors & enrollments" count={4}/>
        <ShortcutCard to="/admin/prop-firm" icon={Trophy} title="Prop Firm" desc="Challenges, sizes & fees" count={adminMetrics.activeChallenges}/>
        <ShortcutCard to="/admin/signals" icon={LineChart} title="Signals" desc="Publish, track hits, revoke" count={adminMetrics.signalsPushedToday}/>
        <ShortcutCard to="/admin/notify" icon={Bell} title="Notify" desc="Broadcast in-app / email / push" count={3}/>
        <ShortcutCard to="/admin/payments" icon={ArrowDownToLine} title="Payments" desc="Enable rails, wallets & fees" count={6}/>
        <ShortcutCard to="/admin/pricing" icon={DollarSign} title="Pricing" desc="Plans, prices & features" count={4}/>
        <ShortcutCard to="/admin/support" icon={LifeBuoy} title="Support" desc="Tickets & SLA management" count={supportTickets.length}/>
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
