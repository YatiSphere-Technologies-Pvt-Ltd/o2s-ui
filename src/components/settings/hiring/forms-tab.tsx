"use client";

import { motion } from "framer-motion";
import { Plus, Pencil, Eye, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APPLICATION_FORMS } from "@/components/settings/hiring/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function FormsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Customize application forms for different roles. Control which fields candidates see and
          which are required.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Form
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {APPLICATION_FORMS.map((form, i) => (
          <motion.div
            key={form.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{form.name}</span>
              {form.isDefault && (
                <span className="bg-warning/10 text-warning text-[10px] font-medium rounded px-1.5 py-0.5">
                  DEFAULT
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {form.fieldCount} fields &middot; {form.usedByJobs} jobs &middot; Edited{" "}
              {form.lastEdited}
            </p>

            <div className="flex flex-wrap gap-1 mt-3">
              {form.fields.map((field) => (
                <span
                  key={field}
                  className="text-[10px] bg-secondary text-muted-foreground rounded px-1.5 py-0.5"
                >
                  {field}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border">
              <Button variant="ghost" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button variant="ghost" size="xs">
                <Eye className="size-3" />
                Preview
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
