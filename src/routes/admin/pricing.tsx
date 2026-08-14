import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, DollarSign, Star, X } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminPricingPlan } from "@/lib/api";

export const Route = createFileRoute("/admin/pricing")({ ssr: false, component: PricingAdminPage });

function PricingAdminPage() {
  const [plans, setPlans] = useState<AdminPricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPricingPlan | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listPricingPlans()
      .then((r) => setPlans(r.plans))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load pricing plans"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleActive = async (p: AdminPricingPlan) => {
    try {
      const { plan } = await adminApi.updatePricingPlan(p._id, { active: !p.active });
      setPlans((list) => list.map((x) => (x._id === p._id ? { ...x, ...plan } : x)));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update plan");
    }
  };

  const toggleFeatured = async (p: AdminPricingPlan) => {
    try {
      const { plan } = await adminApi.updatePricingPlan(p._id, { featured: !p.featured });
      setPlans((list) => list.map((x) => (x._id === p._id ? { ...x, ...plan } : x)));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update plan");
    }
  };

  const remove = async (id: string) => {
    try {
      await adminApi.deletePricingPlan(id);
      setPlans((list) => list.filter((x) => x._id !== id));
      toast.success("Plan removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete plan");
    }
  };

  const save = async (data: { name: string; price: number; interval: string; tagline: string; features: string[] }) => {
    try {
      if (editing) {
        const { plan } = await adminApi.updatePricingPlan(editing._id, data);
        setPlans((list) => list.map((x) => (x._id === editing._id ? { ...x, ...plan } : x)));
        toast.success("Plan updated");
      } else {
        const { plan } = await adminApi.createPricingPlan(data);
        setPlans((list) => [...list, { ...plan, subscribers: 0 }]);
        toast.success("Plan created");
      }
      setEditing(null); setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save plan");
    }
  };

  const totalSubs = plans.reduce((a, p) => a + p.subscribers, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Plans" value={plans.length}/>
        <StatCard label="Live" value={plans.filter(p=>p.active).length}/>
        <StatCard label="Subscribers" value={totalSubs}/>
        <StatCard label="Est. MRR" value={plans.filter(p=>p.interval==="monthly").reduce((a,p)=>a+p.price*p.subscribers,0)} prefix="$"/>
      </div>

      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Pricing Plans</div>
          <div className="text-xs text-muted-foreground">Subscribers shown reflect real users on that plan name.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Plan</button>
      </GlassCard>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-64 rounded-2xl glass animate-pulse"/>)}</div>
      ) : plans.length === 0 ? (
        <GlassCard className="p-10 text-center"><DollarSign size={22} className="mx-auto text-brand"/><div className="mt-3 text-sm font-medium">No pricing plans yet</div></GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <GlassCard key={p._id} className={`p-5 relative ${p.featured ? "border-brand/40" : ""}`}>
              {p.featured && <span className="absolute top-4 right-4 text-[9px] px-2 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">FEATURED</span>}
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">{p.tagline || "—"}</div>
              <div className="mt-2 text-2xl font-bold">${p.price}<span className="text-xs text-muted-foreground font-normal">/{p.interval === "one-time" ? "once" : p.interval.replace("ly","")}</span></div>
              <ul className="mt-3 space-y-1 text-[11px]">
                {p.features.slice(0,4).map((f,i) => <li key={i} className="text-muted-foreground">• {f}</li>)}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Subscribers</div><div className="font-semibold">{p.subscribers}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Status</div><div className="font-semibold">{p.active ? "Live" : "Hidden"}</div></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="flex-1 flex items-center justify-between text-[10px] text-muted-foreground rounded-lg bg-white/[0.03] px-2 py-1.5">
                  Live <input type="checkbox" checked={p.active} onChange={() => toggleActive(p)} className="accent-[oklch(0.70_0.19_47)]"/>
                </label>
                <button onClick={() => toggleFeatured(p)} data-no-toast className={`p-1.5 rounded-lg ${p.featured ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground hover:bg-white/10"}`} aria-label="Toggle featured"><Star size={14}/></button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setEditing(p)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1.5"><Pencil size={12}/> Edit</button>
                <button onClick={() => remove(p._id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs inline-flex items-center justify-center gap-1.5"><Trash2 size={12}/> Delete</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <PlanModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save}/>
    </div>
  );
}

function PlanModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: AdminPricingPlan | null; onSave: (d: { name: string; price: number; interval: string; tagline: string; features: string[] }) => void }) {
  const [features, setFeatures] = useState<string[]>(initial?.features ?? []);
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => { setFeatures(initial?.features ?? []); }, [initial, open]);

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit plan" : "Add plan"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          name: String(fd.get("name") || ""),
          price: Number(fd.get("price") || 0),
          interval: String(fd.get("interval") || "monthly"),
          tagline: String(fd.get("tagline") || ""),
          features,
        });
      }} className="space-y-3">
        <Field label="Name"><input name="name" required defaultValue={initial?.name} className={inputCls} placeholder="Pro"/></Field>
        <Field label="Tagline"><input name="tagline" defaultValue={initial?.tagline} className={inputCls} placeholder="For serious traders"/></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price ($)"><input name="price" type="number" required defaultValue={initial?.price} className={inputCls}/></Field>
          <Field label="Interval"><select name="interval" defaultValue={initial?.interval ?? "monthly"} className={inputCls}><option value="monthly">Monthly</option><option value="yearly">Yearly</option><option value="one-time">One-time</option></select></Field>
        </div>
        <Field label="Features">
          <div className="flex gap-2">
            <input value={featureInput} onChange={(e)=>setFeatureInput(e.target.value)} className={inputCls} placeholder="Add a feature and press Enter" onKeyDown={(e)=>{ if(e.key==="Enter"){ e.preventDefault(); if(featureInput.trim()){ setFeatures(f=>[...f, featureInput.trim()]); setFeatureInput(""); } } }}/>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {features.map((f,i) => (
              <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-white/5 border border-white/10 inline-flex items-center gap-1.5">
                {f} <button type="button" onClick={()=>setFeatures(list=>list.filter((_,idx)=>idx!==i))}><X size={10}/></button>
              </span>
            ))}
          </div>
        </Field>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Create plan"}</button>
      </form>
    </Modal>
  );
}
