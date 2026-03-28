"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import {
  AI_INSIGHTS,
  insightDotClass,
  insightBgClass,
  type Insight,
} from "@/components/analytics/data";

function InsightRow({ insight }: { insight: Insight }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" as const }}
      className={`flex items-start gap-3 rounded-lg border p-3 ${insightBgClass(insight.priority)}`}
    >
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${insightDotClass(insight.priority)}`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{insight.detail}</p>
      </div>
      <button className="shrink-0 text-xs text-brand-purple hover:underline whitespace-nowrap">
        View Details
      </button>
    </motion.div>
  );
}

export function AIInsightsBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple rounded-lg overflow-hidden">
      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <Sparkles className="h-4 w-4 text-brand-purple shrink-0" />
        <span className="text-sm font-medium text-foreground flex-1">
          {AI_INSIGHTS.length} AI insights available
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" as const }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {AI_INSIGHTS.map((insight) => (
                <InsightRow key={insight.id} insight={insight} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
