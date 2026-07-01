import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy, Plus, Search, MessageCircle, BookOpen, Video, Mail, Phone,
  Clock, CheckCircle2, AlertCircle, ChevronRight, ChevronDown, Send,
} from "lucide-react";
import { GlassCard, StatCard, SectionTitle, StatusPill, Modal, Field, inputCls } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/dashboard/support")({
  ssr: false,
  component: SupportPage,
});

const tickets = [
  { id: "TKT-4821", subject: "Withdrawal delayed for 3 days", category: "Wallet", priority: "High", status: "Active", updated: "2h ago", replies: 4 },
  { id: "TKT-4802", subject: "Bot won't deploy on XAU/USD", category: "Trading Bots", priority: "Medium", status: "Active", updated: "1d ago", replies: 2 },
  { id: "TKT-4780", subject: "Phase 2 rules clarification", category: "Prop Firm", priority: "Low", status: "Completed", updated: "3d ago", replies: 6 },
  { id: "TKT-4754", subject: "Academy course access issue", category: "Academy", priority: "Medium", status: "Completed", updated: "1w ago", replies: 3 },
];

const kb = [
  { cat: "Getting Started", articles: 24, icon: BookOpen },
  { cat: "Wallet & Payments", articles: 18, icon: BookOpen },
  { cat: "Trading Bots", articles: 32, icon: BookOpen },
  { cat: "Prop Firm", articles: 28, icon: BookOpen },
  { cat: "Academy", articles: 15, icon: BookOpen },
  { cat: "Signals", articles: 12, icon: BookOpen },
  { cat: "Security", articles: 20, icon: BookOpen },
  { cat: "Billing", articles: 14, icon: BookOpen },
];

const faqs = [
  ["How long do withdrawals take?", "Crypto withdrawals process within 30 minutes. Bank transfers take 1–3 business days."],
  ["Can I run multiple prop firm challenges?", "Yes. You can hold up to 5 concurrent challenges of any account size."],
  ["What happens if I fail a challenge?", "You can restart with a 30% discount using your reset code, or purchase a fresh evaluation."],
  ["How do I connect my broker to a bot?", "Go to Trading Bots → Settings → Broker Integration, and paste your MT5/MT4 API credentials."],
  ["Are signals guaranteed to be profitable?", "No signal service can guarantee profit. Our historical win rate is 90%, but market conditions vary."],
];

function SupportPage() {
  const [newTicket, setNewTicket] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-sm text-muted-foreground mt-1">Get help from the LEGIONFX team, 24/7.</p>
        </div>
        <button onClick={() => setNewTicket(true)} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2 shadow-glow"><Plus size={15} /> New Ticket</button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Open Tickets" value={2} delta="1 high priority" icon={<AlertCircle size={14} />} />
        <StatCard label="Resolved" value={18} delta="This year" icon={<CheckCircle2 size={14} />} />
        <StatCard label="Avg Response" value={12} suffix="m" delta="Under SLA" icon={<Clock size={14} />} />
        <StatCard label="Satisfaction" value={98} suffix="%" delta="Last 30 days" icon={<CheckCircle2 size={14} />} />
      </div>

      {/* Quick contact */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { icon: MessageCircle, title: "Live Chat", desc: "Chat with support", cta: "Start Chat", accent: true },
          { icon: Mail, title: "Email", desc: "support@legionfx.com", cta: "Send Email" },
          { icon: Phone, title: "Phone", desc: "+1 (800) 555-LGFX", cta: "Call Now" },
          { icon: Video, title: "Video Call", desc: "Book 15 min session", cta: "Schedule" },
        ].map((c) => (
          <GlassCard key={c.title} className={`p-5 hover-lift ${c.accent ? "border-brand/30" : ""}`}>
            <div className={`h-11 w-11 rounded-xl grid place-items-center ${c.accent ? "brand-gradient text-brand-foreground" : "glass text-brand"}`}><c.icon size={18} /></div>
            <div className="text-sm font-semibold mt-3">{c.title}</div>
            <div className="text-[10px] text-muted-foreground">{c.desc}</div>
            <button className={`mt-3 w-full py-2 rounded-xl text-xs font-medium ${c.accent ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>{c.cta}</button>
          </GlassCard>
        ))}
      </div>

      {/* Tickets */}
      <GlassCard className="p-5">
        <SectionTitle title="Your Tickets" subtitle="View and manage support requests" />
        <div className="space-y-2">
          {tickets.map((t) => (
            <div key={t.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition">
              <div className="w-16 text-[10px] font-mono text-muted-foreground">{t.id}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{t.subject}</div>
                <div className="text-[10px] text-muted-foreground">{t.category} · {t.replies} replies · updated {t.updated}</div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full ${t.priority === "High" ? "bg-rose-400/10 text-rose-400" : t.priority === "Medium" ? "bg-amber-400/10 text-amber-400" : "bg-white/5 text-muted-foreground"}`}>{t.priority}</span>
              <StatusPill status={t.status} />
              <button className="text-brand hover:underline text-xs inline-flex items-center gap-1">Open <ChevronRight size={12} /></button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Knowledge base */}
      <div>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">Knowledge Base</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Self-service articles & guides</p>
          </div>
          <div className="relative w-64 max-w-full">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search articles..." className={`${inputCls} pl-9 text-xs`} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {kb.map((k) => (
            <button key={k.cat} className="glass rounded-2xl p-4 text-left hover-lift">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><k.icon size={16} /></div>
              <div className="mt-3 text-sm font-semibold">{k.cat}</div>
              <div className="text-[10px] text-muted-foreground">{k.articles} articles</div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <GlassCard className="p-5">
        <SectionTitle title="Frequently Asked Questions" />
        <div className="space-y-2">
          {faqs.map(([q, a], i) => (
            <div key={i} className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
                <span className="text-sm font-medium">{q}</span>
                <ChevronDown size={14} className={`transition ${openFaq === i ? "rotate-180" : ""} text-muted-foreground`} />
              </button>
              {openFaq === i && <div className="px-4 pb-4 text-xs text-muted-foreground">{a}</div>}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* New ticket modal */}
      <Modal open={newTicket} onClose={() => setNewTicket(false)} title="Create Support Ticket" size="lg">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><select className={inputCls}><option>Wallet & Payments</option><option>Trading Bots</option><option>Prop Firm</option><option>Academy</option><option>Signals</option><option>Account & Security</option><option>Other</option></select></Field>
            <Field label="Priority"><select className={inputCls}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field>
          </div>
          <Field label="Subject"><input className={inputCls} placeholder="Brief summary of the issue" /></Field>
          <Field label="Description"><textarea rows={5} className={inputCls + " resize-none"} placeholder="Please describe the issue in detail..." /></Field>
          <Field label="Attach Files (optional)"><input type="file" className={inputCls} multiple /></Field>
          <button onClick={() => setNewTicket(false)} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center justify-center gap-2"><Send size={13} /> Submit Ticket</button>
        </div>
      </Modal>
    </div>
  );
}
