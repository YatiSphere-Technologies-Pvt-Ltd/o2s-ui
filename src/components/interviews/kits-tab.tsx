"use client";

import { motion } from "framer-motion";
import { Plus, Clock, HelpCircle, BarChart3, Calendar, Copy, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERVIEW_KITS } from "@/components/interviews/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function KitsTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {INTERVIEW_KITS.length} interview kits
        </p>
        <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" size="sm">
          <Plus className="size-3.5" />
          New Kit
        </Button>
      </div>

      {/* Kit cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {INTERVIEW_KITS.map((kit, i) => (
          <motion.div
            key={kit.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={i}
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{kit.icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{kit.name}</p>
                <p className="text-xs text-muted-foreground">{kit.type}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {kit.duration}
              </span>
              <span className="flex items-center gap-1">
                <HelpCircle className="size-3" />
                {kit.questionCount} questions
              </span>
              <span className="flex items-center gap-1">
                <BarChart3 className="size-3" />
                Used {kit.usedCount}x
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {kit.lastUpdated}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
              <button className="text-xs font-medium text-brand hover:underline">
                Use This Kit
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Pencil className="size-3" />
                Edit
              </button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Copy className="size-3" />
                Duplicate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
