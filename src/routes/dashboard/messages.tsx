import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search, Send, Paperclip, Smile, Phone, Video, MoreHorizontal, Star, Pin,
  Users, Hash, Bell, Check, CheckCheck, Circle, Image as ImageIcon, File,
  ChevronLeft, Filter, Plus,
} from "lucide-react";
import { GlassCard, inputCls } from "@/components/dashboard/primitives";

export const Route = createFileRoute("/dashboard/messages")({
  ssr: false,
  component: MessagesPage,
});

type Msg = { id: number; from: "me" | "them"; text: string; time: string; read?: boolean };
type Conv = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  pinned?: boolean;
  category: "Mentors" | "Support" | "Prop Firm" | "Academy" | "Signals" | "Community";
  messages: Msg[];
};

const conversations: Conv[] = [
  {
    id: "1", name: "Marcus Vale", role: "Head Trading Mentor", avatar: "MV", preview: "Great work on phase 1 — let's review your journal Tuesday.",
    time: "8m", unread: 2, online: true, pinned: true, category: "Mentors",
    messages: [
      { id: 1, from: "them", text: "Hey Keagan, I reviewed your last 40 trades over the weekend.", time: "9:12 AM" },
      { id: 2, from: "them", text: "Your entry logic on XAU/USD is sharp, but I want you to tighten your stop placement.", time: "9:13 AM" },
      { id: 3, from: "me", text: "Appreciate that. I noticed I was giving trades too much room after wins.", time: "9:24 AM", read: true },
      { id: 4, from: "them", text: "Exactly. Compounded across 100 trades that costs you 4–6% expectancy.", time: "9:25 AM" },
      { id: 5, from: "them", text: "Let's cover it on our Tuesday call — bring 5 losing trades from last month.", time: "9:26 AM" },
      { id: 6, from: "me", text: "Locked in. 4pm SAST?", time: "9:30 AM", read: true },
      { id: 7, from: "them", text: "Perfect. Also — great work on phase 1 of your prop challenge.", time: "9:31 AM" },
    ],
  },
  {
    id: "2", name: "LEGIONFX Support", role: "Customer Support · 24/7", avatar: "LS", preview: "Your withdrawal WD-118 is being processed.",
    time: "1h", unread: 1, online: true, category: "Support",
    messages: [
      { id: 1, from: "them", text: "Hi Keagan, your withdrawal request WD-118 for $1,200 has been received.", time: "8:04 AM" },
      { id: 2, from: "them", text: "Estimated arrival: 1–3 business days for bank transfers.", time: "8:04 AM" },
      { id: 3, from: "me", text: "Thanks for the quick update.", time: "8:12 AM", read: true },
      { id: 4, from: "them", text: "Anything else I can help with today?", time: "8:12 AM" },
    ],
  },
  {
    id: "3", name: "Prop Firm Desk", role: "Challenge Manager", avatar: "PF", preview: "Phase 2 reset confirmed — you have 30 days.",
    time: "3h", unread: 0, online: false, category: "Prop Firm",
    messages: [
      { id: 1, from: "them", text: "Congratulations on passing Phase 1 of the $100K challenge.", time: "Yesterday" },
      { id: 2, from: "them", text: "Phase 2 rules: 5% profit target, 5% max drawdown, 2% daily loss. 30 days.", time: "Yesterday" },
      { id: 3, from: "me", text: "Confirmed. Starting today.", time: "Yesterday", read: true },
    ],
  },
  {
    id: "4", name: "Academy Instructor", role: "Forex Mastery Course", avatar: "AI", preview: "New lesson published: Institutional Order Blocks.",
    time: "1d", unread: 0, online: true, category: "Academy",
    messages: [
      { id: 1, from: "them", text: "Module 7 is now live — Institutional Order Blocks & Liquidity.", time: "Mon" },
    ],
  },
  {
    id: "5", name: "Signals Bot", role: "Automated Alerts", avatar: "SB", preview: "XAU/USD BUY signal @ 2342.5 · 92% confidence.",
    time: "2d", unread: 0, online: true, category: "Signals",
    messages: [
      { id: 1, from: "them", text: "🟢 XAU/USD BUY · Entry 2342.5 · SL 2335 · TP 2360 · Conf 92%", time: "Sun" },
    ],
  },
  {
    id: "6", name: "#general-community", role: "1,284 members · Community", avatar: "#", preview: "Alex: My phase 2 just funded, guys 🔥",
    time: "5m", unread: 12, online: true, category: "Community",
    messages: [
      { id: 1, from: "them", text: "Alex: My phase 2 just funded, guys 🔥", time: "10:41" },
      { id: 2, from: "them", text: "Sarah: Congrats bro, what size?", time: "10:42" },
      { id: 3, from: "them", text: "Alex: $200K account, took me 22 days total.", time: "10:43" },
    ],
  },
];

const categories = ["All", "Mentors", "Support", "Prop Firm", "Academy", "Signals", "Community"] as const;

