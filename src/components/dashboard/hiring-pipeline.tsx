"use client";

import { motion } from "framer-motion";

const mockPipeline = [
  { stage: "Applied", count: 312, percentage: 100 },
  { stage: "Screened", count: 186, percentage: 59.6 },
  { stage: "Interview", count: 89, percentage: 28.5 },
  { stage: "Final Round", count: 34, percentage: 10.9 },
  { stage: "Offer", count: 12, percentage: 3.8 },
  { stage: "Hired", count: 8, percentage: 2.6 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function HiringPipeline() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Hiring Pipeline
        </h2>
        <span className="text-xs text-muted-foreground font-medium bg-secondary px-2.5 py-1 rounded-md">
          This Month
        </span>
      </div>

      {/* Pipeline Bars */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {mockPipeline.map((item, index) => (
          <motion.div key={item.stage} variants={rowVariants}>
            {/* Label row */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground font-medium">
                  {item.stage}
                </span>
                <span className="text-sm font-bold text-foreground">
                  {item.count}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.percentage}%
              </span>
            </div>

            {/* Bar */}
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-linear-to-r from-brand to-brand-teal"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.percentage}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
