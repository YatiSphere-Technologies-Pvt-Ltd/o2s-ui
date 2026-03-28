"use client";

import { motion } from "framer-motion";
import { Plus, Pencil, Copy, MoreHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PIPELINE_TEMPLATES } from "@/components/settings/hiring/data";
import type { PipelineTemplate } from "@/components/settings/hiring/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function StageVisualization({ stages }: { stages: PipelineTemplate["stages"] }) {
  const maxVisible = 6;
  const visible = stages.length > maxVisible ? stages.slice(0, 5) : stages;
  const remaining = stages.length > maxVisible ? stages.length - 5 : 0;

  return (
    <div className="flex items-start gap-0 mt-3 overflow-x-auto">
      {visible.map((stage, idx) => (
        <div key={stage.name} className="flex items-start">
          <div className="flex flex-col items-center min-w-[48px]">
            <div className={`size-2 rounded-full ${stage.colorClass} shrink-0`} />
            <span className="text-[10px] text-muted-foreground mt-1 text-center leading-tight">
              {stage.name}
            </span>
          </div>
          {idx < visible.length - 1 && (
            <div className="h-px w-4 border-t border-border mt-1 shrink-0" />
          )}
          {idx === visible.length - 1 && remaining > 0 && (
            <>
              <div className="h-px w-4 border-t border-border mt-1 shrink-0" />
              <div className="flex flex-col items-center min-w-[48px]">
                <div className="size-2 rounded-full bg-secondary shrink-0" />
                <span className="text-[10px] text-muted-foreground mt-1">+{remaining} more</span>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export function PipelinesTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Define the stages candidates move through. Assign a pipeline to each job or use the
          default.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PIPELINE_TEMPLATES.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
              {tpl.isDefault && (
                <span className="bg-warning/10 text-warning text-[10px] font-medium rounded px-1.5 py-0.5">
                  DEFAULT
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {tpl.stageCount} stages &middot; {tpl.activeJobs} active jobs &middot; Edited{" "}
              {tpl.lastEdited}
            </p>

            <StageVisualization stages={tpl.stages} />

            {tpl.aiAutoAdvance && (
              <p className="text-xs text-brand-purple flex items-center gap-1.5 mt-3">
                <Sparkles className="size-3" />
                AI auto-advance: {tpl.aiAutoAdvance}
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border">
              <Button variant="ghost" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button variant="ghost" size="xs">
                <Copy className="size-3" />
                Duplicate
              </Button>
              <Button variant="ghost" size="icon-xs" className="ml-auto">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
