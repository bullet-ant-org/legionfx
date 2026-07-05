import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, Key, Smartphone, LogOut } from "lucide-react";
import { GlassCard, SectionTitle, Field, inputCls, Modal, StatusPill } from "@/components/dashboard/primitives";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/admin/profile")({ component: AdminProfilePage });

function AdminProfilePage() {
  const [pwOpen, setPwOpen] = useState(false);
  const [tfaOpen, setTfaOpen] = useState(false);
  return (
    <div className="grid lg:grid-cols-[1fr_1.4fr] gap-4">
      <GlassCard className="p-6 text-center">
        <div className="h-24 w-24 mx-auto rounded-2xl brand-gradient grid place-items-center text-brand-foreground text-2xl font-bold shadow-glow">A</div>
        <div className="mt-4 text-lg font-semibold">LEGIONFX Admin</div>
        <div className="text-xs text-muted-foreground">admin@gmail.com</div>
        <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-brand"><ShieldCheck size={12}/> Super Admin</div>
        <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
          <Mini k="Sessions" v="12"/><Mini k="Actions" v="284"/><Mini k="Since" v="2023"/>
        </div>
        <button onClick={() => { signOut(); window.location.href = "/login"; }} className="mt-6 w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm inline-flex items-center justify-center gap-2"><LogOut size={14}/> Sign out</button>
      </GlassCard>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <SectionTitle title="Profile" subtitle="Basic admin identity"/>
          <form onSubmit={(e)=>{e.preventDefault(); toast.success("Profile saved");}} className="grid sm:grid-cols-2 gap-3">
            <Field label="Full Name"><input defaultValue="LEGIONFX Admin" className={inputCls}/></Field>
            <Field label="Email"><input defaultValue="admin@gmail.com" className={inputCls}/></Field>
            <Field label="Role"><input disabled defaultValue="Super Admin" className={inputCls}/></Field>
            <Field label="Phone"><input defaultValue="+1 (555) 010-4520" className={inputCls}/></Field>
            <div className="sm:col-span-2"><button className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Save profile</button></div>
          </form>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Security" subtitle="Protect the admin console"/>
          <div className="space-y-3">
            <div className="glass rounded-xl p-3 flex items-center gap-3">
              <Key size={16} className="text-brand"/>
              <div className="flex-1"><div className="text-sm font-medium">Password</div><div className="text-[10px] text-muted-foreground">Last changed 42 days ago</div></div>
              <button onClick={() => setPwOpen(true)} data-no-toast className="px-3 py-2 rounded-lg glass hover:bg-white/10 text-xs">Change</button>
            </div>
            <div className="glass rounded-xl p-3 flex items-center gap-3">
              <Smartphone size={16} className="text-brand"/>
              <div className="flex-1"><div className="text-sm font-medium">Two-factor authentication</div><div className="text-[10px] text-muted-foreground">Authenticator app</div></div>
              <StatusPill status="Active"/>
              <button onClick={() => setTfaOpen(true)} data-no-toast className="px-3 py-2 rounded-lg glass hover:bg-white/10 text-xs">Manage</button>
            </div>
          </div>
        </GlassCard>
      </div>

      <Modal open={pwOpen} onClose={()=>setPwOpen(false)} title="Change admin password">
        <form onSubmit={(e)=>{e.preventDefault(); setPwOpen(false); toast.success("Password updated");}} className="space-y-3">
          <Field label="Current password"><input type="password" required className={inputCls}/></Field>
          <Field label="New password"><input type="password" required className={inputCls}/></Field>
          <Field label="Confirm new password"><input type="password" required className={inputCls}/></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Update password</button>
        </form>
      </Modal>

      <Modal open={tfaOpen} onClose={()=>setTfaOpen(false)} title="Two-factor authentication">
        <div className="space-y-3 text-sm">
          <p className="text-muted-foreground">2FA is currently <span className="text-emerald-400">active</span> via your authenticator app.</p>
          <div className="glass rounded-xl p-3 font-mono text-xs">Recovery codes: L3G-9F2-84K · L3G-88J-11P · L3G-72M-56R</div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={()=>{setTfaOpen(false); toast.success("Recovery codes regenerated");}} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Regenerate</button>
            <button onClick={()=>{setTfaOpen(false); toast.success("2FA disabled");}} className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm">Disable 2FA</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return <div className="glass rounded-lg p-2"><div className="text-[9px] uppercase text-muted-foreground">{k}</div><div className="text-sm font-semibold mt-0.5">{v}</div></div>;
}
