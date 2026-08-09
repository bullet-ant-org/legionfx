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
  bot: { _id: string; name: string; pair?: string; risk?: string; [key: string]: unknown } | null;
  status: string;
  profit?: number;
  winRate?: number;
  uptime?: string;
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
  [key: string]: unknown;
};

export type ApiEnrollment = {
  _id: string;
  course: { _id: string; title: string; [key: string]: unknown } | null;
  progress: number;
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
  getMyChallenges: () => request<{ challenges: ApiChallenge[] }>("/prop-firm/mine"),
  getMyEnrollments: () => request<{ enrollments: ApiEnrollment[] }>("/academy/mine"),
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
};
