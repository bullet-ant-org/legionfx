import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, Menu, Wallet, User2, ChevronDown, LogOut, Key, Shield, CreditCard, Settings, ArrowDownToLine, ArrowUpFromLine, BellDot, Code2, Banknote } from "lucide-react";
import { notifications as demoNotifs, wallet, user } from "@/lib/demo-data";
import { signOut } from "@/lib/auth";

const routeTitles: Record<string, { title: string; crumb: string }> = {
  "/dashboard": { title: "Overview", crumb: "Dashboard / Overview" },
  "/dashboard/wallet": { title: "Wallet", crumb: "Dashboard / Wallet" },
  "/dashboard/messages": { title: "Messages", crumb: "Dashboard / Messages" },
  "/dashboard/bots": { title: "Trading Bots", crumb: "Dashboard / Trading Bots" },
  "/dashboard/academy": { title: "Academy", crumb: "Dashboard / Academy" },
  "/dashboard/prop-firm": { title: "Prop Firm", crumb: "Dashboard / Prop Firm" },
  "/dashboard/signals": { title: "Signals", crumb: "Dashboard / Signals" },
  "/dashboard/settings": { title: "Settings", crumb: "Dashboard / Settings" },
  "/dashboard/security": { title: "Security", crumb: "Dashboard / Security" },
  "/dashboard/support": { title: "Support", crumb: "Dashboard / Support" },
  "/dashboard/profile": { title: "Profile", crumb: "Dashboard / Profile" },
};

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const info = routeTitles[pathname] ?? { title: "Dashboard", crumb: "Dashboard" };

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(demoNotifs);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unread = notifs.filter((n) => n.unread).length;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-[70px] glass-strong border-b border-white/5">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button onClick={onOpenMobile} className="lg:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Open menu">
          <Menu size={20} />
        </button>

        <div className="min-w-0 hidden sm:block">
          <div className="text-sm font-semibold truncate">{info.title}</div>
          <div className="text-[11px] text-muted-foreground truncate">{info.crumb}</div>
        </div>

        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition" />
            <input
              type="text"
              placeholder="Search transactions, bots, signals, courses..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {/* Wallet chip */}
          <Link to="/dashboard/wallet" className="hidden md:flex items-center gap-2 glass rounded-xl pl-2 pr-3 py-1.5 hover-lift">
            <div className="h-7 w-7 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><Wallet size={14} /></div>
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Available</div>
              <div className="text-xs font-semibold">${wallet.available.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition"
              aria-label="Notifications"
            >
              {unread > 0 ? <BellDot size={18} /> : <Bell size={18} />}
              {unread > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 grid place-items-center rounded-full brand-gradient text-brand-foreground text-[9px] font-semibold">{unread}</span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-[340px] glass-strong rounded-2xl shadow-card overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="text-sm font-semibold">Notifications</div>
                    <button onClick={() => setNotifs(notifs.map((n) => ({ ...n, unread: false })))} className="text-[11px] text-brand hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifs.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer flex gap-3 ${n.unread ? "bg-white/[0.02]" : ""}`}>
                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? "bg-brand animate-glow-pulse" : "bg-muted"}`} />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs">{n.title}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="block w-full py-2.5 text-center text-[11px] text-brand hover:bg-white/5">View all notifications</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl glass hover:bg-white/10 transition"
            >
              <div className="h-8 w-8 rounded-lg brand-gradient grid place-items-center text-brand-foreground text-sm font-semibold">{user.initials}</div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 mt-2 w-[260px] glass-strong rounded-2xl shadow-card overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <div className="py-2 text-sm">
                    <MenuLink to="/dashboard/profile" icon={User2}>My Profile</MenuLink>
                    <MenuLink to="/dashboard/wallet" icon={Wallet}>Wallet Accounts</MenuLink>
                    <MenuLink to="/dashboard/wallet" icon={Banknote}>Withdrawal Accounts</MenuLink>
                    <MenuLink to="/dashboard/wallet" icon={ArrowUpFromLine}>Withdraw Funds</MenuLink>
                    <MenuLink to="/dashboard/wallet" icon={ArrowDownToLine}>Deposit Funds</MenuLink>
                    <MenuLink to="/dashboard/security" icon={Key}>Withdrawal PIN</MenuLink>
                    <MenuLink to="/dashboard/security" icon={Shield}>Two-Factor Auth</MenuLink>
                    <MenuLink to="/dashboard/settings" icon={BellDot}>Notification Prefs</MenuLink>
                    <MenuLink to="/dashboard/settings" icon={Settings}>Profile Settings</MenuLink>
                    <MenuLink to="/dashboard/settings" icon={Code2}>API Keys</MenuLink>
                    <MenuLink to="/dashboard/wallet" icon={CreditCard}>Billing</MenuLink>
                  </div>
                  <button
                    onClick={() => { signOut(); window.location.href = "/login"; }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-400/10 border-t border-white/5"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function MenuLink({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-muted-foreground hover:text-foreground transition">
      <Icon size={15} className="text-brand" /> {children}
    </Link>
  );
}
