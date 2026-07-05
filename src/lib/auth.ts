// Simple no-backend demo auth with two roles: user and admin.
export const DEMO_EMAIL = "demo@gmail.com";
export const DEMO_PASSWORD = "demo123";
export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin123";
const KEY = "legionfx_session";

export type Role = "user" | "admin";
export type Session = { email: string; name: string; role: Role; signedInAt: number };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    // Back-compat: sessions saved before roles existed default to "user".
    if (!s.role) s.role = "user";
    return s;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): Session | null {
  const e = email.trim().toLowerCase();
  let session: Session | null = null;
  if (e === DEMO_EMAIL && password === DEMO_PASSWORD) {
    session = { email: DEMO_EMAIL, name: "Keagan Mitchell", role: "user", signedInAt: Date.now() };
  } else if (e === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    session = { email: ADMIN_EMAIL, name: "LEGIONFX Admin", role: "admin", signedInAt: Date.now() };
  }
  if (!session) return null;
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("legionfx-auth"));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("legionfx-auth"));
}
