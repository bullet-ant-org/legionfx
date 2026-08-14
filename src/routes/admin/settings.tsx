import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, AlertTriangle } from "lucide-react";
import { GlassCard, SectionTitle, Field, inputCls } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type PlatformSettings } from "@/lib/api";

export const Route = createFileRoute("/admin/settings")({ ssr: false, component: SettingsAdminPage });

function SettingsAdminPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getPlatformSettings()
      .then((r) => setSettings(r.settings))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load settings"))
      .finally(() => setLoading(false));
  }, []);

  const save = async (patch: Partial<PlatformSettings>) => {
    setSaving(true);
    try {
      const { settings: updated } = await adminApi.updatePlatformSettings(patch);
      setSettings(updated);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="grid md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 rounded-2xl glass animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-4">
      {settings.maintenanceMode && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 flex items-center gap-2.5 text-xs text-amber-200/90">
          <AlertTriangle size={14} className="text-amber-400 shrink-0" /> Maintenance mode is currently ON — regular users cannot use the platform.
        </div>
      )}

      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        save({ platformName: String(fd.get("platformName") || ""), supportEmail: String(fd.get("supportEmail") || "") });
      }}>
        <GlassCard className="p-5">
          <SectionTitle title="Platform Identity" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Platform Name"><input name="platformName" defaultValue={settings.platformName} className={inputCls} /></Field>
            <Field label="Support Email"><input name="supportEmail" type="email" defaultValue={settings.supportEmail} className={inputCls} /></Field>
          </div>
          <button type="submit" disabled={saving} className="mt-4 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"><Save size={14}/> Save</button>
        </GlassCard>
      </form>

      <GlassCard className="p-5">
        <SectionTitle title="Access & Compliance" />
        <div className="space-y-2">
          <ToggleRow label="Maintenance Mode" desc="Blocks regular users from the app entirely" checked={settings.maintenanceMode} onChange={(v) => save({ maintenanceMode: v })} danger />
          <ToggleRow label="Signups Open" desc="Allow new account registration" checked={settings.signupsOpen} onChange={(v) => save({ signupsOpen: v })} />
          <ToggleRow label="KYC Required" desc="Require identity verification before withdrawals" checked={settings.kycRequired} onChange={(v) => save({ kycRequired: v })} />
        </div>
      </GlassCard>

      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        save({ minDeposit: Number(fd.get("minDeposit")), minWithdraw: Number(fd.get("minWithdraw")) });
      }}>
        <GlassCard className="p-5">
          <SectionTitle title="Wallet Limits" />
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Minimum Deposit ($)"><input name="minDeposit" type="number" defaultValue={settings.minDeposit} className={inputCls} /></Field>
            <Field label="Minimum Withdrawal ($)"><input name="minWithdraw" type="number" defaultValue={settings.minWithdraw} className={inputCls} /></Field>
          </div>
          <button type="submit" disabled={saving} className="mt-4 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 disabled:opacity-60"><Save size={14}/> Save</button>
        </GlassCard>
      </form>

      <GlassCard className="p-5">
        <SectionTitle title="Notification Channels" subtitle="Which channels admin broadcasts are allowed to use — SMS/push delivery isn't built yet, this just tracks intent" />
        <div className="space-y-2">
          <ToggleRow label="Email" desc="" checked={settings.notifyEmail} onChange={(v) => save({ notifyEmail: v })} />
          <ToggleRow label="SMS" desc="" checked={settings.notifySms} onChange={(v) => save({ notifySms: v })} />
          <ToggleRow label="Push" desc="" checked={settings.notifyPush} onChange={(v) => save({ notifyPush: v })} />
          <ToggleRow label="In-App" desc="" checked={settings.notifyInApp} onChange={(v) => save({ notifyInApp: v })} />
        </div>
      </GlassCard>
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange, danger }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; danger?: boolean }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${danger && checked ? "bg-rose-500/10 border-rose-500/30" : "bg-white/[0.03] border-white/5"}`}>
      <div className="flex-1 min-w-0"><div className="text-sm font-medium">{label}</div>{desc && <div className="text-[10px] text-muted-foreground">{desc}</div>}</div>
      <button onClick={() => onChange(!checked)} className={`h-6 w-11 rounded-full transition relative shrink-0 ${checked ? (danger ? "bg-rose-500" : "brand-gradient") : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
