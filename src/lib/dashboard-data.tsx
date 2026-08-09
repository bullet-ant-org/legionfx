import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type ApiWallet, type ApiTransaction, type ApiUserBot, type ApiChallenge, type ApiEnrollment, type ApiSignal, type ApiNotification, type ApiConversation } from "./api";
import { getSession, type Session } from "./auth";

type ReferralStats = { code: string | null; total: number; earnings: number };

type DashboardData = {
  loading: boolean;
  error: string | null;
  session: Session | null;
  wallet: ApiWallet | null;
  transactions: ApiTransaction[];
  bots: ApiUserBot[];
  challenges: ApiChallenge[];
  enrollments: ApiEnrollment[];
  signals: ApiSignal[];
  notifications: ApiNotification[];
  conversations: ApiConversation[];
  referral: ReferralStats | null;
  refresh: () => void;
  markAllNotificationsRead: () => void;
};

const DashboardContext = createContext<DashboardData | null>(null);

export function DashboardDataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(() => getSession());
  const [wallet, setWallet] = useState<ApiWallet | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [bots, setBots] = useState<ApiUserBot[]>([]);
  const [challenges, setChallenges] = useState<ApiChallenge[]>([]);
  const [enrollments, setEnrollments] = useState<ApiEnrollment[]>([]);
  const [signals, setSignals] = useState<ApiSignal[]>([]);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [referral, setReferral] = useState<ReferralStats | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    const onAuth = () => setSession(getSession());
    window.addEventListener("legionfx-auth", onAuth);
    return () => window.removeEventListener("legionfx-auth", onAuth);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    // Each call is independent - one failing (e.g. a user with no prop-firm
    // challenge yet) shouldn't blank out the rest of the dashboard.
    Promise.allSettled([
      api.getWallet(),
      api.getTransactions(),
      api.getMyBots(),
      api.getMyChallenges(),
      api.getMyEnrollments(),
      api.getSignals(),
      api.getNotifications(),
      api.getConversations(),
      api.getReferralStats(),
    ]).then((results) => {
      if (cancelled) return;
      const [w, tx, b, ch, en, sig, notif, convos, ref] = results;
      if (w.status === "fulfilled") setWallet(w.value.wallet);
      if (tx.status === "fulfilled") setTransactions(tx.value.transactions);
      if (b.status === "fulfilled") setBots(b.value.bots);
      if (ch.status === "fulfilled") setChallenges(ch.value.challenges);
      if (en.status === "fulfilled") setEnrollments(en.value.enrollments);
      if (sig.status === "fulfilled") setSignals(sig.value.signals);
      if (notif.status === "fulfilled") setNotifications(notif.value.notifications);
      if (convos.status === "fulfilled") setConversations(convos.value.conversations);
      if (ref.status === "fulfilled") setReferral(ref.value);

      // If literally everything failed, surface it - almost certainly an
      // auth/CORS/network problem rather than empty-account states.
      if (results.every((r) => r.status === "rejected")) {
        setError("Couldn't reach the server. Check your connection and try again.");
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [tick]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    api.markAllNotificationsRead().catch(() => {
      // Revert to server truth on failure.
      refresh();
    });
  }, [refresh]);

  const value = useMemo<DashboardData>(() => ({
    loading, error, session, wallet, transactions, bots, challenges, enrollments, signals, notifications, conversations, referral,
    refresh, markAllNotificationsRead,
  }), [loading, error, session, wallet, transactions, bots, challenges, enrollments, signals, notifications, conversations, referral, refresh, markAllNotificationsRead]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardData() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardData must be used within DashboardDataProvider");
  return ctx;
}
