import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download } from "lucide-react";
import { GlassCard, inputCls } from "@/components/dashboard/primitives";
import { auditLog } from "@/lib/admin-data";
import { toast } from "sonner";

const extended = [
  ...auditLog,
  { actor: "admin@gmail.com", action: "Published signal: BTC/USD SELL @ 68400", time: "2d ago" },
  { actor: "admin@gmail.com", action: "Created pricing plan: Enterprise", time: "3d ago" },
  { actor: "admin@gmail.com", action: "Suspended user USR-1018", time: "4d ago" },
  { actor: "admin@gmail.com", action: "Rejected withdrawal WDR-7015", time: "5d ago" },
  { actor: "admin@gmail.com", action: "Verified KYC for USR-1005", time: "6d ago" },
  { actor: "admin@gmail.com", action: "Added payment option: USDT ERC20", time: "1w ago" },
];

export const Route = createFileRoute("/admin/audit")({ component: AuditPage });

function AuditPage() {
  const [q, setQ] = useState("");
  const rows = extended.filter(r => q === "" || r.action.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-4">
      <GlassCard className="p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search actions…" className={`${inputCls} pl-10`}/>
        </div>
        <button onClick={() => toast.success("Audit log exported")} className="px-3.5 py-2.5 rounded-xl glass hover:bg-white/10 text-sm inline-flex items-center gap-2"><Download size={14}/> Export CSV</button>
      </GlassCard>
      <GlassCard className="p-0 overflow-hidden">
        <ul>
          {rows.map((r,i) => (
            <li key={i} className="px-4 py-3 border-b border-white/5 last:border-0 flex items-center justify-between text-sm hover:bg-white/[0.02]">
              <div><div>{r.action}</div><div className="text-[10px] text-muted-foreground mt-0.5">{r.actor}</div></div>
              <div className="text-xs text-muted-foreground">{r.time}</div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
