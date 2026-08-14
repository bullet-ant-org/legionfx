import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search, History } from "lucide-react";
import { GlassCard, inputCls, StatCard } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminAuditLog } from "@/lib/api";

export const Route = createFileRoute("/admin/audit")({ ssr: false, component: AuditPage });

function AuditPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    adminApi.listAuditLog()
      .then((r) => setLogs(r.logs))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load audit log"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => logs.filter((l) =>
    q === "" ||
    l.action.toLowerCase().includes(q.toLowerCase()) ||
    (l.actor?.name ?? "").toLowerCase().includes(q.toLowerCase()) ||
    l.target.toLowerCase().includes(q.toLowerCase())
  ), [logs, q]);

  const today = logs.filter((l) => new Date(l.createdAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <StatCard label="Total Events" value={logs.length}/>
        <StatCard label="Today" value={today}/>
        <StatCard label="Unique Admins" value={new Set(logs.map((l) => l.actor?._id).filter(Boolean)).size}/>
      </div>

      <GlassCard className="p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search action, admin, or target…" className={`${inputCls} pl-10`} />
        </div>
      </GlassCard>

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
              <tr>{["Admin", "Action", "Target", "Details", "Time"].map((h) => <th key={h} className="text-left px-4 py-3">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm"><History size={18} className="mx-auto mb-2 text-muted-foreground"/>No matching activity.</td></tr>
              ) : filtered.map((l) => (
                <tr key={l._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3"><div className="font-medium">{l.actor?.name ?? "System"}</div><div className="text-[10px] text-muted-foreground">{l.actor?.email}</div></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] border border-white/10">{l.action}</span></td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{l.target}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[260px] truncate">{Object.entries(l.meta || {}).map(([k, v]) => `${k}: ${v}`).join(", ") || "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
