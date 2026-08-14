import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Send, Bell, Users } from "lucide-react";
import { GlassCard, SectionTitle, Field, inputCls } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminAuditLog, type AdminUser } from "@/lib/api";

export const Route = createFileRoute("/admin/notify")({ ssr: false, component: NotifyPage });

const audiences = [
  { value: "all", label: "All Users" },
  { value: "Starter", label: "Starter plan" },
  { value: "Pro", label: "Pro plan" },
  { value: "Elite", label: "Elite plan" },
  { value: "Enterprise", label: "Enterprise plan" },
];

function NotifyPage() {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<AdminAuditLog[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    adminApi.listAuditLog()
      .then((r) => setHistory(r.logs.filter((l) => l.action === "notify.broadcast")))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
    adminApi.listUsers({}).then((r) => setUsers(r.users)).catch(() => {});
  }, []);

  const audienceSize = useMemo(() => {
    if (audience === "all") return users.length;
    return users.filter((u) => u.plan === audience).length;
  }, [audience, users]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Enter a message title"); return; }
    setSending(true);
    try {
      await adminApi.broadcastNotification(title.trim(), "info", audience);
      toast.success(`Sent to ${audienceSize} user${audienceSize === 1 ? "" : "s"}`);
      setTitle("");
      const r = await adminApi.listAuditLog();
      setHistory(r.logs.filter((l) => l.action === "notify.broadcast"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <GlassCard className="lg:col-span-2 p-5">
        <SectionTitle title="Broadcast Notification" subtitle="Delivered as an in-app notification — email/SMS/push aren't wired up yet" />
        <form onSubmit={send} className="space-y-4">
          <Field label="Message"><textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={4} className={inputCls} placeholder="e.g. Scheduled maintenance tonight at 2AM UTC" /></Field>
          <Field label="Audience">
            <select value={audience} onChange={(e) => setAudience(e.target.value)} className={inputCls}>
              {audiences.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </Field>
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Users size={13} className="text-brand" /> This will reach <span className="text-foreground font-semibold">{audienceSize}</span> user{audienceSize === 1 ? "" : "s"}.
          </div>
          <button type="submit" disabled={sending} className="w-full py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <Send size={14} /> {sending ? "Sending…" : "Send Broadcast"}
          </button>
        </form>
      </GlassCard>

      <GlassCard className="p-5">
        <SectionTitle title="Recent Broadcasts" subtitle="From the audit log" />
        {loadingHistory ? (
          <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 rounded-xl glass animate-pulse" />)}</div>
        ) : history.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground"><Bell size={18} className="mx-auto mb-2 text-muted-foreground" />No broadcasts sent yet.</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((h) => (
              <div key={h._id} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div className="text-xs font-medium truncate">{(h.meta?.title as string) || "Broadcast"}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  {(h.meta?.audience as string) || "all"} · {(h.meta?.count as number) ?? "?"} recipients · {new Date(h.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
