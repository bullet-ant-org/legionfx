// Centralized demo data shared across the dashboard.

export const user = {
  name: "Keagan Mitchell",
  firstName: "Keagan",
  email: "demo@gmail.com",
  plan: "Elite",
  status: "Verified",
  streakDays: 32,
  initials: "KM",
  joined: "Mar 2023",
};

export const wallet = {
  totalPortfolio: 24865.72,
  available: 12580.42,
  locked: 8420.0,
  totalProfit: 18450.22,
  pendingWithdrawals: 1250.0,
  referralEarnings: 2615.3,
  bonusBalance: 320.0,
  totalDeposits: 21500,
  todayChangePct: 2.84,
};

export const quickStats = [
  { label: "Wallet Balance", value: wallet.available, prefix: "$", delta: "+2.8%", trend: "up" as const },
  { label: "Today's Profit", value: 412.55, prefix: "$", delta: "+1.6%", trend: "up" as const },
  { label: "Monthly Profit", value: 6240.18, prefix: "$", delta: "+18.4%", trend: "up" as const },
  { label: "Total Withdrawals", value: 8200, prefix: "$", delta: "+3 this mo", trend: "up" as const },
  { label: "Active Bots", value: 3, delta: "All running", trend: "up" as const },
  { label: "Signal Accuracy", value: 90, suffix: "%", delta: "+2%", trend: "up" as const },
  { label: "Prop Firm Progress", value: 72, suffix: "%", delta: "Phase 2", trend: "up" as const },
  { label: "Academy Completion", value: 65, suffix: "%", delta: "Forex Mastery", trend: "up" as const },
];

// Performance series — used for area charts.
function gen(n: number, start: number, vol: number) {
  const out: { i: number; v: number; deposits: number; withdrawals: number }[] = [];
  let v = start;
  for (let i = 0; i < n; i++) {
    v += (Math.sin(i * 0.4) + (Math.random() - 0.45)) * vol;
    v = Math.max(start * 0.85, v);
    out.push({
      i,
      v: Math.round(v),
      deposits: Math.round(Math.max(0, (Math.sin(i * 0.3) + 1) * vol * 0.6)),
      withdrawals: Math.round(Math.max(0, (Math.cos(i * 0.5) + 1) * vol * 0.3)),
    });
  }
  return out;
}

export const performance = {
  daily: gen(24, 22000, 180),
  weekly: gen(14, 21000, 350),
  monthly: gen(30, 18500, 420),
  yearly: gen(12, 12000, 1200),
};

export const portfolioBreakdown = [
  { name: "Available Wallet", value: 12580, color: "oklch(0.78 0.21 55)" },
  { name: "Prop Firm Capital", value: 5400, color: "oklch(0.72 0.14 190)" },
  { name: "Trading Bots", value: 3200, color: "oklch(0.68 0.18 295)" },
  { name: "Academy", value: 850, color: "oklch(0.78 0.18 150)" },
  { name: "Signals", value: 400, color: "oklch(0.85 0.12 90)" },
  { name: "Pending Withdrawals", value: 1250, color: "oklch(0.62 0.22 25)" },
  { name: "Referral Earnings", value: 1185, color: "oklch(0.62 0.05 50)" },
];

export const activeBots = [
  { name: "Apex Trend Pro", pair: "EUR/USD", status: "Running", profit: 1245.5, winRate: 78, risk: "Medium", uptime: "4d 12h" },
  { name: "Midas Gold v3", pair: "XAU/USD", status: "Running", profit: 3210.2, winRate: 82, risk: "High", uptime: "12d 4h" },
  { name: "Sentinel Scalper", pair: "GBP/JPY", status: "Paused", profit: 540.1, winRate: 71, risk: "Low", uptime: "—" },
];

export const propFirm = {
  size: 100000,
  phase: "Phase 2",
  completion: 72,
  profitTarget: 8000,
  currentEquity: 105760,
  dailyDrawdown: 2.1,
  maxDrawdown: 4.8,
  remainingDays: 14,
};

export const academy = {
  currentCourse: "Forex Mastery",
  completion: 65,
  lessons: { done: 26, total: 40 },
  certificates: 3,
  nextSession: "Tue, Jul 1 · 4:00 PM",
};

export const signals = [
  { pair: "XAU/USD", direction: "BUY", entry: 2342.5, sl: 2335, tp: 2360, confidence: 92, status: "Active" },
  { pair: "EUR/USD", direction: "SELL", entry: 1.0824, sl: 1.085, tp: 1.078, confidence: 86, status: "Active" },
  { pair: "GBP/JPY", direction: "BUY", entry: 198.55, sl: 197.9, tp: 200.2, confidence: 78, status: "TP Hit" },
  { pair: "BTC/USD", direction: "SELL", entry: 68400, sl: 69200, tp: 66500, confidence: 81, status: "Active" },
];

