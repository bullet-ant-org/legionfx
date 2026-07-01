import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Bell, Palette, Globe, Mail, Smartphone, Monitor, Moon, Sun,
  DollarSign, Zap, Check, ChevronRight,
} from "lucide-react";
import { GlassCard, SectionTitle, Field, inputCls } from "@/components/dashboard/primitives";
import { user } from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/settings")({
  ssr: false,
  component: SettingsPage,
});

const sections = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "preferences", label: "Preferences", icon: Globe },
  { id: "billing", label: "Billing", icon: DollarSign },
  { id: "integrations", label: "Integrations", icon: Zap },
] as const;

function SettingsPage() {
  const [tab, setTab] = useState<(typeof sections)[number]["id"]>("account");

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your LEGIONFX experience.</p>
      </motion.div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
        <GlassCard className="p-3 h-fit">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button key={s.id} onClick={() => setTab(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${tab === s.id ? "bg-brand/15 text-foreground border border-brand/20" : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"}`}>
                <Icon size={16} className={tab === s.id ? "text-brand" : ""} />
                <span className="font-medium">{s.label}</span>
              </button>
            );
          })}
        </GlassCard>

        <div className="space-y-4">
          {tab === "account" && (
            <>
              <GlassCard className="p-5">
                <SectionTitle title="Profile Information" />
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-20 w-20 rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground">{user.initials}</div>
                  <div>
                    <button className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs">Upload Photo</button>
                    <div className="text-[10px] text-muted-foreground mt-1">JPG or PNG · max 2MB</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label="Full Name"><input className={inputCls} defaultValue={user.name} /></Field>
                  <Field label="Email"><input className={inputCls} defaultValue={user.email} /></Field>
                  <Field label="Phone"><input className={inputCls} defaultValue="+27 82 555 0123" /></Field>
                  <Field label="Country"><select className={inputCls}><option>South Africa</option><option>USA</option><option>UK</option></select></Field>
                  <Field label="Timezone"><select className={inputCls}><option>Africa/Johannesburg (SAST)</option><option>UTC</option><option>America/New_York</option></select></Field>
                  <Field label="Language"><select className={inputCls}><option>English</option><option>Español</option><option>Français</option></select></Field>
                </div>
                <button className="mt-5 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Save Changes</button>
              </GlassCard>
            </>
          )}

          {tab === "notifications" && (
            <GlassCard className="p-5">
              <SectionTitle title="Notification Preferences" subtitle="Choose how you want to be notified" />
              <div className="space-y-2">
                {[
                  { icon: Mail, label: "Email Notifications", desc: "Receive updates via email", on: true },
                  { icon: Smartphone, label: "Push Notifications", desc: "Mobile push alerts", on: true },
                  { icon: Zap, label: "Trade Signals", desc: "Real-time signal alerts", on: true },
                  { icon: DollarSign, label: "Wallet Activity", desc: "Deposits, withdrawals, transfers", on: true },
                  { icon: Bell, label: "Marketing Updates", desc: "Product news & promotions", on: false },
                ].map((n) => (
                  <ToggleRow key={n.label} icon={n.icon} label={n.label} desc={n.desc} defaultOn={n.on} />
                ))}
              </div>
            </GlassCard>
          )}

          {tab === "appearance" && (
            <GlassCard className="p-5">
              <SectionTitle title="Appearance" subtitle="Customize your interface" />
              <div>
                <div className="text-xs text-muted-foreground mb-2">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  {[{ icon: Moon, label: "Dark", active: true }, { icon: Sun, label: "Light" }, { icon: Monitor, label: "System" }].map((t) => (
                    <button key={t.label} className={`rounded-xl p-4 flex flex-col items-center gap-2 border transition ${t.active ? "border-brand bg-brand/10" : "border-white/10 glass hover:bg-white/10"}`}>
                      <t.icon size={20} className={t.active ? "text-brand" : ""} />
                      <span className="text-xs font-medium">{t.label}</span>
                      {t.active && <Check size={12} className="text-brand" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Accent Color</div>
                <div className="flex gap-2">
                  {["#F58C1F", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"].map((c) => (
                    <button key={c} className={`h-10 w-10 rounded-xl border-2 ${c === "#F58C1F" ? "border-white" : "border-transparent"}`} style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Density</div>
                <div className="flex gap-2">
                  {["Compact", "Comfortable", "Spacious"].map((d) => (
                    <button key={d} className={`px-4 py-2 rounded-xl text-xs ${d === "Comfortable" ? "brand-gradient text-brand-foreground" : "glass"}`}>{d}</button>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {tab === "preferences" && (
            <GlassCard className="p-5">
              <SectionTitle title="Trading Preferences" />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Default Currency"><select className={inputCls}><option>USD</option><option>EUR</option><option>GBP</option></select></Field>
                <Field label="Chart Type"><select className={inputCls}><option>Candlestick</option><option>Bar</option><option>Line</option></select></Field>
                <Field label="Default Risk %"><input className={inputCls} defaultValue="1.0" /></Field>
                <Field label="Default Leverage"><select className={inputCls}><option>1:100</option><option>1:200</option><option>1:500</option></select></Field>
              </div>
              <div className="mt-5 space-y-2">
                <ToggleRow icon={Zap} label="Auto-copy signals" desc="Automatically execute new signals from subscribed providers" defaultOn={false} />
                <ToggleRow icon={Bell} label="Trade confirmations" desc="Require confirmation before placing trades" defaultOn={true} />
              </div>
            </GlassCard>
          )}

          {tab === "billing" && (
            <>
              <GlassCard className="p-5">
                <SectionTitle title="Current Plan" />
                <div className="rounded-2xl p-5 brand-gradient text-brand-foreground">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Active Subscription</div>
                  <div className="text-2xl font-bold mt-1">LEGIONFX Elite</div>
                  <div className="text-sm opacity-90 mt-1">$149/month · Renews Jul 14, 2026</div>
                  <div className="flex gap-2 mt-4">
                    <button className="px-3 py-1.5 rounded-lg bg-white/20 text-xs">Change Plan</button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/10 text-xs">Cancel</button>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-5">
                <SectionTitle title="Billing History" />
                <div className="space-y-2 text-xs">
                  {[
                    { date: "Jun 14, 2026", desc: "Elite subscription", amount: "$149.00" },
                    { date: "May 14, 2026", desc: "Elite subscription", amount: "$149.00" },
                    { date: "Apr 14, 2026", desc: "Elite subscription", amount: "$149.00" },
                  ].map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                      <div><div className="font-medium">{b.desc}</div><div className="text-[10px] text-muted-foreground">{b.date}</div></div>
                      <div className="font-semibold">{b.amount}</div>
                      <button className="text-[11px] text-brand hover:underline">Invoice</button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}

          {tab === "integrations" && (
            <GlassCard className="p-5">
              <SectionTitle title="Connected Services" />
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: "MetaTrader 5", desc: "Broker platform", connected: true },
                  { name: "TradingView", desc: "Charts & alerts", connected: true },
                  { name: "Discord", desc: "Community signals", connected: true },
                  { name: "Telegram", desc: "Alert bot", connected: false },
                  { name: "Zapier", desc: "Automation", connected: false },
                  { name: "Google Calendar", desc: "Mentorship sync", connected: false },
                ].map((i) => (
                  <div key={i.name} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-brand-foreground font-bold text-xs">{i.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold flex items-center gap-2">{i.name} {i.connected && <Check size={12} className="text-emerald-400" />}</div>
                      <div className="text-[10px] text-muted-foreground">{i.desc}</div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i.connected ? "glass hover:bg-white/10" : "brand-gradient text-brand-foreground"}`}>{i.connected ? "Disconnect" : "Connect"}</button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, desc, defaultOn }: { icon: typeof Bell; label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="h-9 w-9 rounded-lg glass grid place-items-center text-brand"><Icon size={14} /></div>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium">{label}</div><div className="text-[10px] text-muted-foreground">{desc}</div></div>
      <button onClick={() => setOn(!on)} className={`h-6 w-11 rounded-full transition relative ${on ? "brand-gradient" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
