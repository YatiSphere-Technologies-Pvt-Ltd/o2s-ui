"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, Send, Wrench } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRole } from "@/lib/role-context";
import { RequestLeaveDrawer } from "@/components/leave/drawers/request-leave-drawer";

type Message = {
  id: string;
  role: "user" | "assistant" | "tool";
  text: string;
};

const CHIPS_BY_ROLE: Record<string, string[]> = {
  employee: ["Request leave", "What's my balance?", "Who's out today?", "Show my policy"],
  manager:  ["Pending approvals?", "Team out this week", "Coverage gaps", "Approve all simple cases"],
  hr:       ["Org leave forecast", "Policy violations", "Accrual exceptions", "Year-end planning"],
  admin:    ["System health", "Audit log", "Permissions report"],
};

export function AuroraFab() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { screen } = useScreen();
  const { activeRole } = useRole();
  const panelRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const chips = CHIPS_BY_ROLE[activeRole] ?? CHIPS_BY_ROLE.employee;
  const [requestDrawerOpen, setRequestDrawerOpen] = useState(false);

  function send(text: string) {
    if (!text.trim()) return;
    // Intercept "Request leave" to open the reusable RequestLeaveDrawer instead.
    if (text.trim().toLowerCase() === "request leave") {
      setRequestDrawerOpen(true);
      setOpen(false);
      return;
    }
    const n = ++idRef.current;
    const userMsg: Message = { id: `u-${n}`, role: "user", text };
    const toolMsg: Message = {
      id: `t-${n}`,
      role: "tool",
      text: screen
        ? `Checking ${screen.module} / ${screen.page}${screen.recordLabel ? ` for ${screen.recordLabel}` : ""}…`
        : "Looking that up…",
    };
    const aMsg: Message = {
      id: `a-${n}`,
      role: "assistant",
      text: "Wired to the real model later — this is a placeholder while we build out Leave Management.",
    };
    setMessages((prev) => [...prev, userMsg, toolMsg, aMsg]);
    setInput("");
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 h-12 pl-3 pr-4 rounded-full bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_28px_rgba(99,102,241,0.5)] transition-all duration-200 group"
        aria-label="Ask Aurora"
      >
        <Sparkles className="size-4" />
        <span>Ask Aurora</span>
      </button>

      {/* Slide-in panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-105 bg-card border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
                    <Sparkles className="size-3.5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Aurora</h3>
                    {screen && (
                      <p className="text-[10px] text-muted-foreground">
                        Context: {screen.module} · {screen.page}
                        {screen.recordLabel ? ` · ${screen.recordLabel}` : ""}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                {messages.length === 0 ? (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      I can help with leave, schedules, policies, and more. Quick-start:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {chips.map((c) => (
                        <button
                          key={c}
                          onClick={() => send(c)}
                          className="px-2.5 py-1 rounded-full bg-secondary text-[11px] text-foreground hover:bg-surface-overlay transition-colors"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((m) => {
                    if (m.role === "tool") {
                      return (
                        <div key={m.id} className="flex items-center gap-2 text-[11px] text-muted-foreground italic">
                          <Wrench className="size-3" />
                          {m.text}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={m.id}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                            m.role === "user"
                              ? "bg-brand text-brand-foreground"
                              : "bg-surface-overlay text-foreground"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Composer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="border-t border-border p-3 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Aurora anything…"
                  className="flex-1 h-9 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-brand/40"
                />
                <button
                  type="submit"
                  className="size-9 rounded-lg bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  aria-label="Send"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <RequestLeaveDrawer open={requestDrawerOpen} onClose={() => setRequestDrawerOpen(false)} />
    </>
  );
}
