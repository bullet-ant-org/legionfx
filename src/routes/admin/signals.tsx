import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Trash2 } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard, StatusPill } from "@/components/dashboard/primitives";
import { adminSignals } from "@/lib/admin-data";

type Signal = typeof adminSignals[number] & { id: string; sl?: number; tp?: number };
const seed: Signal[] = adminSignals.map((s, i) => ({ ...s, id: `sig-${i}` }));

export const Route = createFileRoute("/admin/signals")({ component: SignalsPage });

function SignalsPage() {
  const [items, setItems] = useState<Signal[]>(seed);
  const [addOpen, setAddOpen] = useState(false);

  const publish = (id: string) => { setItems(x => x.map(s => s.id === id ? { ...s, published: true, sent: 5284 } : s)); toast.success("Signal published"); };
  const revoke = (id: string) => { setItems(x => x.map(s => s.id === id ? { ...s, published: false } : s)); toast.success("Signal revoked"); };
  const remove = (id: string) => { setItems(x => x.filter(s => s.id !== id)); toast.success("Signal deleted"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Signals" value={items.length}/>
        <StatCard label="Published" value={items.filter(i=>i.published).length}/>
        <StatCard label="Reach" value={items.reduce((a,b)=>a+b.sent,0)}/>
        <StatCard label="Avg Hit" value={Math.round(items.reduce((a,b)=>a+(b.sent?b.hits/b.sent:0),0)/items.length*100)} suffix="%"/>
      </div>

      <GlassCard className="p-4 flex items-center justify-between">
        <div className="text-sm font-semibold">Signals Feed</div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Send size={14}/> New Signal</button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground border-b border-white/5"><tr>{["Pair","Direction","Entry","Confidence","Status","Sent","Hits",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(s => (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold">{s.pair}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] border ${s.direction === "BUY" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-rose-400 bg-rose-400/10 border-rose-400/20"}`}>{s.direction}</span></td>
                  <td className="px-4 py-3">{s.entry}</td>
                  <td className="px-4 py-3">{s.confidence}%</td>
                  <td className="px-4 py-3"><StatusPill status={s.published ? "Active" : "Pending"}/></td>
                  <td className="px-4 py-3">{s.sent.toLocaleString()}</td>
                  <td className="px-4 py-3">{s.hits.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {s.published ? <button onClick={() => revoke(s.id)} data-no-toast className="px-2 py-1 rounded-lg text-xs glass hover:bg-white/10">Revoke</button> : <button onClick={() => publish(s.id)} data-no-toast className="px-2 py-1 rounded-lg text-xs brand-gradient text-brand-foreground">Publish</button>}
                      <button onClick={() => remove(s.id)} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10" aria-label="Delete"><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Publish new signal">
        <form onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const n: Signal = { id: `sig-${Date.now()}`, pair: String(fd.get("pair")||""), direction: String(fd.get("direction")||"BUY"), entry: Number(fd.get("entry")||0), sl: Number(fd.get("sl")||0), tp: Number(fd.get("tp")||0), confidence: Number(fd.get("confidence")||80), status: "Active", published: true, sent: 5284, hits: 0 };
          setItems([n, ...items]); setAddOpen(false); toast.success("Signal published to 5,284 users");
        }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pair"><input name="pair" required defaultValue="XAU/USD" className={inputCls}/></Field>
            <Field label="Direction"><select name="direction" className={inputCls}><option>BUY</option><option>SELL</option></select></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Entry"><input name="entry" type="number" step="0.01" required className={inputCls}/></Field>
            <Field label="Stop Loss"><input name="sl" type="number" step="0.01" className={inputCls}/></Field>
            <Field label="Take Profit"><input name="tp" type="number" step="0.01" className={inputCls}/></Field>
          </div>
          <Field label="Confidence %"><input name="confidence" type="number" defaultValue={85} className={inputCls}/></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Publish signal</button>
        </form>
      </Modal>
    </div>
  );
}
