// Real auth against the LegionFX backend. Session lives in an httpOnly
// cookie set by the server — this module just calls the API and keeps a
// small localStorage mirror of the current user for fast UI reads (so route
// guards don't need to await a network call on every render).
import { api, ApiError, setToken, type ApiUser } from "./api";

const KEY = "legionfx_session";

export type Role = "user" | "admin";
export type Session = { email: string; name: string; role: Role; user: ApiUser };

function toSession(user: ApiUser): Session {
  return { email: user.email, name: user.name, role: user.role, user };
}

function persist(session: Session | null) {
  if (typeof window === "undefined") return;
  if (session) {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(KEY);
  }
  window.dispatchEvent(new Event("legionfx-auth"));
}

/** Synchronous, cached read — good for initial render / route guards. */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

/** Authoritative check against the backend. Call on app load to validate/refresh the cached session. */
export async function refreshSession(): Promise<Session | null> {
  try {
    const { user } = await api.me();
    const session = toSession(user);
    persist(session);
    return session;
  } catch {
    persist(null);
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<{ session: Session | null; error: string | null }> {
  try {
    const { user, token } = await api.login(email, password);
    setToken(token);
    const session = toSession(user);
    persist(session);
    return { session, error: null };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Unable to reach the server. Please try again.";
    return { session: null, error: message };
  }
}

export async function signUp(name: string, email: string, password: string, ref?: string): Promise<{ session: Session | null; error: string | null }> {
  try {
    const { user, token } = await api.signup(name, email, password, ref);
    setToken(token);
    const session = toSession(user);
    persist(session);
    return { session, error: null };
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "Unable to reach the server. Please try again.";
    return { session: null, error: message };
  }
}

export async function signOut() {
  try {
    await api.logout();
  } finally {
    setToken(null);
    persist(null);
  }
}
