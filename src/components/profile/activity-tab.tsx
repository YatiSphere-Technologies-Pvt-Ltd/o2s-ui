"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  USER_ACTIVITY,
  ACTIVITY_TYPE_CONFIG,
  type ActivityItem,
} from "@/components/profile/data";

const FILTER_OPTIONS = ["All", "Hiring", "People", "Reviews", "Logins", "AI", "Settings"] as const;

const FILTER_MAP: Record<string, string | null> = {
  All: null,
  Hiring: "hiring",
  People: "people",
  Reviews: "review",
  Logins: "login",
  AI: "ai",
  Settings: "settings",
};

export function ActivityTab() {
  const [filter, setFilter] = useState<string>("All");

  const filtered: ActivityItem[] =
    filter === "All"
      ? USER_ACTIVITY
      : USER_ACTIVITY.filter((a) => a.type === FILTER_MAP[filter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
      className="space-y-4"
    >
      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
              filter === opt
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {filtered.map((item, index) => {
          const config = ACTIVITY_TYPE_CONFIG[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1] as const,
              }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {/* Vertical line */}
              {index < filtered.length - 1 && (
                <div className="absolute left-[15px] top-8 bottom-0 border-l-2 border-border" />
              )}

              {/* Icon */}
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-overlay text-sm ${config.colorClass}`}
              >
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.action}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    {item.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activity found for this filter.
          </p>
        )}
      </div>
    </motion.div>
  );
}
