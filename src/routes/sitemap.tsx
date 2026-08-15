import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home, Info, Sparkles, Layers, Mail, LogIn, LayoutDashboard, Wallet, Bot,
  Trophy, GraduationCap, LineChart, MessageSquare, User, Shield, Settings,
  LifeBuoy, ShieldCheck, Users, ArrowDownToLine, ArrowUpFromLine, Bell,
  CreditCard, Tags, FileText, Coins, ExternalLink,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap — LEGIONFX" },
      { name: "description", content: "A full map of every page on LEGIONFX — public pages, the trader dashboard, and the admin console." },
    ],
  }),
  component: SitemapPage,
});

type Entry = { to: string; label: string; icon: any; desc?: string };
type Group = { title: string; note?: string; entries: Entry[] };

const PUBLIC: Group = {
  title: "Public Pages",
  entries: [
    { to: "/", label: "Home", icon: Home, desc: "Landing page" },
    { to: "/about", label: "About", icon: Info, desc: "Our story, values & team" },
    { to: "/features", label: "Features", icon: Sparkles, desc: "What you can do inside LEGIONFX" },
    { to: "/services", label: "Services", icon: Layers, desc: "Prop firm, academy, bots & signals" },
    { to: "/contact", label: "Contact", icon: Mail, desc: "Get in touch with our team" },
    { to: "/login", label: "Login / Sign Up", icon: LogIn, desc: "Access or create your account" },
  ],
};

const DASHBOARD: Group = {
  title: "Trader Dashboard",
  note: "Requires a logged-in account",
  entries: [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/dashboard/wallet", label: "Wallet", icon: Wallet },
    { to: "/dashboard/bots", label: "Trading Bots", icon: Bot },
    { to: "/dashboard/prop-firm", label: "Prop Firm", icon: Trophy },
    { to: "/dashboard/academy", label: "Academy", icon: GraduationCap },
    { to: "/dashboard/signals", label: "Signals", icon: LineChart },
    { to: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { to: "/dashboard/profile", label: "Profile", icon: User },
    { to: "/dashboard/security", label: "Security", icon: Shield },
    { to: "/dashboard/settings", label: "Settings", icon: Settings },
    { to: "/dashboard/support", label: "Support", icon: LifeBuoy },
  ],
};

const ADMIN: Group = {
  title: "Admin Console",
  note: "Requires an admin account",
  entries: [
    { to: "/admin", label: "Overview", icon: ShieldCheck },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
    { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
    { to: "/admin/deposit-methods", label: "Deposit Methods", icon: Coins },
    { to: "/admin/payments", label: "Payment Methods", icon: CreditCard },
    { to: "/admin/pricing", label: "Pricing Plans", icon: Tags },
    { to: "/admin/bots", label: "Bots", icon: Bot },
    { to: "/admin/prop-firm", label: "Prop Firm", icon: Trophy },
    { to: "/admin/academy", label: "Academy", icon: GraduationCap },
    { to: "/admin/signals", label: "Signals", icon: LineChart },
    { to: "/admin/support", label: "Support", icon: LifeBuoy },
    { to: "/admin/notify", label: "Notify", icon: Bell },
    { to: "/admin/audit", label: "Audit Log", icon: FileText },
    { to: "/admin/settings", label: "Platform Settings", icon: Settings },
    { to: "/admin/profile", label: "Admin Profile", icon: User },
  ],
};

const CHECKOUT: Group = {
  title: "Checkout Flow",
  note: "Reached from Wallet → Deposit",
  entries: [
    { to: "/pay", label: "Choose Payment Method", icon: Wallet },
    { to: "/pay/crypto", label: "Crypto Checkout", icon: Coins },
  ],
};

function SitemapPage() {
  return (
    <SiteLayout>
      <Section className="pt-32">
        <SectionHeader
          eyebrow="Sitemap"
          title="Every page on LEGIONFX"
          subtitle="A complete map of the site — public pages open to everyone, plus the trader dashboard and admin console for signed-in accounts."
        />

        <div className="mb-10 flex flex-wrap items-center gap-3 justify-center">
          <a href="/sitemap.xml" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">
            View sitemap.xml <ExternalLink size={14}/>
          </a>
          <a href="/robots.txt" target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm">
            View robots.txt <ExternalLink size={14}/>
          </a>
        </div>

        <div className="space-y-10">
          {[PUBLIC, DASHBOARD, ADMIN, CHECKOUT].map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold">{group.title}</h2>
                {group.note && <span className="text-[10px] px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">{group.note}</span>}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.entries.map((e) => (
                  <Link
                    key={e.to}
                    to={e.to}
                    className="glass rounded-xl p-4 flex items-center gap-3 hover-lift group"
                  >
                    <div className="h-9 w-9 rounded-lg brand-gradient grid place-items-center text-brand-foreground shrink-0">
                      <e.icon size={15}/>
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium group-hover:text-brand transition truncate">{e.label}</div>
                      {e.desc && <div className="text-[11px] text-muted-foreground truncate">{e.desc}</div>}
                      <div className="text-[10px] text-muted-foreground/70 font-mono truncate">{e.to}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
