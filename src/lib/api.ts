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
};
