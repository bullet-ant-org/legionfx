import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Landmark, Hash, Wallet, Bitcoin, ChevronRight, ArrowLeft } from "lucide-react";
import { getPaySession, startPaySession } from "@/lib/deposit-methods";

type Search = { amount?: number };

export const Route = createFileRoute("/pay/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    amount: s['amount'] !== undefined ? Number(s['amount']) : undefined,
  }),
  component: PayIndex,
});

const METHODS = [
  { slug: "card", label: "Card payment", desc: "Visa, Mastercard, Amex", icon: CreditCard, available: false },
  { slug: "bank", label: "Bank transfer", desc: "Domestic and SWIFT wires", icon: Landmark, available: false },
  { slug: "ussd", label: "USSD payment", desc: "Pay from your mobile banking code", icon: Hash, available: false },
  { slug: "paypal", label: "PayPal", desc: "Balance or linked account", icon: Wallet, available: false },
  { slug: "crypto", label: "Cryptocurrency", desc: "BTC, USDT, ETH and more", icon: Bitcoin, available: true },
];

function PayIndex() {
  const { amount } = useSearch({ from: "/pay/" });
  const [session, setSession] = useState({ amount: 0, reference: "" });

  useEffect(() => {
    setSession(amount && amount > 0 ? startPaySession(amount) : getPaySession());
  }, [amount]);

  return (
    <div>
      <Link to="/dashboard/wallet" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft size={14} /> Back to wallet
      </Link>

      <div className="mt-6 rounded-2xl border border-border">
        <div className="p-6 flex items-end justify-between gap-4 border-b border-border">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Amount due</div>
            <div className="mt-1.5 text-4xl font-semibold mono tracking-tight">
              ${session.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Reference</div>
            <div className="text-xs mono">{session.reference}</div>
          </div>
        </div>

        <div className="p-6">
          <div className="text-sm font-medium">Choose a payment method</div>
          <p className="text-xs text-muted-foreground mt-1">Availability depends on your region and account status.</p>

          <div className="mt-5 space-y-2">
            {METHODS.map((m) => (
              <Link
                key={m.slug}
                to={m.available ? "/pay/crypto" : "/pay/unavailable/$method"}
                params={{ method: m.slug }}
                className="group flex items-center gap-4 rounded-xl border border-border px-4 py-4 hover:bg-foreground/[0.03] transition"
              >
                <div className={`h-10 w-10 rounded-lg border border-border grid place-items-center ${m.available ? "text-brand" : "text-muted-foreground"}`}>
                  <m.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{m.desc}</div>
                </div>
                {m.available ? (
                  <span className="text-[10px] uppercase tracking-widest text-brand">Available</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">Unavailable</span>
                )}
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-muted-foreground leading-relaxed">
        RexaPay processes deposits on behalf of LEGIONFX. Never send funds to an address that was not generated inside this checkout.
      </p>
    </div>
  );
}
