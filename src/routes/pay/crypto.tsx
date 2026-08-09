import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Copy, Check, AlertTriangle } from "lucide-react";
import { getPaySession, updatePaySession } from "@/lib/deposit-methods";
import { api, ApiError, type ApiDepositMethod } from "@/lib/api";

export const Route = createFileRoute("/pay/crypto")({ component: CryptoPage });

function CryptoPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<ApiDepositMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ApiDepositMethod | null>(null);
  const [session, setSession] = useState({ amount: 0, reference: "" });
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSession(getPaySession());
    api.getDepositMethods()
      .then((r) => {
        setMethods(r.methods);
        setSelected(r.methods[0] ?? null);
      })
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "Could not load payment methods"))
      .finally(() => setLoading(false));
  }, []);

  const copy = async () => {
    if (!selected) return;
    try {
      await navigator.clipboard.writeText(selected.address);
      setCopied(true);
      toast.success("Wallet address copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please select the address manually");
    }
  };

  const confirm = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.submitDeposit(
        session.amount,
        `${selected.symbol} (${selected.network})`,
        `Ref ${session.reference} — sent to ${selected.address}`,
      );
      updatePaySession({ methodId: selected._id });
      navigate({ to: "/pay/processing" });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not submit deposit — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/pay" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft size={14} /> Payment methods
      </Link>

      <div className="mt-6 rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Amount to send</div>
            <div className="mt-1.5 text-4xl font-semibold mono tracking-tight">
              ${session.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-muted-foreground">Reference</div>
            <div className="text-xs mono">{session.reference}</div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading payment methods…</div>
        ) : loadError ? (
          <div className="p-8 text-center text-sm text-rose-400">{loadError}</div>
        ) : methods.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No cryptocurrency is currently enabled for deposits. Please contact support.
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-border">
              <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Select currency</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {methods.map((m) => (
                  <button
                    key={m._id}
                    data-no-toast
                    onClick={() => setSelected(m)}
                    className={`px-3.5 py-2.5 rounded-xl border text-sm transition ${
                      selected?._id === m._id ? "border-brand bg-brand/10 text-foreground" : "border-border text-muted-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <span className="font-medium">{m.symbol}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{m.network}</span>
                  </button>
                ))}
              </div>
            </div>

            {selected && (
              <div className="p-6 space-y-4">
                <Row k="Currency" v={`${selected.currency} (${selected.symbol})`} />
                <Row k="Network" v={selected.network} />
                <Row k="Required confirmations" v={`${selected.confirmations}`} />

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Wallet address</div>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 rounded-xl border border-border bg-foreground/[0.03] px-4 py-3.5 mono text-xs break-all">
                      {selected.address}
                    </div>
                    <button
                      data-no-toast
                      onClick={copy}
                      className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition"
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy wallet address"}
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  <button
                    data-no-toast
                    onClick={confirm}
                    disabled={submitting}
                    className="px-5 py-3.5 rounded-xl bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "I have made the transfer"}
                  </button>
                  <Link to="/pay" className="px-5 py-3.5 rounded-xl border border-border text-sm text-center hover:bg-foreground/5 transition">
                    Back
                  </Link>
                </div>

                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-amber-200/90 space-y-1.5">
                    <p><strong>Do not click “I have made the transfer” unless the payment has actually been sent.</strong> False confirmations are logged and repeated attempts will suspend your deposit privileges.</p>
                    <p><strong>Do not refresh or close this page</strong> while the transaction is being confirmed — the reference above will be lost and the deposit may not be credited.</p>
                    <p>Send only <strong>{selected.symbol}</strong> over the <strong>{selected.network}</strong> network. Assets sent on another network are unrecoverable.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="text-xs text-muted-foreground">{k}</span>
      <span className="text-sm mono">{v}</span>
    </div>
  );
}
