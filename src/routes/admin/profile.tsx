import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Key, Smartphone, Mail } from "lucide-react";
import { GlassCard, SectionTitle, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { api, ApiError } from "@/lib/api";
import { setSessionUser, signOut, getSession, refreshSession, type Session } from "@/lib/auth";

export const Route = createFileRoute("/admin/profile")({ ssr: false, component: AdminProfilePage });

function AdminProfilePage() {
  const [session, setSession] = useState<Session | null>(() => getSession());
  const refresh = () => { refreshSession().then(setSession); };
  useEffect(() => { refresh(); }, []);
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const twoFAEnabled = !!session?.user?.twoFactorEnabled;

  const name = session?.name || "Admin";
  const email = session?.email || "";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "A";

  const toggle2FA = async () => {
    try {
      const { user } = await api.updateProfile({ twoFactorEnabled: !twoFAEnabled });
      setSessionUser(user);
      refresh();
      toast.success(twoFAEnabled ? "2FA disabled" : "2FA enabled");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update 2FA");
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 h-32 brand-gradient opacity-20" />
        <div className="relative flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground shadow-glow overflow-hidden">
            {session?.user?.avatarUrl ? <img src={session.user.avatarUrl as string} className="h-full w-full object-cover" alt={name} /> : initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2"><h1 className="text-xl font-bold">{name}</h1><span className="text-[10px] px-2 py-1 rounded-full bg-brand/15 text-brand border border-brand/30 inline-flex items-center gap-1"><ShieldCheck size={10}/> Admin</span></div>
            <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5"><Mail size={12}/> {email}</div>
          </div>
          <button onClick={() => setEditOpen(true)} className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm">Edit Profile</button>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Password" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="h-10 w-10 rounded-lg glass grid place-items-center text-brand"><Key size={16}/></div>
            <div className="flex-1 text-sm font-medium">••••••••••••</div>
            <button data-no-toast onClick={() => setPwOpen(true)} className="px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground text-xs font-medium">Change</button>
          </div>
        </GlassCard>
        <GlassCard className="p-5">
          <SectionTitle title="Two-Factor Authentication" subtitle="Basic flag only — full TOTP support is coming soon" />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className={`h-10 w-10 rounded-lg grid place-items-center ${twoFAEnabled ? "bg-emerald-400/10 text-emerald-400" : "glass text-brand"}`}><Smartphone size={16}/></div>
            <div className="flex-1 text-sm font-medium">{twoFAEnabled ? "Enabled" : "Disabled"}</div>
            <button data-no-toast onClick={toggle2FA} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${twoFAEnabled ? "glass hover:bg-white/10 text-rose-400" : "brand-gradient text-brand-foreground"}`}>{twoFAEnabled ? "Disable" : "Enable"}</button>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <button data-no-toast onClick={async () => { await signOut(); navigate({ to: "/login" }); }} className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm font-medium">Sign Out</button>
      </GlassCard>

      <EditModal open={editOpen} onClose={() => setEditOpen(false)} name={name} phone={(session?.user?.phone as string) || ""} country={(session?.user?.country as string) || ""} avatarUrl={(session?.user?.avatarUrl as string) || ""} onSaved={refresh} />
      <PasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </div>
  );
}

function EditModal({ open, onClose, name, phone, country, avatarUrl, onSaved }: { open: boolean; onClose: () => void; name: string; phone: string; country: string; avatarUrl: string; onSaved: () => void }) {
  const [form, setForm] = useState({ name, phone, country, avatarUrl });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const { user } = await api.updateProfile(form);
      setSessionUser(user);
      onSaved();
      toast.success("Profile updated");
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Full Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <Field label="Phone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></Field>
        <Field label="Country"><input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className={inputCls} /></Field>
        <Field label="Avatar URL"><input value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} className={inputCls} placeholder="https://..." /></Field>
        <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </Modal>
  );
}

function PasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [current, setCurrent] = useState(""); const [next, setNext] = useState(""); const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) { toast.error("New password must be at least 8 characters"); return; }
    if (next !== confirm) { toast.error("Passwords do not match"); return; }
    setSubmitting(true);
    try {
      await api.changePassword(current, next);
      toast.success("Password updated");
      setCurrent(""); setNext(""); setConfirm("");
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update password");
    } finally { setSubmitting(false); }
  };
  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Current Password"><input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className={inputCls} /></Field>
        <Field label="New Password"><input type="password" value={next} onChange={(e) => setNext(e.target.value)} className={inputCls} /></Field>
        <Field label="Confirm New Password"><input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} /></Field>
        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60">{submitting ? "Updating…" : "Update Password"}</button>
      </form>
    </Modal>
  );
}
