// Simple no-backend demo auth.
export const DEMO_EMAIL = "demo@gmail.com";
export const DEMO_PASSWORD = "demo123";
const KEY = "legionfx_session";

export type Session = { email: string; name: string; signedInAt: number };

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, password: string): Session | null {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return null;
  const session: Session = { email: DEMO_EMAIL, name: "Keagan Mitchell", signedInAt: Date.now() };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("legionfx-auth"));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("legionfx-auth"));
}
