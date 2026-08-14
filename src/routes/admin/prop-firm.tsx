import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Trophy, Star } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard, StatusPill } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminPropFirmPlan } from "@/lib/api";

export const Route = createFileRoute("/admin/prop-firm")({ ssr: false, component: PropFirmAdminPage });

function PropFirmAdminPage() {
  const [plans, setPlans] = useState<AdminPropFirmPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminPropFirmPlan | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listPropFirmPlans()
      .then((r) => setPlans(r.plans))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load plans"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleActive = async (p: AdminPropFirmPlan) => {
    try {
      const { plan } = await adminApi.updatePropFirmPlan(p._id, { active: !p.active });
      setPlans((list) => list.map((x) => (x._id === p._id ? { ...x, ...plan } : x)));
      toast.success(plan.active ? "Plan published" : "Plan hidden");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update plan");
    }
  };

  const togglePopular = async (p: AdminPropFirmPlan) => {
    try {
      const { plan } = await adminApi.updatePropFirmPlan(p._id, { popular: !p.popular });
      setPlans((list) => list.map((x) => (x._id === p._id ? { ...x, ...plan } : x)));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update plan");
    }
  };

  const remove = async (id: string) => {
    try {
      await adminApi.deletePropFirmPlan(id);
      setPlans((list) => list.filter((x) => x._id !== id));
      toast.success("Plan removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete plan");
    }
  };

  const save = async (data: { size: number; price: number; profitSplit: number }) => {
    try {
      if (editing) {
        const { plan } = await adminApi.updatePropFirmPlan(editing._id, data);
        setPlans((list) => list.map((x) => (x._id === editing._id ? { ...x, ...plan } : x)));
        toast.success("Plan updated");
      } else {
        const { plan } = await adminApi.createPropFirmPlan(data);
        setPlans((list) => [...list, { ...plan, buyers: 0 }].sort((a,b)=>a.size-b.size));
        toast.success("Plan created");
      }
      setEditing(null); setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save plan");
    }
  };

  const totalBuyers = plans.reduce((a, p) => a + p.buyers, 0);
  const totalRevenue = plans.reduce((a, p) => a + p.buyers * p.price, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Plans" value={plans.length}/>
        <StatCard label="Live Plans" value={plans.filter(p=>p.active).length}/>
        <StatCard label="Total Buyers" value={totalBuyers}/>
        <StatCard label="Est. Revenue" value={totalRevenue} prefix="$"/>
      </div>

      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Challenge Plans</div>
          <div className="text-xs text-muted-foreground">Account sizes, fees and profit splits shown to clients.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Plan</button>
      </GlassCard>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-56 rounded-2xl glass animate-pulse"/>)}</div>
      ) : plans.length === 0 ? (
        <GlassCard className="p-10 text-center"><Trophy size={22} className="mx-auto text-brand"/><div className="mt-3 text-sm font-medium">No plans yet</div></GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <GlassCard key={p._id} className="p-5 relative">
              {p.popular && <span className="absolute top-4 right-4 text-[9px] px-2 py-1 rounded-full bg-brand/15 text-brand border border-brand/30">POPULAR</span>}
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><Trophy size={16}/></div>
              <div className="mt-3 text-lg font-bold">${(p.size/1000).toFixed(0)}K Account</div>
              <div className="text-[11px] text-muted-foreground">Fee ${p.price} · {p.profitSplit}% profit split</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-white/[0.03] p-2 text-center"><div className="text-muted-foreground text-[9px]">Buyers</div><div className="font-semibold">{p.buyers}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2 text-center"><div className="text-muted-foreground text-[9px]">Status</div><StatusPill status={p.active ? "Completed" : "Failed"}/></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <label className="flex-1 flex items-center justify-between text-[10px] text-muted-foreground rounded-lg bg-white/[0.03] px-2 py-1.5">
                  Live <input type="checkbox" checked={p.active} onChange={() => toggleActive(p)} className="accent-[oklch(0.70_0.19_47)]"/>
                </label>
                <button onClick={() => togglePopular(p)} data-no-toast className={`p-1.5 rounded-lg ${p.popular ? "text-amber-400 bg-amber-400/10" : "text-muted-foreground hover:bg-white/10"}`} aria-label="Toggle popular"><Star size={14}/></button>
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

function PlanModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: AdminPropFirmPlan | null; onSave: (d: { size: number; price: number; profitSplit: number }) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit plan" : "Add plan"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          size: Number(fd.get("size") || 0),
          price: Number(fd.get("price") || 0),
          profitSplit: Number(fd.get("profitSplit") || 80),
        });
      }} className="space-y-3">
        <Field label="Account size ($)"><input name="size" type="number" required defaultValue={initial?.size} className={inputCls} placeholder="100000"/></Field>
        <Field label="Fee ($)"><input name="price" type="number" required defaultValue={initial?.price} className={inputCls} placeholder="499"/></Field>
        <Field label="Profit split (%)"><input name="profitSplit" type="number" defaultValue={initial?.profitSplit ?? 80} className={inputCls}/></Field>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Create plan"}</button>
      </form>
    </Modal>
  );
}
