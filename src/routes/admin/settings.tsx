import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, SectionTitle, Field, inputCls } from "@/components/dashboard/primitives";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettingsPage });

function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [maintenance, setMaintenance] = useState(false);
  const [signup, setSignup] = useState(true);
  const [kycRequired, setKycRequired] = useState(true);
  const [minDeposit, setMinDeposit] = useState(50);
  const [minWithdraw, setMinWithdraw] = useState(20);
  const [supportEmail, setSupportEmail] = useState("support@legionfx.com");
  const [platformName, setPlatformName] = useState("LEGIONFX");
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, inApp: true });

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <GlassCard className="p-5">
        <SectionTitle title="Platform" subtitle="Global identity and public settings"/>
        <div className="space-y-3">
          <Field label="Platform Name"><input value={platformName} onChange={e=>setPlatformName(e.target.value)} className={inputCls}/></Field>
          <Field label="Support Email"><input value={supportEmail} onChange={e=>setSupportEmail(e.target.value)} className={inputCls}/></Field>
          <Field label="Theme">
            <div className="grid grid-cols-2 gap-2">
              {(["dark","light"] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)} className={`py-2 rounded-lg text-sm border ${theme === t ? "border-brand bg-brand/10 text-brand" : "border-white/10 text-muted-foreground hover:bg-white/5"}`}>{t}</button>
              ))}
            </div>
          </Field>
          <button onClick={() => toast.success("Platform settings saved")} className="w-full mt-2 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Save changes</button>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="Access" subtitle="User signup and compliance"/>
        <div className="space-y-3">
          <Toggle label="Maintenance mode" desc="Show a maintenance banner and disable trades." checked={maintenance} onChange={setMaintenance}/>
          <Toggle label="Signups open" desc="Allow new user registrations." checked={signup} onChange={setSignup}/>
          <Toggle label="KYC required" desc="Users must verify identity before withdrawals." checked={kycRequired} onChange={setKycRequired}/>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="Finance" subtitle="Deposit and withdrawal thresholds"/>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Min deposit ($)"><input type="number" value={minDeposit} onChange={e=>setMinDeposit(Number(e.target.value))} className={inputCls}/></Field>
          <Field label="Min withdraw ($)"><input type="number" value={minWithdraw} onChange={e=>setMinWithdraw(Number(e.target.value))} className={inputCls}/></Field>
        </div>
        <button onClick={() => toast.success("Finance thresholds saved")} className="w-full mt-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Save</button>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="Notification Channels" subtitle="Enable broadcast channels globally"/>
        <div className="space-y-3">
          {(["email","sms","push","inApp"] as const).map(k => (
            <Toggle key={k} label={k === "inApp" ? "In-App" : k.toUpperCase()} desc={`Send ${k} notifications to users.`} checked={notifs[k]} onChange={(v)=>setNotifs({ ...notifs, [k]: v })}/>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="glass rounded-xl p-3 flex items-center gap-3 cursor-pointer">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[10px] text-muted-foreground">{desc}</div>
      </div>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="accent-[oklch(0.72_0.19_50)] scale-125"/>
    </label>
  );
}
