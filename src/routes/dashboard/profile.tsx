import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Calendar, Award, TrendingUp, CheckCircle2,
  FileText, Camera, Edit, Shield, Star, Briefcase, X,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { achievements } from "@/lib/demo-data";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError } from "@/lib/api";
import { setSessionUser, deactivateAccount, deleteAccount } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  ssr: false,
  component: ProfilePage,
});

const documents = [
  { name: "Government ID", type: "Passport / National ID", status: "Not uploaded" },
  { name: "Proof of Address", type: "Utility bill / bank statement", status: "Not uploaded" },
  { name: "Tax Certificate", type: "Latest tax year", status: "Not uploaded" },
  { name: "Bank Statement", type: "Last 3 months", status: "Not uploaded" },
];

function ProfilePage() {
  const { session, wallet, refresh } = useDashboardData();
  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  const name = session?.name || "Trader";
  const email = session?.email || "";
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "U";
  const plan = (session?.user?.plan as string) ?? "Starter";
  const status = (session?.user?.status as string) ?? "Active";
  const kyc = (session?.user?.kyc as string) ?? "Pending";
  const phone = (session?.user?.phone as string) || "Not set";
  const country = (session?.user?.country as string) || "Not set";
  const joined = session?.user?.createdAt
    ? new Date(session.user.createdAt as string).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "—";

  const kycChecks: [string, boolean][] = [
    ["Email verified", true],
    ["Phone verified", !!phone && phone !== "Not set"],
    ["Identity verified", kyc === "Verified"],
    ["Address verified", kyc === "Verified"],
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Your personal information, verification status and trading history.</p>
      </motion.div>

      {/* Profile header */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 h-40 brand-gradient opacity-20" />
        <div className="relative grid md:grid-cols-[auto_1fr_auto] gap-5 items-end">
          <div className="relative">
            <div className="h-28 w-28 rounded-3xl brand-gradient grid place-items-center text-4xl font-bold text-brand-foreground shadow-glow border-4 border-background overflow-hidden">
              {session?.user?.avatarUrl ? (
                <img src={session.user.avatarUrl as string} alt={name} className="h-full w-full object-cover" />
              ) : initials}
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-xl glass-strong grid place-items-center text-brand hover:bg-white/10"
              aria-label="Change photo"
            ><Camera size={13} /></button>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-2xl font-bold">{name}</h2>
              <span className="text-[10px] px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 font-semibold">{plan}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full border inline-flex items-center gap-1 ${status === "Active" ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-amber-400/10 text-amber-400 border-amber-400/20"}`}>
                <CheckCircle2 size={10} /> {status}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Member since {joined}</div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Mail size={12} /> {email}</span>
              <span className="flex items-center gap-1.5"><Phone size={12} /> {phone}</span>
              <span className="flex items-center gap-1.5"><MapPin size={12} /> {country}</span>
              <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined {joined}</span>
            </div>
          </div>
          <button onClick={() => setEditOpen(true)} className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2"><Edit size={13} /> Edit Profile</button>
        </div>
      </GlassCard>

      {/* Trader stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Portfolio" value={(wallet?.available ?? 0) + (wallet?.locked ?? 0)} prefix="$" decimals={0} icon={<TrendingUp size={14} />} />
        <StatCard label="Total Deposits" value={wallet?.totalDeposits ?? 0} prefix="$" decimals={0} icon={<Briefcase size={14} />} />
        <StatCard label="Total Profit" value={wallet?.totalProfit ?? 0} prefix="$" decimals={0} icon={<Award size={14} />} />
        <StatCard label="Referral Earnings" value={wallet?.referralEarnings ?? 0} prefix="$" decimals={0} icon={<Star size={14} />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Personal info */}
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Personal Information" action={<button onClick={() => setEditOpen(true)} className="text-xs text-brand hover:underline">Edit</button>} />
          <div className="grid md:grid-cols-2 gap-3">
            {[
              ["Full Name", name],
              ["Email", email],
              ["Phone", phone],
              ["Country", country],
              ["Plan", plan],
              ["Account Status", status],
              ["Verification", kyc],
              ["Member Since", joined],
            ].map(([k, v]) => (
              <div key={k} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                <div className="text-sm font-medium mt-0.5">{v}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Verification */}
        <GlassCard className="p-5">
          <SectionTitle title="Verification Level" />
          <div className="text-center">
            <div className="h-20 w-20 mx-auto rounded-2xl brand-gradient grid place-items-center text-brand-foreground shadow-glow">
              <Shield size={28} />
            </div>
            <div className="mt-3 text-lg font-bold">{kyc === "Verified" ? "Fully Verified" : kyc}</div>
            <div className="text-[10px] text-muted-foreground">{kyc === "Verified" ? "Full access to all features" : "Complete verification to unlock full access"}</div>
            <div className="mt-4 space-y-2 text-left">
              {kycChecks.map(([l, ok]) => (
                <div key={l} className="flex items-center gap-2 text-xs">
                  {ok ? <CheckCircle2 size={12} className="text-emerald-400" /> : <X size={12} className="text-muted-foreground" />}
                  <span className={ok ? "text-muted-foreground" : "text-muted-foreground/60"}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Documents */}
      <GlassCard className="p-5">
        <SectionTitle
          title="Uploaded Documents"
          action={<button onClick={() => toast.info("Document uploads are coming soon — contact support to verify your account for now.")} className="text-xs px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground">Upload New</button>}
        />
        <div className="grid md:grid-cols-2 gap-3">
          {documents.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              <div className="h-11 w-11 rounded-xl glass grid place-items-center text-muted-foreground"><FileText size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{d.name}</div>
                <div className="text-[10px] text-muted-foreground">{d.type}</div>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-muted-foreground">{d.status}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Achievements */}
      <GlassCard className="p-5">
        <SectionTitle title="Achievements" subtitle="Milestones you've unlocked" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {achievements.map((a) => (
            <div key={a.label} className={`rounded-xl p-4 text-center border ${a.earned ? "brand-gradient border-brand/30 text-brand-foreground shadow-glow" : "glass border-white/5 opacity-40"}`}>
              <Award size={20} className="mx-auto" />
              <div className="text-[10px] font-semibold mt-2">{a.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Danger zone */}
      <GlassCard className="p-5 border border-rose-500/20">
        <SectionTitle title="Danger Zone" subtitle="Irreversible account actions" />
        <div className="grid md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
            <div className="text-sm font-semibold">Deactivate Account</div>
            <div className="text-[10px] text-muted-foreground mt-1">Temporarily disable your account. Contact support to reactivate.</div>
            <button onClick={() => setDeactivateOpen(true)} className="mt-3 px-3 py-1.5 rounded-lg glass hover:bg-white/10 text-xs text-rose-400">Deactivate</button>
          </div>
          <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
            <div className="text-sm font-semibold">Delete Account</div>
            <div className="text-[10px] text-muted-foreground mt-1">Permanently remove your account and all associated data.</div>
            <button onClick={() => setDeleteOpen(true)} className="mt-3 px-3 py-1.5 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white text-xs font-medium">Delete Account</button>
          </div>
        </div>
      </GlassCard>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={name}
        initialPhone={phone === "Not set" ? "" : phone}
        initialCountry={country === "Not set" ? "" : country}
        initialAvatarUrl={(session?.user?.avatarUrl as string) || ""}
        onSaved={() => { refresh(); }}
      />

      <DeactivateModal
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onDeactivated={() => navigate({ to: "/login" })}
      />

      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onDeleted={() => navigate({ to: "/login" })}
      />
    </div>
  );
}

function EditProfileModal({ open, onClose, initialName, initialPhone, initialCountry, initialAvatarUrl, onSaved }: {
  open: boolean; onClose: () => void;
  initialName: string; initialPhone: string; initialCountry: string; initialAvatarUrl: string;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState(initialCountry);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    setSubmitting(true);
    try {
      const { user } = await api.updateProfile({ name: name.trim(), phone: phone.trim(), country: country.trim(), avatarUrl: avatarUrl.trim() });
      setSessionUser(user);
      toast.success("Profile updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Phone"><input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className={inputCls} /></Field>
        <Field label="Country"><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g. Nigeria" className={inputCls} /></Field>
        <Field label="Avatar URL"><input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." className={inputCls} /></Field>
        <p className="text-[11px] text-muted-foreground">Direct file upload isn't available yet — paste a link to an image instead.</p>
        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium disabled:opacity-60">
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}

function DeactivateModal({ open, onClose, onDeactivated }: { open: boolean; onClose: () => void; onDeactivated: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const confirm = async () => {
    setSubmitting(true);
    try {
      await deactivateAccount();
      toast.success("Account deactivated");
      onDeactivated();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not deactivate account");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose} title="Deactivate account">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Your account will be suspended and you'll be signed out immediately. Contact support to reactivate it later.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onClose} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button onClick={confirm} disabled={submitting} className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium disabled:opacity-60">
            {submitting ? "Deactivating…" : "Deactivate"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DeleteModal({ open, onClose, onDeleted }: { open: boolean; onClose: () => void; onDeleted: () => void }) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) { toast.error("Enter your password to confirm"); return; }
    setSubmitting(true);
    try {
      await deleteAccount(password);
      toast.success("Account deleted");
      onDeleted();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { setPassword(""); onClose(); }} title="Delete account">
      <form onSubmit={confirm} className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This permanently deletes your account and all associated data. This cannot be undone. Enter your password to confirm.
        </p>
        <Field label="Password"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="••••••••" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => { setPassword(""); onClose(); }} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Cancel</button>
          <button type="submit" disabled={submitting} className="py-2.5 rounded-xl bg-rose-500/90 hover:bg-rose-500 text-white text-sm font-medium disabled:opacity-60">
            {submitting ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
