import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, LifeBuoy } from "lucide-react";
import { GlassCard, Modal, inputCls, StatCard, StatusPill } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type ApiTicket } from "@/lib/api";

export const Route = createFileRoute("/admin/support")({ ssr: false, component: SupportAdminPage });

const statuses = ["Open", "In Progress", "Resolved", "Closed"];

function SupportAdminPage() {
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<ApiTicket | null>(null);

  const load = () => {
    setLoading(true);
    adminApi.listTickets(filter)
      .then((r) => setTickets(r.tickets))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load tickets"))
      .finally(() => setLoading(false));
  };
  useEffect(load, [filter]);

  const counts = useMemo(() => ({
    open: tickets.filter(t => t.status === "Open").length,
    progress: tickets.filter(t => t.status === "In Progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
  }), [tickets]);

  const setStatus = async (id: string, status: string) => {
    try {
      const { ticket } = await adminApi.updateTicket(id, { status });
      setTickets((list) => list.map((t) => (t._id === id ? { ...t, ...ticket } : t)));
      setActive((a) => (a && a._id === id ? { ...a, ...ticket } : a));
      toast.success("Ticket updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not update ticket");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Tickets" value={tickets.length}/>
        <StatCard label="Open" value={counts.open} trend="down"/>
        <StatCard label="In Progress" value={counts.progress}/>
        <StatCard label="Resolved" value={counts.resolved}/>
      </div>

      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          {["All", ...statuses].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-full transition ${filter===f ? "brand-gradient text-brand-foreground" : "glass text-muted-foreground hover:text-foreground"}`}>{f}</button>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>{["User","Subject","Category","Priority","Status","Date",""].map(h => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</td></tr>
              ) : tickets.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm"><LifeBuoy size={18} className="mx-auto mb-2 text-muted-foreground"/>No tickets.</td></tr>
              ) : tickets.map((t) => {
                const user = typeof t.user === "object" ? t.user : null;
                return (
                  <tr key={t._id} onClick={() => setActive(t)} className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer">
                    <td className="px-4 py-3"><div className="font-medium">{user?.name ?? "Unknown"}</div><div className="text-[10px] text-muted-foreground">{user?.email}</div></td>
                    <td className="px-4 py-3 truncate max-w-[220px]">{t.subject}</td>
                    <td className="px-4 py-3 text-xs">{t.category}</td>
                    <td className="px-4 py-3 text-xs">{t.priority}</td>
                    <td className="px-4 py-3"><StatusPill status={t.status}/></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs text-brand">View →</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <TicketModal ticket={active} onClose={() => setActive(null)} onStatus={setStatus} onUpdated={(t) => { setTickets(list => list.map(x => x._id === t._id ? t : x)); setActive(t); }}/>
    </div>
  );
}

function TicketModal({ ticket, onClose, onStatus, onUpdated }: { ticket: ApiTicket | null; onClose: () => void; onStatus: (id: string, s: string) => void; onUpdated: (t: ApiTicket) => void }) {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const user = ticket && typeof ticket.user === "object" ? ticket.user : null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !reply.trim()) return;
    setSubmitting(true);
    try {
      const { ticket: updated } = await adminApi.replyTicket(ticket._id, reply.trim());
      onUpdated(updated);
      setReply("");
      toast.success("Reply sent");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send reply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={!!ticket} onClose={() => { setReply(""); onClose(); }} title={ticket?.subject ?? "Ticket"} size="lg">
      {ticket && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
            <span className="text-foreground font-medium">{user?.name ?? "Unknown"}</span>
            <span>· {user?.email}</span>
            <span>· {ticket.category}</span>
            <span>· {ticket.priority} priority</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {statuses.map(s => (
              <button key={s} onClick={() => onStatus(ticket._id, s)} className={`px-3 py-1 text-[11px] rounded-full transition ${ticket.status===s ? "brand-gradient text-brand-foreground" : "glass text-muted-foreground hover:text-foreground"}`}>{s}</button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="text-[10px] text-muted-foreground mb-1">{user?.name ?? "User"} · {new Date(ticket.createdAt).toLocaleString()}</div>
              <div className="text-sm">{ticket.message}</div>
            </div>
            {ticket.replies.map((r, i) => (
              <div key={i} className="rounded-xl p-3 border bg-brand/10 border-brand/20 mr-6">
                <div className="text-[10px] text-muted-foreground mb-1">Support Team · {new Date(r.createdAt).toLocaleString()}</div>
                <div className="text-sm">{r.body}</div>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex gap-2">
            <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply as support…" className={`${inputCls} flex-1`}/>
            <button type="submit" disabled={submitting || !reply.trim()} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground disabled:opacity-60"><Send size={14}/></button>
          </form>
        </div>
      )}
    </Modal>
  );
}
