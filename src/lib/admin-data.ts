// Centralized mock data for the admin console.
export const adminMetrics = {
  totalUsers: 5284,
  activeUsers: 3120,
  newSignups: 184,
  verifiedUsers: 4128,
  totalDeposits: 1284500,
  totalWithdrawals: 842300,
  pendingWithdrawals: 42800,
  pendingDeposits: 18450,
  revenue: 284500,
  monthlyRevenue: 38420,
  openTickets: 24,
  activeBots: 148,
  activeChallenges: 312,
  signalsPushedToday: 8,
};

export const growthSeries = Array.from({ length: 30 }).map((_, i) => ({
  i,
  users: Math.round(4200 + Math.sin(i * 0.4) * 80 + i * 30),
  deposits: Math.round(28000 + Math.cos(i * 0.3) * 4000 + i * 200),
  withdrawals: Math.round(18000 + Math.sin(i * 0.5) * 3200 + i * 130),
  revenue: Math.round(1000 + Math.sin(i * 0.35) * 300 + i * 40),
}));

export const revenueBySource = [
  { name: "Prop Firm Challenges", value: 128400, color: "oklch(0.78 0.21 55)" },
  { name: "Academy", value: 62400, color: "oklch(0.68 0.18 295)" },
  { name: "Signals", value: 41200, color: "oklch(0.72 0.14 190)" },
  { name: "Trading Bots", value: 32800, color: "oklch(0.78 0.18 150)" },
  { name: "Subscriptions", value: 19700, color: "oklch(0.85 0.12 90)" },
];

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  country: string;
  plan: "Starter" | "Pro" | "Elite" | "Enterprise";
  status: "Active" | "Suspended" | "Pending";
  kyc: "Verified" | "Pending" | "Rejected";
  balance: number;
  joined: string;
  lastLogin: string;
};

const first = ["Keagan","Maya","Ariana","Luca","Noah","Zara","Ethan","Isla","Mateo","Amelia","Ravi","Chloe","Diego","Yuki","Layla","Kai","Sofia","Oliver","Nia","Jasper"];
const last = ["Mitchell","Rossi","Nakamura","Silva","Wang","Kim","Ortega","Adebayo","Patel","Cohen","Hansen","Novak","Ferrari","Osei","Reyes","Bernard","Costa","Bauer","Ivanov","Larsen"];
const countries = ["🇺🇸 US","🇬🇧 UK","🇦🇪 UAE","🇳🇬 NG","🇮🇳 IN","🇩🇪 DE","🇧🇷 BR","🇯🇵 JP","🇿🇦 ZA","🇦🇺 AU","🇸🇬 SG","🇨🇦 CA"];
const plans: AdminUser["plan"][] = ["Starter","Pro","Elite","Enterprise"];
const statuses: AdminUser["status"][] = ["Active","Active","Active","Pending","Suspended"];
const kycs: AdminUser["kyc"][] = ["Verified","Verified","Pending","Rejected"];

export const adminUsers: AdminUser[] = Array.from({ length: 42 }).map((_, i) => ({
  id: `USR-${(1000 + i).toString()}`,
  name: `${first[i % first.length]} ${last[(i * 3) % last.length]}`,
  email: `${first[i % first.length].toLowerCase()}.${last[(i * 3) % last.length].toLowerCase()}@mail.com`,
  country: countries[i % countries.length],
  plan: plans[i % plans.length],
  status: statuses[i % statuses.length],
  kyc: kycs[i % kycs.length],
  balance: Math.round((300 + Math.random() * 24000) * 100) / 100,
  joined: `2025-${((i % 12) + 1).toString().padStart(2, "0")}-${((i % 27) + 1).toString().padStart(2, "0")}`,
  lastLogin: ["5m ago","1h ago","3h ago","Yesterday","2d ago","1w ago"][i % 6],
}));

export type AdminDeposit = {
  id: string;
  user: string;
  email: string;
  method: string;
  amount: number;
  status: "Pending" | "Completed" | "Failed" | "Under Review";
  date: string;
  txRef: string;
};

export const adminDeposits: AdminDeposit[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `DEP-${5000 + i}`,
  user: adminUsers[i % adminUsers.length].name,
  email: adminUsers[i % adminUsers.length].email,
  method: ["USDT TRC20","BTC","ETH","Bank Transfer","Card"][i % 5],
  amount: Math.round((150 + Math.random() * 8500) * 100) / 100,
  status: (["Pending","Completed","Completed","Under Review","Failed"] as const)[i % 5],
  date: `2026-06-${((i % 28) + 1).toString().padStart(2, "0")}`,
  txRef: `0x${Math.random().toString(16).slice(2, 8)}…${Math.random().toString(16).slice(2, 5)}`,
}));

