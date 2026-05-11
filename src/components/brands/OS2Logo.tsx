"use client";

import { motion } from "framer-motion";

export default function O2SLogo({
  size = 90,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 38) / 80}
      viewBox="0 0 80 38"
      className={className}
    >
      <defs>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* O */}
      <text
        x="0"
        y="32"
        fontFamily="Inter, Sora, sans-serif"
        fontSize="38"
        fontWeight="700"
        fill="#E5E7EB"
      >
        O
      </text>

      {/* S */}
      <text
        x="48"
        y="32"
        fontFamily="Inter, Sora, sans-serif"
        fontSize="38"
        fontWeight="700"
        fill="#E5E7EB"
      >
        S
      </text>

      {/* Animated "2" Badge — superscript position */}
      <motion.g
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.08 }}
      >
        <motion.circle
          cx="35"
          cy="7"
          r="8"
          fill="#2DA8FF"
          opacity={0.25}
          filter="url(#softGlow)"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="35" cy="7" r="8" fill="#2DA8FF" />
        <text
          x="35"
          y="11"
          textAnchor="middle"
          fontFamily="Inter, Sora, sans-serif"
          fontSize="10"
          fontWeight="700"
          fill="#FFFFFF"
        >
          2
        </text>
      </motion.g>
    </svg>
  );
}
