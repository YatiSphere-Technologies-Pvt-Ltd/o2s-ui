"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, ChevronDown, Shield } from "lucide-react";
import {
  type PanelAlignment,
  type PanelVote,
  getInterviewerById,
  recommendationColor,
  recommendationBgColor,
  recommendationLabel,
  scoreColor,
  scoreBgColor,
  roundTypeLabel,
} from "./data";

interface AlignmentViewProps {
  alignment: PanelAlignment;
  candidateName: string;
}

const VOTE_BAR_COLORS: Record<string, string> = {
  strong_hire: "bg-success",
  hire: "bg-success/70",
  lean_hire: "bg-brand-teal",
  lean_no: "bg-warning",
  no_hire: "bg-destructive/70",
  strong_no: "bg-destructive",
};

function VoteCard({ vote }: { vote: PanelVote }) {
  const [expanded, setExpanded] = useState(false);
  const prof = getInterviewerById(vote.interviewerId);
  if (!prof) return null;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-secondary/20 transition-colors cursor-pointer text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple shrink-0">
            {prof.initials}
          </div>
          <div className="min-w-0">
            <span className="text-sm font-medium text-foreground block">{prof.name}</span>
            <span className="text-[10px] text-muted-foreground">{prof.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-lg font-bold ${scoreColor(vote.score)}`}>{vote.score}</span>
          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${recommendationBgColor(vote.recommendation)} ${recommendationColor(vote.recommendation)}`}>
            {recommendationLabel(vote.recommendation)}
          </span>
          <ChevronDown className={`size-4 text-muted-foreground/30 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 border-t border-border/50 space-y-2 pt-3">
              {vote.strengths.length > 0 && (
                <div>
                  <span className="text-[9px] font-semibold text-success uppercase tracking-wider block mb-1">Strengths</span>
                  {vote.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              )}
              {vote.concerns.length > 0 && (
                <div>
                  <span className="text-[9px] font-semibold text-destructive uppercase tracking-wider block mb-1">Concerns</span>
                  {vote.concerns.map((c, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground/70 italic pt-1">
                &ldquo;{vote.notes}&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AlignmentView({ alignment, candidateName }: AlignmentViewProps) {
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

  // Vote distribution for bar
  const voteCounts: Record<string, number> = {};
  for (const v of alignment.votes) {
    voteCounts[v.recommendation] = (voteCounts[v.recommendation] || 0) + 1;
  }
  const totalVotes = alignment.votes.length;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="size-4 text-brand-teal" />
          Panel Alignment — {candidateName}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${scoreColor(alignment.agreementScore)}`}>
            {alignment.agreementScore}%
          </span>
          <span className="text-[10px] text-muted-foreground">agreement</span>
        </div>
      </div>

      {/* Conflict warning */}
      {alignment.hasConflict && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/5 border border-destructive/20">
          <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-semibold text-destructive block">Conflict Detected</span>
            <p className="text-[11px] text-muted-foreground mt-0.5">{alignment.conflictExplanation}</p>
          </div>
        </div>
      )}

      {/* Vote distribution bar */}
      <div className="space-y-2">
        <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
          {Object.entries(voteCounts).map(([rec, count]) => {
            const width = (count / totalVotes) * 100;
            const color = VOTE_BAR_COLORS[rec] || "bg-secondary";
            return (
              <motion.div
                key={rec}
                className={`${color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(voteCounts).map(([rec, count]) => {
            const color = VOTE_BAR_COLORS[rec] || "bg-secondary";
            return (
              <div key={rec} className="flex items-center gap-1.5">
                <div className={`size-2 rounded-full ${color}`} />
                <span className="text-[10px] text-muted-foreground">
                  {recommendationLabel(rec as any)} ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-brand-purple" />
              <span className="text-sm font-semibold text-foreground">AI Synthesis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${recommendationBgColor(alignment.aiRecommendation)} ${recommendationColor(alignment.aiRecommendation)}`}>
                {recommendationLabel(alignment.aiRecommendation)}
              </span>
              <span className="text-[10px] text-muted-foreground">{alignment.aiConfidence}% confidence</span>
            </div>
          </div>

          <button
            onClick={() => setReasoningExpanded(!reasoningExpanded)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronDown className={`size-3.5 transition-transform ${reasoningExpanded ? "rotate-180" : ""}`} />
            {reasoningExpanded ? "Hide reasoning" : "Show AI reasoning"}
          </button>

          <AnimatePresence>
            {reasoningExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-[13px] text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {alignment.aiSynthesis}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Individual votes */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
          Individual Votes ({totalVotes})
        </h4>
        {alignment.votes.map((vote) => (
          <VoteCard key={`${vote.interviewerId}-${vote.roundId}`} vote={vote} />
        ))}
      </div>
    </div>
  );
}
