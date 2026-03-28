"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, MoreHorizontal, Sparkles, Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  type Candidate,
  STAGE_MAP,
  avatarColorClass,
  scoreTextClass,
  tagClasses,
  daysColor,
} from "@/components/talent/data";

interface TableViewProps {
  candidates: Candidate[];
  onSelectCandidate: (c: Candidate) => void;
}

export function TableView({ candidates, onSelectCandidate }: TableViewProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const allSelected =
    candidates.length > 0 && candidates.every((c) => selectedIds.has(c.id));
  const someSelected =
    candidates.some((c) => selectedIds.has(c.id)) && !allSelected;

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(candidates.map((c) => c.id)));
      } else {
        setSelectedIds(new Set());
      }
    },
    [candidates]
  );

  const handleToggle = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Clear selection when candidates change (e.g. filter applied)
  const prevIdsRef = useRef<string>("");
  useEffect(() => {
    const key = candidates.map((c) => c.id).join(",");
    if (key !== prevIdsRef.current) {
      prevIdsRef.current = key;
      setSelectedIds(new Set());
    }
  }, [candidates]);

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
    <div className="h-full overflow-auto">
      <table className="w-full min-w-[900px]">
        <thead className="sticky top-0 z-10 bg-background">
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="w-10 px-4 py-3 text-left">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={handleSelectAll}
                aria-label="Select all candidates"
              />
            </th>
            <th className="px-4 py-3 text-left font-medium">Candidate</th>
            <th className="px-4 py-3 text-left font-medium">Applied For</th>
            <th className="px-4 py-3 text-left font-medium">Stage</th>
            <th className="px-4 py-3 text-left font-medium">AI Score</th>
            <th className="px-4 py-3 text-left font-medium">Source</th>
            <th className="px-4 py-3 text-left font-medium">Days</th>
            <th className="px-4 py-3 text-left font-medium">Tags</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => {
            const stage = STAGE_MAP[candidate.stage];
            const visibleTags = candidate.tags.slice(0, 2);
            const isSelected = selectedIds.has(candidate.id);

            return (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02, duration: 0.15 }}
                onClick={() => onSelectCandidate(candidate)}
                className="border-b border-border cursor-pointer transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(candidate.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Select ${candidate.name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColorClass(candidate.name)}`}
                    >
                      {candidate.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate flex items-center gap-1.5">
                        {candidate.name}
                        {candidate.aiSourced && (
                          <Sparkles className="size-3 text-brand-purple" />
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" />
                        {candidate.location}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">
                    {candidate.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`size-2 rounded-full shrink-0 ${stage?.colorClass ?? "bg-secondary"}`}
                    />
                    <span className="text-sm text-foreground">
                      {stage?.name ?? candidate.stage}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${scoreTextClass(candidate.aiScore)}`}
                  >
                    {candidate.aiScore !== null ? candidate.aiScore : "\u2014"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {candidate.source}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm flex items-center gap-1 ${daysColor(candidate.daysInStage)}`}
                  >
                    <Clock className="size-3" />
                    {candidate.daysInStage}d
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
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
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`More actions for ${candidate.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <MoreHorizontal className="size-4 text-muted-foreground" />
                  </Button>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>

      {/* Bulk action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-card border border-border rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-xl"
          >
            <span className="text-sm text-foreground font-medium">
              {selectedIds.size} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <Button variant="ghost" size="sm" aria-label="Move stage">
              Move Stage
            </Button>
            <Button variant="ghost" size="sm" aria-label="Add tag">
              Add Tag
            </Button>
            <Button variant="ghost" size="sm" aria-label="Archive">
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              aria-label="Reject"
            >
              Reject
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
