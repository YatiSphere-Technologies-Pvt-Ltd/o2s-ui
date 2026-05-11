"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  Ban,
  CheckCircle2,
  ShieldAlert,
  TrendingDown,
  X,
} from "lucide-react";

export type ConfirmVariant =
  | "destructive"
  | "policy_violation"
  | "low_balance"
  | "statutory_floor"
  | "warning";

interface Props {
  open: boolean;
  variant: ConfirmVariant;
  title: string;
  body: string;
  /** Optional policy citation chip shown above the body. */
  citation?: string;
  /** When set, requires the user to type this string to enable confirm. Use for high-risk actions. */
  typeToConfirm?: string;
  /** Confirm button label. */
  confirmLabel: string;
  cancelLabel?: string;
  /** When statutory_floor, the action is blocked (no confirm option). */
  block?: boolean;
  onConfirm: (note?: string) => void;
  onClose: () => void;
  /** When true, includes a note field (kept in audit trail). */
  withNote?: boolean;
}

const VARIANT_META: Record<
  ConfirmVariant,
  { icon: React.ComponentType<{ className?: string }>; tint: string; color: string; btn: string }
> = {
  destructive:      { icon: Ban,             tint: "bg-destructive/10", color: "text-destructive", btn: "bg-destructive text-white" },
  policy_violation: { icon: AlertOctagon,    tint: "bg-warning/10",     color: "text-warning",     btn: "bg-warning text-white" },
  low_balance:      { icon: TrendingDown,    tint: "bg-warning/10",     color: "text-warning",     btn: "bg-warning text-white" },
  statutory_floor:  { icon: ShieldAlert,     tint: "bg-destructive/10", color: "text-destructive", btn: "bg-destructive text-white" },
  warning:          { icon: AlertTriangle,   tint: "bg-warning/10",     color: "text-warning",     btn: "bg-warning text-white" },
};

export function ConfirmDialog({
  open,
  variant,
  title,
  body,
  citation,
  typeToConfirm,
  confirmLabel,
  cancelLabel = "Cancel",
  block,
  onConfirm,
  onClose,
  withNote,
}: Props) {
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState("");

  function handleClose() {
    setTyped("");
    setNote("");
    onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const meta = VARIANT_META[variant];
  const Icon = meta.icon;
  const confirmEnabled = !block && (!typeToConfirm || typed.trim() === typeToConfirm);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-60 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
              <div className="flex items-start gap-3">
                <div className={`size-9 shrink-0 rounded-full flex items-center justify-center ${meta.tint}`}>
                  <Icon className={`size-5 ${meta.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{title}</h3>
                  {citation && (
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mt-1">
                      {citation}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="size-4" />
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{body}</p>

              {block && (
                <div className="mt-4 p-3 rounded-lg bg-destructive/5 border border-destructive/30 text-[11px] text-destructive">
                  Blocked by policy — no override available. Contact HR if you believe this is in error.
                </div>
              )}

              {!block && typeToConfirm && (
                <div className="mt-4">
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                    Type <span className="text-foreground font-mono">{typeToConfirm}</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-input bg-secondary text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>
              )}

              {!block && withNote && (
                <div className="mt-4">
                  <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                    Note (kept in audit trail)
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 mt-5">
                <button
                  onClick={handleClose}
                  className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {block ? "Close" : cancelLabel}
                </button>
                {!block && (
                  <button
                    onClick={() => onConfirm(withNote ? note : undefined)}
                    disabled={!confirmEnabled}
                    className={`h-9 px-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed ${meta.btn}`}
                  >
                    {confirmLabel}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Convenience export for "All clear" success patterns. */
export function SuccessChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-success">
      <CheckCircle2 className="size-3" />
      {label}
    </span>
  );
}
