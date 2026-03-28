"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Sparkles, Search } from "lucide-react";
import {
  type Candidate,
  STAGE_MAP,
  avatarColorClass,
  scoreClasses,
  tagClasses,
  daysColor,
} from "@/components/talent/data";

interface ListViewProps {
  candidates: Candidate[];
  onSelectCandidate: (c: Candidate) => void;
}

export function ListView({ candidates, onSelectCandidate }: ListViewProps) {
  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="size-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          No candidates match your filters
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-4 py-3 space-y-2">
      {candidates.map((candidate, index) => {
        const stage = STAGE_MAP[candidate.stage];
        const visibleTags = candidate.tags.slice(0, 3);

        return (
          <motion.div
            key={candidate.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02, duration: 0.15 }}
            onClick={() => onSelectCandidate(candidate)}
            className="bg-card border border-border rounded-lg px-4 py-3 cursor-pointer transition-all hover:border-border/80 hover:bg-card/80"
          >
            {/* Row 1: Avatar + Name + Role | Stage pill + Score */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`size-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${avatarColorClass(candidate.name)}`}
                >
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {candidate.name}
                  </span>
                  {candidate.aiSourced && (
                    <Sparkles className="size-3 text-brand-purple shrink-0" />
                  )}
                  <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                    {candidate.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full text-white ${stage?.colorClass ?? "bg-secondary"}`}
                >
                  {stage?.name ?? candidate.stage}
                </span>
                <div
                  className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${scoreClasses(candidate.aiScore)}`}
                >
                  {candidate.aiScore !== null ? candidate.aiScore : "\u2014"}
                </div>
              </div>
            </div>

            {/* Row 2: Location, Source, Days */}
            <div className="flex items-center gap-3 mt-1.5 ml-11 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="size-3" />
                {candidate.location}
              </span>
              <span>&middot;</span>
              <span>{candidate.source}</span>
              <span>&middot;</span>
              <span
                className={`flex items-center gap-1 ${daysColor(candidate.daysInStage)}`}
              >
                <Clock className="size-3" />
                {candidate.daysInStage}d in stage
              </span>
            </div>

            {/* Row 3: Tags (if any) */}
            {visibleTags.length > 0 && (
              <div className="flex gap-1.5 mt-2 ml-11">
                {visibleTags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5 ${tagClasses(tag)}`}
                  >
                    {tag === "AI Sourced" && (
                      <Sparkles className="size-2.5" />
                    )}
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
