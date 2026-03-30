"use client";

import { motion } from "framer-motion";
import { Bot, Sparkles, AlertTriangle, Shield, Zap, BarChart3 } from "lucide-react";
import {
  type InterviewRound,
  type RoundInterviewer,
  getInterviewerById,
  roundTypeLabel,
  roundTypeColor,
  roundTypeBgColor,
  seniorityLabel,
  availabilityColor,
  scoreColor,
} from "./data";

interface PanelViewProps {
  round: InterviewRound;
}

function InterviewerCard({ ri, index }: { ri: RoundInterviewer; index: number }) {
  const prof = getInterviewerById(ri.interviewerId);
  if (!prof) return null;

  const loadPercent = (prof.interviewLoad / prof.maxLoad) * 100;
  const biasLevel = prof.biasScore <= 5 ? "Low" : prof.biasScore <= 10 ? "Medium" : "High";
  const biasColor = prof.biasScore <= 5 ? "text-success" : prof.biasScore <= 10 ? "text-warning" : "text-destructive";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className={`rounded-xl border bg-card p-4 transition-all ${
        ri.isAISuggested ? "border-brand-purple/30" : "border-border"
      }`}
    >
      {/* AI suggested badge */}
      {ri.isAISuggested && (
        <div className="flex items-center gap-1.5 mb-3 text-[9px] font-semibold text-brand-purple bg-brand-purple/8 px-2 py-1 rounded-full w-fit">
          <Sparkles className="size-3" />
          AI Suggested
        </div>
      )}

      {/* Profile */}
      <div className="flex items-center gap-3 mb-3">
        <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple shrink-0">
          {prof.initials}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-foreground">{prof.name}</h4>
          <p className="text-[10px] text-muted-foreground">{prof.role} · {seniorityLabel(prof.seniority)}</p>
        </div>
        <span className={`text-[10px] font-medium ml-auto ${availabilityColor(prof.availability)}`}>
          {prof.availability}
        </span>
      </div>

      {/* Reason */}
      <p className="text-[11px] text-muted-foreground/70 mb-3 italic">
        &ldquo;{ri.reason}&rdquo;
      </p>

      {/* Expertise */}
      <div className="mb-3">
        <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider block mb-1.5">Expertise</span>
        <div className="flex flex-wrap gap-1">
          {prof.expertise.map((e) => (
            <span key={e} className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-medium text-muted-foreground">
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
        <div className="text-center">
          <div className={`text-sm font-bold ${scoreColor(prof.avgFeedbackScore * 20)}`}>
            {prof.avgFeedbackScore}
          </div>
          <span className="text-[9px] text-muted-foreground/50">Avg Score</span>
        </div>
        <div className="text-center">
          <div className={`text-sm font-bold ${biasColor}`}>{biasLevel}</div>
          <span className="text-[9px] text-muted-foreground/50">Bias Risk</span>
        </div>
        <div className="text-center">
          <div className={`text-sm font-bold ${loadPercent >= 100 ? "text-destructive" : loadPercent >= 75 ? "text-warning" : "text-success"}`}>
            {prof.interviewLoad}/{prof.maxLoad}
          </div>
          <span className="text-[9px] text-muted-foreground/50">Load</span>
        </div>
      </div>
    </motion.div>
  );
}

export function PanelView({ round }: PanelViewProps) {
  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Bot className="size-4 text-brand-purple" />
          Panel — Round {round.roundNumber}: {roundTypeLabel(round.type)}
        </h3>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${roundTypeBgColor(round.type)} ${roundTypeColor(round.type)}`}>
          {round.interviewers.length} interviewer{round.interviewers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* AI confidence */}
      {round.interviewers.some((ri) => ri.isAISuggested) && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-purple/[0.04] border border-brand-purple/10">
          <Sparkles className="size-3.5 text-brand-purple" />
          <span className="text-[11px] text-brand-purple font-medium">
            AI assembled this panel based on expertise match, load balancing, and bias diversity
          </span>
        </div>
      )}

      {/* Interviewer cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {round.interviewers.map((ri, i) => (
          <InterviewerCard key={ri.interviewerId} ri={ri} index={i} />
        ))}
      </div>

      {/* AI-generated questions preview */}
      {round.aiQuestions.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border/50">
          <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="size-3" />
            AI-Generated Questions
          </h4>
          {round.aiQuestions.map((q, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <span className="text-brand-purple font-mono shrink-0">Q{i + 1}.</span>
              <span>{q}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
