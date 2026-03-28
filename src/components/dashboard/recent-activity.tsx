"use client";

import { motion } from "framer-motion";
import { Bot, UserCircle } from "lucide-react";

const recentActivity = [
  {
    type: "human" as const,
    actor: "Sarah Kim",
    action: "moved",
    target: "John Doe",
    detail: "to Final Round for Product Designer",
    time: "2h ago",
  },
  {
    type: "human" as const,
    actor: "You",
    action: "posted",
    target: "Senior Data Engineer",
    detail: "to 3 job boards",
    time: "4h ago",
  },
  {
    type: "human" as const,
    actor: "Alex Rivera",
    action: "submitted scorecard for",
    target: "Lisa Park",
    detail: "\u2605\u2605\u2605\u2605\u2606",
    time: "5h ago",
  },
  {
    type: "human" as const,
    actor: "You",
    action: "approved offer for",
    target: "Marcus Johnson",
    detail: "($145K)",
    time: "Yesterday",
  },
  {
    type: "system" as const,
    actor: "System",
    action: "auto-archived",
    target: "23 stale applications",
    detail: "older than 30 days",
    time: "Yesterday",
  },
  {
    type: "human" as const,
    actor: "You",
    action: "updated",
    target: "VP Engineering",
    detail: "job description",
    time: "2 days ago",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

export function RecentActivity() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Section Header */}
      <h2 className="text-base font-semibold text-foreground mb-4">
        Recent Activity
      </h2>

      {/* Activity List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recentActivity.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`flex items-center gap-3 py-3 ${
              index < recentActivity.length - 1
                ? "border-b border-border"
                : ""
            }`}
          >
            {/* Icon */}
            <div className="shrink-0">
              {item.type === "system" ? (
                <Bot className="w-6 h-6 text-brand-purple" />
              ) : (
                <UserCircle className="w-6 h-6 text-brand-purple" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 text-sm">
              <span className="text-foreground font-medium">
                {item.actor}
              </span>{" "}
              <span className="text-muted-foreground">{item.action}</span>{" "}
              <span className="text-brand cursor-pointer hover:underline">
                {item.target}
              </span>{" "}
              <span className="text-muted-foreground">{item.detail}</span>
            </div>

            {/* Timestamp */}
            <span className="shrink-0 text-xs text-muted-foreground ml-auto">
              {item.time}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Link */}
      <div className="pt-3">
        <button className="text-brand text-sm font-medium hover:underline cursor-pointer">
          View all &rarr;
        </button>
      </div>
    </div>
  );
}
