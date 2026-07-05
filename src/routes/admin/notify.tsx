import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Send, Users, Calendar, Trash2 } from "lucide-react";
import { GlassCard, SectionTitle, StatusPill, Field, inputCls } from "@/components/dashboard/primitives";
import { sentNotifications, type AdminNotification } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/notify")({ component: NotifyPage });

const audiences = ["All Users","Elite","Pro","Starter","Prop Firm","Bots"] as const;
const channels = ["In-App","Email","SMS","Push"] as const;

function NotifyPage() {
  const [items, setItems] = useState<AdminNotification[]>(sentNotifications);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<typeof audiences[number]>("All Users");
  const [channel, setChannel] = useState<typeof channels[number]>("In-App");
  const [schedule, setSchedule] = useState("");

  const audienceSize = (a: string) => a === "All Users" ? 5284 : a === "Elite" ? 640 : a === "Pro" ? 2140 : a === "Starter" ? 1204 : a === "Prop Firm" ? 312 : 148;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) { toast.error("Fill title and message"); return; }
    const n: AdminNotification = {
      id: `n-${Date.now()}`,
      title, message, audience, channel,
      status: schedule ? "Scheduled" : "Sent",
      date: schedule || new Date().toISOString().slice(0,10),
      recipients: audienceSize(audience),
    };
    setItems([n, ...items]);
    setTitle(""); setMessage(""); setSchedule("");
    toast.success(schedule ? "Notification scheduled" : `Sent to ${n.recipients.toLocaleString()} users`);
  };

  const remove = (id: string) => { setItems(items.filter(i => i.id !== id)); toast.success("Notification removed"); };
  const draft = () => {
    if (!title.trim()) { toast.error("Title required"); return; }
    setItems([{ id: `n-${Date.now()}`, title, message, audience, channel, status: "Draft", date: new Date().toISOString().slice(0,10), recipients: audienceSize(audience) }, ...items]);
    toast.success("Draft saved");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-4">
      <GlassCard className="p-5">
        <SectionTitle title="Compose Broadcast" subtitle="Send to any user segment across all channels"/>
        <form onSubmit={send} className="space-y-3">
          <Field label="Title"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New Prop Firm 200K launched" className={inputCls}/></Field>
          <Field label="Message"><textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} placeholder="Full message body users will see…" className={inputCls}/></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Audience"><select value={audience} onChange={e=>setAudience(e.target.value as any)} className={inputCls}>{audiences.map(a => <option key={a}>{a}</option>)}</select></Field>
            <Field label="Channel"><select value={channel} onChange={e=>setChannel(e.target.value as any)} className={inputCls}>{channels.map(a => <option key={a}>{a}</option>)}</select></Field>
          </div>
          <Field label="Schedule (optional)"><input type="date" value={schedule} onChange={e=>setSchedule(e.target.value)} className={inputCls}/></Field>

          <div className="glass rounded-xl p-3 text-xs text-muted-foreground flex items-center gap-3">
            <Users size={14} className="text-brand"/> Estimated reach: <span className="text-foreground font-medium">{audienceSize(audience).toLocaleString()}</span> users
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={draft} data-no-toast className="py-2.5 rounded-xl glass hover:bg-white/10 text-sm">Save Draft</button>
            <button type="submit" className="py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center justify-center gap-2"><Send size={14}/> {schedule ? "Schedule" : "Send now"}</button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="History" subtitle={`${items.length} notifications`}/>
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {items.map(n => (
            <div key={n.id} className="glass rounded-xl p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{n.channel}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{n.audience}</span>
                    <span className="inline-flex items-center gap-1"><Calendar size={10}/> {n.date}</span>
                    <span>· {n.recipients.toLocaleString()} recipients</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusPill status={n.status === "Sent" ? "Completed" : n.status === "Scheduled" ? "Pending" : "Active"}/>
                  <button onClick={() => remove(n.id)} data-no-toast className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-400/10" aria-label="Delete"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
