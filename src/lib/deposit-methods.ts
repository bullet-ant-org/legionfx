// Deposit methods configured by the admin and consumed by the RexaPay
// crypto checkout. Persisted in localStorage so the admin console and the
// gateway stay in sync inside the demo environment.

export type DepositMethod = {
  id: string;
  currency: string;      // e.g. "Bitcoin"
  symbol: string;        // e.g. "BTC"
  network: string;       // e.g. "Bitcoin"
  address: string;
  min: number;
  max: number;
  confirmations: number;
  enabled: boolean;
};

const KEY = "legionfx_deposit_methods";

export const defaultDepositMethods: DepositMethod[] = [
  { id: "dm-btc", currency: "Bitcoin", symbol: "BTC", network: "Bitcoin", address: "bc1qhal7x8lq0yz3v9d2u6r4kq5m7wsn3xj8yq2eaf", min: 50, max: 250000, confirmations: 2, enabled: true },
  { id: "dm-usdt", currency: "Tether", symbol: "USDT", network: "TRC-20", address: "TQ7hVbW9dLmNc4Ffx2sYpR8gKu3JzXe6Va", min: 25, max: 500000, confirmations: 12, enabled: true },
  { id: "dm-eth", currency: "Ethereum", symbol: "ETH", network: "ERC-20", address: "0x9E4bC1f27aD6538e0Cb71fA35d9c4E8127a5D3b0", min: 50, max: 250000, confirmations: 15, enabled: true },
  { id: "dm-sol", currency: "Solana", symbol: "SOL", network: "Solana", address: "7xKQm2Vn9pRt4LbJ8sYcWzF3dHg6UaEo5NqPrTvB1cXm", min: 25, max: 100000, confirmations: 32, enabled: false },
];

export function loadDepositMethods(): DepositMethod[] {
  if (typeof window === "undefined") return defaultDepositMethods;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultDepositMethods;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? (parsed as DepositMethod[]) : defaultDepositMethods;
  } catch {
    return defaultDepositMethods;
  }
}

export function saveDepositMethods(list: DepositMethod[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

// ---- RexaPay checkout session (amount carried between gateway pages) ----

const SESSION_KEY = "rexapay_session";

export type PaySession = { amount: number; reference: string; methodId?: string };

export function startPaySession(amount: number): PaySession {
  const s: PaySession = {
    amount,
    reference: `RXP-${Date.now().toString(36).toUpperCase()}`,
  };
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
  return s;
}

export function getPaySession(): PaySession {
  if (typeof window === "undefined") return { amount: 0, reference: "RXP-000000" };
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as PaySession;
  } catch {}
  return startPaySession(500);
}

export function updatePaySession(patch: Partial<PaySession>) {
  const next = { ...getPaySession(), ...patch };
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(next)); } catch {}
  return next;
}

// ---- Geo lookup used to explain regional availability ----

export type GeoInfo = {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  postal: string;
  timezone: string;
  org: string;
  currency: string;
};

export async function fetchGeo(): Promise<GeoInfo | null> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return null;
    const d: Record<string, unknown> = await res.json();
    const str = (k: string) => (typeof d[k] === "string" ? (d[k] as string) : "—");
    return {
      ip: str("ip"),
      city: str("city"),
      region: str("region"),
      country: str("country_name"),
      countryCode: str("country_code"),
      postal: str("postal"),
      timezone: str("timezone"),
      org: str("org"),
      currency: str("currency"),
    };
  } catch {
    return null;
  }
}
