import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Bot as BotIcon, Users, TrendingUp } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminBot } from "@/lib/api";

export const Route = createFileRoute("/admin/bots")({ ssr: false, component: BotsPage });

function BotsPage() {
  const [bots, setBots] = useState<AdminBot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminBot | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listBots()
      .then((r) => setBots(r.bots))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load bots"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleActive = async (b: AdminBot) => {
    try {
      const { bot } = await adminApi.updateBot(b._id, { active: !b.active });
      setBots((list) => list.map((x) => (x._id === b._id ? { ...x, ...bot } : x)));
      toast.success(bot.active ? "Bot published to marketplace" : "Bot hidden from marketplace");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update bot");
    }
  };

  const remove = async (id: string) => {
    try {
      await adminApi.deleteBot(id);
      setBots((list) => list.filter((x) => x._id !== id));
      toast.success("Bot removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete bot");
    }
  };

  const save = async (data: { name: string; pair: string; risk: string; description: string }) => {
    try {
      if (editing) {
        const { bot } = await adminApi.updateBot(editing._id, data);
        setBots((list) => list.map((x) => (x._id === editing._id ? { ...x, ...bot } : x)));
        toast.success("Bot updated");
      } else {
        const { bot } = await adminApi.createBot(data);
        setBots((list) => [{ ...bot, users: 0, profit: 0, winRate: 0 }, ...list]);
        toast.success("Bot created");
      }
      setEditing(null); setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save bot");
    }
  };

  const totalUsers = bots.reduce((a, b) => a + b.users, 0);
  const totalProfit = bots.reduce((a, b) => a + b.profit, 0);
  const activeCount = bots.filter((b) => b.active).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Bots" value={bots.length}/>
        <StatCard label="Live" value={activeCount}/>
        <StatCard label="Subscribers" value={totalUsers} icon={<Users size={14}/>}/>
        <StatCard label="Aggregate Profit" value={totalProfit} prefix="$" icon={<TrendingUp size={14}/>}/>
      </div>

      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Trading Bots</div>
          <div className="text-xs text-muted-foreground">Manage what's shown in the client marketplace.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> Add Bot</button>
      </GlassCard>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-52 rounded-2xl glass animate-pulse"/>)}</div>
      ) : bots.length === 0 ? (
        <GlassCard className="p-10 text-center"><BotIcon size={22} className="mx-auto text-brand"/><div className="mt-3 text-sm font-medium">No bots yet</div></GlassCard>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bots.map((b) => (
            <GlassCard key={b._id} className="p-5">
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><BotIcon size={16}/></div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <span className="text-[10px] text-muted-foreground">{b.active ? "Live" : "Hidden"}</span>
                  <input type="checkbox" checked={b.active} onChange={() => toggleActive(b)} className="accent-[oklch(0.70_0.19_47)]"/>
                </label>
              </div>
              <div className="mt-3 text-sm font-semibold">{b.name}</div>
              <div className="text-[10px] text-muted-foreground">{b.pair} · {b.risk} risk</div>
              {b.description && <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">{b.description}</p>}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Users</div><div className="font-semibold">{b.users}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Profit</div><div className="font-semibold text-emerald-400">${b.profit.toLocaleString()}</div></div>
                <div className="rounded-lg bg-white/[0.03] p-2"><div className="text-muted-foreground text-[9px]">Win Rate</div><div className="font-semibold">{b.winRate}%</div></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => setEditing(b)} data-no-toast className="py-2 rounded-lg glass hover:bg-white/10 text-xs inline-flex items-center justify-center gap-1.5"><Pencil size={12}/> Edit</button>
                <button onClick={() => remove(b._id)} data-no-toast className="py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs inline-flex items-center justify-center gap-1.5"><Trash2 size={12}/> Delete</button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <BotModal open={!!editing || addOpen} onClose={() => { setEditing(null); setAddOpen(false); }} initial={editing} onSave={save}/>
    </div>
  );
}

function BotModal({ open, onClose, initial, onSave }: { open: boolean; onClose: () => void; initial: AdminBot | null; onSave: (d: { name: string; pair: string; risk: string; description: string }) => void }) {
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit bot" : "Add bot"}>
      <form onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        onSave({
          name: String(fd.get("name") || ""),
          pair: String(fd.get("pair") || ""),
          risk: String(fd.get("risk") || "Medium"),
          description: String(fd.get("description") || ""),
        });
      }} className="space-y-3">
        <Field label="Name"><input name="name" required defaultValue={initial?.name} className={inputCls} placeholder="Momentum Scalper"/></Field>
        <Field label="Pair"><input name="pair" required defaultValue={initial?.pair} className={inputCls} placeholder="EUR/USD"/></Field>
        <Field label="Risk"><select name="risk" defaultValue={initial?.risk ?? "Medium"} className={inputCls}>{["Low","Medium","High"].map(r=><option key={r}>{r}</option>)}</select></Field>
        <Field label="Description"><textarea name="description" rows={3} defaultValue={initial?.description} className={inputCls}/></Field>
        <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">{initial ? "Save changes" : "Create bot"}</button>
      </form>
    </Modal>
  );
}
