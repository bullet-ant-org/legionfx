import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, Users } from "lucide-react";
import { GlassCard, Modal, Field, inputCls } from "@/components/dashboard/primitives";
import { pricingPlans, type PricingPlan } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/pricing")({ component: PricingPage });

function PricingPage() {
  const [items, setItems] = useState<PricingPlan[]>(pricingPlans);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const setFeatured = (id: string) => { setItems(items.map(p => ({ ...p, featured: p.id === id }))); toast.success("Featured plan updated"); };
  const toggle = (id: string) => { setItems(items.map(p => p.id === id ? { ...p, active: !p.active } : p)); toast.success("Plan visibility updated"); };
  const remove = (id: string) => { setItems(items.filter(p => p.id !== id)); toast.success("Plan removed"); };
  const save = (p: PricingPlan) => {
    setItems(list => list.some(x => x.id === p.id) ? list.map(x => x.id === p.id ? p : x) : [...list, p]);
    setEditing(null); setAddOpen(false);
    toast.success("Plan saved");
  };

  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Subscription Plans</div>
          <div className="text-xs text-muted-foreground">Configure LEGIONFX pricing tiers and included features.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Plan</button>
      </GlassCard>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {items.map(p => (
          <GlassCard key={p.id} className={`p-5 relative ${p.featured ? "ring-1 ring-brand/40" : ""}`}>
            {p.featured && <div className="absolute -top-2 left-4 px-2 py-0.5 rounded-full brand-gradient text-brand-foreground text-[10px] font-semibold">Featured</div>}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{p.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{p.tagline}</div>
              </div>
              <label className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"><input type="checkbox" checked={p.active} onChange={() => toggle(p.id)} className="accent-[oklch(0.72_0.19_50)]"/> Live</label>
            </div>
            <div className="mt-4 flex items-baseline gap-1"><span className="text-3xl font-bold text-gradient">${p.price}</span><span className="text-xs text-muted-foreground">/{p.interval}</span></div>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground"><Users size={11}/> {p.subscribers.toLocaleString()} subscribers</div>
            <ul className="mt-4 space-y-1.5 text-xs">
              {p.features.map(f => <li key={f} className="flex gap-2"><span className="text-brand">✓</span>{f}</li>)}
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <button onClick={() => setEditing(p)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1"><Pencil size={12}/> Edit</button>
              <button onClick={() => setFeatured(p.id)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1"><Star size={12}/> Feature</button>
              <button onClick={() => remove(p.id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs inline-flex items-center justify-center gap-1"><Trash2 size={12}/></button>
            </div>
          </GlassCard>
        ))}
      </div>

      <PlanModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save}/>
    </div>
  );
}

function PlanModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: PricingPlan | null; onSave: (p: PricingPlan) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit plan" : "Add plan"} size="lg">
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          id: initial?.id || `plan-${Date.now()}`,
          name: String(fd.get("name") || ""),
          price: Number(fd.get("price") || 0),
          interval: (fd.get("interval") as "mo" | "yr") || "mo",
          tagline: String(fd.get("tagline") || ""),
          featured: initial?.featured ?? false,
          active: fd.get("active") === "on",
          features: String(fd.get("features") || "").split("\n").map(s => s.trim()).filter(Boolean),
          subscribers: initial?.subscribers ?? 0,
        });
      }} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><input name="name" required defaultValue={initial?.name} className={inputCls}/></Field>
          <Field label="Tagline"><input name="tagline" defaultValue={initial?.tagline} className={inputCls}/></Field>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Price"><input name="price" type="number" required defaultValue={initial?.price ?? 49} className={inputCls}/></Field>
          <Field label="Interval"><select name="interval" defaultValue={initial?.interval || "mo"} className={inputCls}><option value="mo">Monthly</option><option value="yr">Yearly</option></select></Field>
          <Field label="Active"><label className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" name="active" defaultChecked={initial?.active ?? true} className="accent-[oklch(0.72_0.19_50)]"/> Show on pricing page</label></Field>
        </div>
        <Field label="Features (one per line)"><textarea name="features" rows={5} defaultValue={initial?.features.join("\n")} className={inputCls}/></Field>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save plan" : "Add plan"}</button>
      </form>
    </Modal>
  );
}
