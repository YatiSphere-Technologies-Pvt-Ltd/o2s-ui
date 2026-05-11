"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional caption shown under the title. */
  subtitle?: string;
  /** Drawer width on sm+. Defaults to ~480px. */
  width?: "sm" | "md" | "lg";
  children: ReactNode;
  /** Optional footer slot (e.g. action buttons). */
  footer?: ReactNode;
}

const WIDTH_CLASS: Record<NonNullable<Props["width"]>, string> = {
  sm: "sm:w-96",
  md: "sm:w-[480px]",
  lg: "sm:w-[560px]",
};

export function Drawer({ open, onClose, title, subtitle, width = "md", children, footer }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className={`fixed right-0 top-0 bottom-0 z-50 w-full ${WIDTH_CLASS[width]} bg-card border-l border-border flex flex-col`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin p-5">{children}</div>

            {footer && <div className="border-t border-border p-3">{footer}</div>}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
