import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { startPaySession } from "@/lib/deposit-methods";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Wallet as WalletIcon, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Lock,
  TrendingUp, Gift, ChevronRight, Plus, Edit, Trash2, Check, ShieldCheck, Key,
  CreditCard, Bitcoin, Activity, Download, Filter, X, Bot, Trophy, GraduationCap,
  LineChart as LineIcon, Sparkles, Copy,
} from "lucide-react";
import {
  GlassCard, StatCard, SectionTitle, Counter, StatusPill, Modal, Field, inputCls,
} from "@/components/dashboard/primitives";
import {
  wallet, performance, portfolioBreakdown, transactions, paymentMethods, market,
  activeBots, propFirm, academy, referral,
} from "@/lib/demo-data";

export const Route = createFileRoute("/dashboard/wallet")({
  ssr: false,
  component: WalletPage,
});

type Range = "Today" | "7D" | "30D" | "3M" | "1Y" | "All";

function WalletPage() {
  const [modal, setModal] = useState<null | "deposit" | "withdraw" | "transfer">(null);
  const [selectedTx, setSelectedTx] = useState<(typeof transactions)[number] | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [range, setRange] = useState<Range>("30D");

  const data = useMemo(() => {
    const map: Record<Range, typeof performance.daily> = {
      Today: performance.daily,
      "7D": performance.weekly,
      "30D": performance.monthly,
      "3M": performance.monthly,
      "1Y": performance.yearly,
      All: performance.yearly,
    };
    return map[range];
  }, [range]);

  const filteredTx = useMemo(
    () => (filter === "All" ? transactions : transactions.filter((t) => t.type === filter)),
    [filter],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage every aspect of your trading finances from one secure location.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setModal("deposit")} className="px-4 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium shadow-glow hover:opacity-90 transition inline-flex items-center gap-2">
            <ArrowDownToLine size={15} /> Deposit
          </button>
          <button onClick={() => setModal("withdraw")} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm font-medium inline-flex items-center gap-2">
            <ArrowUpFromLine size={15} /> Withdraw
          </button>
          <button onClick={() => setModal("transfer")} className="px-4 py-2.5 rounded-xl glass hover:bg-white/10 text-sm font-medium inline-flex items-center gap-2">
            <ArrowLeftRight size={15} /> Transfer
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <StatCard label="Portfolio Value" value={wallet.totalPortfolio} prefix="$" decimals={2} delta={`+${wallet.todayChangePct}% today`} icon={<TrendingUp size={14} />} />
        <StatCard label="Available" value={wallet.available} prefix="$" decimals={2} delta="Spendable" icon={<WalletIcon size={14} />} />
        <StatCard label="Locked" value={wallet.locked} prefix="$" decimals={2} delta="In challenges" trend="down" icon={<Lock size={14} />} />
        <StatCard label="Total Profit" value={wallet.totalProfit} prefix="$" decimals={2} delta="+18.4% YTD" icon={<TrendingUp size={14} />} />
        <StatCard label="Pending W/D" value={wallet.pendingWithdrawals} prefix="$" decimals={2} delta="1-3 days" trend="down" icon={<ArrowUpFromLine size={14} />} />
        <StatCard label="Referrals" value={wallet.referralEarnings} prefix="$" decimals={2} delta="+$184 this wk" icon={<Gift size={14} />} />
      </div>

      {/* Distribution + Performance */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <SectionTitle title="Portfolio Distribution" subtitle="Where your capital is allocated" />
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={portfolioBreakdown} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="none">
                  {portfolioBreakdown.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {portfolioBreakdown.map((p) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0"><span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} /><span className="text-muted-foreground truncate">{p.name}</span></div>
                <div className="font-medium">${p.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold">Wallet Performance</div>
              <div className="text-xs text-muted-foreground">Portfolio growth & cash flow</div>
            </div>
            <div className="flex gap-1 p-1 glass rounded-xl">
              {(["Today", "7D", "30D", "3M", "1Y", "All"] as Range[]).map((t) => (
                <button key={t} onClick={() => setRange(t)} className={`px-2.5 py-1.5 text-[11px] rounded-lg transition ${range === t ? "brand-gradient text-brand-foreground" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="walPerf" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.78 0.21 55)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="walDep" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.14 190)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="oklch(0.72 0.14 190)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" vertical={false} />
                <XAxis dataKey="i" tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 60)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.02 50)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.21 55)" strokeWidth={2} fill="url(#walPerf)" />
                <Area type="monotone" dataKey="deposits" stroke="oklch(0.72 0.14 190)" strokeWidth={1.5} fill="url(#walDep)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Asset breakdown */}
      <div>
        <SectionTitle title="Asset Breakdown" subtitle="Funds across each LEGIONFX service" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AssetCard
            icon={<WalletIcon size={16} />} title="Main Wallet"
            primary={`$${wallet.available.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            secondary="Available for use"
            actions={[{ label: "Deposit", onClick: () => setModal("deposit") }, { label: "Withdraw", onClick: () => setModal("withdraw") }, { label: "Transfer", onClick: () => setModal("transfer") }]}
          />
          <AssetCard
            icon={<Trophy size={16} />} title="Prop Firm Wallet"
            primary={`$${propFirm.currentEquity.toLocaleString()}`}
            secondary={`${propFirm.phase} · ${propFirm.completion}% complete`}
            actions={[{ label: "Continue Challenge", primary: true }]}
          />
          <AssetCard
            icon={<Bot size={16} />} title="Trading Bots Wallet"
            primary={`+$${activeBots.reduce((a, b) => a + b.profit, 0).toLocaleString()}`}
            secondary={`${activeBots.length} bots · subscription active`}
            actions={[{ label: "Manage Bots" }]}
          />
          <AssetCard
            icon={<LineIcon size={16} />} title="Signals Wallet"
            primary="$49 / mo"
            secondary="Renews Jul 14 · Auto-renew on"
            actions={[{ label: "Renew" }, { label: "Auto-renew" }]}
          />
          <AssetCard
            icon={<GraduationCap size={16} />} title="Academy Wallet"
            primary={`${academy.lessons.done} lessons`}
            secondary={`${academy.certificates} certificates · 4 mentor credits`}
            actions={[{ label: "View History" }]}
          />
          <AssetCard
            icon={<Gift size={16} />} title="Referral Wallet"
            primary={`$${referral.earnings.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            secondary={`${referral.total} referrals · $420 withdrawable`}
            actions={[{ label: "Invite Friends", primary: true }]}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <SectionTitle title="Quick Actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { icon: ArrowDownToLine, label: "Deposit", onClick: () => setModal("deposit") },
            { icon: ArrowUpFromLine, label: "Withdraw", onClick: () => setModal("withdraw") },
            { icon: ArrowLeftRight, label: "Transfer", onClick: () => setModal("transfer") },
            { icon: Bot, label: "Buy Bot" },
            { icon: Trophy, label: "Prop Firm" },
            { icon: LineIcon, label: "Signals" },
            { icon: GraduationCap, label: "Academy" },
            { icon: Sparkles, label: "Pay Link" },
          ].map((a) => (
            <button key={a.label} onClick={a.onClick} className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover-lift">
              <div className="h-10 w-10 rounded-xl brand-gradient grid place-items-center text-brand-foreground"><a.icon size={16} /></div>
              <div className="text-xs font-medium">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <GlassCard className="p-5">
        <SectionTitle
          title="Transaction History"
          action={
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 inline-flex items-center gap-1"><Download size={12} /> CSV</button>
              <button className="text-xs px-3 py-1.5 rounded-lg glass hover:bg-white/10 inline-flex items-center gap-1"><Download size={12} /> PDF</button>
            </div>
          }
        />
        <div className="flex flex-wrap gap-1.5 mb-3">
          {["All", "Deposit", "Withdrawal", "Bot Profit", "Signal Purchase", "Academy", "Prop Firm", "Referral"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-[11px] rounded-full transition ${filter === f ? "brand-gradient text-brand-foreground" : "glass text-muted-foreground hover:text-foreground"}`}>{f}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-white/5">
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">ID</th>
                <th className="text-left py-2 font-medium">Type</th>
                <th className="text-left py-2 font-medium">Method</th>
                <th className="text-right py-2 font-medium">Amount</th>
                <th className="text-right py-2 font-medium">Status</th>
                <th className="text-right py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((t) => (
                <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="py-2.5 text-muted-foreground">{t.date}</td>
                  <td className="py-2.5 text-muted-foreground">{t.id}</td>
                  <td className="py-2.5">{t.type}</td>
                  <td className="py-2.5 text-muted-foreground">{t.method}</td>
                  <td className={`py-2.5 text-right font-medium ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>{t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString()}</td>
                  <td className="py-2.5 text-right"><StatusPill status={t.status} /></td>
                  <td className="py-2.5 text-right">
                    <button onClick={() => setSelectedTx(t)} className="text-brand hover:underline text-[11px]">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Payment methods + Security */}
      <div className="grid lg:grid-cols-3 gap-4">
        <GlassCard className="p-5 lg:col-span-2">
          <SectionTitle title="Payment Methods" action={<button className="text-xs px-3 py-1.5 rounded-lg brand-gradient text-brand-foreground inline-flex items-center gap-1"><Plus size={12} /> Add New</button>} />
          <div className="grid md:grid-cols-2 gap-3">
            {paymentMethods.map((p) => (
              <div key={p.label} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl glass grid place-items-center text-brand">
                  {p.type.includes("Bitcoin") ? <Bitcoin size={16} /> : p.type.includes("USDT") ? <Sparkles size={16} /> : <CreditCard size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold flex items-center gap-2">{p.type} {p.verified && <Check size={12} className="text-emerald-400" />}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{p.label}</div>
                </div>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground"><Edit size={12} /></button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-rose-400"><Trash2 size={12} /></button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <SectionTitle title="Wallet Security" />
          <div className="space-y-2.5">
            {[
              { icon: Key, label: "Withdrawal PIN", value: "Enabled" },
              { icon: ShieldCheck, label: "Two-Factor Auth", value: "Active" },
              { icon: Check, label: "Verified Identity", value: "Verified" },
              { icon: ArrowUpFromLine, label: "Last Withdrawal", value: "Jun 27" },
              { icon: ArrowDownToLine, label: "Last Deposit", value: "Jun 29" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 text-xs rounded-xl bg-white/[0.03] border border-white/5 p-3">
                <div className="h-8 w-8 rounded-lg glass grid place-items-center text-brand"><s.icon size={14} /></div>
                <div className="flex-1 text-muted-foreground">{s.label}</div>
                <div className="font-medium">{s.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Market widgets */}
      <div>
        <SectionTitle title="Market Overview" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {market.map((m) => (
            <div key={m.symbol} className="glass rounded-2xl p-4 hover-lift">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold">{m.symbol}</div>
                <Activity size={12} className="text-brand" />
              </div>
              <div className="text-[10px] text-muted-foreground">{m.name}</div>
              <div className="mt-2 text-base font-bold">{m.price.toLocaleString()}</div>
              <div className={`text-[10px] mt-0.5 ${m.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>{m.change >= 0 ? "+" : ""}{m.change}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <GlassCard className="p-5">
        <SectionTitle title="Frequently Asked Questions" />
        <div className="space-y-2">
          {[
            ["How long do withdrawals take?", "Crypto withdrawals process within 30 minutes; bank transfers within 1–3 business days."],
            ["Which payment methods are supported?", "Visa, Mastercard, USDT (TRC20/ERC20), Bitcoin, Ethereum, and direct bank transfers."],
            ["Are deposits instant?", "Crypto deposits credit after 1 confirmation. Card payments are instant."],
            ["Can I transfer between wallets?", "Yes — instantly, with zero fees, between Main, Prop Firm, Bots, Signals, and Academy wallets."],
            ["What are the withdrawal fees?", "Crypto: network fee only. Bank transfer: $5 flat. Internal transfers are free."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-xl bg-white/[0.03] border border-white/5 p-3 open:bg-white/[0.05]">
              <summary className="text-sm cursor-pointer list-none flex items-center justify-between"><span>{q}</span><ChevronRight size={14} className="text-brand transition group-open:rotate-90" /></summary>
              <p className="mt-2 text-xs text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </GlassCard>

      {/* Final CTA */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 brand-gradient text-brand-foreground">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Take Full Control of Your Trading Capital.</h2>
          <p className="mt-3 text-sm opacity-90">Manage your funds, track performance, monitor profits, and securely move money across every LEGIONFX service from one intelligent financial dashboard.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => setModal("deposit")} className="px-5 py-2.5 rounded-xl bg-background text-foreground text-sm font-medium hover:opacity-90 inline-flex items-center gap-2"><ArrowDownToLine size={14} /> Deposit Funds</button>
            <a href="/dashboard" className="px-5 py-2.5 rounded-xl border border-background/30 text-sm font-medium hover:bg-background/10">Trading Dashboard</a>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal open={modal === "deposit"} onClose={() => setModal(null)} />
      <WithdrawModal open={modal === "withdraw"} onClose={() => setModal(null)} />
      <TransferModal open={modal === "transfer"} onClose={() => setModal(null)} />
      <TxDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}

function AssetCard({ icon, title, primary, secondary, actions }: {
  icon: React.ReactNode; title: string; primary: string; secondary: string;
  actions: { label: string; primary?: boolean; onClick?: () => void }[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-5 hover-lift">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="h-8 w-8 rounded-lg brand-gradient grid place-items-center text-brand-foreground">{icon}</span>
        {title}
      </div>
      <div className="mt-3 text-2xl font-bold">{primary}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{secondary}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a) => (
          <button key={a.label} onClick={a.onClick} className={`text-[11px] px-3 py-1.5 rounded-lg ${a.primary ? "brand-gradient text-brand-foreground" : "glass hover:bg-white/10"}`}>{a.label}</button>
        ))}
      </div>
    </motion.div>
  );
}

function DepositModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("500");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Math.max(10, Number(amount) || 0);
    startPaySession(value);
    onClose();
    navigate({ to: "/pay", search: { amount: value } });
  };
  return (
    <Modal open={open} onClose={onClose} title="Deposit Funds" size="lg">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (USD)"><input type="number" min="10" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputCls} /></Field>
          <Field label="Promo Code"><input type="text" placeholder="Optional" className={inputCls} /></Field>
        </div>
        <div className="flex flex-wrap gap-2">
          {[100, 500, 1000, 5000].map((v) => (
            <button key={v} type="button" data-no-toast onClick={() => setAmount(String(v))} className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-foreground/5">${v.toLocaleString()}</button>
          ))}
        </div>
        <div className="glass rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-muted-foreground">Amount</span><span>${amount}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Processing Fee</span><span>$0.00</span></div>
          <div className="flex justify-between font-semibold pt-1.5 border-t border-white/5"><span>You receive</span><span className="text-brand">${amount}</span></div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          You'll be taken to the secure RexaPay checkout to choose a payment method.
        </p>
        <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Continue to RexaPay</button>
      </form>
    </Modal>
  );
}


function WithdrawModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <Modal open={open} onClose={() => { setDone(false); onClose(); }} title="Withdraw Funds" size="lg">
      {done ? (
        <div className="text-center py-6">
          <div className="h-14 w-14 mx-auto rounded-full brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Check size={26} /></div>
          <h4 className="mt-4 font-semibold">Withdrawal submitted</h4>
          <p className="text-xs text-muted-foreground mt-1">Reference WD-119 · ETA 1–3 business days</p>
          <button onClick={() => { setDone(false); onClose(); }} className="mt-5 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Close</button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Method"><select className={inputCls}>{["USDT TRC20", "Bank Transfer", "Bitcoin"].map((m) => <option key={m}>{m}</option>)}</select></Field>
            <Field label="Account"><select className={inputCls}><option>Primary · •••• 4821</option></select></Field>
          </div>
          <Field label="Amount (USD)"><input type="number" defaultValue={500} className={inputCls} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Withdrawal PIN"><input type="password" maxLength={6} className={inputCls} placeholder="••••••" /></Field>
            <Field label="2FA Code"><input type="text" maxLength={6} className={inputCls} placeholder="123 456" /></Field>
          </div>
          <div className="glass rounded-xl p-3 text-xs space-y-1.5">
            <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span>$5.00</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Processing</span><span>1–3 days</span></div>
            <div className="flex justify-between font-semibold pt-1.5 border-t border-white/5"><span>Net Receive</span><span className="text-brand">$495.00</span></div>
          </div>
          <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Confirm Withdrawal</button>
        </form>
      )}
    </Modal>
  );
}

function TransferModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <Modal open={open} onClose={() => { setDone(false); onClose(); }} title="Transfer Between Wallets">
      {done ? (
        <div className="text-center py-6">
          <div className="h-14 w-14 mx-auto rounded-full brand-gradient grid place-items-center text-brand-foreground shadow-glow"><Check size={26} /></div>
          <h4 className="mt-4 font-semibold">Transfer complete</h4>
          <button onClick={() => { setDone(false); onClose(); }} className="mt-5 px-5 py-2.5 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Close</button>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} className="space-y-4">
          <Field label="From"><select className={inputCls}>{["Main Wallet", "Referral Wallet"].map((m) => <option key={m}>{m}</option>)}</select></Field>
          <div className="grid place-items-center text-brand"><ArrowLeftRight size={16} /></div>
          <Field label="To"><select className={inputCls}>{["Bot Wallet", "Prop Firm Wallet", "Signals Wallet", "Academy Wallet"].map((m) => <option key={m}>{m}</option>)}</select></Field>
          <Field label="Amount"><input type="number" defaultValue={250} className={inputCls} /></Field>
          <button type="submit" className="w-full py-3 rounded-xl brand-gradient text-brand-foreground text-sm font-medium">Transfer</button>
        </form>
      )}
    </Modal>
  );
}

function TxDetailsModal({ tx, onClose }: { tx: (typeof transactions)[number] | null; onClose: () => void }) {
  return (
    <Modal open={!!tx} onClose={onClose} title="Transaction Details">
      {tx && (
        <div className="space-y-3 text-xs">
          {[
            ["Transaction ID", tx.id],
            ["Date", tx.date],
            ["Type", tx.type],
            ["Category", tx.category],
            ["Method", tx.method],
            ["Reference", tx.ref],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2"><span className="text-muted-foreground">Amount</span>
            <span className={`font-semibold ${tx.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>{tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between py-2"><span className="text-muted-foreground">Status</span><StatusPill status={tx.status} /></div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="py-2 rounded-xl glass hover:bg-white/10 text-xs">Download Receipt</button>
            <button onClick={onClose} className="py-2 rounded-xl brand-gradient text-brand-foreground text-xs font-medium">Close</button>
          </div>
        </div>
      )}
    </Modal>
  );
}
