// Thin fetch wrapper around the LegionFX backend API.
// Auth is cookie-based (httpOnly JWT cookie set by the backend), so every
// request goes with credentials: "include" and we never touch the token
// directly on the client.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

export type ApiNotification = {
  _id: string;
  title: string;
  unread: boolean;
  createdAt: string;
  [key: string]: unknown;
};

export const api = {
  signup: (name: string, email: string, password: string) =>
    request<{ user: ApiUser }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser }>("/auth/login", {
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
};
