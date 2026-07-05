import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Search, Menu, ChevronDown, LogOut, Sun, Moon, ShieldCheck, Users, ArrowDownToLine, ArrowUpFromLine, Settings, User2 } from "lucide-react";
import { signOut } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { adminMetrics, sentNotifications } from "@/lib/admin-data";

const titles: Record<string, { title: string; crumb: string }> = {
  "/admin": { title: "Overview", crumb: "Admin / Overview" },
  "/admin/users": { title: "Users", crumb: "Admin / Users" },
  "/admin/deposits": { title: "Deposits", crumb: "Admin / Deposits" },
  "/admin/withdrawals": { title: "Withdrawals", crumb: "Admin / Withdrawals" },
  "/admin/notify": { title: "Notify Users", crumb: "Admin / Notify" },
  "/admin/payments": { title: "Payment Options", crumb: "Admin / Payments" },
  "/admin/pricing": { title: "Pricing Plans", crumb: "Admin / Pricing" },
  "/admin/bots": { title: "Bots", crumb: "Admin / Bots" },
  "/admin/academy": { title: "Academy", crumb: "Admin / Academy" },
  "/admin/prop-firm": { title: "Prop Firm", crumb: "Admin / Prop Firm" },
  "/admin/signals": { title: "Signals", crumb: "Admin / Signals" },
  "/admin/support": { title: "Support", crumb: "Admin / Support" },
  "/admin/audit": { title: "Audit Log", crumb: "Admin / Audit" },
  "/admin/settings": { title: "Settings", crumb: "Admin / Settings" },
  "/admin/profile": { title: "Profile", crumb: "Admin / Profile" },
};

export function AdminTopbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const info = titles[pathname] ?? { title: "Admin", crumb: "Admin" };
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const nRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (nRef.current && !nRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (pRef.current && !pRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-[70px] glass-strong border-b border-white/5">
      <div className="h-full px-4 md:px-6 flex items-center gap-3">
        <button onClick={onOpenMobile} data-no-toast className="lg:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Open menu"><Menu size={20} /></button>

        <div className="min-w-0 hidden sm:block">
          <div className="text-sm font-semibold truncate flex items-center gap-2">{info.title}<span className="text-[9px] uppercase tracking-widest text-brand inline-flex items-center gap-1"><ShieldCheck size={10}/> Admin</span></div>
          <div className="text-[11px] text-muted-foreground truncate">{info.crumb}</div>
        </div>

        <div className="flex-1 max-w-xl mx-2 hidden md:block">
          <div className="relative group">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-brand transition" />
            <input type="text" placeholder="Search users, transactions, tickets, plans…" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/20 transition" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link to="/admin/withdrawals" className="hidden md:flex items-center gap-2 glass rounded-xl pl-2 pr-3 py-1.5 hover-lift">
            <div className="h-7 w-7 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><ArrowUpFromLine size={14} /></div>
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Pending WD</div>
              <div className="text-xs font-semibold">${adminMetrics.pendingWithdrawals.toLocaleString()}</div>
            </div>
          </Link>

          <button onClick={toggle} data-no-toast aria-label="Toggle theme" className="p-2.5 rounded-xl glass hover:bg-white/10 transition">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="relative" ref={nRef}>
            <button onClick={() => setNotifOpen((o) => !o)} data-no-toast aria-haspopup="menu" aria-expanded={notifOpen} className="relative p-2.5 rounded-xl glass hover:bg-white/10 transition" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 grid place-items-center rounded-full brand-gradient text-brand-foreground text-[9px] font-semibold">{sentNotifications.filter(n=>n.status!=="Sent").length + 3}</span>
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-[340px] glass-strong rounded-2xl shadow-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 text-sm font-semibold">Admin Alerts</div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { t: "3 withdrawals awaiting approval", s: "5m" },
                      { t: "New user signup surge (+18)", s: "22m" },
                      { t: "Ticket TCK-2080 escalated (Urgent)", s: "1h" },
                      { t: "Payment method Bitcoin re-enabled", s: "3h" },
                    ].map((n, i) => (
                      <div key={i} className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer">
                        <div className="text-xs">{n.t}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">{n.s} ago</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/audit" onClick={() => setNotifOpen(false)} className="block w-full py-2.5 text-center text-[11px] text-brand hover:bg-white/5">Open audit log</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={pRef}>
            <button onClick={() => setProfileOpen((o) => !o)} data-no-toast aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Admin menu" className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl glass hover:bg-white/10 transition">
              <div className="h-8 w-8 rounded-lg brand-gradient grid place-items-center text-brand-foreground text-sm font-semibold">A</div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute right-0 mt-2 w-[240px] glass-strong rounded-2xl shadow-card overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5">
                    <div className="text-sm font-medium">LEGIONFX Admin</div>
                    <div className="text-[11px] text-muted-foreground truncate">admin@gmail.com</div>
                  </div>
                  <div className="py-2 text-sm">
                    <Item to="/admin/profile" icon={User2}>Admin Profile</Item>
                    <Item to="/admin/users" icon={Users}>User Management</Item>
                    <Item to="/admin/deposits" icon={ArrowDownToLine}>Deposits Queue</Item>
                    <Item to="/admin/withdrawals" icon={ArrowUpFromLine}>Withdrawals Queue</Item>
                    <Item to="/admin/settings" icon={Settings}>Platform Settings</Item>
                  </div>
                  <button onClick={() => { signOut(); window.location.href = "/login"; }} className="w-full flex items-center gap-2 px-4 py-3 text-sm text-rose-400 hover:bg-rose-400/10 border-t border-white/5">
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

function Item({ to, icon: Icon, children }: { to: string; icon: any; children: React.ReactNode }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 px-4 py-2 hover:bg-white/5 text-muted-foreground hover:text-foreground transition">
      <Icon size={15} className="text-brand" /> {children}
    </Link>
  );
}
