"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  Send,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentAction {
  id: string;
  text: string;
  status: "done" | "running" | "pending";
  time: string;
}

const initialActions: AgentAction[] = [
  {
    id: "a1",
    text: "Screened 12 new applications for Senior Frontend Engineer",
    status: "done",
    time: "2 min ago",
  },
  {
    id: "a2",
    text: "Flagged 3 candidates as Strong Hire based on skills match",
    status: "done",
    time: "5 min ago",
  },
  {
    id: "a3",
    text: "Scheduling final round for Lisa Park with hiring manager",
    status: "running",
    time: "now",
  },
  {
    id: "a4",
    text: "Drafting offer letter for Marcus Johnson (pending approval)",
    status: "pending",
    time: "queued",
  },
];

const suggestedPrompts = [
  "Summarize top candidates",
  "Draft rejection emails for screened-out",
  "Compare interview scores",
  "Schedule next round",
];

function StatusIcon({ status }: { status: AgentAction["status"] }) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="size-3.5 text-success shrink-0" />;
    case "running":
      return <Loader2 className="size-3.5 text-brand-purple shrink-0 animate-spin" />;
    case "pending":
      return <Clock className="size-3.5 text-muted-foreground shrink-0" />;
  }
}

export function AICopilotBar() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [actions, setActions] = useState<AgentAction[]>(initialActions);
  const [responding, setResponding] = useState(false);
  const idCounter = useRef(100);

  const handleSend = useCallback(() => {
    const text = query.trim();
    if (!text || responding) return;

    setQuery("");
    setResponding(true);

    setTimeout(() => {
      idCounter.current += 1;
      setActions((prev) => [
        {
          id: `user-${idCounter.current}`,
          text,
          status: "done",
          time: "just now",
        },
        ...prev,
      ]);
      setResponding(false);
    }, 1500);
  }, [query, responding]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <motion.div
        layout
        className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden border-l-[3px] border-l-brand-purple"
      >
        {/* Collapsed bar */}
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-overlay transition-colors"
          aria-label={expanded ? "Collapse AI copilot" : "Expand AI copilot"}
        >
          <div className="flex items-center gap-2.5">
            <div className="size-6 rounded-full bg-brand-purple/20 flex items-center justify-center">
              <Sparkles className="size-3 text-brand-purple" />
            </div>
            <span className="text-sm text-foreground font-medium">
              Recruiter Agent is active
            </span>
            <span className="text-xs text-muted-foreground">
              &middot; Screened 12 new applications
            </span>
          </div>
          {expanded ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="size-4 text-muted-foreground" />
          )}
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-border">
                {/* Recent actions */}
                <div className="px-4 py-3 space-y-2.5">
                  <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    Recent Actions
                  </p>

                  {/* Thinking indicator */}
                  {responding && (
                    <div className="flex items-start gap-2.5">
                      <Loader2 className="size-3.5 text-brand-purple shrink-0 animate-spin" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground leading-relaxed italic">
                          Thinking&hellip;
                        </p>
                      </div>
                    </div>
                  )}

                  {actions.map((action) => (
                    <div
                      key={action.id}
                      className="flex items-start gap-2.5"
                    >
                      <StatusIcon status={action.status} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-relaxed">
                          {action.text}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {action.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Suggested prompts */}
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setQuery(prompt)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/20 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask the Recruiter Agent..."
                      className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-brand-purple"
                      aria-label="Ask the Recruiter Agent"
                    />
                    <Button
                      size="icon-sm"
                      className="bg-brand-purple text-white hover:bg-brand-purple/90 shrink-0"
                      onClick={handleSend}
                      disabled={responding || !query.trim()}
                      aria-label="Send message"
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
