"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "./candidate-card";
import {
  type Candidate,
  STAGES,
  STAGE_MAP,
  type Stage,
} from "@/components/talent/data";

/* ── Props ── */

interface KanbanBoardProps {
  candidates: Candidate[];
  allCandidates: Candidate[];
  onSelectCandidate: (c: Candidate) => void;
  onCandidatesChange: (candidates: Candidate[]) => void;
}

/* ── Droppable Column ── */

interface KanbanColumnProps {
  stage: Stage;
  candidates: Candidate[];
  onSelectCandidate: (c: Candidate) => void;
}

function KanbanColumn({ stage, candidates, onSelectCandidate }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={[
        "w-75 min-w-75 bg-background rounded-xl border flex flex-col transition-all duration-200",
        isOver
          ? `${stage.borderClass} border-2 animate-pulse`
          : "border-border",
      ].join(" ")}
    >
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 py-2">
        <span className={`size-2 rounded-full shrink-0 ${stage.colorClass}`} />
        <span className="text-sm font-semibold text-foreground">
          {stage.name}
        </span>
        <span className="text-xs text-muted-foreground bg-surface-overlay px-1.5 py-0.5 rounded">
          {candidates.length}
        </span>
      </div>

      {/* Colored divider */}
      <div className={`h-0.5 mx-3 ${stage.colorClass}`} />

      {/* Card list */}
      <div className="flex flex-col gap-2.5 p-2 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-auto">
        {candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-xs text-muted-foreground">No candidates</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              Drag candidates here or click + to add
            </p>
          </div>
        ) : (
          candidates.map((candidate, index) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={() => onSelectCandidate(candidate)}
              stageColorClass={stage.borderClass}
              index={index}
            />
          ))
        )}
      </div>

      {/* Add candidate ghost button */}
      <div className="p-2 mt-auto">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground hover:text-foreground justify-start gap-1.5"
        >
          <Plus className="size-3" />
          Add Candidate
        </Button>
      </div>
    </div>
  );
}

/* ── Kanban Board ── */

export function KanbanBoard({
  candidates,
  allCandidates,
  onSelectCandidate,
  onCandidatesChange,
}: KanbanBoardProps) {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const id = event.active.id as string;
    const candidate = allCandidates.find((c) => c.id === id) ?? null;
    setActiveCandidate(candidate);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCandidate(null);
    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as string;

    // Only process if dropped on a valid column
    if (STAGE_MAP[newStage]) {
      const candidate = allCandidates.find((c) => c.id === candidateId);
      if (candidate && candidate.stage !== newStage) {
        const updated = allCandidates.map((c) =>
          c.id === candidateId ? { ...c, stage: newStage, daysInStage: 0 } : c
        );
        onCandidatesChange(updated);
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 px-6 pt-4 scrollbar-thin">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter(
            (c) => c.stage === stage.id
          );

          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              candidates={stageCandidates}
              onSelectCandidate={onSelectCandidate}
            />
          );
        })}
      </div>

      {/* Drag overlay — ghost card following the cursor */}
      <DragOverlay>
        {activeCandidate ? (
          <div className="shadow-xl rotate-3 opacity-90">
            <CandidateCard
              candidate={activeCandidate}
              onClick={() => {}}
              stageColorClass={
                STAGE_MAP[activeCandidate.stage]?.borderClass ?? "border-border"
              }
              index={0}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
