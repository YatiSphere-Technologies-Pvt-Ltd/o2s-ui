"use client";

import { motion } from "framer-motion";
import { ACTIVITY_LOG, activityDotColor } from "@/components/candidates/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export function ActivityTab() {
  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Vertical line */}
      <div className="absolute left-[7px] top-2 bottom-2 border-l-2 border-border" />

      <div className="space-y-0">
        {ACTIVITY_LOG.map((event) => (
          <motion.div
            key={event.id}
            variants={itemVariants}
            className="relative flex gap-4 pb-5"
          >
            {/* Dot */}
            <div
              className={`relative z-10 mt-0.5 size-4 rounded-full shrink-0 ${activityDotColor(event.type)} ring-2 ring-background`}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm">{event.icon}</span>
                <span className="text-sm font-semibold">{event.title}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {event.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {event.date} · {event.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
