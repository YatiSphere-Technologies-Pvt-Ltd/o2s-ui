"use client";

import { motion } from "framer-motion";
import { GripVertical } from "lucide-react";
import {
  type ArenaCandidate,
  stageLabel,
  priorityColor,
  priorityBgColor,
  scoreColor,
  roundTypeLabel,
  roundTypeColor,
  roundTypeBgColor,
} from "./data";

interface CandidateQueueProps {
  candidates: ArenaCandidate[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  draggedId: string | null;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function CandidateQueue({
  candidates,
  selectedId,
  onSelect,
  draggedId,
  onDragStart,
  onDragEnd,
}: CandidateQueueProps) {
  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Candidates</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {candidates.length} pending
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        {candidates.length === 0 && (
          <div className="flex items-center justify-center py-10">
            <p className="text-xs text-muted-foreground/40">All scheduled</p>
          </div>
        )}

        {candidates.map((c, i) => {
          const isSelected = selectedId === c.id;
          const isDragging = draggedId === c.id;

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: isDragging ? 0.4 : 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              draggable
              onDragStart={() => onDragStart(c.id)}
              onDragEnd={onDragEnd}
              onClick={() => onSelect(c.id)}
              className={`relative rounded-xl border p-3 cursor-grab active:cursor-grabbing transition-all duration-150 group ${
                isSelected
                  ? "border-brand bg-brand/[0.05] ring-1 ring-brand/50"
                  : "border-border hover:border-border hover:bg-surface-overlay"
              } ${isDragging ? "scale-95" : ""}`}
            >
              {/* Drag handle */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
                <GripVertical className="size-3.5 text-muted-foreground" />
              </div>

              {/* Priority left bar */}
              <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full ${
                c.priority === "urgent" ? "bg-destructive" :
                c.priority === "high" ? "bg-warning" :
                c.priority === "normal" ? "bg-brand" : "bg-muted-foreground/15"
              }`} />

              <div className="flex items-center gap-3 pl-2 pr-4">
                {/* Avatar */}
                <div className="size-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-xs font-bold text-brand-purple shrink-0">
                  {c.initials}
                </div>

                <div className="min-w-0 flex-1">
                  {/* Name + Score */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {c.name}
                    </span>
                    <span className={`text-xs font-bold tabular-nums ${scoreColor(c.fitScore)}`}>
                      {c.fitScore}
                    </span>
                  </div>

                  {/* Stage + Round type */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${priorityBgColor(c.priority)} ${priorityColor(c.priority)}`}>
                      {stageLabel(c.stage)}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${roundTypeBgColor(c.requiredRoundType)} ${roundTypeColor(c.requiredRoundType)}`}>
                      {roundTypeLabel(c.requiredRoundType)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer hint */}
      <div className="shrink-0 px-4 py-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground/40">
          Click to highlight · Drag to schedule
        </p>
      </div>
    </div>
  );
}
