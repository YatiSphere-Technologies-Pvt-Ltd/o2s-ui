"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { Drawer } from "@/components/leave/drawer";
import { LEAVE_TYPES } from "@/components/leave/data";

const QUICK_CHIPS = [
  "Next Friday off",
  "Half-day Friday",
  "Sick today",
  "Mon to Wed",
  "WFA next week",
];

interface Props {
  open: boolean;
  onClose: () => void;
}

/**
 * Quick request drawer — reusable from any screen. Submitting deep-links to
 * /leave/request?q=… so the full conversational + form flow takes over.
 */
export function RequestLeaveDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function submitText(t: string) {
    const trimmed = t.trim();
    if (!trimmed) return;
    onClose();
    router.push(`/leave/request?q=${encodeURIComponent(trimmed)}`);
  }

  function submitStructured() {
    if (!type || !startDate) {
      submitText(text);
      return;
    }
    const range =
      endDate && endDate !== startDate
        ? `${type} from ${startDate} to ${endDate}`
        : `${type} on ${startDate}`;
    submitText(range);
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Request leave"
      subtitle="Ask in natural language, or pre-fill dates and type."
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submitStructured}
            disabled={!text && (!type || !startDate)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Continue with Aurora
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Aurora intake */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="size-6 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
              <Sparkles className="size-3 text-white" />
            </div>
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              Ask Aurora
            </label>
          </div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitText(text);
            }}
            placeholder="e.g. next Friday off, or sick today"
            className="w-full h-11 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_CHIPS.map((c) => (
              <button
                key={c}
                onClick={() => submitText(c)}
                className="px-2.5 py-1 rounded-full bg-secondary text-[11px] text-muted-foreground hover:bg-surface-overlay hover:text-foreground transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center">
          <span className="flex-1 h-px bg-border" />
          <span className="px-2 text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
            or pre-fill
          </span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
              Leave type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="">Pick a type…</option>
              {LEAVE_TYPES.filter((t) => t.available).map((t) => (
                <option key={t.key} value={t.label}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Start</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">End</label>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
