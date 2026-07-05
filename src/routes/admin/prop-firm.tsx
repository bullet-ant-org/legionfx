import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminChallenges, type AdminChallenge } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/prop-firm")({ component: PropFirmPage });

function PropFirmPage() {
  const [items, setItems] = useState<AdminChallenge[]>(adminChallenges);
  const [edit, setEdit] = useState<AdminChallenge | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const toggle = (id: string) => { setItems(x => x.map(c => c.id === id ? { ...c, active: !c.active } : c)); toast.success("Challenge visibility updated"); };
  const remove = (id: string) => { setItems(x => x.filter(c => c.id !== id)); toast.success("Removed"); };
  const save = (c: AdminChallenge) => { setItems(list => list.some(x=>x.id===c.id) ? list.map(x=>x.id===c.id?c:x) : [...list, c]); setEdit(null); setAddOpen(false); toast.success("Saved"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Active Challenges" value={items.filter(i=>i.active).length}/>
        <StatCard label="Total Buyers" value={items.reduce((a,b)=>a+b.buyers,0)} delta="+42 wk"/>
        <StatCard label="Fee Revenue" value={items.reduce((a,b)=>a+b.buyers*b.fee,0)} prefix="$"/>
        <StatCard label="Total Capital" value={items.reduce((a,b)=>a+b.buyers*b.size,0)} prefix="$"/>
      </div>

      <GlassCard className="p-4 flex items-center justify-between">
        <div className="text-sm font-semibold">Challenge Configurations</div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Challenge</button>
      </GlassCard>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(c => (
          <GlassCard key={c.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">${(c.size/1000).toFixed(0)}K account size</div>
              </div>
              <label className="text-[10px] text-muted-foreground inline-flex items-center gap-1"><input type="checkbox" checked={c.active} onChange={() => toggle(c.id)} className="accent-[oklch(0.72_0.19_50)]"/>Live</label>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="glass rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Fee</div><div className="font-semibold">${c.fee}</div></div>
              <div className="glass rounded-lg p-2"><div className="text-[10px] text-muted-foreground">Buyers</div><div className="font-semibold">{c.buyers}</div></div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button onClick={() => setEdit(c)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1"><Pencil size={12}/> Edit</button>
              <button onClick={() => remove(c.id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs inline-flex items-center justify-center gap-1"><Trash2 size={12}/> Delete</button>
            </div>
          </GlassCard>
        ))}
      </div>

      <Modal open={!!edit || addOpen} onClose={() => { setEdit(null); setAddOpen(false); }} title={edit ? "Edit challenge" : "Add challenge"}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          save({ id: edit?.id || `ch-${Date.now()}`, name: String(fd.get("name")||""), size: Number(fd.get("size")||10000), fee: Number(fd.get("fee")||99), active: fd.get("active")==="on", buyers: edit?.buyers ?? 0 });
        }} className="space-y-3">
          <Field label="Name"><input name="name" required defaultValue={edit?.name} className={inputCls}/></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Account Size ($)"><input name="size" type="number" defaultValue={edit?.size ?? 10000} className={inputCls}/></Field>
            <Field label="Fee ($)"><input name="fee" type="number" defaultValue={edit?.fee ?? 99} className={inputCls}/></Field>
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-muted-foreground"><input type="checkbox" name="active" defaultChecked={edit?.active ?? true} className="accent-[oklch(0.72_0.19_50)]"/> Active on public site</label>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{edit ? "Save" : "Create challenge"}</button>
        </form>
      </Modal>
    </div>
  );
}
