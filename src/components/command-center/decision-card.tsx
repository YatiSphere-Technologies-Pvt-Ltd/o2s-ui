"use client";

import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";
import { ConfidenceBadge } from "./confidence-badge";
import {
  type Decision,
  urgencyBorderColor,
  urgencyColor,
  urgencyLabel,
  decisionTypeLabel,
} from "./data";

interface DecisionCardProps {
  decision: Decision;
  isSelected: boolean;
  onSelect: () => void;
}

export function DecisionCard({ decision, isSelected, onSelect }: DecisionCardProps) {
  const isUrgentDeadline =
    decision.deadline &&
    (decision.deadline.includes("hour") || decision.deadline === "Today");

  return (
    <motion.div
      layout
      onClick={onSelect}
      className={`relative rounded-lg border-l-[3px] border border-border bg-card p-3.5 cursor-pointer group transition-all duration-150 ${urgencyBorderColor(decision.urgency)} ${
        isSelected
          ? "ring-1 ring-brand bg-brand/[0.04] border-border"
          : "hover:bg-secondary/30 hover:-translate-y-[1px]"
      }`}
    >
      {/* Top row: type label + confidence */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {decisionTypeLabel(decision.type)}
        </span>
        <ConfidenceBadge score={decision.confidence} size="sm" />
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1.5">
        {decision.title}
      </h4>

      {/* Subtitle */}
      <p className="text-[11px] text-muted-foreground line-clamp-1 mb-3">
        {decision.subtitle}
      </p>

      {/* Candidate row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="size-6 rounded-full bg-brand-purple/10 flex items-center justify-center text-[9px] font-bold text-brand-purple shrink-0">
          {decision.candidateInitials}
        </div>
        <div className="min-w-0">
          <span className="text-[11px] font-medium text-foreground truncate block">
            {decision.candidateName}
          </span>
        </div>
      </div>

      {/* Bottom row: time + urgency + deadline */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3" />
          <span className="text-[10px]">{decision.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Urgency dot */}
          <span
            className={`text-[10px] font-medium ${urgencyColor(decision.urgency)}`}
          >
            {urgencyLabel(decision.urgency)}
          </span>

          {/* Deadline */}
          {decision.deadline && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${
                isUrgentDeadline
                  ? "bg-destructive/10 text-destructive"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {isUrgentDeadline && (
                <AlertCircle className="size-2.5 animate-pulse" />
              )}
              {decision.deadline}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
