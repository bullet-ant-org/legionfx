import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { XCircle, ArrowLeft, LifeBuoy } from "lucide-react";
import { getPaySession } from "@/lib/deposit-methods";

export const Route = createFileRoute("/pay/failed")({ component: FailedPage });

function FailedPage() {
  const [session, setSession] = useState({ amount: 0, reference: "" });
  useEffect(() => { setSession(getPaySession()); }, []);

  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div className="max-w-md">
        <div className="mx-auto h-14 w-14 rounded-2xl border border-rose-500/40 bg-rose-500/10 grid place-items-center text-rose-400">
          <XCircle size={24} />
        </div>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Payment was not confirmed</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          We could not find a matching transfer on-chain for this reference. If you have already sent the funds, they are safe — confirmations can take longer during network congestion, and the deposit will be credited automatically once detected.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-px bg-border border border-border rounded-xl overflow-hidden text-left">
          <div className="bg-background px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Reference</div>
            <div className="text-sm mono mt-0.5">{session.reference}</div>
          </div>
          <div className="bg-background px-4 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</div>
            <div className="text-sm mono mt-0.5">${session.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/dashboard/wallet" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition">
            <ArrowLeft size={15} /> Back to wallet
          </Link>
          <Link to="/dashboard/support" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border text-sm hover:bg-foreground/5 transition">
            <LifeBuoy size={15} /> Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
