"use client";

import { motion } from "framer-motion";
import { FileText, Pencil, Copy, Archive, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES, type ContractTemplate } from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function TemplateStatusBadge({ status }: { status: ContractTemplate["status"] }) {
  const classes: Record<ContractTemplate["status"], string> = {
    active: "bg-success/10 text-success",
    draft: "bg-secondary text-muted-foreground",
    deprecated: "bg-warning/10 text-warning",
  };
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${classes[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function TemplatesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-destructive text-white hover:bg-destructive/90" size="sm">
          <Plus className="size-3.5" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {TEMPLATES.map((t, i) => (
          <motion.div
            key={t.id}
            {...fadeIn}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const, delay: i * 0.03 }}
            className="bg-card border border-border rounded-xl p-5 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-muted-foreground" />
                <span className="font-semibold text-sm text-foreground">{t.name}</span>
              </div>
              <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{t.typeLabel}</span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span>v{t.version}</span>
              <span>{t.variables} variables</span>
              <span>{t.usageCount} uses</span>
            </div>

            {/* Entities */}
            <div className="flex flex-wrap gap-1">
              {t.entities.map((e) => (
                <span key={e} className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{e}</span>
              ))}
            </div>

            {/* Jurisdictions */}
            <div className="flex flex-wrap gap-1">
              {t.jurisdictions.map((j) => (
                <span key={j} className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{j}</span>
              ))}
            </div>

            {/* Status + dates */}
            <div className="flex items-center justify-between">
              <TemplateStatusBadge status={t.status} />
              <div className="text-[10px] text-muted-foreground space-x-3">
                <span>Last used: {t.lastUsed}</span>
                <span>Created: {t.createdAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button variant="outline" size="xs">
                <Copy className="size-3" />
                Duplicate
              </Button>
              <Button variant="ghost" size="xs">
                <Archive className="size-3" />
                Deprecate
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
