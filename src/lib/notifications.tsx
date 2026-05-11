"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";

export type NotificationTab = "you" | "approvals" | "agent" | "system";

export interface Notification {
  id: string;
  tab: NotificationTab;
  source: string;
  timestamp: string;
  summary: string;
  action?: { label: string; href?: string };
  read: boolean;
}

const SEED: Notification[] = [
  { id: "n1", tab: "approvals", source: "Priya Desai (Eng)", timestamp: "2m ago",
    summary: "Requested 3 days off (Jun 12 – Jun 14)",
    action: { label: "Review", href: "/leave/approvals" }, read: false },
  { id: "n2", tab: "approvals", source: "REQ-2026-013", timestamp: "1h ago",
    summary: "Requisition approval needed: HR Business Partner",
    action: { label: "Open", href: "/requisitions" }, read: false },
  { id: "n3", tab: "you", source: "Calendar", timestamp: "Today, 14:00",
    summary: "1:1 with Meera in 30 minutes",
    action: { label: "Join" }, read: false },
  { id: "n4", tab: "agent", source: "Aurora", timestamp: "10m ago",
    summary: "I noticed your leave balance hasn't been used this quarter. Want a suggested plan?",
    action: { label: "Ask Aurora" }, read: false },
  { id: "n5", tab: "agent", source: "Recruiter Agent", timestamp: "1h ago",
    summary: "Screened 14 new applicants; 3 strong matches surfaced",
    action: { label: "View", href: "/cv-screening/results" }, read: true },
  { id: "n6", tab: "system", source: "Security", timestamp: "Yesterday",
    summary: "New device signed in from Mumbai",
    action: { label: "Review", href: "/profile?tab=security" }, read: true },
  { id: "n7", tab: "system", source: "Platform", timestamp: "2d ago",
    summary: "Scheduled maintenance window: Sat 02:00 – 03:00 IST",
    read: true },
];

interface Value {
  items: Notification[];
  unread: Record<NotificationTab, number>;
  unreadTotal: number;
  markRead: (id: string) => void;
  markAllRead: (tab?: NotificationTab) => void;
}

const Ctx = createContext<Value | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useLocalStorage<Notification[]>("o2s.notifications", SEED);

  const markRead = useCallback(
    (id: string) => setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))),
    [setItems],
  );

  const markAllRead = useCallback(
    (tab?: NotificationTab) =>
      setItems((prev) => prev.map((n) => (tab && n.tab !== tab ? n : { ...n, read: true }))),
    [setItems],
  );

  const value = useMemo<Value>(() => {
    const unread: Record<NotificationTab, number> = { you: 0, approvals: 0, agent: 0, system: 0 };
    let total = 0;
    for (const n of items) {
      if (!n.read) {
        unread[n.tab]++;
        total++;
      }
    }
    return { items, unread, unreadTotal: total, markRead, markAllRead };
  }, [items, markRead, markAllRead]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNotifications() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNotifications must be used inside <NotificationsProvider>");
  return ctx;
}
