"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications, type NotificationTab } from "@/lib/notifications";

const TABS: { key: NotificationTab; label: string }[] = [
  { key: "you", label: "For You" },
  { key: "approvals", label: "Approvals" },
  { key: "agent", label: "Agent" },
  { key: "system", label: "System" },
];

export function NotificationsBell() {
  const { items, unread, unreadTotal, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<NotificationTab>("you");
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const visible = items.filter((n) => n.tab === tab);

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Notifications"
        onClick={() => setOpen((p) => !p)}
      >
        <Bell className="size-5" />
        {unreadTotal > 0 && (
          <span className="absolute right-0.5 top-0.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-[9px] font-semibold text-white flex items-center justify-center">
            {unreadTotal > 9 ? "9+" : unreadTotal}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-[380px] bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => markAllRead(tab)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  title="Mark current tab as read"
                >
                  <CheckCheck className="size-3" />
                  Mark all read
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="ml-2 p-1 text-muted-foreground hover:text-foreground rounded"
                  aria-label="Close"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              {TABS.map((t) => {
                const active = tab === t.key;
                const count = unread[t.key];
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`flex-1 px-2 py-2 text-[11px] font-medium border-b-2 transition-colors ${
                      active
                        ? "border-brand text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                    {count > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[14px] h-3.5 px-1 rounded-full bg-destructive/15 text-destructive text-[9px] font-semibold">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
              {visible.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-10">
                  Nothing here.
                </p>
              ) : (
                visible.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex flex-col gap-1.5 px-3 py-3 border-b border-border last:border-0 cursor-pointer hover:bg-surface-overlay/60 transition-colors ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold text-foreground">{n.source}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {n.summary}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 shrink-0 whitespace-nowrap">
                        {n.timestamp}
                      </span>
                    </div>
                    {n.action && (
                      <div className="flex justify-end">
                        {n.action.href ? (
                          <Link
                            href={n.action.href}
                            onClick={() => setOpen(false)}
                            className="text-[11px] text-brand hover:underline"
                          >
                            {n.action.label} →
                          </Link>
                        ) : (
                          <span className="text-[11px] text-brand">{n.action.label} →</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
