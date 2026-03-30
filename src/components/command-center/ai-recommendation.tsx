"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Check, X, Pause } from "lucide-react";
import { ConfidenceBadge } from "./confidence-badge";

interface AIRecommendationProps {
  recommendation: "approve" | "reject" | "defer";
  confidence: number;
  reasoning: string;
  expanded?: boolean;
  onToggle?: () => void;
}

const recConfig = {
  approve: {
    label: "Approve",
    icon: Check,
    textColor: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  reject: {
    label: "Reject",
    icon: X,
    textColor: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  defer: {
    label: "Defer",
    icon: Pause,
    textColor: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
};

function renderReasoning(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function AIRecommendation({
  recommendation,
  confidence,
  reasoning,
  expanded: controlledExpanded,
  onToggle,
}: AIRecommendationProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = controlledExpanded ?? internalExpanded;
  const toggle = onToggle ?? (() => setInternalExpanded((prev) => !prev));

  const config = recConfig[recommendation];
  const RecIcon = config.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Gradient top accent */}
      <div className="h-0.5 bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />

      <div className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-brand-purple/10 flex items-center justify-center">
              <Sparkles className="size-3.5 text-brand-purple" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              AI Recommendation
            </span>
          </div>
          <ConfidenceBadge score={confidence} size="md" />
        </div>

        {/* Recommendation pill */}
        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.bgColor} ${config.borderColor}`}
          >
            <RecIcon className={`size-3.5 ${config.textColor}`} />
            <span className={`text-sm font-semibold ${config.textColor}`}>
              {config.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {confidence}% confidence
          </span>
        </div>

        {/* Expandable reasoning */}
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
          {isExpanded ? "Hide reasoning" : "Why did AI recommend this?"}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-1 pb-1 text-[13px] text-muted-foreground leading-relaxed border-t border-border/50 mt-1 pt-3">
                {renderReasoning(reasoning)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
