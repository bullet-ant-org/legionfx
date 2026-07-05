import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Eye, Search } from "lucide-react";
import { GlassCard, StatusPill, Modal, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminWithdrawals, type AdminWithdrawal } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/withdrawals")({ component: WithdrawalsPage });

function WithdrawalsPage() {
  const [rows, setRows] = useState<AdminWithdrawal[]>(adminWithdrawals);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<AdminWithdrawal | null>(null);

  const filtered = useMemo(() => rows.filter(r =>
    (filter === "All" || r.status === filter) &&
    (q === "" || r.user.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
  ), [rows, q, filter]);

  const setStatus = (id: string, status: AdminWithdrawal["status"]) => {
    setRows(list => list.map(r => r.id === id ? { ...r, status } : r));
    setView(v => v && v.id === id ? { ...v, status } : v);
    toast.success(`Withdrawal ${id} → ${status}`);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Pending" value={rows.filter(r=>r.status==="Pending").length} delta={`$${rows.filter(r=>r.status==="Pending").reduce((a,b)=>a+b.amount,0).toLocaleString()}`}/>
        <StatCard label="Completed" value={rows.filter(r=>r.status==="Completed").length}/>
        <StatCard label="Failed" value={rows.filter(r=>r.status==="Failed").length} trend="down"/>
        <StatCard label="Total Out" value={rows.reduce((a,b)=>a+b.amount,0)} prefix="$"/>
      </div>

      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search user or ID…" className={`${inputCls} pl-10`}/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Pending","Completed","Failed"].map(s => <option key={s}>{s}</option>)}
        </select>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>{["ID","User","Method","Amount","Status","Date","Ref",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                  <td className="px-4 py-3"><div className="font-medium">{r.user}</div><div className="text-[10px] text-muted-foreground">{r.email}</div></td>
                  <td className="px-4 py-3 text-xs">{r.method}</td>
                  <td className="px-4 py-3 font-semibold">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status}/></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.date}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.txRef}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setView(r)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="View"><Eye size={14}/></button>
                      {r.status === "Pending" && <>
                        <button onClick={() => setStatus(r.id, "Completed")} data-no-toast className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10" aria-label="Approve"><Check size={14}/></button>
                        <button onClick={() => setStatus(r.id, "Failed")} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10" aria-label="Reject"><X size={14}/></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Withdrawal ${view.id}` : ""}>
        {view && (
          <div className="space-y-2 text-sm">
            <Row k="User" v={view.user}/><Row k="Email" v={view.email}/>
            <Row k="Method" v={view.method}/><Row k="Amount" v={`$${view.amount.toLocaleString()}`}/>
            <Row k="Reference" v={view.txRef}/><Row k="Date" v={view.date}/><Row k="Status" v={view.status}/>
            {view.status === "Pending" && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => setStatus(view.id, "Failed")} className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm">Reject</button>
                <button onClick={() => setStatus(view.id, "Completed")} className="py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Approve payout</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between glass rounded-lg px-3 py-2"><span className="text-muted-foreground text-xs">{k}</span><span className="font-medium">{v}</span></div>;
}
