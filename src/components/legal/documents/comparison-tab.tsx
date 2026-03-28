"use client";

import { motion } from "framer-motion";
import {
  Upload,
  FileSearch,
  ArrowRight,
  FileDown,
  Minus,
  Plus,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPARISONS } from "@/components/legal/documents/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const } },
};

function similarityColor(pct: number): string {
  if (pct >= 80) return "bg-success";
  if (pct >= 60) return "bg-warning";
  return "bg-destructive";
}

function similarityTextColor(pct: number): string {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-warning";
  return "text-destructive";
}

function riskDeltaColor(delta: string): string {
  if (delta.includes("High") || delta.includes("+4") || delta.includes("+3"))
    return "text-destructive bg-destructive/10";
  if (delta.includes("Medium") || delta.includes("+2"))
    return "text-warning bg-warning/10";
  return "text-success bg-success/10";
}

export function ComparisonTab() {
  return (
    <div className="space-y-6">
      {/* Compare Documents Section */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Compare Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          {/* Doc A */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 hover:border-muted-foreground/40 transition-colors cursor-pointer">
            <Upload className="size-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-foreground">
              Document A
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Drop file or click to upload
            </span>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="size-5 text-muted-foreground hidden md:block" />
          </div>

          {/* Doc B */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 hover:border-muted-foreground/40 transition-colors cursor-pointer">
            <Upload className="size-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-foreground">
              Document B
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              Drop file or click to upload
            </span>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            className="bg-destructive text-white hover:bg-destructive/90"
            size="sm"
          >
            <FileSearch className="size-3.5" />
            Compare Documents
          </Button>
        </div>
      </div>

      {/* Previous Comparisons */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Previous Comparisons
        </h2>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {COMPARISONS.map((cmp) => (
            <motion.div
              key={cmp.id}
              variants={fadeInUp}
              className="bg-card border border-border rounded-xl p-5 space-y-4"
            >
              {/* Name & Date */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">
                  {cmp.name}
                </h3>
                <span className="text-[10px] text-muted-foreground">
                  {cmp.createdAt}
                </span>
              </div>

              {/* Files */}
              <div className="text-xs text-muted-foreground">
                <span>{cmp.docA}</span>
                <span className="mx-2">vs</span>
                <span>{cmp.docB}</span>
              </div>

              {/* Similarity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Similarity
                  </span>
                  <span
                    className={`text-xs font-medium ${similarityTextColor(cmp.similarity)}`}
                  >
                    {cmp.similarity}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className={`h-full rounded-full ${similarityColor(cmp.similarity)}`}
                    style={{ width: `${cmp.similarity}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Pencil className="size-3" />
                  {cmp.modified} modified
                </span>
                <span className="inline-flex items-center gap-1 text-success">
                  <Plus className="size-3" />
                  {cmp.added} added
                </span>
                <span className="inline-flex items-center gap-1 text-destructive">
                  <Minus className="size-3" />
                  {cmp.removed} removed
                </span>
              </div>

              {/* Risk Delta */}
              <div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${riskDeltaColor(cmp.riskDelta)}`}
                >
                  Risk: {cmp.riskDelta}
                </span>
              </div>

              {/* AI Summary */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  AI Summary
                </span>
                <ul className="space-y-0.5">
                  {cmp.aiSummary.map((item, i) => (
                    <li
                      key={i}
                      className="text-xs text-foreground flex items-start gap-1.5"
                    >
                      <span className="text-muted-foreground mt-1">
                        &bull;
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="xs">
                  View Full Comparison
                </Button>
                <Button variant="ghost" size="xs">
                  <FileDown className="size-3" />
                  Export Redline
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
