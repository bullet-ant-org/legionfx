// Thin fetch wrapper around the LegionFX backend API.
//
// Auth uses a Bearer token, not the cookie. The backend also sets an
// httpOnly cookie, but since the frontend and backend live on different
// top-level domains (e.g. Vercel + Render), that cookie is cross-site and
// gets silently dropped by browsers' third-party cookie protections
// (Safari ITP, and Chrome is moving the same direction) even with
// SameSite=None; Secure set correctly. The token returned in the login/
// signup response body sidesteps that entirely.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "legionfx_token";

let token: string | null = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

export function setToken(t: string | null) {
  token = t;
  if (typeof window === "undefined") return;
  if (t) window.localStorage.setItem(TOKEN_KEY, t);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  let body: any = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
  }

  if (!res.ok) {
    const message = body?.message || `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status);
  }

  return body as T;
}

export type ApiUser = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: string;
  status: string;
  kyc: string;
  [key: string]: unknown;
};

export type ApiWallet = {
  _id: string;
  available: number;
  locked: number;
  totalDeposits: number;
  totalProfit: number;
  pendingWithdrawals: number;
  referralEarnings: number;
  bonusBalance: number;
  [key: string]: unknown;
};

export type ApiTransaction = {
  _id: string;
  type: string;
  category: string;
  amount: number;
  status: string;
  method: string;
  ref: string;
  createdAt: string;
  [key: string]: unknown;
};

export type ApiUserBot = {
  _id: string;
  bot: { _id: string; name: string; pair?: string; risk?: string; description?: string; [key: string]: unknown } | null;
  status: string;
  profit?: number;
  winRate?: number;
  startedAt?: string;
  [key: string]: unknown;
};

export type ApiChallenge = {
  _id: string;
  size: number;
  phase: string;
  status: string;
  currentEquity: number;
  profitTarget: number;
  dailyDrawdown: number;
  maxDrawdown: number;
  completion: number;
  remainingDays?: number;
  createdAt?: string;
  [key: string]: unknown;
};

export type ApiEnrollment = {
  _id: string;
  course: { _id: string; title: string; description?: string; lessonCount?: number; price?: number; [key: string]: unknown } | null;
  lessonsDone: number;
  completion: number;
  certificateEarned: boolean;
  [key: string]: unknown;
};

export type ApiSignal = {
  _id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string | number;
  sl: string | number;
  tp: string | number;
  confidence: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
};

export type ApiDepositMethod = {
  _id: string;
  currency: string;
  symbol: string;
  network: string;
  address: string;
  min: number;
  max: number;
  confirmations: number;
  enabled: boolean;
  [key: string]: unknown;
};

export type ApiTicketReply = { author: string; body: string; createdAt: string };
export type ApiTicket = {
  _id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
  priority: string;
  replies: ApiTicketReply[];
  createdAt: string;
  updatedAt: string;
  user?: { _id: string; name: string; email: string } | string;
  [key: string]: unknown;
};

export type ApiNotification = {
  _id: string;
  title: string;
  unread: boolean;
  createdAt: string;
  [key: string]: unknown;
};

export type ApiConversation = {
  _id: string;
  participants: { _id: string; name: string; email: string; avatarUrl?: string; role: string }[];
  lastMessageAt: string;
  lastMessage: { body: string; createdAt: string; sender: string } | null;
  unreadCount: number;
  [key: string]: unknown;
};

export const api = {
  signup: (name: string, email: string, password: string, ref?: string) =>
    request<{ user: ApiUser; token: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password, ref }),
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),

  me: () => request<{ user: ApiUser }>("/auth/me", { method: "GET" }),

  getWallet: () => request<{ wallet: ApiWallet }>("/wallet"),
  getTransactions: () => request<{ transactions: ApiTransaction[] }>("/wallet/transactions"),
  getMyBots: () => request<{ bots: ApiUserBot[] }>("/bots/mine"),
  getBotCatalog: () => request<{ bots: { _id: string; name: string; pair: string; risk: string; description: string }[] }>("/bots"),
  activateBot: (botId: string) => request<{ bot: ApiUserBot }>("/bots/activate", { method: "POST", body: JSON.stringify({ botId }) }),
  setUserBotStatus: (id: string, status: "Running" | "Paused" | "Stopped") =>
    request<{ bot: ApiUserBot }>(`/bots/mine/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),  getMyChallenges: () => request<{ challenges: ApiChallenge[] }>("/prop-firm/mine"),
  getPropFirmPlans: () => request<{ plans: { _id: string; size: number; price: number; profitSplit: number; popular: boolean }[] }>("/prop-firm/plans"),
  buyChallenge: (planId: string) =>
    request<{ challenge: ApiChallenge; wallet: ApiWallet }>("/prop-firm/buy", { method: "POST", body: JSON.stringify({ planId }) }),
  getMyEnrollments: () => request<{ enrollments: ApiEnrollment[] }>("/academy/mine"),
  getCourses: () => request<{ courses: { _id: string; title: string; description: string; lessonCount: number; price: number }[] }>("/academy/courses"),
  enrollCourse: (courseId: string) => request<{ enrollment: ApiEnrollment }>("/academy/enroll", { method: "POST", body: JSON.stringify({ courseId }) }),
  updateEnrollmentProgress: (id: string, lessonsDone: number) =>
    request<{ enrollment: ApiEnrollment }>(`/academy/enrollments/${id}/progress`, { method: "PATCH", body: JSON.stringify({ lessonsDone }) }),
  getSignals: () => request<{ signals: ApiSignal[] }>("/signals"),
  getNotifications: () => request<{ notifications: ApiNotification[] }>("/notifications"),
  markAllNotificationsRead: () => request<{ message: string }>("/notifications/read-all", { method: "PATCH" }),
  getReferralStats: () => request<{ code: string | null; total: number; earnings: number }>("/referrals/mine"),
  getConversations: () => request<{ conversations: ApiConversation[] }>("/messages"),

  // Deposit methods (crypto wallets configured by the admin)
  getDepositMethods: () => request<{ methods: ApiDepositMethod[] }>("/wallet/deposit-methods"),
  adminListDepositMethods: () => request<{ methods: ApiDepositMethod[] }>("/admin/deposit-methods"),
  adminCreateDepositMethod: (data: Omit<ApiDepositMethod, "_id" | "enabled"> & { enabled?: boolean }) =>
    request<{ method: ApiDepositMethod }>("/admin/deposit-methods", { method: "POST", body: JSON.stringify(data) }),
  adminUpdateDepositMethod: (id: string, data: Partial<Omit<ApiDepositMethod, "_id">>) =>
    request<{ method: ApiDepositMethod }>(`/admin/deposit-methods/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  adminToggleDepositMethod: (id: string) =>
    request<{ method: ApiDepositMethod }>(`/admin/deposit-methods/${id}/toggle`, { method: "PATCH" }),
  adminDeleteDepositMethod: (id: string) =>
    request<{ message: string }>(`/admin/deposit-methods/${id}`, { method: "DELETE" }),

  // Wallet deposit submission (used by the /pay checkout when the user
  // confirms they've sent funds).
  submitDeposit: (amount: number, method: string, note?: string) =>
    request<{ transaction: ApiTransaction; message: string }>("/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({ amount, method, note }),
    }),

  withdraw: (amount: number, method: string) =>
    request<{ transaction: ApiTransaction; wallet: ApiWallet; message: string }>("/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount, method }),
    }),

  transfer: (amount: number, from: string, to: string) =>
    request<{ transaction: ApiTransaction; wallet: ApiWallet }>("/wallet/transfer", {
      method: "POST",
      body: JSON.stringify({ amount, from, to }),
    }),

  updateProfile: (data: { name?: string; phone?: string; country?: string; avatarUrl?: string; twoFactorEnabled?: boolean }) =>
    request<{ user: ApiUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(data) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  deactivateAccount: () => request<{ message: string }>("/auth/deactivate", { method: "POST" }),

  deleteAccount: (password: string) =>
    request<{ message: string }>("/auth/me", { method: "DELETE", body: JSON.stringify({ password }) }),

  getTickets: () => request<{ tickets: ApiTicket[] }>("/support"),
  createTicket: (subject: string, category: string, message: string, priority: string) =>
    request<{ ticket: ApiTicket }>("/support", { method: "POST", body: JSON.stringify({ subject, category, message, priority }) }),
  replyTicket: (id: string, body: string) =>
    request<{ ticket: ApiTicket }>(`/support/${id}/reply`, { method: "POST", body: JSON.stringify({ body }) }),
};

// ---------------------------------------------------------------------------
// Admin API — all endpoints below require the caller's session to have
// role: "admin"; the backend enforces this independently.
// ---------------------------------------------------------------------------

export type AdminMetrics = {
  totalUsers: number;
  activeUsers: number;
  verifiedUsers: number;
  openTickets: number;
  activeBots: number;
  activeChallenges: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
};

export type AdminUser = ApiUser & { balance?: number };

export type AdminTransaction = ApiTransaction & { user: { _id: string; name: string; email: string } | null };

export type AdminAuditLog = {
  _id: string;
  actor: { _id: string; name: string; email: string } | null;
  action: string;
  target: string;
  meta: Record<string, unknown>;
  createdAt: string;
};

export type AdminBot = {
  _id: string;
  name: string;
  pair: string;
  risk: string;
  description: string;
  active: boolean;
  users: number;
  profit: number;
  winRate: number;
};

export type AdminPropFirmPlan = {
  _id: string;
  size: number;
  price: number;
  profitSplit: number;
  popular: boolean;
  active: boolean;
  buyers: number;
};

export type AdminCourse = {
  _id: string;
  title: string;
  description: string;
  lessonCount: number;
  price: number;
  published: boolean;
  students: number;
};

export type AdminSignal = ApiSignal;

export type AdminPricingPlan = {
  _id: string;
  name: string;
  price: number;
  interval: "monthly" | "yearly" | "one-time";
  tagline: string;
  features: string[];
  featured: boolean;
  active: boolean;
  subscribers: number;
};

export type AdminPaymentMethod = {
  _id: string;
  user: { _id: string; name: string; email: string } | null;
  type: string;
  label: string;
  verified: boolean;
  createdAt: string;
};

export type PlatformSettings = {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  signupsOpen: boolean;
  kycRequired: boolean;
  minDeposit: number;
  minWithdraw: number;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyPush: boolean;
  notifyInApp: boolean;
};

export const adminApi = {
  getMetrics: () => request<AdminMetrics>("/admin/metrics"),

  listUsers: (params?: { q?: string; status?: string; plan?: string }) => {
    const qs = new URLSearchParams();
    if (params?.q) qs.set("q", params.q);
    if (params?.status && params.status !== "All") qs.set("status", params.status);
    if (params?.plan && params.plan !== "All") qs.set("plan", params.plan);
    qs.set("limit", "500");
    return request<{ users: AdminUser[]; total: number }>(`/admin/users?${qs.toString()}`);
  },
  createUser: (data: { name: string; email: string; password: string; plan?: string; role?: string }) =>
    request<{ user: AdminUser }>("/admin/users", { method: "POST", body: JSON.stringify(data) }),
  updateUserStatus: (id: string, status: string) =>
    request<{ user: AdminUser }>(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  verifyUserKyc: (id: string) => request<{ user: AdminUser }>(`/admin/users/${id}/kyc`, { method: "PATCH" }),
  deleteUser: (id: string) => request<{ message: string }>(`/admin/users/${id}`, { method: "DELETE" }),
  emailUser: (id: string, subject: string, message: string) =>
    request<{ message: string }>(`/admin/users/${id}/email`, { method: "POST", body: JSON.stringify({ subject, message }) }),

  listDeposits: (status = "All") => request<{ deposits: AdminTransaction[] }>(`/admin/deposits?status=${encodeURIComponent(status)}`),
  listWithdrawals: (status = "All") => request<{ withdrawals: AdminTransaction[] }>(`/admin/withdrawals?status=${encodeURIComponent(status)}`),
  approveTransaction: (id: string) => request<{ transaction: AdminTransaction }>(`/admin/transactions/${id}/approve`, { method: "PATCH" }),
  rejectTransaction: (id: string) => request<{ transaction: AdminTransaction }>(`/admin/transactions/${id}/reject`, { method: "PATCH" }),

  listAuditLog: () => request<{ logs: AdminAuditLog[] }>("/admin/audit"),
  broadcastNotification: (title: string, kind: string, audience?: string) =>
    request<{ message: string }>("/admin/notify", { method: "POST", body: JSON.stringify({ title, kind, audience }) }),

  listBots: () => request<{ bots: AdminBot[] }>("/bots/admin/all"),
  createBot: (data: { name: string; pair: string; risk: string; description?: string }) =>
    request<{ bot: AdminBot }>("/bots", { method: "POST", body: JSON.stringify(data) }),
  updateBot: (id: string, data: Partial<{ name: string; pair: string; risk: string; description: string; active: boolean }>) =>
    request<{ bot: AdminBot }>(`/bots/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteBot: (id: string) => request<{ message: string }>(`/bots/${id}`, { method: "DELETE" }),

  listPropFirmPlans: () => request<{ plans: AdminPropFirmPlan[] }>("/prop-firm/plans/admin/all"),
  createPropFirmPlan: (data: { size: number; price: number; profitSplit?: number; popular?: boolean; active?: boolean }) =>
    request<{ plan: AdminPropFirmPlan }>("/prop-firm/plans", { method: "POST", body: JSON.stringify(data) }),
  updatePropFirmPlan: (id: string, data: Partial<{ size: number; price: number; profitSplit: number; popular: boolean; active: boolean }>) =>
    request<{ plan: AdminPropFirmPlan }>(`/prop-firm/plans/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePropFirmPlan: (id: string) => request<{ message: string }>(`/prop-firm/plans/${id}`, { method: "DELETE" }),

  listCourses: () => request<{ courses: AdminCourse[] }>("/academy/courses/admin/all"),
  createCourse: (data: { title: string; description?: string; lessonCount: number; price: number; published?: boolean }) =>
    request<{ course: AdminCourse }>("/academy/courses", { method: "POST", body: JSON.stringify(data) }),
  updateCourse: (id: string, data: Partial<{ title: string; description: string; lessonCount: number; price: number; published: boolean }>) =>
    request<{ course: AdminCourse }>(`/academy/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteCourse: (id: string) => request<{ message: string }>(`/academy/courses/${id}`, { method: "DELETE" }),

  listSignals: () => request<{ signals: AdminSignal[] }>("/signals"),
  createSignal: (data: { pair: string; direction: "BUY" | "SELL"; entry: number; sl: number; tp: number; confidence: number }) =>
    request<{ signal: AdminSignal }>("/signals", { method: "POST", body: JSON.stringify(data) }),
  updateSignal: (id: string, data: Partial<{ status: string; pair: string; entry: number; sl: number; tp: number; confidence: number }>) =>
    request<{ signal: AdminSignal }>(`/signals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteSignal: (id: string) => request<{ message: string }>(`/signals/${id}`, { method: "DELETE" }),

  listTickets: (status?: string) => request<{ tickets: ApiTicket[] }>(`/support/admin/all${status && status !== "All" ? `?status=${encodeURIComponent(status)}` : ""}`),
  updateTicket: (id: string, data: Partial<{ status: string; priority: string }>) =>
    request<{ ticket: ApiTicket }>(`/support/admin/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  replyTicket: (id: string, body: string) =>
    request<{ ticket: ApiTicket }>(`/support/${id}/reply`, { method: "POST", body: JSON.stringify({ body }) }),

  listPricingPlans: () => request<{ plans: AdminPricingPlan[] }>("/payments/admin/pricing"),
  createPricingPlan: (data: { name: string; price: number; interval: string; tagline?: string; features?: string[]; featured?: boolean; active?: boolean }) =>
    request<{ plan: AdminPricingPlan }>("/payments/admin/pricing", { method: "POST", body: JSON.stringify(data) }),
  updatePricingPlan: (id: string, data: Partial<{ name: string; price: number; interval: string; tagline: string; features: string[]; featured: boolean; active: boolean }>) =>
    request<{ plan: AdminPricingPlan }>(`/payments/admin/pricing/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deletePricingPlan: (id: string) => request<{ message: string }>(`/payments/admin/pricing/${id}`, { method: "DELETE" }),

  listPaymentMethods: () => request<{ methods: AdminPaymentMethod[] }>("/payments/admin/methods"),

  getPlatformSettings: () => request<{ settings: PlatformSettings }>("/admin/platform-settings"),
  updatePlatformSettings: (data: Partial<PlatformSettings>) =>
    request<{ settings: PlatformSettings }>("/admin/platform-settings", { method: "PATCH", body: JSON.stringify(data) }),

  // Deposit methods (crypto wallets) — already covered by api.adminListDepositMethods etc.
};
