import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Play, Pause, Trash2, Pencil, Plus } from "lucide-react";
import { GlassCard, StatusPill, Modal, Field, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminBots, type AdminBot } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/bots")({ component: BotsPage });

function BotsPage() {
  const [bots, setBots] = useState<AdminBot[]>(adminBots);
  const [edit, setEdit] = useState<AdminBot | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const toggle = (id: string) => { setBots(b => b.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Paused" : "Active" } : x)); toast.success("Bot status updated"); };
  const remove = (id: string) => { setBots(b => b.filter(x => x.id !== id)); toast.success("Bot removed"); };
  const save = (b: AdminBot) => { setBots(list => list.some(x=>x.id===b.id) ? list.map(x=>x.id===b.id?b:x) : [b, ...list]); setEdit(null); setAddOpen(false); toast.success("Bot saved"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Bots" value={bots.length}/>
        <StatCard label="Subscribers" value={bots.reduce((a,b)=>a+b.users,0)} delta="+18 wk"/>
        <StatCard label="Avg Win Rate" value={Math.round(bots.reduce((a,b)=>a+b.win,0)/bots.length)} suffix="%"/>
        <StatCard label="Total Profit" value={bots.reduce((a,b)=>a+b.profit,0)} prefix="$"/>
      </div>

      <GlassCard className="p-4 flex items-center justify-between">
        <div className="text-sm font-semibold">Bot Marketplace</div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Bot</button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground border-b border-white/5"><tr>{["Bot","Strategy","Users","Win %","Profit","Status",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {bots.map(b => (
                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-medium">{b.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.strategy}</td>
                  <td className="px-4 py-3">{b.users}</td>
                  <td className="px-4 py-3">{b.win}%</td>
                  <td className="px-4 py-3 font-semibold">${b.profit.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={b.status === "Deprecated" ? "Failed" : b.status}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => toggle(b.id)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Toggle">{b.status === "Active" ? <Pause size={14}/> : <Play size={14}/>}</button>
                      <button onClick={() => setEdit(b)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="Edit"><Pencil size={14}/></button>
                      <button onClick={() => remove(b.id)} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10" aria-label="Delete"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={!!edit || addOpen} onClose={() => { setEdit(null); setAddOpen(false); }} title={edit ? "Edit bot" : "Add bot"}>
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          save({ id: edit?.id || `bot-${Date.now()}`, name: String(fd.get("name")||""), strategy: String(fd.get("strategy")||""), users: Number(fd.get("users")||0), status: (fd.get("status") as AdminBot["status"]) || "Active", win: Number(fd.get("win")||0), profit: Number(fd.get("profit")||0) });
        }} className="space-y-3">
          <Field label="Name"><input name="name" required defaultValue={edit?.name} className={inputCls}/></Field>
          <Field label="Strategy"><input name="strategy" defaultValue={edit?.strategy} className={inputCls}/></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Users"><input name="users" type="number" defaultValue={edit?.users ?? 0} className={inputCls}/></Field>
            <Field label="Win %"><input name="win" type="number" defaultValue={edit?.win ?? 70} className={inputCls}/></Field>
            <Field label="Profit"><input name="profit" type="number" defaultValue={edit?.profit ?? 0} className={inputCls}/></Field>
          </div>
          <Field label="Status"><select name="status" defaultValue={edit?.status || "Active"} className={inputCls}>{["Active","Paused","Deprecated"].map(s=><option key={s}>{s}</option>)}</select></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{edit ? "Save" : "Add bot"}</button>
        </form>
      </Modal>
    </div>
  );
}
