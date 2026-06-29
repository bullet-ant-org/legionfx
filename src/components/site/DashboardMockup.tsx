import { TrendingUp, Wallet, Activity, Target } from "lucide-react";

export function DashboardMockup() {
  // Synthesized SVG candlestick / sparkline for a premium feel
  const candles = Array.from({ length: 28 }, (_, i) => {
    const base = 40 + Math.sin(i * 0.6) * 14 + i * 0.4;
    const up = (i * 7) % 3 !== 0;
    const wickTop = base - 10 - ((i * 13) % 8);
    const wickBot = base + 10 + ((i * 17) % 8);
    const openY = up ? base + 4 : base - 4;
    const closeY = up ? base - 4 : base + 4;
    return { i, up, wickTop, wickBot, openY, closeY };
  });

  return (
    <div className="relative animate-float">
      {/* Glow blobs */}
      <div className="absolute -inset-10 -z-10">
        <div className="absolute top-10 -left-6 h-56 w-56 rounded-full bg-brand/40 blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-triad-violet/30 blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 rounded-full bg-triad-teal/30 blur-3xl" />
      </div>

      {/* Laptop frame */}
      <div className="rounded-[24px] glass-strong p-3 shadow-card">
        <div className="rounded-[16px] bg-background/80 border border-white/5 overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <div className="ml-4 text-xs text-muted-foreground">legionfx.app / dashboard</div>
          </div>

          <div className="p-4 grid grid-cols-6 gap-3">
            {/* KPI cards */}
            <KPI icon={<Wallet size={14} />} label="Balance" value="$184,920" delta="+12.4%" />
            <KPI icon={<TrendingUp size={14} />} label="Daily P&L" value="+$3,210" delta="+1.7%" />
            <KPI icon={<Activity size={14} />} label="Win Rate" value="72%" delta="+3%" />

            {/* Chart */}
            <div className="col-span-6 rounded-xl bg-white/[0.02] border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-muted-foreground">EUR / USD · 1H</div>
                  <div className="text-lg font-semibold">1.0824 <span className="text-brand text-xs ml-1">+0.42%</span></div>
                </div>
                <div className="flex gap-1 text-[10px]">
                  {["1H","4H","1D","1W"].map((t,i) => (
                    <span key={t} className={`px-2 py-1 rounded ${i===0?"bg-brand/20 text-brand":"text-muted-foreground"}`}>{t}</span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 300 110" className="w-full h-32">
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="oklch(0.72 0.19 50)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* grid */}
                {[20,40,60,80].map(y => (
                  <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="oklch(1 0 0 / 0.04)" />
                ))}
                {/* area */}
                <path
                  d={`M0,80 ${candles.map(c => `L${c.i*10+5},${c.closeY+20}`).join(" ")} L300,110 L0,110 Z`}
                  fill="url(#area)"
                />
                {/* candles */}
                {candles.map(c => (
                  <g key={c.i}>
                    <line x1={c.i*10+5} x2={c.i*10+5} y1={c.wickTop+10} y2={c.wickBot+10} stroke={c.up?"oklch(0.78 0.18 150)":"oklch(0.68 0.2 25)"} strokeWidth="1" />
                    <rect x={c.i*10+2} y={Math.min(c.openY,c.closeY)+10} width="6" height={Math.max(2,Math.abs(c.openY-c.closeY))} fill={c.up?"oklch(0.78 0.18 150)":"oklch(0.68 0.2 25)"} rx="1" />
                  </g>
                ))}
              </svg>
            </div>

            {/* Lower row */}
            <div className="col-span-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2"><Target size={12}/> Funding Progress</div>
              <div className="text-sm font-medium mb-2">Phase 2 · $50K Challenge</div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[68%] brand-gradient rounded-full" />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2"><span>68%</span><span>Target 8%</span></div>
            </div>
            <div className="col-span-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
              <div className="text-xs text-muted-foreground mb-2">Open Positions</div>
              {[["XAUUSD","BUY","+$420"],["GBPJPY","SELL","+$185"],["BTCUSD","BUY","-$54"]].map(([s,d,p]) => (
                <div key={s} className="flex items-center justify-between text-xs py-1.5 border-b border-white/5 last:border-0">
                  <span className="font-medium">{s}</span>
                  <span className={d==="BUY"?"text-emerald-400":"text-rose-400"}>{d}</span>
                  <span className={p.startsWith("+")?"text-emerald-400":"text-rose-400"}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon, label, value, delta }: { icon: React.ReactNode; label: string; value: string; delta: string }) {
  return (
    <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/5 p-3">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">{icon} {label}</div>
      <div className="text-base font-semibold">{value}</div>
      <div className="text-[10px] text-brand mt-0.5">{delta}</div>
    </div>
  );
}
