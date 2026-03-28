"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Insight {
  text: string;
  suggestions: string[];
  cta: string;
}

const mockInsights: Insight[] = [
  {
    text: "Your technical interview stage has a **38% drop-off rate** — 2.1x higher than industry benchmark.",
    suggestions: ["Reducing from 4 rounds to 3", "Adding a take-home option"],
    cta: "View Full Analysis",
  },
  {
    text: "3 candidates in your pipeline have **competing offers expiring this week**.",
    suggestions: ["Marcus Johnson (Mar 27)", "Lisa Park (Mar 28)", "David Kim (Mar 30)"],
    cta: "View Priority Queue",
  },
  {
    text: "Based on current pipeline velocity, the **VP Engineering** role will likely take **45 more days** to fill.",
    suggestions: ["Activate executive sourcing agent", "Consider retained search firms"],
    cta: "Adjust Strategy",
  },
];

function renderInsightText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-foreground font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

const insightVariants = {
  enter: { opacity: 0, y: 12 },
  center: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" as const } },
};

export function AIInsightCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextInsight = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % mockInsights.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextInsight, 10000);
    return () => clearInterval(interval);
  }, [nextInsight]);

  const insight = mockInsights[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Gradient top bar */}
      <div className="h-0.75 bg-linear-to-r from-brand-purple via-brand to-brand-teal rounded-t-xl" />

      {/* Card body */}
      <div className="bg-card border border-border border-t-0 rounded-b-xl p-5 ai-insight-glow">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span className="text-sm font-semibold text-foreground">
            AI Insight
          </span>
          {/* Pagination dots */}
          <div className="flex items-center gap-1 ml-auto">
            {mockInsights.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? "bg-brand-purple" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Insight content with transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={insightVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Body text */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {renderInsightText(insight.text)}
            </p>

            {/* Suggestions */}
            <div className="flex flex-col gap-1 mb-4">
              {insight.suggestions.map((suggestion, i) => (
                <p key={i} className="text-sm text-muted-foreground ml-4">
                  <span className="mr-1">&rarr;</span>
                  {suggestion}
                </p>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="text-brand text-sm font-medium hover:underline transition-colors">
                {insight.cta}
              </button>
              <button
                onClick={nextInsight}
                className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
