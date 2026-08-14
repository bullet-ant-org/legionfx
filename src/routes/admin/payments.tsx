import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Wallet, ArrowRight, Check } from "lucide-react";
import { GlassCard, SectionTitle, StatCard } from "@/components/dashboard/primitives";
import { adminApi, ApiError, type AdminPaymentMethod } from "@/lib/api";

export const Route = createFileRoute("/admin/payments")({ ssr: false, component: PaymentsAdminPage });

function PaymentsAdminPage() {
  const [methods, setMethods] = useState<AdminPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.listPaymentMethods()
      .then((r) => setMethods(r.methods))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : "Could not load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  const verified = methods.filter((m) => m.verified).length;

  return (
    <div className="space-y-4">
      <GlassCard className="p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold flex items-center gap-2"><Wallet size={16} className="text-brand"/> Deposit Wallets (Crypto)</div>
          <div className="text-xs text-muted-foreground mt-0.5">Manage the wallet addresses clients pay into from the checkout — that's a separate page.</div>
        </div>
        <Link to="/admin/deposit-methods" className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium inline-flex items-center gap-2">
          Manage Deposit Wallets <ArrowRight size={14}/>
        </Link>
      </GlassCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Saved Methods" value={methods.length} icon={<CreditCard size={14}/>}/>
        <StatCard label="Verified" value={verified} icon={<Check size={14}/>}/>
      </div>

      <GlassCard className="p-5">
        <SectionTitle title="User Payment Methods" subtitle="Cards / accounts users have saved on their own wallet page — read-only" />
        {loading ? (
          <div className="space-y-2">{Array.from({length:4}).map((_,i)=><div key={i} className="h-14 rounded-xl glass animate-pulse"/>)}</div>
        ) : methods.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">No users have added a payment method yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
                <tr>{["User","Type","Label","Verified","Added"].map(h => <th key={h} className="text-left px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {methods.map((m) => (
                  <tr key={m._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5"><div className="font-medium">{m.user?.name ?? "Unknown"}</div><div className="text-[10px] text-muted-foreground">{m.user?.email}</div></td>
                    <td className="px-3 py-2.5 text-xs">{m.type}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{m.label}</td>
                    <td className="px-3 py-2.5">{m.verified ? <span className="text-emerald-400 text-xs inline-flex items-center gap-1"><Check size={11}/> Verified</span> : <span className="text-muted-foreground text-xs">Unverified</span>}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
