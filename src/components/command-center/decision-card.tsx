"use client";

import { motion } from "framer-motion";
import { Clock, AlertCircle, Check, X, Pause, Sparkles } from "lucide-react";
import { ConfidenceBadge } from "./confidence-badge";
import {
  type Decision,
  urgencyBorderColor,
  urgencyColor,
  urgencyBgColor,
  urgencyLabel,
  decisionTypeLabel,
} from "./data";

interface DecisionCardProps {
  decision: Decision;
  isSelected: boolean;
  onSelect: () => void;
}

const REC_ICONS: Record<string, typeof Check> = { approve: Check, reject: X, review: Pause, defer: Pause };
const REC_COLORS: Record<string, string> = { approve: "text-success", reject: "text-destructive", review: "text-warning", defer: "text-warning" };

export function DecisionCard({ decision, isSelected, onSelect }: DecisionCardProps) {
  const isUrgentDeadline =
    decision.deadline &&
    (decision.deadline.includes("hour") || decision.deadline === "Today");

  const isCritical = decision.urgency === "critical";
  const RecIcon = REC_ICONS[decision.recommendation] || Pause;

  return (
    <motion.div
      layout
      onClick={onSelect}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.1 }}
      className={`relative rounded-xl border-l-[3px] border bg-card cursor-pointer group transition-all duration-150 overflow-hidden ${urgencyBorderColor(decision.urgency)} ${
        isSelected
          ? "ring-1 ring-brand bg-brand/[0.04] border-border shadow-sm"
          : "border-border hover:bg-secondary/20"
      }`}
    >
      {/* Critical pulsing top accent */}
      {isCritical && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-destructive via-destructive/50 to-transparent animate-pulse" />
      )}

      <div className="p-3.5">
        {/* Row 1: Avatar + Title + Confidence */}
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple shrink-0 mt-0.5">
            {decision.candidateInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">
              {decision.title}
            </h4>
            <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
              {decision.subtitle}
            </p>
          </div>
          <ConfidenceBadge score={decision.confidence} size="sm" />
        </div>

        {/* Row 2: Meta tags */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {/* AI recommendation pill */}
          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold px-2 py-0.5 rounded-full ${
            decision.recommendation === "approve" ? "bg-success/10 text-success" :
            decision.recommendation === "reject" ? "bg-destructive/10 text-destructive" :
            "bg-warning/10 text-warning"
          }`}>
            <RecIcon className="size-2.5" />
            AI: {decision.recommendation === "approve" ? "Approve" : decision.recommendation === "reject" ? "Reject" : "Defer"}
          </span>

          {/* Urgency */}
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${urgencyBgColor(decision.urgency)} ${urgencyColor(decision.urgency)}`}>
            {urgencyLabel(decision.urgency)}
          </span>

          {/* Type */}
          <span className="text-[9px] text-muted-foreground/50">
            {decisionTypeLabel(decision.type)}
          </span>
        </div>

        {/* Row 3: Time + Deadline */}
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground/40">
            <Clock className="size-3" />
            <span className="text-[10px]">{decision.createdAt}</span>
          </div>

          {decision.deadline && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
              isUrgentDeadline
                ? "bg-destructive/15 text-destructive"
                : "bg-secondary text-muted-foreground"
            }`}>
              {isUrgentDeadline && <AlertCircle className="size-3 animate-pulse" />}
              Due: {decision.deadline}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
