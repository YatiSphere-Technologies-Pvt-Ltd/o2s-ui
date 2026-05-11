"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, Wrench } from "lucide-react";

export type Bubble =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "aurora"; text: string }
  | { id: string; role: "tool"; agent: string; text: string }
  | { id: string; role: "chip"; chips: string[] };

interface Props {
  messages: Bubble[];
  onSubmit: (text: string) => void;
  busy?: boolean;
}

export function ConversationPane({ messages, onSubmit, busy }: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  function send(text: string) {
    if (!text.trim() || busy) return;
    onSubmit(text);
    setInput("");
  }

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-border">
        <div className="size-7 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
          <Sparkles className="size-3.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Request leave with Aurora</h3>
          <p className="text-[11px] text-muted-foreground">
            Describe what you need — Aurora handles dates, policy, and coverage.
          </p>
        </div>
      </div>

      {/* Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderBubble(m, send)}
            </motion.div>
          ))}
        </AnimatePresence>
        {busy && (
          <div className="flex items-center gap-1 ml-9 text-[11px] text-muted-foreground italic">
            <span className="size-1 rounded-full bg-muted-foreground animate-pulse" />
            <span className="size-1 rounded-full bg-muted-foreground animate-pulse [animation-delay:120ms]" />
            <span className="size-1 rounded-full bg-muted-foreground animate-pulse [animation-delay:240ms]" />
          </div>
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Reply or refine — e.g., 'no, half-day on Friday'"
          className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          type="submit"
          disabled={!input.trim() || busy}
          className="size-10 rounded-lg bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          aria-label="Send"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

function renderBubble(m: Bubble, send: (text: string) => void) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-md px-3 py-2 text-sm bg-brand text-brand-foreground">
          {m.text}
        </div>
      </div>
    );
  }
  if (m.role === "aurora") {
    return (
      <div className="flex gap-2.5">
        <div className="size-7 shrink-0 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
          <Sparkles className="size-3.5 text-white" />
        </div>
        <div className="max-w-[80%] rounded-2xl rounded-tl-md px-3 py-2 text-sm bg-surface-overlay text-foreground leading-relaxed">
          {m.text}
        </div>
      </div>
    );
  }
  if (m.role === "tool") {
    return (
      <div className="flex items-center gap-2 ml-9 text-[11px] text-muted-foreground italic">
        <Wrench className="size-3" />
        <span>
          <span className="text-foreground/80 font-medium">{m.agent}</span> · {m.text}
        </span>
      </div>
    );
  }
  // chip
  return (
    <div className="flex flex-wrap gap-1.5 ml-9">
      {m.chips.map((c) => (
        <button
          key={c}
          onClick={() => send(c)}
          className="px-2.5 py-1 rounded-full bg-secondary text-[11px] text-muted-foreground hover:bg-surface-overlay hover:text-foreground transition-colors"
        >
          {c}
        </button>
      ))}
    </div>
  );
}
