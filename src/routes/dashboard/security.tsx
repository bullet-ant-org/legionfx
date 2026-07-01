import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, Key, Smartphone, Monitor, MapPin, Clock, AlertTriangle,
  Check, Fingerprint, Mail, Lock, LogOut, Eye,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, Field, inputCls, Modal } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/dashboard/security")({
  ssr: false,
  component: SecurityPage,
});

const devices = [
  { name: "MacBook Pro 16\"", os: "macOS Sonoma · Chrome", location: "Cape Town, ZA", ip: "196.24.•.•", last: "Active now", current: true },
  { name: "iPhone 15 Pro", os: "iOS 17 · Safari", location: "Cape Town, ZA", ip: "196.24.•.•", last: "12 minutes ago", current: false },
  { name: "iPad Air", os: "iPadOS 17 · Safari", location: "Johannesburg, ZA", ip: "41.13.•.•", last: "2 days ago", current: false },
  { name: "Windows Desktop", os: "Windows 11 · Edge", location: "London, UK", ip: "82.14.•.•", last: "Jun 18", current: false },
];

const activity = [
  { icon: ShieldCheck, event: "Successful login", detail: "MacBook Pro · Cape Town", time: "5 min ago", ok: true },
  { icon: Key, event: "Password changed", detail: "Via account settings", time: "2 days ago", ok: true },
  { icon: Smartphone, event: "2FA enabled", detail: "Google Authenticator", time: "1 week ago", ok: true },
  { icon: AlertTriangle, event: "Login attempt blocked", detail: "Unknown device · Russia", time: "2 weeks ago", ok: false },
  { icon: Lock, event: "Withdrawal PIN set", detail: "6-digit numeric", time: "3 weeks ago", ok: true },
];

