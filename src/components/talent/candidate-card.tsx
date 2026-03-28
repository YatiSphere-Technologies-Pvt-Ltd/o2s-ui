"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { type Candidate, avatarColorClass, scoreClasses, tagClasses, daysColor } from "@/components/talent/data";

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
  stageColorClass: string;
  index: number;
  isDragging?: boolean;
}

export function CandidateCard({
  candidate,
  onClick,
  stageColorClass,
  index,
  isDragging: isDraggingProp,
}: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDragActive,
  } = useDraggable({
    id: candidate.id,
  });

  const dragging = isDraggingProp || isDragActive;

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragActive ? 0.4 : 1,
  };

  const visibleTags = candidate.tags.slice(0, 2);
  const overflowCount = candidate.tags.length - 2;

  const aiSourcedBorder = candidate.aiSourced
    ? "border-l-2 border-l-brand-purple"
    : "";

  // Build hover border class from the stage color — maps e.g. "border-brand-purple" to "hover:border-brand-purple"
  const hoverBorder = stageColorClass.startsWith("border-")
    ? `hover:${stageColorClass}`
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.2 }}
    >
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onClick={onClick}
        role="button"
        aria-label={`${candidate.name} — ${candidate.role}, ${candidate.location}`}
        className={[
          "bg-card border border-border rounded-lg p-3.5 cursor-pointer group",
          "hover:-translate-y-0.5 transition-all duration-150",
          aiSourcedBorder,
          hoverBorder,
          dragging ? "shadow-lg rotate-2 z-50" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* Top row: avatar, name/role, score */}
        <div className="flex items-start gap-2.5">
          <div
            className={`size-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${avatarColorClass(candidate.name)}`}
          >
            {candidate.initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {candidate.name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {candidate.role}
            </p>
          </div>
          <div
            className={`size-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${scoreClasses(candidate.aiScore)}`}
          >
            {candidate.aiScore !== null ? candidate.aiScore : "\u2014"}
          </div>
        </div>

        {/* Middle row: location & source */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
          <MapPin className="size-3 shrink-0" />
          <span className="truncate">{candidate.location}</span>
          <span>&middot;</span>
          <span className="truncate">{candidate.source}</span>
        </div>

        {/* Bottom row: tags & days */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5 ${tagClasses(tag)}`}
              >
                {tag === "AI Sourced" && <Sparkles className="size-2.5" />}
                {tag}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-secondary text-muted-foreground">
                +{overflowCount}
              </span>
            )}
          </div>
          <div
            className={`flex items-center gap-1 text-[10px] ${daysColor(candidate.daysInStage)}`}
          >
            <Clock className="size-3" />
            {candidate.daysInStage}d
          </div>
        </div>
      </div>
    </motion.div>
  );
}
