"use client";

import {
  healthColor,
  healthBgColor,
  healthLabel,
} from "@/components/ta/journey-data";

interface JourneyHealthBadgeProps {
  score: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export function JourneyHealthBadge({
  score,
  size = "sm",
  showLabel = false,
}: JourneyHealthBadgeProps) {
  const color = healthColor(score);
  const bgColor = healthBgColor(score);

  if (size === "sm" && !showLabel) {
    return <span className={`text-xs font-bold ${color}`}>{score}</span>;
  }

  if (size === "md" && !showLabel) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${color} ${bgColor}/10`}
      >
        <span className="font-bold">{score}</span>
        <span>{healthLabel(score)}</span>
      </span>
    );
  }

  /* showLabel mode — number + label + bar */
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${color} ${bgColor}/10`}
      >
        <span className="font-bold">{score}</span>
        <span>{healthLabel(score)}</span>
      </span>
      <span className="text-xs text-muted-foreground">Health: {score}</span>
      <span className="w-16 h-1.5 rounded-full bg-secondary inline-block relative">
        <span
          className={`absolute inset-y-0 left-0 rounded-full ${bgColor}`}
          style={{ width: `${score}%` }}
        />
      </span>
    </span>
  );
}
