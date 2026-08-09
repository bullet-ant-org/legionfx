import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, Users, ArrowDownToLine, ArrowUpFromLine, Bell, CreditCard,
  Tags, Settings, User2, ChevronsLeft, ChevronsRight, LogOut, X, ShieldCheck,
  Bot, GraduationCap, Trophy, LineChart, LifeBuoy, FileText, Coins,
} from "lucide-react";
import { signOut } from "@/lib/auth";
import { Modal } from "@/components/dashboard/primitives";
import { adminMetrics } from "@/lib/admin-data";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, desc: "Platform metrics" },
  { to: "/admin/users", label: "Users", icon: Users, desc: "Manage accounts" },
  { to: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine, desc: "Approve inflows" },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine, desc: "Approve outflows" },
  { to: "/admin/notify", label: "Notify", icon: Bell, desc: "Broadcast messages" },
  { to: "/admin/deposit-methods", label: "Deposit Methods", icon: Coins, desc: "Currencies & wallets" },
  { to: "/admin/payments", label: "Payment Options", icon: CreditCard, desc: "Wallets & rails" },
  { to: "/admin/pricing", label: "Pricing Plans", icon: Tags, desc: "Subscriptions & tiers" },
  { to: "/admin/bots", label: "Bots", icon: Bot, desc: "Marketplace ops" },
  { to: "/admin/academy", label: "Academy", icon: GraduationCap, desc: "Courses & mentors" },
  { to: "/admin/prop-firm", label: "Prop Firm", icon: Trophy, desc: "Challenges" },
  { to: "/admin/signals", label: "Signals", icon: LineChart, desc: "Publish & track" },
  { to: "/admin/support", label: "Support", icon: LifeBuoy, desc: "Tickets & SLAs" },
  { to: "/admin/audit", label: "Audit Log", icon: FileText, desc: "Admin activity" },
  { to: "/admin/settings", label: "Settings", icon: Settings, desc: "Platform config" },
  { to: "/admin/profile", label: "Profile", icon: User2, desc: "Admin identity" },
];

export function AdminSidebar({
  collapsed, setCollapsed, mobileOpen, setMobileOpen,
}: {
  collapsed: boolean; setCollapsed: (v: boolean) => void;
  mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [logoutOpen, setLogoutOpen] = useState(false);

  const inner = (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground shadow-glow shrink-0">L</div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-display font-bold tracking-tight text-lg truncate leading-none">LEGION<span className="text-brand">FX</span></div>
            <div className="mt-1 inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-brand"><ShieldCheck size={10}/> Admin Console</div>
          </div>
        )}
        <button onClick={() => setMobileOpen(false)} data-no-toast className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/5" aria-label="Close menu"><X size={18}/></button>
      </div>

      {!collapsed && (
        <div className="px-3 mb-2">
          <div className="glass rounded-2xl p-3 grid grid-cols-2 gap-2 text-[11px]">
            <MiniStat label="Users" value={adminMetrics.totalUsers.toLocaleString()} />
            <MiniStat label="Revenue" value={`$${(adminMetrics.revenue/1000).toFixed(0)}K`} accent />
            <MiniStat label="Pending WD" value={`$${(adminMetrics.pendingWithdrawals/1000).toFixed(1)}K`} />
            <MiniStat label="Tickets" value={`${adminMetrics.openTickets}`} accent />
          </div>
        </div>
      )}

      <nav className="mt-2 px-3 flex-1 overflow-y-auto space-y-1 pr-2">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                active ? "bg-brand/15 text-foreground border border-brand/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon size={18} className={active ? "text-brand" : ""} />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{item.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{item.desc}</div>
                </div>
              )}
              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg glass-strong text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button onClick={() => setLogoutOpen(true)} data-no-toast className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-400/10 transition ${collapsed ? "justify-center" : ""}`}>
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button onClick={() => setCollapsed(!collapsed)} data-no-toast aria-label={collapsed ? "Expand" : "Collapse"} className={`hidden lg:flex w-full mt-2 items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition ${collapsed ? "justify-center" : ""}`}>
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>
      </div>

      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log out of Admin Console?">
        <p className="text-sm text-muted-foreground">You'll need to sign in again with admin credentials.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => setLogoutOpen(false)} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button onClick={() => { signOut(); window.location.href = "/login"; }} className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium">Log out</button>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      <aside className={`hidden lg:flex fixed top-0 left-0 h-screen z-40 glass-strong border-r border-white/5 transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[280px]"}`}>{inner}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed top-0 left-0 h-screen w-[280px] z-50 glass-strong border-r border-white/5 lg:hidden">{inner}</motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xs font-medium mt-0.5 truncate ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}
