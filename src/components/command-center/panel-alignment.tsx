"use client";

import { motion } from "framer-motion";
import {
  type InterviewerVote,
  type PanelAlignment as PanelAlignmentType,
  voteColor,
  voteBgColor,
  voteLabel,
  consensusColor,
  consensusBgColor,
  consensusLabel,
} from "./data";

interface PanelAlignmentProps {
  votes: InterviewerVote[];
  alignment: PanelAlignmentType;
}

const VOTE_BAR_COLORS: Record<string, string> = {
  "Strong Yes": "bg-success",
  "Yes": "bg-success/60",
  "Neutral": "bg-muted-foreground/30",
  "No": "bg-destructive/60",
  "Strong No": "bg-destructive",
};

export function PanelAlignment({ votes, alignment }: PanelAlignmentProps) {
  const totalVotes = alignment.votes.reduce((sum, v) => sum + v.count, 0);
  const hasVotes = votes.length > 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Panel Alignment
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${consensusColor(alignment.consensusLevel)} ${consensusBgColor(alignment.consensusLevel)}`}
        >
          {consensusLabel(alignment.consensusLevel)}
        </span>
      </div>

      {/* Vote distribution bar */}
      {totalVotes > 0 && (
        <div className="space-y-2">
          <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
            {alignment.votes.map((v) => {
              if (v.count === 0) return null;
              const widthPercent = (v.count / totalVotes) * 100;
              const barColor = VOTE_BAR_COLORS[v.label] || "bg-secondary";
              return (
                <motion.div
                  key={v.label}
                  className={`${barColor} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {alignment.votes.map((v) => {
              if (v.count === 0) return null;
              const barColor = VOTE_BAR_COLORS[v.label] || "bg-secondary";
              return (
                <div key={v.label} className="flex items-center gap-1.5">
                  <div className={`size-2 rounded-full ${barColor}`} />
                  <span className="text-[10px] text-muted-foreground">
                    {v.label} ({v.count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Individual voters */}
      {hasVotes ? (
        <div className="space-y-2">
          {votes.map((voter) => (
            <div
              key={voter.name}
              className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/30"
            >
              <div className="size-7 shrink-0 rounded-full bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                {voter.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {voter.name}
                  </span>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold ${voteColor(voter.vote)} ${voteBgColor(voter.vote)}`}
                  >
                    {voteLabel(voter.vote)}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1 line-clamp-2">
                  {voter.notes}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/50 italic">
          No interview feedback available yet
        </p>
      )}
    </div>
  );
}