function SecurityPage() {
  const [pwModal, setPwModal] = useState(false);
  const [twoFaModal, setTwoFaModal] = useState(false);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Protect your account with industry-grade security controls.</p>
      </motion.div>

      {/* Security score */}
      <GlassCard className="p-6">
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="text-center">
            <div className="relative h-32 w-32 mx-auto">
              <svg viewBox="0 0 100 100" className="rotate-[-90deg]">
                <circle cx="50" cy="50" r="42" strokeWidth="8" stroke="oklch(1 0 0 / 0.05)" fill="none" />
                <motion.circle
                  cx="50" cy="50" r="42" strokeWidth="8" stroke="oklch(0.78 0.21 55)" fill="none"
                  strokeLinecap="round" strokeDasharray={2 * Math.PI * 42}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.92) }}
                  transition={{ duration: 1.2 }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center"><div className="text-3xl font-bold text-gradient">92</div><div className="text-[9px] text-muted-foreground uppercase">Score</div></div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-400">Excellent Security</div>
            <h2 className="text-xl font-bold mt-1">Your account is well protected</h2>
            <p className="text-sm text-muted-foreground mt-1">Enable biometric login to reach a perfect score.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              <ScoreItem label="2FA Active" ok />
              <ScoreItem label="Strong Password" ok />
              <ScoreItem label="Email Verified" ok />
              <ScoreItem label="Biometric Login" ok={false} />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Active Devices" value={devices.length} delta="1 current" icon={<Monitor size={14} />} />
        <StatCard label="2FA Method" value={1} suffix="/2" delta="Auth app" icon={<Smartphone size={14} />} />
        <StatCard label="Login Attempts (30d)" value={42} delta="0 blocked" icon={<ShieldCheck size={14} />} />
        <StatCard label="Last Password Change" value={2} suffix="d" delta="Ago" icon={<Key size={14} />} />
      </div>

      {/* Auth methods */}
      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Authentication" />
          <div className="space-y-3">
            <AuthRow icon={Key} title="Password" desc="Last changed 2 days ago" status="Strong" onClick={() => setPwModal(true)} />
            <AuthRow icon={Smartphone} title="Two-Factor Authentication" desc="Google Authenticator" status="Enabled" statusOk onClick={() => setTwoFaModal(true)} />
            <AuthRow icon={Fingerprint} title="Biometric Login" desc="Face ID / Touch ID" status="Setup" />
            <AuthRow icon={Mail} title="Email Verification" desc={"demo@gmail.com"} status="Verified" statusOk />
            <AuthRow icon={Lock} title="Withdrawal PIN" desc="6-digit PIN required for withdrawals" status="Enabled" statusOk />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Recent Activity" />
          <div className="space-y-2">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`h-9 w-9 rounded-lg grid place-items-center ${a.ok ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}><a.icon size={14} /></div>
                <div className="flex-1 min-w-0"><div className="text-xs font-medium">{a.event}</div><div className="text-[10px] text-muted-foreground">{a.detail}</div></div>
                <div className="text-[10px] text-muted-foreground">{a.time}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Devices */}
      <GlassCard className="p-5">
        <SectionTitle title="Active Sessions" action={<button className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-rose-400">Sign out all</button>} />
        <div className="space-y-2">
          {devices.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="h-10 w-10 rounded-lg glass grid place-items-center text-brand"><Monitor size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-2">{d.name} {d.current && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">This device</span>}</div>
                <div className="text-[10px] text-muted-foreground flex flex-wrap gap-3 mt-0.5">
                  <span>{d.os}</span>
                  <span className="flex items-center gap-1"><MapPin size={9} /> {d.location}</span>
                  <span>{d.ip}</span>
                  <span className="flex items-center gap-1"><Clock size={9} /> {d.last}</span>
                </div>
              </div>
              {!d.current && <button className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs text-rose-400 inline-flex items-center gap-1"><LogOut size={11} /> Sign out</button>}
            </div>
          ))}
        </div>
      </GlassCard>

      <Modal open={pwModal} onClose={() => setPwModal(false)} title="Change Password">
        <div className="space-y-3">
          <Field label="Current Password"><input type="password" className={inputCls} /></Field>
          <Field label="New Password" hint="Min 12 chars, one uppercase, one number, one symbol"><input type="password" className={inputCls} /></Field>
          <Field label="Confirm New Password"><input type="password" className={inputCls} /></Field>
          <button onClick={() => setPwModal(false)} className="w-full mt-2 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Update Password</button>
        </div>
      </Modal>

      <Modal open={twoFaModal} onClose={() => setTwoFaModal(false)} title="Two-Factor Authentication">
        <div className="space-y-4 text-center">
          <div className="h-40 w-40 mx-auto rounded-xl bg-white p-3">
            <div className="h-full w-full grid grid-cols-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className={i % 3 === 0 || i % 5 === 0 ? "bg-black" : "bg-white"} />
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">Scan this QR code with Google Authenticator or Authy</div>
          <Field label="6-digit code"><input className={inputCls + " text-center tracking-[0.5em] font-mono"} maxLength={6} /></Field>
          <button onClick={() => setTwoFaModal(false)} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Verify & Enable</button>
        </div>
      </Modal>
    </div>
  );
}

function ScoreItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] ${ok ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
      {ok ? <Check size={12} /> : <AlertTriangle size={12} />} {label}
    </div>
  );
}

function AuthRow({ icon: Icon, title, desc, status, statusOk, onClick }: { icon: typeof Key; title: string; desc: string; status: string; statusOk?: boolean; onClick?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="h-10 w-10 rounded-lg brand-gradient grid place-items-center text-brand-foreground"><Icon size={16} /></div>
      <div className="flex-1 min-w-0"><div className="text-sm font-semibold">{title}</div><div className="text-[10px] text-muted-foreground">{desc}</div></div>
      <span className={`text-[10px] px-2 py-1 rounded-full ${statusOk ? "bg-emerald-400/10 text-emerald-400" : "bg-white/5 text-muted-foreground"}`}>{status}</span>
      <button onClick={onClick} className="px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs">Manage</button>
    </div>
  );
}
