import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPaySession } from "@/lib/deposit-methods";

export const Route = createFileRoute("/pay/processing")({ component: ProcessingPage });

const STEPS = [
  "Broadcasting reference to the network",
  "Scanning mempool for a matching transfer",
  "Awaiting network confirmations",
  "Finalising deposit",
];

function ProcessingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [session, setSession] = useState({ amount: 0, reference: "" });

  useEffect(() => { setSession(getPaySession()); }, []);

  useEffect(() => {
    const t = window.setTimeout(() => navigate({ to: "/pay/failed" }), 15000);
    const i = window.setInterval(() => setStep((s) => (s < STEPS.length - 1 ? s + 1 : s)), 3800);
    const guard = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", guard);
    return () => { window.clearTimeout(t); window.clearInterval(i); window.removeEventListener("beforeunload", guard); };
  }, [navigate]);

  return (
    <div className="min-h-[60vh] grid place-items-center text-center">
      <div>
        <div className="relative mx-auto h-28 w-28">
          <div className="absolute inset-0 rounded-full border border-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand border-r-brand animate-spin-slow" />
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-brand/50 animate-spin-rev" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-xs mono text-muted-foreground">RXP</span>
          </div>
        </div>

        <h1 className="mt-8 text-xl font-semibold tracking-tight">Confirming transaction</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          We are verifying your transfer on-chain. This usually takes a few moments — please do not refresh or close this page.
        </p>

        <div className="mt-8 mx-auto max-w-sm space-y-2 text-left">
          {STEPS.map((s, i) => (
            <div key={s} className={`flex items-center gap-3 text-xs transition ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${i < step ? "bg-brand" : i === step ? "bg-brand animate-glow-pulse" : "bg-border"}`} />
              {s}
            </div>
          ))}
        </div>

        <div className="mt-8 inline-flex items-center gap-4 rounded-xl border border-border px-4 py-3 text-xs">
          <span className="text-muted-foreground">Reference</span>
          <span className="mono">{session.reference}</span>
          <span className="text-muted-foreground">Amount</span>
          <span className="mono">${session.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
