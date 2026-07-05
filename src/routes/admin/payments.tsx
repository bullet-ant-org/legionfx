import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";
import { GlassCard, SectionTitle, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { paymentOptions, type PaymentOption } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const [items, setItems] = useState<PaymentOption[]>(paymentOptions);
  const [editing, setEditing] = useState<PaymentOption | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const toggle = (id: string) => {
    setItems(list => list.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    toast.success("Payment option updated");
  };
  const remove = (id: string) => { setItems(list => list.filter(p => p.id !== id)); toast.success("Removed"); };
  const save = (p: PaymentOption) => {
    setItems(list => list.some(x => x.id === p.id) ? list.map(x => x.id === p.id ? p : x) : [p, ...list]);
    toast.success("Saved");
    setEditing(null); setAddOpen(false);
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Payment Rails</div>
          <div className="text-xs text-muted-foreground">Configure which methods users can deposit and withdraw with.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Method</button>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <GlassCard key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold">{p.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-brand mt-0.5">{p.type} {p.network ? `· ${p.network}` : ""}</div>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <span className="text-[10px] text-muted-foreground">{p.enabled ? "Enabled" : "Disabled"}</span>
                <input type="checkbox" checked={p.enabled} onChange={() => toggle(p.id)} className="accent-[oklch(0.72_0.19_50)]"/>
              </label>
            </div>
            <div className="mt-3 text-xs font-mono truncate bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-2">{p.address}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Mini k="Min" v={`$${p.min}`}/><Mini k="Max" v={`$${(p.max/1000).toFixed(0)}K`}/><Mini k="Fee" v={`${p.fee}%`}/>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setEditing(p)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1.5"><Pencil size={12}/> Edit</button>
              <button onClick={() => remove(p.id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs inline-flex items-center justify-center gap-1.5"><Trash2 size={12}/> Delete</button>
            </div>
          </GlassCard>
        ))}
      </div>

      <PaymentModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save}/>
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return <div className="glass rounded-lg px-2 py-1.5 text-center"><div className="text-[9px] uppercase text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>;
}

function PaymentModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: PaymentOption | null; onSave: (p: PaymentOption) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit payment method" : "Add payment method"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          id: initial?.id || `pay-${Date.now()}`,
          name: String(fd.get("name") || ""),
          type: String(fd.get("type") || "Crypto") as PaymentOption["type"],
          address: String(fd.get("address") || ""),
          network: String(fd.get("network") || "") || undefined,
          enabled: fd.get("enabled") === "on",
          min: Number(fd.get("min") || 0),
          max: Number(fd.get("max") || 0),
          fee: Number(fd.get("fee") || 0),
        });
      }} className="space-y-3">
        <Field label="Name"><input name="name" required defaultValue={initial?.name} className={inputCls}/></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type"><select name="type" defaultValue={initial?.type || "Crypto"} className={inputCls}>{["Crypto","Card","Bank","Wallet"].map(t => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Network"><input name="network" defaultValue={initial?.network} className={inputCls}/></Field>
        </div>
        <Field label="Address / Reference"><input name="address" required defaultValue={initial?.address} className={inputCls}/></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Min $"><input name="min" type="number" defaultValue={initial?.min ?? 50} className={inputCls}/></Field>
          <Field label="Max $"><input name="max" type="number" defaultValue={initial?.max ?? 100000} className={inputCls}/></Field>
          <Field label="Fee %"><input name="fee" type="number" step="0.1" defaultValue={initial?.fee ?? 0} className={inputCls}/></Field>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" name="enabled" defaultChecked={initial?.enabled ?? true} className="accent-[oklch(0.72_0.19_50)]"/> Enabled for users</label>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Add method"}</button>
      </form>
    </Modal>
  );
}
