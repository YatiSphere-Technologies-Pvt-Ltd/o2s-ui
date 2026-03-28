"use client";

import { motion } from "framer-motion";
import { Pencil, Copy, Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CLAUSES, RISK_CONFIG, type ContractClause } from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

export function ClausesTab() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-destructive text-white hover:bg-destructive/90" size="sm">
          <Plus className="size-3.5" />
          New Clause
        </Button>
      </div>

      <div className="space-y-3">
        {CLAUSES.map((clause, i) => {
          const risk = RISK_CONFIG[clause.riskLevel];
          return (
            <motion.div
              key={clause.id}
              {...fadeIn}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const, delay: i * 0.03 }}
              className="bg-card border border-border rounded-xl p-5 space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{clause.id}</span>
                  <span className="font-semibold text-sm text-foreground">{clause.title}</span>
                  <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{clause.category}</span>
                  {risk && (
                    <span className="inline-flex items-center gap-1">
                      <span className={`size-2 rounded-full ${risk.dotClass}`} />
                      <span className={`text-[10px] ${risk.textClass}`}>{risk.label}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {clause.isRequired && (
                    <span className="inline-flex rounded-full bg-brand/10 text-brand text-[10px] font-medium px-2 py-0.5">Required</span>
                  )}
                </div>
              </div>

              {/* Jurisdictions */}
              <div className="flex flex-wrap gap-1">
                {clause.jurisdictions.map((j) => (
                  <span key={j} className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{j}</span>
                ))}
              </div>

              {/* Usage */}
              <div className="text-xs text-muted-foreground">
                Used in: {clause.usedInContracts} contracts, {clause.usedInTemplates} templates
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground">{clause.description}</p>

              {/* Enforcement note */}
              {clause.enforcementNote && (
                <div className="border-l-[2px] border-warning bg-warning/5 rounded-r-lg p-2 text-xs text-foreground">
                  {clause.enforcementNote}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="xs">
                  <Eye className="size-3" />
                  View Variants
                </Button>
                <Button variant="outline" size="xs">
                  <Pencil className="size-3" />
                  Edit
                </Button>
                <Button variant="ghost" size="xs">
                  <Copy className="size-3" />
                  Duplicate
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
