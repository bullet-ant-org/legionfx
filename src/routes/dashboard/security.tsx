import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Shield, Key, Smartphone, Monitor, MapPin, Clock, LogOut, CheckCircle2,
  AlertTriangle, Lock,
} from "lucide-react";
import { GlassCard, SectionTitle, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError } from "@/lib/api";
import { setSessionUser, signOut } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/security")({
  ssr: false,
  component: SecurityPage,
});

const recentActivity = [
  { action: "Signed in", detail: "This device", time: "Just now", ok: true },
  { action: "Signed in", detail: "Chrome on Windows", time: "2 days ago", ok: true },
  { action: "Password changed", detail: "—", time: "3 weeks ago", ok: true },
];

function SecurityPage() {
  const { session, refresh } = useDashboardData();
  const navigate = useNavigate();
  const [pwOpen, setPwOpen] = useState(false);
  const [twoFAOpen, setTwoFAOpen] = useState(false);
  const [signingOutAll, setSigningOutAll] = useState(false);

  const twoFAEnabled = !!session?.user?.twoFactorEnabled;
  const kyc = (session?.user?.kyc as string) ?? "Pending";

  const securityScore = [true, twoFAEnabled, kyc === "Verified"].filter(Boolean).length * 33 + 1;

  const signOutEverywhere = async () => {
    setSigningOutAll(true);
    try {
      await signOut();
      toast.success("Signed out of this device");
      navigate({ to: "/login" });
    } finally {
      setSigningOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Protect your account and manage access.</p>
      </motion.div>

      {/* Security score */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-brand/15 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="h-28 w-28 rounded-full brand-gradient grid place-items-center text-brand-foreground shadow-glow shrink-0">
            <div className="text-center"><div className="text-2xl font-bold">{Math.min(securityScore, 100)}</div><div className="text-[9px] opacity-80">SCORE</div></div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Account Security</div>
            <div className="text-xs text-muted-foreground mt-1">Complete the steps below to fully secure your account.</div>
            <div className="grid sm:grid-cols-3 gap-2 mt-3">
              <ScoreItem ok label="Password set" />
              <ScoreItem ok={twoFAEnabled} label="2FA enabled" />
              <ScoreItem ok={kyc === "Verified"} label="Identity verified" />
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Password */}
        <GlassCard className="p-5">
          <SectionTitle title="Password" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center text-brand"><Key size={16} /></div>
            <div className="flex-1">
              <div className="text-sm font-medium">••••••••••••</div>
              <div className="text-[10px] text-muted-foreground">Last changed — check Recent Activity below</div>
            </div>
            <button onClick={() => setPwOpen(true)} className="px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground text-xs font-medium">Change</button>
          </div>
        </GlassCard>

        {/* 2FA */}
        <GlassCard className="p-5">
          <SectionTitle title="Two-Factor Authentication" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className={`h-10 w-10 rounded-lg grid place-items-center ${twoFAEnabled ? "bg-emerald-400/10 text-emerald-400" : "glass text-brand"}`}><Smartphone size={16} /></div>
            <div className="flex-1">
              <div className="text-sm font-medium">{twoFAEnabled ? "Enabled" : "Disabled"}</div>
              <div className="text-[10px] text-muted-foreground">{twoFAEnabled ? "Your account has an extra layer of protection" : "Add an extra layer of protection"}</div>
            </div>
            <button onClick={() => setTwoFAOpen(true)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${twoFAEnabled ? "glass hover:bg-white/10 text-rose-400" : "brand-gradient text-brand-foreground"}`}>
              {twoFAEnabled ? "Disable" : "Enable"}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Sessions */}
      <GlassCard className="p-5">
        <SectionTitle
          title="Active Sessions"
          subtitle="Multi-device session tracking is coming soon — this shows your current session only"
          action={<button onClick={signOutEverywhere} disabled={signingOutAll} className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 inline-flex items-center gap-1 disabled:opacity-60"><LogOut size={12} /> Sign Out</button>}
        />
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-400/5 border border-emerald-400/20">
          <div className="h-10 w-10 rounded-lg glass grid place-items-center text-emerald-400"><Monitor size={16} /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium flex items-center gap-2">This device <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-400/15 text-emerald-400">Current</span></div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1"><MapPin size={9} /> Your location</span>
              <span className="flex items-center gap-1"><Clock size={9} /> Active now</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Recent activity */}
      <GlassCard className="p-5">
        <SectionTitle title="Recent Activity" subtitle="Illustrative — full audit log is coming soon" />
        <div className="space-y-2">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className={`h-8 w-8 rounded-lg grid place-items-center ${a.ok ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}>
                {a.ok ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{a.action}</div>
                <div className="text-[10px] text-muted-foreground">{a.detail}</div>
              </div>
              <div className="text-[10px] text-muted-foreground shrink-0">{a.time}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
      <TwoFAModal open={twoFAOpen} onClose={() => setTwoFAOpen(false)} enabled={twoFAEnabled} onChanged={() => refresh()} />
    </div>
  );
}

function ScoreItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${ok ? "bg-emerald-400/10 text-emerald-400" : "bg-white/[0.03] text-muted-foreground"}`}>
      {ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />} {label}
    </div>
  );
}

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setCurrent(""); setNext(""); setConfirm(""); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (next !== confirm) { toast.error("Passwords do not match"); return; }
    setSubmitting(true);
    try {
      await api.changePassword(current, next);
      toast.success("Password updated");
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Change Password">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Current Password"><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} placeholder="••••••••" /></Field>
        <Field label="New Password"><input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} placeholder="At least 8 characters" /></Field>
        <Field label="Confirm New Password"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} placeholder="••••••••" /></Field>
        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60">
          {submitting ? "Updating…" : "Update Password"}
        </button>
      </form>
    </Modal>
  );
}

function TwoFAModal({ open, onClose, enabled, onChanged }: { open: boolean; onClose: () => void; enabled: boolean; onChanged: () => void }) {
  const [submitting, setSubmitting] = useState(false);

  const toggle = async () => {
    setSubmitting(true);
    try {
      const { user } = await api.updateProfile({ twoFactorEnabled: !enabled });
      setSessionUser(user);
      onChanged();
      toast.success(enabled ? "Two-factor authentication disabled" : "Two-factor authentication enabled");
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update 2FA setting");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={enabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}>
      <div className="space-y-4">
        {enabled ? (
          <p className="text-sm text-muted-foreground">This will remove the extra verification step when you sign in. Are you sure?</p>
        ) : (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 flex gap-2.5">
            <Lock size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/90">
              Authenticator-app based verification (QR code + rotating codes) is still being built. For now this flips a basic
              two-factor flag on your account. Full TOTP support is coming soon.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button onClick={toggle} disabled={submitting} className={`py-2.5 rounded-xl text-sm font-medium disabled:opacity-60 ${enabled ? "bg-rose-500/90 hover:bg-rose-500 text-white" : "brand-gradient text-brand-foreground"}`}>
            {submitting ? "Saving…" : enabled ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