export type AdminWithdrawal = AdminDeposit;
export const adminWithdrawals: AdminWithdrawal[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `WDR-${7000 + i}`,
  user: adminUsers[(i + 2) % adminUsers.length].name,
  email: adminUsers[(i + 2) % adminUsers.length].email,
  method: ["USDT TRC20","BTC","Bank Transfer","PayPal"][i % 4],
  amount: Math.round((100 + Math.random() * 5000) * 100) / 100,
  status: (["Pending","Completed","Pending","Completed","Failed"] as const)[i % 5],
  date: `2026-06-${((i % 28) + 1).toString().padStart(2, "0")}`,
  txRef: `WD-${(118 + i).toString()}`,
}));

export type PaymentOption = {
  id: string;
  name: string;
  type: "Crypto" | "Card" | "Bank" | "Wallet";
  address: string;
  network?: string;
  enabled: boolean;
  min: number;
  max: number;
  fee: number;
};

export const paymentOptions: PaymentOption[] = [
  { id: "pay-1", name: "USDT (TRC20)", type: "Crypto", address: "TXaB9c8k7dR3F2gH1jL5mN9pQ4vY0wZ2xC", network: "TRON", enabled: true, min: 50, max: 100000, fee: 0 },
  { id: "pay-2", name: "USDT (ERC20)", type: "Crypto", address: "0x8aF3c4d5E6F7g8H9j0K1l2M3n4O5p6Q7r8S9t0", network: "Ethereum", enabled: true, min: 100, max: 100000, fee: 0.5 },
  { id: "pay-3", name: "Bitcoin", type: "Crypto", address: "bc1q9v8t7r6e5w4q3z2y1x0…", network: "Bitcoin", enabled: true, min: 100, max: 250000, fee: 0 },
  { id: "pay-4", name: "Ethereum", type: "Crypto", address: "0x4c3b2A1e0d9F8e7D6c5B4a3F2e1D0…", network: "Ethereum", enabled: true, min: 100, max: 100000, fee: 0.4 },
  { id: "pay-5", name: "Visa / Mastercard", type: "Card", address: "Stripe · Live", enabled: true, min: 25, max: 10000, fee: 2.9 },
  { id: "pay-6", name: "Bank Transfer (SWIFT)", type: "Bank", address: "ACC 003821 · LEGIONFX LTD", enabled: false, min: 500, max: 500000, fee: 1.0 },
];

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  interval: "mo" | "yr";
  tagline: string;
  featured: boolean;
  active: boolean;
  features: string[];
  subscribers: number;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "plan-starter",
    name: "Starter",
    price: 49,
    interval: "mo",
    tagline: "Get access to the essentials.",
    featured: false,
    active: true,
    subscribers: 1204,
    features: ["Basic signals","2 academy courses","Community access","Email support"],
  },
  {
    id: "plan-pro",
    name: "Pro",
    price: 149,
    interval: "mo",
    tagline: "For serious traders scaling accounts.",
    featured: true,
    active: true,
    subscribers: 2140,
    features: ["Premium signals","Full academy access","1 trading bot slot","Mentorship group","Priority support"],
  },
  {
    id: "plan-elite",
    name: "Elite",
    price: 499,
    interval: "mo",
    tagline: "Full LEGIONFX ecosystem access.",
    featured: false,
    active: true,
    subscribers: 640,
    features: ["Unlimited signals","Unlimited bots","1-on-1 mentorship","Prop firm discount 30%","Dedicated manager"],
  },
  {
    id: "plan-enterprise",
    name: "Enterprise",
    price: 1499,
    interval: "mo",
    tagline: "For funds & institutional traders.",
    featured: false,
    active: false,
    subscribers: 42,
    features: ["Everything in Elite","API access","White-label options","SLA & compliance"],
  },
];

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  audience: "All Users" | "Elite" | "Pro" | "Starter" | "Prop Firm" | "Bots";
  channel: "In-App" | "Email" | "SMS" | "Push";
  status: "Sent" | "Scheduled" | "Draft";
  date: string;
  recipients: number;
};

export const sentNotifications: AdminNotification[] = [
  { id: "n-1", title: "New Prop Firm 200K launched", message: "Introducing the new 200K challenge with reduced fees for a limited time.", audience: "All Users", channel: "In-App", status: "Sent", date: "2026-06-28", recipients: 5284 },
  { id: "n-2", title: "Weekly XAU/USD outlook", message: "Marcus Vale drops the weekly gold outlook — watch inside.", audience: "Elite", channel: "Email", status: "Sent", date: "2026-06-27", recipients: 640 },
  { id: "n-3", title: "Scheduled maintenance", message: "Wallet withdrawals paused Jul 1 · 02:00 UTC for 30 min.", audience: "All Users", channel: "Push", status: "Scheduled", date: "2026-07-01", recipients: 5284 },
  { id: "n-4", title: "Bot marketplace update", message: "Midas Gold v3.4 is now available with tighter risk controls.", audience: "Bots", channel: "In-App", status: "Sent", date: "2026-06-26", recipients: 148 },
];

