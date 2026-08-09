import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bitcoin, ShieldAlert, Globe2 } from "lucide-react";
import { fetchGeo, type GeoInfo } from "@/lib/deposit-methods";

export const Route = createFileRoute("/pay/unavailable/$method")({ component: UnavailablePage });

const LABELS: Record<string, string> = {
  card: "Card payment",
  bank: "Bank transfer",
  ussd: "USSD payment",
  paypal: "PayPal",
};

function UnavailablePage() {
  const { method } = useParams({ from: "/pay/unavailable/$method" });
  const label = LABELS[method] ?? "This payment option";
  const [geo, setGeo] = useState<GeoInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchGeo().then((g) => { if (alive) { setGeo(g); setLoading(false); } });
    return () => { alive = false; };
  }, []);

  const rows: [string, string][] = geo
    ? [
        ["IP address", geo.ip],
        ["City", geo.city],
        ["Region", geo.region],
        ["Country", `${geo.country} (${geo.countryCode})`],
        ["Postal code", geo.postal],
        ["Timezone", geo.timezone],
        ["Network", geo.org],
        ["Local currency", geo.currency],
      ]
    : [];

  return (
    <div>
      <Link to="/pay" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
        <ArrowLeft size={14} /> Payment methods
      </Link>

      <div className="mt-6 rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl border border-amber-500/40 bg-amber-500/10 grid place-items-center text-amber-400">
            <ShieldAlert size={19} />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">{label} is currently not available in your region</h1>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Our acquiring partner does not yet support this method for the location detected below. Cryptocurrency deposits remain available worldwide.
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <Globe2 size={12} /> Detected connection
          </div>

          {loading ? (
            <div className="mt-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 rounded-lg bg-foreground/[0.04] animate-pulse" />
              ))}
            </div>
          ) : geo ? (
            <dl className="mt-4 grid sm:grid-cols-2 gap-px bg-border border border-border rounded-xl overflow-hidden">
              {rows.map(([k, v]) => (
                <div key={k} className="bg-background px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="text-sm mono mt-0.5 truncate">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              We could not determine your location automatically. This payment method is still unavailable for your account.
            </p>
          )}
        </div>

        <div className="p-6 border-t border-border grid sm:grid-cols-2 gap-3">
          <Link to="/pay/crypto" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition">
            <Bitcoin size={16} /> Pay with cryptocurrency
          </Link>
          <Link to="/pay" className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-sm hover:bg-foreground/5 transition">
            Choose another method
          </Link>
        </div>
      </div>
    </div>
  );
}
