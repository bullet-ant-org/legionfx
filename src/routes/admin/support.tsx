import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, StatusPill, Modal, Field, inputCls, StatCard } from "@/components/dashboard/primitives";
import { supportTickets, type SupportTicket } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/support")({ component: SupportPage });

function SupportPage() {
  const [items, setItems] = useState<SupportTicket[]>(supportTickets);
  const [reply, setReply] = useState<SupportTicket | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = items.filter(i => filter === "All" || i.status === filter);
  const setStatus = (id: string, status: SupportTicket["status"]) => { setItems(x => x.map(t => t.id === id ? { ...t, status, updated: "just now" } : t)); toast.success(`Ticket ${id} → ${status}`); };
  const remove = (id: string) => { setItems(x => x.filter(t => t.id !== id)); toast.success("Ticket deleted"); };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Open" value={items.filter(i=>i.status==="Open").length} trend="down"/>
        <StatCard label="In Progress" value={items.filter(i=>i.status==="In Progress").length}/>
        <StatCard label="Resolved" value={items.filter(i=>i.status==="Resolved").length}/>
        <StatCard label="Urgent" value={items.filter(i=>i.priority==="Urgent").length} trend="down"/>
      </div>

      <GlassCard className="p-4 flex items-center gap-3">
        <div className="text-sm font-semibold flex-1">Support Tickets</div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className={`${inputCls} w-auto`}>{["All","Open","In Progress","Resolved","Closed"].map(s=><option key={s}>{s}</option>)}</select>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase text-muted-foreground border-b border-white/5"><tr>{["Ticket","User","Priority","Status","Channel","Updated",""].map(h=><th key={h} className="text-left px-4 py-3">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><div className="font-medium">{t.subject}</div><div className="text-[10px] text-muted-foreground">{t.id}</div></td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className="px-4 py-3"><StatusPill status={t.priority === "Urgent" ? "Failed" : t.priority === "High" ? "Pending" : "Active"}/></td>
                  <td className="px-4 py-3"><StatusPill status={t.status === "Resolved" || t.status === "Closed" ? "Completed" : t.status === "Open" ? "Pending" : "Active"}/></td>
                  <td className="px-4 py-3 text-xs">{t.channel}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setReply(t)} data-no-toast className="px-2 py-1 rounded-lg text-xs brand-gradient text-brand-foreground">Reply</button>
                      {t.status !== "Resolved" && <button onClick={() => setStatus(t.id, "Resolved")} data-no-toast className="px-2 py-1 rounded-lg text-xs glass hover:bg-white/10">Resolve</button>}
                      <button onClick={() => remove(t.id)} data-no-toast className="px-2 py-1 rounded-lg text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-300">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal open={!!reply} onClose={() => setReply(null)} title={reply ? `Reply — ${reply.subject}` : ""} size="lg">
        {reply && (
          <form onSubmit={(e) => { e.preventDefault(); setStatus(reply.id, "In Progress"); setReply(null); toast.success("Reply sent"); }} className="space-y-3">
            <div className="glass rounded-xl p-3 text-xs text-muted-foreground">Ticket <span className="text-foreground font-medium">{reply.id}</span> · from <span className="text-foreground">{reply.user}</span> · channel {reply.channel}</div>
            <Field label="Response"><textarea required rows={6} className={inputCls} defaultValue={`Hi ${reply.user},\n\nThanks for reaching out — we're on it. `}/></Field>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setStatus(reply.id, "Resolved"); setReply(null); }} className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Send & Resolve</button>
              <button type="submit" className="py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Send reply</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
