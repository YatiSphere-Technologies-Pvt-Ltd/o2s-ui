"use client";

import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const QUICK_CHIPS = [
  "Next Friday off",
  "Half-day today",
  "Sick leave today",
  "WFA next week",
  "Plan a long weekend",
];

export function AuroraIntakeBox({ onSubmit }: { onSubmit?: (text: string) => void }) {
  const [value, setValue] = useState("");

  function submit(text: string) {
    if (!text.trim()) return;
    onSubmit?.(text);
    setValue("");
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="size-6 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
          <Sparkles className="size-3 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Ask Aurora</h3>
        <span className="text-[10px] text-muted-foreground/60">Tell me what you need in plain English</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="e.g., next Friday off, or sick leave today"
          className="flex-1 h-11 px-4 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="h-11 px-4 rounded-lg bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Request
          <ArrowRight className="size-3.5" />
        </button>
      </form>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {QUICK_CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => submit(c)}
            className="px-2.5 py-1 rounded-full bg-secondary text-[11px] text-muted-foreground hover:bg-surface-overlay hover:text-foreground transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
