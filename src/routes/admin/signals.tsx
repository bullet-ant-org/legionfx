import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Signal, TrendingUp, TrendingDown } from "lucide-react";
import { GlassCard, Modal, Field, inputCls, StatCard, StatusPill } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminSignal } from "@/lib/api";

export const Route = createFileRoute("/admin/signals")({ ssr: false, component: SignalsAdminPage });

const statuses = ["Active", "TP Hit", "SL Hit", "Closed"];

function SignalsAdminPage() {
  const [signals, setSignals] = useState<AdminSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi.listSignals()
      .then((r) => setSignals(r.signals))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load signals"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { signal } = await adminApi.updateSignal(id, { status });
      setSignals((list) => list.map((x) => (x._id === id ? { ...x, ...signal } : x)));
      toast.success("Signal updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update signal");
    }
  };

  const remove = async (id: string) => {
    try {
      await adminApi.deleteSignal(id);
      setSignals((list) => list.filter((x) => x._id !== id));
      toast.success("Signal removed");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete signal");
    }
  };

  const create = async (data: { pair: string; direction: "BUY" | "SELL"; entry: number; sl: number; tp: number; confidence: number }) => {
    try {
      const { signal } = await adminApi.createSignal(data);
      setSignals((list) => [signal, ...list]);
      toast.success("Signal published");
      setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not publish signal");
    }
  };

  const activeCount = signals.filter(s => s.status === "Active").length;
  const tpCount = signals.filter(s => s.status === "TP Hit").length;
  const avgConfidence = signals.length ? Math.round(signals.reduce((a,s)=>a+s.confidence,0)/signals.length) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Signals" value={signals.length}/>
        <StatCard label="Active" value={activeCount}/>
        <StatCard label="TP Hit" value={tpCount}/>
        <StatCard label="Avg Confidence" value={avgConfidence} suffix="%"/>
      </div>

      <GlassCard className="p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Signal Feed</div>
          <div className="text-xs text-muted-foreground">Published signals go live immediately for all clients.</div>
        </div>
        <button onClick={() => setAddOpen(true)} data-no-toast className="px-3.5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2"><Plus size={14}/> New Signal</button>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>{["Pair","Dir","Entry","SL","TP","Confidence","Status","Date",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</td></tr>
              ) : signals.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground text-sm"><Signal size={18} className="mx-auto mb-2 text-muted-foreground"/>No signals published yet.</td></tr>
              ) : signals.map(s => (
                <tr key={s._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-semibold">{s.pair}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded ${s.direction==="BUY"?"bg-emerald-400/10 text-emerald-400":"bg-rose-400/10 text-rose-400"}`}>
                      {s.direction==="BUY"?<TrendingUp size={10}/>:<TrendingDown size={10}/>} {s.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">{s.entry}</td>
                  <td className="px-4 py-3 text-xs text-rose-400">{s.sl}</td>
                  <td className="px-4 py-3 text-xs text-emerald-400">{s.tp}</td>
                  <td className="px-4 py-3 text-xs">{s.confidence}%</td>
                  <td className="px-4 py-3">
                    <select value={s.status} onChange={(e) => updateStatus(s._id, e.target.value)} className="bg-transparent text-xs border border-white/10 rounded-lg px-2 py-1">
                      {statuses.map(st => <option key={st} value={st} className="bg-background">{st}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(s._id)} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10" aria-label="Delete"><Trash2 size={14}/></button>
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
          create({
            pair: String(fd.get("pair") || ""),
            direction: (String(fd.get("direction") || "BUY") as "BUY" | "SELL"),
            entry: Number(fd.get("entry") || 0),
            sl: Number(fd.get("sl") || 0),
            tp: Number(fd.get("tp") || 0),
            confidence: Number(fd.get("confidence") || 80),
          });
        }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Pair"><input name="pair" required className={inputCls} placeholder="EUR/USD"/></Field>
            <Field label="Direction"><select name="direction" className={inputCls}><option>BUY</option><option>SELL</option></select></Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Entry"><input name="entry" type="number" step="any" required className={inputCls}/></Field>
            <Field label="Stop Loss"><input name="sl" type="number" step="any" required className={inputCls}/></Field>
            <Field label="Take Profit"><input name="tp" type="number" step="any" required className={inputCls}/></Field>
          </div>
          <Field label="Confidence (%)"><input name="confidence" type="number" min={1} max={100} defaultValue={80} className={inputCls}/></Field>
          <button type="submit" className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Publish signal</button>
        </form>
      </Modal>
    </div>
  );
}
