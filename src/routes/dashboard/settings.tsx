import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User, Bell, Palette, Globe, Mail, Smartphone, Monitor, Moon, Sun,
  DollarSign, Zap, Check,
} from "lucide-react";
import { GlassCard, SectionTitle, Field, inputCls } from "@/components/dashboard/primitives";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError } from "@/lib/api";
import { setSessionUser } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

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
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState("#F58C1F");
  const [density, setDensity] = useState("Comfortable");
  const { session, refresh } = useDashboardData();

  const name = session?.name || "";
  const email = session?.email || "";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";
  const [form, setForm] = useState({
    name,
    phone: (session?.user?.phone as string) || "",
    country: (session?.user?.country as string) || "",
  });
  const [saving, setSaving] = useState(false);

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const { user } = await api.updateProfile({ name: form.name.trim(), phone: form.phone.trim(), country: form.country.trim() });
      setSessionUser(user);
      refresh();
      toast.success("Changes saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

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
            <GlassCard className="p-5">
              <SectionTitle title="Profile Information" />
              <div className="flex items-center gap-4 mb-5">
                <div className="h-20 w-20 rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground overflow-hidden">
                  {session?.user?.avatarUrl ? <img src={session.user.avatarUrl as string} alt={name} className="h-full w-full object-cover" /> : initials}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Update your photo from the Profile page.</div>
                </div>
              </div>
              <form onSubmit={saveAccount} className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                <Field label="Email"><input className={inputCls} value={email} disabled title="Contact support to change your email" /></Field>
                <Field label="Phone"><input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555 000 0000" /></Field>
                <Field label="Country"><input className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="e.g. Nigeria" /></Field>
                <div className="md:col-span-2">
                  <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60">
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {tab === "notifications" && (
            <GlassCard className="p-5">
              <SectionTitle title="Notification Preferences" subtitle="Choose how you want to be notified — saved on this device for now" />
              <div className="space-y-2">
                {[
                  { icon: Mail, label: "Email Notifications", desc: "Receive updates via email", on: true },
                  { icon: Smartphone, label: "Push Notifications", desc: "Mobile push alerts", on: true },
                  { icon: Zap, label: "Trade Signals", desc: "Real-time signal alerts", on: true },
                  { icon: DollarSign, label: "Wallet Activity", desc: "Deposits, withdrawals, transfers", on: true },
                  { icon: Bell, label: "Marketing Updates", desc: "Product news & promotions", on: false },
                ].map((n) => (
                  <ToggleRow key={n.label} storageKey={`notif:${n.label}`} icon={n.icon} label={n.label} desc={n.desc} defaultOn={n.on} />
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
                  {[
                    { icon: Moon, label: "Dark", value: "dark" as const },
                    { icon: Sun, label: "Light", value: "light" as const },
                    { icon: Monitor, label: "System", value: "system" as const },
                  ].map((t) => {
                    const active = t.value === "system" ? false : theme === t.value;
                    return (
                      <button
                        key={t.label}
                        data-no-toast
                        onClick={() => {
                          if (t.value === "system") {
                            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                            setTheme(prefersDark ? "dark" : "light");
                          } else setTheme(t.value);
                        }}
                        className={`rounded-xl p-4 flex flex-col items-center gap-2 border transition ${active ? "border-brand bg-brand/10" : "border-white/10 glass hover:bg-white/10"}`}
                      >
                        <t.icon size={20} className={active ? "text-brand" : ""} />
                        <span className="text-xs font-medium">{t.label}</span>
                        {active && <Check size={12} className="text-brand" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Accent Color</div>
                <div className="flex gap-2">
                  {["#F58C1F", "#3B82F6", "#10B981", "#8B5CF6", "#EC4899"].map((c) => (
                    <button
                      key={c}
                      data-no-toast
                      onClick={() => { setAccent(c); toast.info("Custom accent colors are coming soon."); }}
                      aria-label={`Accent ${c}`}
                      className={`h-10 w-10 rounded-xl border-2 transition ${c === accent ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground mb-2">Density</div>
                <div className="flex gap-2">
                  {["Compact", "Comfortable", "Spacious"].map((d) => (
                    <button
                      key={d}
                      data-no-toast
                      onClick={() => { setDensity(d); toast.info("Layout density options are coming soon."); }}
                      className={`px-4 py-2 rounded-xl text-xs transition ${d === density ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          )}

          {tab === "preferences" && (
            <GlassCard className="p-5">
              <SectionTitle title="Trading Preferences" subtitle="Not yet connected to a broker — saved on this device for now" />
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Default Currency"><select className={inputCls}><option>USD</option><option>EUR</option><option>GBP</option></select></Field>
                <Field label="Chart Type"><select className={inputCls}><option>Candlestick</option><option>Bar</option><option>Line</option></select></Field>
                <Field label="Default Risk %"><input className={inputCls} defaultValue="1.0" /></Field>
                <Field label="Default Leverage"><select className={inputCls}><option>1:100</option><option>1:200</option><option>1:500</option></select></Field>
              </div>
              <div className="mt-5 space-y-2">
                <ToggleRow storageKey="pref:auto-copy" icon={Zap} label="Auto-copy signals" desc="Automatically execute new signals from subscribed providers" defaultOn={false} />
                <ToggleRow storageKey="pref:trade-confirm" icon={Bell} label="Trade confirmations" desc="Require confirmation before placing trades" defaultOn={true} />
              </div>
            </GlassCard>
          )}

          {tab === "billing" && (
            <>
              <GlassCard className="p-5">
                <SectionTitle title="Current Plan" />
                <div className="rounded-2xl p-5 brand-gradient text-brand-foreground">
                  <div className="text-[10px] uppercase tracking-wider opacity-80">Active Subscription</div>
                  <div className="text-2xl font-bold mt-1">LEGIONFX {(session?.user?.plan as string) ?? "Starter"}</div>
                  <div className="text-sm opacity-90 mt-1">Plan changes are handled by our team for now.</div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => toast.info("Reach out via Support to change your plan.")} className="px-3 py-1.5 rounded-lg bg-white/20 text-xs">Change Plan</button>
                    <button onClick={() => toast.info("Reach out via Support to cancel your plan.")} className="px-3 py-1.5 rounded-lg bg-white/10 text-xs">Cancel</button>
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-5">
                <SectionTitle title="Billing History" subtitle="See Wallet → Transaction History for all deposits, withdrawals, and purchases" />
                <div className="text-xs text-muted-foreground py-4 text-center">There's no separate subscription billing yet — plan purchases and wallet activity all show up in your Wallet.</div>
              </GlassCard>
            </>
          )}

          {tab === "integrations" && (
            <GlassCard className="p-5">
              <SectionTitle title="Connected Services" subtitle="Coming soon" />
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: "MetaTrader 5", desc: "Broker platform" },
                  { name: "TradingView", desc: "Charts & alerts" },
                  { name: "Discord", desc: "Community signals" },
                  { name: "Telegram", desc: "Alert bot" },
                  { name: "Zapier", desc: "Automation" },
                  { name: "Google Calendar", desc: "Mentorship sync" },
                ].map((i) => (
                  <div key={i.name} className="rounded-xl bg-white/[0.03] border border-white/5 p-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-brand-foreground font-bold text-xs">{i.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{i.name}</div>
                      <div className="text-[10px] text-muted-foreground">{i.desc}</div>
                    </div>
                    <button onClick={() => toast.info(`${i.name} integration is coming soon.`)} className="px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground text-xs font-medium">Connect</button>
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

function ToggleRow({ icon: Icon, label, desc, defaultOn, storageKey }: { icon: typeof Bell; label: string; desc: string; defaultOn: boolean; storageKey: string }) {
  const [on, setOn] = useState(() => {
    if (typeof window === "undefined") return defaultOn;
    const stored = window.localStorage.getItem(storageKey);
    return stored === null ? defaultOn : stored === "on";
  });
  const toggle = () => {
    const next = !on;
    setOn(next);
    if (typeof window !== "undefined") window.localStorage.setItem(storageKey, next ? "on" : "off");
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="h-9 w-9 rounded-lg glass grid place-items-center text-brand"><Icon size={14} /></div>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium">{label}</div><div className="text-[10px] text-muted-foreground">{desc}</div></div>
      <button onClick={toggle} className={`h-6 w-11 rounded-full transition relative ${on ? "brand-gradient" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