export const transactions = [
  { id: "TX-2841", date: "2026-06-29", type: "Deposit", category: "Wallet", amount: 2500, status: "Completed", method: "USDT TRC20", ref: "0x8af…21c" },
  { id: "TX-2840", date: "2026-06-28", type: "Bot Profit", category: "Trading Bot", amount: 412.55, status: "Completed", method: "Internal", ref: "BOT-APEX-12" },
  { id: "TX-2839", date: "2026-06-27", type: "Withdrawal", category: "Wallet", amount: -1200, status: "Pending", method: "Bank Transfer", ref: "WD-118" },
  { id: "TX-2838", date: "2026-06-26", type: "Signal Purchase", category: "Signals", amount: -49, status: "Completed", method: "Card", ref: "INV-552" },
  { id: "TX-2837", date: "2026-06-25", type: "Referral", category: "Referral", amount: 184.2, status: "Completed", method: "Internal", ref: "REF-09" },
  { id: "TX-2836", date: "2026-06-24", type: "Prop Firm", category: "Prop Firm", amount: 1200, status: "Completed", method: "Internal", ref: "PF-100K-2" },
  { id: "TX-2835", date: "2026-06-23", type: "Academy", category: "Academy", amount: -199, status: "Completed", method: "Card", ref: "EDU-FX-1" },
  { id: "TX-2834", date: "2026-06-22", type: "Deposit", category: "Wallet", amount: 5000, status: "Completed", method: "BTC", ref: "0x4ce…91f" },
];

export const calendar = [
  { date: "Jul 01", title: "Mentorship: Smart Money", type: "Mentorship" },
  { date: "Jul 02", title: "FOMC Rate Decision", type: "News" },
  { date: "Jul 03", title: "Bot v3.4 Update", type: "Bot" },
  { date: "Jul 05", title: "Prop Firm Phase 2 Deadline", type: "Prop Firm" },
];

export const market = [
  { symbol: "XAU/USD", name: "Gold", price: 2342.5, change: 0.84 },
  { symbol: "BTC/USD", name: "Bitcoin", price: 68420, change: -1.2 },
  { symbol: "EUR/USD", name: "Euro", price: 1.0824, change: 0.42 },
  { symbol: "GBP/USD", name: "Pound", price: 1.272, change: -0.18 },
  { symbol: "NAS100", name: "Nasdaq", price: 19582, change: 1.05 },
  { symbol: "SPX500", name: "S&P 500", price: 5478, change: 0.36 },
];

export const messages = [
  { from: "Marcus Vale", role: "Trading Mentor", preview: "Great work on phase 1 — let's review your journal.", time: "8m", unread: true },
  { from: "Support", role: "Customer Support", preview: "Your withdrawal is being processed.", time: "1h", unread: true },
  { from: "Prop Firm Desk", role: "Manager", preview: "Phase 2 reset confirmed.", time: "3h", unread: false },
  { from: "Academy", role: "Instructor", preview: "New lesson published in Forex Mastery.", time: "1d", unread: false },
];

export const achievements = [
  { label: "First Withdrawal", earned: true },
  { label: "100 Trades", earned: true },
  { label: "Passed Phase 1", earned: true },
  { label: "Top Performer", earned: true },
  { label: "Elite Member", earned: true },
  { label: "Referral Pro", earned: false },
];

export const notifications = [
  { id: 1, title: "Wallet deposit successful", time: "5m ago", unread: true, kind: "wallet" },
  { id: 2, title: "Midas Gold v3 generated +$210 profit", time: "22m ago", unread: true, kind: "bot" },
  { id: 3, title: "New signal: XAU/USD BUY @ 2342.5", time: "1h ago", unread: true, kind: "signal" },
  { id: 4, title: "Mentorship session starts tomorrow", time: "3h ago", unread: true, kind: "mentor" },
  { id: 5, title: "Prop Firm challenge reached 72%", time: "Yesterday", unread: false, kind: "propfirm" },
];

export const paymentMethods = [
  { type: "Visa", label: "•••• 4821", verified: true },
  { type: "USDT TRC20", label: "TX8a…21c", verified: true },
  { type: "Bitcoin", label: "bc1q…9f0", verified: false },
  { type: "Bank — Standard", label: "ACC 003821", verified: true },
];

export const referral = {
  link: "https://legionfx.com/r/keagan-3X4Z",
  total: 28,
  earnings: 2615.3,
};
