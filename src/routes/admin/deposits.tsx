import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, X, Eye, Search } from "lucide-react";
import { GlassCard, StatusPill, Modal, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminTransaction } from "@/lib/api";

export const Route = createFileRoute("/admin/deposits")({ ssr: false, component: DepositsPage });

function DepositsPage() {
  const [rows, setRows] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<AdminTransaction | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.listDeposits(filter)
      .then((r) => setRows(r.deposits))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load deposits"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const filtered = useMemo(() => rows.filter(r =>
    q === "" || (r.user?.name ?? "").toLowerCase().includes(q.toLowerCase()) || r.ref.toLowerCase().includes(q.toLowerCase())
  ), [rows, q]);

  const pending = rows.filter(r => r.status === "Pending");
  const completed = rows.filter(r => r.status === "Completed");
  const rejected = rows.filter(r => r.status === "Rejected");

  const act = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const { transaction } = action === "approve" ? await adminApi.approveTransaction(id) : await adminApi.rejectTransaction(id);
      setRows((list) => list.map((r) => (r._id === id ? { ...r, ...transaction } : r)));
      setView((v) => (v && v._id === id ? { ...v, ...transaction } : v));
      toast.success(`Deposit ${action === "approve" ? "approved" : "rejected"}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update deposit");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Pending" value={pending.length} delta={`$${pending.reduce((a,b)=>a+b.amount,0).toLocaleString()}`}/>
        <StatCard label="Completed" value={completed.length}/>
        <StatCard label="Rejected" value={rejected.length} trend="down"/>
        <StatCard label="Total Volume" value={rows.reduce((a,b)=>a+b.amount,0)} prefix="$"/>
      </div>

      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search user or reference…" className={`${inputCls} pl-10`}/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className={`${inputCls} w-auto`}>
          {["All","Pending","Completed","Rejected"].map(s => <option key={s}>{s}</option>)}
        </select>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>{["User","Method","Amount","Status","Date","Ref",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">No deposits match.</td></tr>
              ) : filtered.map(r => (
                <tr key={r._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><div className="font-medium">{r.user?.name ?? "Unknown"}</div><div className="text-[10px] text-muted-foreground">{r.user?.email}</div></td>
                  <td className="px-4 py-3 text-xs">{r.method}</td>
                  <td className="px-4 py-3 font-semibold">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusPill status={r.status}/></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.ref}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setView(r)} data-no-toast className="p-1.5 rounded-lg hover:bg-white/10" aria-label="View"><Eye size={14}/></button>
                      {r.status === "Pending" && <>
                        <button onClick={() => act(r._id, "approve")} disabled={busyId===r._id} data-no-toast className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-400/10 disabled:opacity-50" aria-label="Approve"><Check size={14}/></button>
                        <button onClick={() => act(r._id, "reject")} disabled={busyId===r._id} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10 disabled:opacity-50" aria-label="Reject"><X size={14}/></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Deposit ${view.ref}` : ""}>
        {view && (
          <div className="space-y-3 text-sm">
            <Row k="User" v={view.user?.name ?? "Unknown"}/>
            <Row k="Email" v={view.user?.email ?? "—"}/>
            <Row k="Method" v={view.method}/>
            <Row k="Amount" v={`$${view.amount.toLocaleString()}`}/>
            <Row k="Reference" v={view.ref}/>
            <Row k="Note" v={(view.note as string) || "—"}/>
            <Row k="Date" v={new Date(view.createdAt).toLocaleString()}/>
            <Row k="Status" v={view.status}/>
            {view.status === "Pending" && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button data-no-toast onClick={() => act(view._id, "reject")} disabled={busyId===view._id} className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-sm disabled:opacity-50">Reject</button>
                <button data-no-toast onClick={() => act(view._id, "approve")} disabled={busyId===view._id} className="py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-50">Approve deposit</button>
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
