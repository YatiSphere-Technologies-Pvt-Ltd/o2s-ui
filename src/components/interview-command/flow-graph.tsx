"use client";

import { motion } from "framer-motion";
import { User, ArrowRight, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";
import {
  type InterviewPlan,
  type InterviewRound,
  roundTypeLabel,
  roundTypeColor,
  roundTypeBgColor,
  roundTypeEmoji,
  roundStatusColor,
  roundStatusBgColor,
  roundStatusLabel,
  scoreColor,
  getInterviewerById,
} from "./data";

interface FlowGraphProps {
  plan: InterviewPlan;
  selectedRoundId: string | null;
  onSelectRound: (id: string) => void;
}

function RoundNode({
  round,
  isSelected,
  onSelect,
  index,
}: {
  round: InterviewRound;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const statusIcons = {
    pending: Clock,
    scheduled: Calendar,
    in_progress: AlertCircle,
    completed: CheckCircle2,
    cancelled: AlertCircle,
  };
  const StatusIcon = statusIcons[round.status];
  const interviewer = round.interviewers[0] ? getInterviewerById(round.interviewers[0].interviewerId) : null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={onSelect}
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-150 cursor-pointer min-w-[140px] ${
        isSelected
          ? "border-brand ring-1 ring-brand bg-brand/[0.04]"
          : "border-border hover:border-border hover:bg-secondary/20"
      }`}
    >
      {/* Round type emoji + label */}
      <span className="text-xl mb-1">{roundTypeEmoji(round.type)}</span>
      <span className={`text-[10px] font-semibold ${roundTypeColor(round.type)}`}>
        {roundTypeLabel(round.type)}
      </span>

      {/* Status badge */}
      <span className={`mt-2 text-[9px] font-semibold px-2 py-0.5 rounded-full ${roundStatusBgColor(round.status)} ${roundStatusColor(round.status)}`}>
        {roundStatusLabel(round.status)}
      </span>

      {/* Score (if completed) */}
      {round.score !== null && (
        <span className={`mt-1.5 text-lg font-bold ${scoreColor(round.score)}`}>
          {round.score}
        </span>
      )}

      {/* Interviewer(s) */}
      {interviewer && (
        <div className="mt-2 flex items-center gap-1">
          <div className="size-5 rounded-full bg-brand-purple/10 flex items-center justify-center text-[8px] font-bold text-brand-purple">
            {interviewer.initials}
          </div>
          {round.interviewers.length > 1 && (
            <span className="text-[9px] text-muted-foreground">
              +{round.interviewers.length - 1}
            </span>
          )}
        </div>
      )}

      {/* Round number pill */}
      <div className="absolute -top-2 -left-2 size-5 rounded-full bg-card border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground">
        {round.roundNumber}
      </div>
    </motion.button>
  );
}

export function FlowGraph({ plan, selectedRoundId, onSelectRound }: FlowGraphProps) {
  const completedRounds = plan.rounds.filter((r) => r.status === "completed").length;
  const progress = (completedRounds / plan.rounds.length) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple">
            {plan.candidateInitials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{plan.candidateName}</h3>
            <p className="text-[11px] text-muted-foreground">{plan.candidateRole} · {plan.candidateCompany}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-bold ${scoreColor(plan.fitScore)}`}>{plan.fitScore}</div>
          <span className="text-[10px] text-muted-foreground">Fit Score</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>{completedRounds} of {plan.rounds.length} rounds completed</span>
          <span className={roundStatusColor(plan.overallStatus === "decision_pending" ? "completed" : plan.overallStatus === "in_progress" ? "in_progress" : "pending")}>
            {plan.overallStatus === "decision_pending" ? "Decision Pending" : plan.overallStatus === "in_progress" ? "In Progress" : "Planning"}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-purple to-brand-teal"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Flow nodes */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2 pt-3">
        {/* Candidate start node */}
        <div className="flex flex-col items-center p-3 min-w-[80px]">
          <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center">
            <User className="size-5 text-brand-purple" />
          </div>
          <span className="text-[9px] text-muted-foreground mt-1.5">Candidate</span>
        </div>

        {plan.rounds.map((round, i) => (
          <div key={round.id} className="flex items-center gap-2">
            {/* Connector */}
            <div className={`w-6 h-0.5 rounded-full ${
              round.status === "completed" ? "bg-success" :
              round.status === "scheduled" || round.status === "in_progress" ? "bg-brand" :
              "bg-border"
            }`} />

            <RoundNode
              round={round}
              isSelected={selectedRoundId === round.id}
              onSelect={() => onSelectRound(round.id)}
              index={i}
            />
          </div>
        ))}

        {/* Decision end node */}
        <div className="flex items-center gap-2">
          <div className={`w-6 h-0.5 rounded-full ${
            plan.overallStatus === "decision_pending" || plan.overallStatus === "completed" ? "bg-success" : "bg-border"
          }`} />
          <div className="flex flex-col items-center p-3 min-w-[80px]">
            <div className={`size-10 rounded-full flex items-center justify-center ${
              plan.overallStatus === "decision_pending" ? "bg-warning/10" : "bg-secondary/50"
            }`}>
              <CheckCircle2 className={`size-5 ${
                plan.overallStatus === "decision_pending" ? "text-warning" : "text-muted-foreground/30"
              }`} />
            </div>
            <span className="text-[9px] text-muted-foreground mt-1.5">Decision</span>
          </div>
        </div>
      </div>

      {/* Gaps / Conflicts warnings */}
      {(plan.panelGaps.length > 0 || plan.panelConflicts.length > 0) && (
        <div className="space-y-1.5">
          {plan.panelGaps.map((gap, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-warning px-3 py-1.5 rounded-lg bg-warning/5">
              <AlertCircle className="size-3 shrink-0" />
              <span>Gap: {gap}</span>
            </div>
          ))}
          {plan.panelConflicts.map((conflict, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-destructive px-3 py-1.5 rounded-lg bg-destructive/5">
              <AlertCircle className="size-3 shrink-0" />
              <span>Conflict: {conflict}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