export type SupportTicket = {
  id: string;
  subject: string;
  user: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  updated: string;
  channel: "Email" | "Chat" | "Ticket";
};

export const supportTickets: SupportTicket[] = [
  { id: "TCK-2081", subject: "Withdrawal delayed 3 days", user: "Maya Rossi", priority: "High", status: "In Progress", updated: "5m", channel: "Ticket" },
  { id: "TCK-2080", subject: "Cannot reset 2FA", user: "Noah Kim", priority: "Urgent", status: "Open", updated: "12m", channel: "Chat" },
  { id: "TCK-2079", subject: "Signal notification not received", user: "Ariana Silva", priority: "Medium", status: "Open", updated: "1h", channel: "Email" },
  { id: "TCK-2078", subject: "Bot license upgrade", user: "Luca Ferrari", priority: "Low", status: "Resolved", updated: "3h", channel: "Ticket" },
  { id: "TCK-2077", subject: "Prop firm phase reset", user: "Ethan Cohen", priority: "Medium", status: "In Progress", updated: "6h", channel: "Ticket" },
];

export type AdminBot = {
  id: string;
  name: string;
  strategy: string;
  users: number;
  status: "Active" | "Paused" | "Deprecated";
  win: number;
  profit: number;
};

export const adminBots: AdminBot[] = [
  { id: "bot-1", name: "Apex Trend Pro", strategy: "Trend following", users: 82, status: "Active", win: 78, profit: 128400 },
  { id: "bot-2", name: "Midas Gold v3", strategy: "Gold breakout", users: 54, status: "Active", win: 82, profit: 214800 },
  { id: "bot-3", name: "Sentinel Scalper", strategy: "GBP scalping", users: 41, status: "Paused", win: 71, profit: 42500 },
  { id: "bot-4", name: "Nightowl BTC", strategy: "Crypto swing", users: 23, status: "Active", win: 74, profit: 68200 },
];

export type AdminCourse = {
  id: string;
  title: string;
  mentor: string;
  price: number;
  students: number;
  status: "Published" | "Draft" | "Archived";
  lessons: number;
};

export const adminCourses: AdminCourse[] = [
  { id: "crs-1", title: "Forex Mastery", mentor: "Marcus Vale", price: 199, students: 1240, status: "Published", lessons: 40 },
  { id: "crs-2", title: "Smart Money Concepts", mentor: "Elena Cross", price: 249, students: 812, status: "Published", lessons: 34 },
  { id: "crs-3", title: "Prop Firm Blueprint", mentor: "Jordan Reyes", price: 149, students: 964, status: "Published", lessons: 22 },
  { id: "crs-4", title: "Bot Building 101", mentor: "Rae Whitman", price: 299, students: 210, status: "Draft", lessons: 18 },
];

export type AdminChallenge = {
  id: string;
  name: string;
  size: number;
  fee: number;
  active: boolean;
  buyers: number;
};

export const adminChallenges: AdminChallenge[] = [
  { id: "ch-25", name: "25K Evaluation", size: 25000, fee: 149, active: true, buyers: 520 },
  { id: "ch-50", name: "50K Evaluation", size: 50000, fee: 299, active: true, buyers: 380 },
  { id: "ch-100", name: "100K Evaluation", size: 100000, fee: 499, active: true, buyers: 240 },
  { id: "ch-200", name: "200K Evaluation", size: 200000, fee: 899, active: true, buyers: 82 },
  { id: "ch-500", name: "500K Evaluation", size: 500000, fee: 1999, active: false, buyers: 14 },
];

export const adminSignals = [
  { pair: "XAU/USD", direction: "BUY", entry: 2342.5, confidence: 92, published: true, sent: 5284, hits: 4120 },
  { pair: "EUR/USD", direction: "SELL", entry: 1.0824, confidence: 86, published: true, sent: 5284, hits: 3820 },
  { pair: "GBP/JPY", direction: "BUY", entry: 198.55, confidence: 78, published: true, sent: 4210, hits: 3040 },
  { pair: "BTC/USD", direction: "SELL", entry: 68400, confidence: 81, published: false, sent: 0, hits: 0 },
];

export const auditLog = [
  { actor: "admin@gmail.com", action: "Approved withdrawal WDR-7003", time: "2m ago" },
  { actor: "admin@gmail.com", action: "Suspended user USR-1024", time: "18m ago" },
  { actor: "admin@gmail.com", action: "Enabled payment option: Bitcoin", time: "1h ago" },
  { actor: "admin@gmail.com", action: "Updated pricing: Pro plan → $149/mo", time: "3h ago" },
  { actor: "admin@gmail.com", action: "Broadcast: New Prop Firm 200K launched", time: "1d ago" },
];
