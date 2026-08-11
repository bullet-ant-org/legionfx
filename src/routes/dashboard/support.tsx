import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  MessageCircle, Mail, Phone, Video, Search, ChevronRight, Send, Plus,
  Clock, CheckCircle2, AlertCircle,
} from "lucide-react";
import { GlassCard, SectionTitle, Modal, Field, inputCls, StatusPill } from "@/components/dashboard/primitives";
import { useDashboardData } from "@/lib/dashboard-data";
import { api, ApiError, type ApiTicket } from "@/lib/api";

export const Route = createFileRoute("/dashboard/support")({
  ssr: false,
  component: SupportPage,
});

const faqs = [
  ["How do I deposit funds?", "Go to Wallet → Deposit, enter an amount, and follow the checkout — currently crypto deposits only."],
  ["How long does verification take?", "Identity verification is reviewed by our team, usually within 1–2 business days once documents are submitted."],
  ["Can I withdraw anytime?", "Yes, as long as your available balance covers it. Withdrawals go through admin review before completing."],
  ["How do I join a prop firm challenge?", "Visit the Prop Firm page, pick a plan, and confirm the purchase — funds come from your wallet."],
  ["Is copy trading automated?", "Not yet — signals show entry/SL/TP and you execute manually with your own broker for now."],
];

const quickChannels = [
  { icon: Mail, label: "Email Support", detail: "support@legionfx.com", action: "mailto:support@legionfx.com", kind: "link" as const },
  { icon: Phone, label: "Phone Support", detail: "Call our team", action: "tel:+10000000000", kind: "link" as const },
  { icon: MessageCircle, label: "Live Chat", detail: "Coming soon", kind: "toast" as const },
  { icon: Video, label: "Video Call", detail: "Coming soon", kind: "toast" as const },
];

function SupportPage() {
  const { session } = useDashboardData();
  const [tickets, setTickets] = useState<ApiTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [active, setActive] = useState<ApiTicket | null>(null);

  const load = () => {
    setLoading(true);
    api.getTickets()
      .then((r) => setTickets(r.tickets))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load tickets"))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filteredFaqs = useMemo(
    () => faqs.filter(([q]) => q.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const openCount = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Get help fast — search answers or open a ticket with our team.</p>
        </div>
        <button onClick={() => setNewOpen(true)} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 shadow-glow">
          <Plus size={15} /> New Ticket
        </button>
      </motion.div>

      {/* Search */}
      <GlassCard className="p-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Search size={16} className="text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search help articles…" className="flex-1 bg-transparent text-sm outline-none" />
        </div>
      </GlassCard>

      {/* Quick channels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickChannels.map((c) => (
          c.kind === "link" ? (
            <a key={c.label} href={c.action} className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover-lift text-center">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><c.icon size={16} /></div>
              <div className="text-xs font-medium">{c.label}</div>
              <div className="text-[10px] text-muted-foreground">{c.detail}</div>
            </a>
          ) : (
            <button key={c.label} onClick={() => toast.info(`${c.label} is coming soon.`)} className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover-lift text-center">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><c.icon size={16} /></div>
              <div className="text-xs font-medium">{c.label}</div>
              <div className="text-[10px] text-muted-foreground">{c.detail}</div>
            </button>
          )
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* FAQ */}
        <GlassCard className="lg:col-span-2 p-5">
          <SectionTitle title="Frequently Asked Questions" />
          {filteredFaqs.length === 0 ? (
            <div className="text-xs text-muted-foreground py-6 text-center">No articles match "{search}". Try a support ticket instead.</div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map(([q, a]) => (
                <details key={q} className="group rounded-xl bg-white/[0.03] border border-white/5 p-3 open:bg-white/[0.05]">
                  <summary className="text-sm cursor-pointer list-none flex items-center justify-between"><span>{q}</span><ChevronRight size={14} className="text-brand transition group-open:rotate-90" /></summary>
                  <p className="mt-2 text-xs text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Status */}
        <GlassCard className="p-5">
          <SectionTitle title="Your Tickets" subtitle={`${openCount} open`} />
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl glass animate-pulse" />)
            ) : tickets.length === 0 ? (
              <div className="text-xs text-muted-foreground text-center py-6">No tickets yet.</div>
            ) : (
              tickets.map((t) => (
                <button key={t._id} onClick={() => setActive(t)} className="w-full text-left p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-xs font-medium truncate">{t.subject}</div>
                    <StatusPill status={t.status} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">{new Date(t.createdAt).toLocaleDateString()} · {t.category}</div>
                </button>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      <NewTicketModal open={newOpen} onClose={() => setNewOpen(false)} onCreated={(t) => { setTickets((p) => [t, ...p]); setActive(t); }} />
      <TicketModal ticket={active} onClose={() => setActive(null)} currentUserId={session?.user?._id as string} onUpdated={(t) => setTickets((p) => p.map((x) => (x._id === t._id ? t : x)))} />
    </div>
  );
}

function NewTicketModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: (t: ApiTicket) => void }) {
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setSubject(""); setCategory("General"); setPriority("Medium"); setMessage(""); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) { toast.error("Subject and message are required"); return; }
    setSubmitting(true);
    try {
      const { ticket } = await api.createTicket(subject.trim(), category, message.trim(), priority);
      toast.success("Ticket submitted");
      onCreated(ticket);
      reset();
      onClose();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => { reset(); onClose(); }} title="Open a support ticket">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Subject"><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="What's the issue?" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
              {["General", "Wallet", "Prop Firm", "Bots", "Academy", "Verification", "Technical"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Priority">
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={inputCls}>
              {["Low", "Medium", "High", "Urgent"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Message"><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={inputCls} placeholder="Describe your issue in detail…" /></Field>
        <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit Ticket"}
        </button>
      </form>
    </Modal>
  );
}

function TicketModal({ ticket, onClose, onUpdated, currentUserId }: { ticket: ApiTicket | null; onClose: () => void; onUpdated: (t: ApiTicket) => void; currentUserId: string }) {
  const [reply, setReply] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !reply.trim()) return;
    setSubmitting(true);
    try {
      const { ticket: updated } = await api.replyTicket(ticket._id, reply.trim());
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
            <StatusPill status={ticket.status} />
            <span>· {ticket.category}</span>
            <span>· {ticket.priority} priority</span>
            <span>· Opened {new Date(ticket.createdAt).toLocaleString()}</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="text-[10px] text-muted-foreground mb-1">You · {new Date(ticket.createdAt).toLocaleString()}</div>
              <div className="text-sm">{ticket.message}</div>
            </div>
            {ticket.replies.map((r, i) => {
              const isMe = r.author === currentUserId;
              return (
                <div key={i} className={`rounded-xl p-3 border ${isMe ? "bg-brand/10 border-brand/20 ml-6" : "bg-white/[0.03] border-white/5 mr-6"}`}>
                  <div className="text-[10px] text-muted-foreground mb-1">{isMe ? "You" : "Support Team"} · {new Date(r.createdAt).toLocaleString()}</div>
                  <div className="text-sm">{r.body}</div>
                </div>
              );
            })}
          </div>

          {ticket.status === "Closed" ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-white/[0.03]">
              <CheckCircle2 size={14} className="text-emerald-400" /> This ticket is closed. Open a new one if you need further help.
            </div>
          ) : (
            <form onSubmit={send} className="flex gap-2">
              <input value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type a reply…" className={`${inputCls} flex-1`} />
              <button type="submit" disabled={submitting || !reply.trim()} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground disabled:opacity-60"><Send size={14} /></button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
}
