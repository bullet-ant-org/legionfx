import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Wallet, MessageSquare, Bot, GraduationCap, Trophy, LineChart,
  Settings, ShieldCheck, LifeBuoy, User2, ChevronDown, ChevronsLeft, ChevronsRight,
  LogOut, X,
} from "lucide-react";
import { user, wallet, propFirm, activeBots } from "@/lib/demo-data";
import { signOut } from "@/lib/auth";
import { Modal } from "./primitives";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, desc: "Account summary" },
  { to: "/dashboard/wallet", label: "Wallet", icon: Wallet, desc: "Deposits & withdrawals" },
  { to: "/dashboard/messages", label: "Messages", icon: MessageSquare, desc: "Conversations & alerts" },
  { to: "/dashboard/bots", label: "Trading Bots", icon: Bot, desc: "Automation & analytics" },
  { to: "/dashboard/academy", label: "Academy", icon: GraduationCap, desc: "Courses & mentorship" },
  { to: "/dashboard/prop-firm", label: "Prop Firm", icon: Trophy, desc: "Challenges & funding" },
  { to: "/dashboard/signals", label: "Signals", icon: LineChart, desc: "Live signal feed" },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, desc: "Preferences" },
  { to: "/dashboard/security", label: "Security", icon: ShieldCheck, desc: "2FA & devices" },
  { to: "/dashboard/support", label: "Support", icon: LifeBuoy, desc: "Tickets & help" },
  { to: "/dashboard/profile", label: "Profile", icon: User2, desc: "Personal info" },
];

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [accordion, setAccordion] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const inner = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
        <div className="h-9 w-9 rounded-xl brand-gradient grid place-items-center font-display font-bold text-brand-foreground shadow-glow shrink-0">L</div>
        {!collapsed && (
          <span className="font-display font-bold tracking-tight text-lg truncate">
            LEGION<span className="text-brand">FX</span>
          </span>
        )}
        <button
          onClick={() => setMobileOpen(false)}
          data-no-toast
          className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-white/5"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>

      </div>

      {/* User card / accordion */}
      <div className="px-3">
        <button
          onClick={() => setAccordion((a) => !a)}
          data-no-toast
          aria-expanded={accordion}
          className={`w-full glass rounded-2xl p-3 flex items-center gap-3 hover:bg-white/5 transition ${collapsed ? "justify-center" : ""}`}
        >
          <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center font-semibold text-brand-foreground shrink-0">
            {user.initials}
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 text-left flex-1">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
              </div>
              <ChevronDown size={14} className={`text-muted-foreground transition ${accordion ? "rotate-180" : ""}`} />
            </>
          )}
        </button>
        <AnimatePresence>
          {accordion && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <Stat label="Wallet" value={`$${wallet.available.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                <Stat label="Bots Active" value={`${activeBots.filter((b) => b.status === "Running").length} Running`} />
                <Stat label="Bot Profit" value={`+$${activeBots.reduce((a, b) => a + b.profit, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} accent />
                <Stat label="Prop Firm" value={`${propFirm.size / 1000}K · ${propFirm.phase}`} />
                <Stat label="Completion" value={`${propFirm.completion}%`} accent />
                <Stat label="Plan" value={`${user.plan} · ${user.status}`} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="mt-4 px-3 flex-1 overflow-y-auto space-y-1 pr-2">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
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
                <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg glass-strong text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sticky bottom */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setLogoutOpen(true)}
          data-no-toast
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-400/10 transition ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          data-no-toast
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`hidden lg:flex w-full mt-2 items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition ${collapsed ? "justify-center" : ""}`}
        >
          {collapsed ? <ChevronsRight size={16} /> : <><ChevronsLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>
      </div>


      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title="Log out of LEGIONFX?">
        <p className="text-sm text-muted-foreground">You'll need to sign in again to access your dashboard.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => setLogoutOpen(false)} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button
            onClick={() => { signOut(); window.location.href = "/login"; }}
            className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium"
          >
            Log out
          </button>
        </div>
      </Modal>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`hidden lg:flex fixed top-0 left-0 h-screen z-40 glass-strong border-r border-white/5 transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[280px]"}`}
      >
        {inner}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-screen w-[280px] z-50 glass-strong border-r border-white/5 lg:hidden"
            >
              {inner}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 px-2.5 py-2">
      <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-xs font-medium mt-0.5 truncate ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}
