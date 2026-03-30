"use client";

import { motion } from "framer-motion";
import { confidenceColor, confidenceStrokeColor } from "./data";

interface ConfidenceBadgeProps {
  score: number;
  size?: "sm" | "md";
}

export function ConfidenceBadge({ score, size = "sm" }: ConfidenceBadgeProps) {
  const dim = size === "sm" ? 28 : 36;
  const strokeWidth = size === "sm" ? 2.5 : 3;
  const radius = (dim - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = confidenceStrokeColor(score);
  const textClass = confidenceColor(score);
  const fontSize = size === "sm" ? "text-[9px]" : "text-[11px]";

  return (
    <div className="relative shrink-0" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border"
        />
        {/* Animated arc */}
        <motion.circle
          cx={dim / 2}
          cy={dim / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center font-bold ${fontSize} ${textClass}`}
      >
        {score}
      </span>
    </div>
  );
}