function MessagesPage() {
  const [selected, setSelected] = useState<Conv>(conversations[0]);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const [msgs, setMsgs] = useState<Msg[]>(selected.messages);
  const [draft, setDraft] = useState("");
  const [showList, setShowList] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMsgs(selected.messages); }, [selected]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [msgs]);

  const filtered = useMemo(() => conversations.filter((c) => {
    const okCat = cat === "All" || c.category === cat;
    const okQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.preview.toLowerCase().includes(query.toLowerCase());
    return okCat && okQ;
  }), [cat, query]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "me", text: draft.trim(), time: "now", read: false }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "them", text: "Got it — I'll follow up with more shortly.", time: "now" }]);
    }, 900);
  };

  return (
    <div className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground mt-1">Unified inbox for mentors, support, prop firm desk and community.</p>
        </div>
        <button className="hidden md:inline-flex px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium items-center gap-2 shadow-glow"><Plus size={14} /> New Message</button>
      </div>

      <GlassCard className="flex-1 overflow-hidden p-0 grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[320px_1fr_300px]">
        {/* Conversation list */}
        <div className={`border-r border-white/5 flex flex-col ${showList ? "" : "hidden md:flex"}`}>
          <div className="p-4 border-b border-white/5">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations..." className={`${inputCls} pl-9`} />
            </div>
            <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] ${cat === c ? "brand-gradient text-brand-foreground" : "glass text-muted-foreground"}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <button key={c.id} onClick={() => { setSelected(c); setShowList(false); }} className={`w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition flex gap-3 ${selected.id === c.id ? "bg-brand/10" : ""}`}>
                <div className="relative shrink-0">
                  <div className="h-11 w-11 rounded-xl brand-gradient grid place-items-center font-semibold text-brand-foreground text-sm">{c.avatar}</div>
                  {c.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-background" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <div className="text-sm font-medium truncate flex-1">{c.name}</div>
                    {c.pinned && <Pin size={10} className="text-brand" />}
                    <div className="text-[10px] text-muted-foreground shrink-0">{c.time}</div>
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{c.role}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="text-[11px] text-muted-foreground truncate flex-1">{c.preview}</div>
                    {c.unread > 0 && <span className="h-4 min-w-[16px] px-1 rounded-full brand-gradient text-brand-foreground text-[9px] font-semibold grid place-items-center shrink-0">{c.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div className={`flex flex-col ${showList ? "hidden md:flex" : ""}`}>
          <div className="p-4 border-b border-white/5 flex items-center gap-3">
            <button onClick={() => setShowList(true)} className="md:hidden p-1.5 rounded-lg hover:bg-white/5"><ChevronLeft size={16} /></button>
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center font-semibold text-brand-foreground text-sm">{selected.avatar}</div>
              {selected.online && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-background" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{selected.name}</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1"><Circle size={6} className="fill-current" /> {selected.online ? "Online now" : "Last seen 2h ago"}</div>
            </div>
            <div className="flex gap-1">
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"><Phone size={14} /></button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"><Video size={14} /></button>
              <button onClick={() => setShowInfo((v) => !v)} className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground lg:hidden"><MoreHorizontal size={14} /></button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="text-center text-[10px] text-muted-foreground">Today</div>
            {msgs.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "me" ? "brand-gradient text-brand-foreground rounded-br-sm" : "glass rounded-bl-sm"}`}>
                  <div>{m.text}</div>
                  <div className={`text-[9px] mt-1 flex items-center gap-1 justify-end ${m.from === "me" ? "text-brand-foreground/70" : "text-muted-foreground"}`}>
                    {m.time}
                    {m.from === "me" && (m.read ? <CheckCheck size={10} /> : <Check size={10} />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <div className="glass rounded-2xl flex items-end gap-2 p-2">
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"><Paperclip size={16} /></button>
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"><ImageIcon size={16} /></button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1}
                placeholder={`Message ${selected.name}...`}
                className="flex-1 bg-transparent outline-none text-sm resize-none py-2 max-h-32"
              />
              <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground"><Smile size={16} /></button>
              <button onClick={send} className="p-2.5 rounded-xl brand-gradient text-brand-foreground hover:opacity-90"><Send size={14} /></button>
            </div>
          </div>
        </div>

        {/* Info panel */}
        <div className="hidden lg:flex border-l border-white/5 flex-col overflow-y-auto">
          <div className="p-6 text-center border-b border-white/5">
            <div className="h-20 w-20 mx-auto rounded-2xl brand-gradient grid place-items-center text-2xl font-bold text-brand-foreground">{selected.avatar}</div>
            <div className="mt-3 font-semibold">{selected.name}</div>
            <div className="text-xs text-muted-foreground">{selected.role}</div>
            <div className="flex justify-center gap-2 mt-4">
              <button className="p-2 rounded-lg glass hover:bg-white/10"><Phone size={13} /></button>
              <button className="p-2 rounded-lg glass hover:bg-white/10"><Video size={13} /></button>
              <button className="p-2 rounded-lg glass hover:bg-white/10"><Bell size={13} /></button>
              <button className="p-2 rounded-lg glass hover:bg-white/10"><Star size={13} /></button>
            </div>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Shared Files</div>
              {[
                { name: "trade-journal-june.pdf", size: "2.4 MB" },
                { name: "phase1-report.xlsx", size: "184 KB" },
                { name: "smart-money-notes.pdf", size: "512 KB" },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-2 py-1.5">
                  <div className="h-8 w-8 rounded-lg glass grid place-items-center text-brand"><File size={12} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">{f.name}</div>
                    <div className="text-[10px] text-muted-foreground">{f.size}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Shared Media</div>
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-lg brand-gradient opacity-60" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Community Channels</div>
              {["#general", "#signals", "#academy", "#prop-firm", "#wins"].map((c) => (
                <button key={c} className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-2">
                  <Hash size={11} className="text-brand" /> <span>{c.replace("#", "")}</span>
                  <Users size={10} className="text-muted-foreground ml-auto" />
                  <span className="text-[10px] text-muted-foreground">{100 + c.length * 40}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
