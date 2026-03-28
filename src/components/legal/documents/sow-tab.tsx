"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Table2,
  Sparkles,
  Pencil,
  Copy,
  FileDown,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SOWS,
  SOW_STATUS_CONFIG,
  ENGAGEMENT_TYPES,
  type SOW,
  type SOWStatus,
} from "@/components/legal/documents/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function StatusBadge({ status }: { status: SOWStatus }) {
  const cfg = SOW_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.textClass}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}

function TableView() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs">
            <th className="px-4 py-3 text-left font-medium">SOW #</th>
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Value</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Linked MSA</th>
            <th className="px-4 py-3 text-left font-medium">Duration</th>
            <th className="px-4 py-3 text-left font-medium">D / M / R</th>
            <th className="px-4 py-3 text-left font-medium">AI</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {SOWS.map((sow) => {
            const hasSuggestions =
              sow.status === "draft" && sow.aiSuggestions > 0;
            return (
              <tr
                key={sow.id}
                className={`border-b border-border transition-colors hover:bg-surface-overlay ${
                  hasSuggestions
                    ? "border-l-[2px] border-l-brand-purple"
                    : ""
                }`}
              >
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                  {sow.sowNumber}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground text-sm">
                    {sow.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sow.client}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {ENGAGEMENT_TYPES[sow.engagementType] ??
                      sow.engagementType}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground">
                  {sow.totalValue}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={sow.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {sow.linkedMSA ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {sow.duration}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {sow.deliverables} / {sow.milestones} / {sow.resources}
                </td>
                <td className="px-4 py-3">
                  {sow.aiSuggestions > 0 ? (
                    <span className="inline-flex items-center gap-1 text-destructive text-[10px] font-medium">
                      <Sparkles className="size-3" />
                      {sow.aiSuggestions}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[10px]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="icon-xs">
                    <MoreHorizontal className="size-3.5" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CardView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {SOWS.map((sow) => {
        const hasSuggestions = sow.status === "draft" && sow.aiSuggestions > 0;
        return (
          <motion.div
            key={sow.id}
            {...fadeIn}
            className={`bg-card border border-border rounded-xl p-5 space-y-3 ${
              hasSuggestions ? "border-l-[2px] border-l-brand-purple" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {sow.sowNumber}
                </span>
                <StatusBadge status={sow.status} />
              </div>
              {sow.aiSuggestions > 0 && (
                <span className="inline-flex items-center gap-1 text-destructive text-[10px] font-medium">
                  <Sparkles className="size-3" />
                  {sow.aiSuggestions} suggestions
                </span>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {sow.title}
              </h3>
              <span className="text-xs text-muted-foreground">
                {sow.client} &middot; {sow.clientContact}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Type: </span>
                <span className="text-foreground">
                  {ENGAGEMENT_TYPES[sow.engagementType] ?? sow.engagementType}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Value: </span>
                <span className="font-mono text-foreground">
                  {sow.totalValue}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <span className="text-foreground">{sow.duration}</span>
              </div>
              <div>
                <span className="text-muted-foreground">MSA: </span>
                <span className="text-foreground">
                  {sow.linkedMSA ?? "None"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Period: </span>
                <span className="text-foreground">
                  {sow.startDate} — {sow.endDate}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">D/M/R: </span>
                <span className="text-foreground">
                  {sow.deliverables}/{sow.milestones}/{sow.resources}
                </span>
              </div>
            </div>

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
                <FileDown className="size-3" />
                Export PDF
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function SOWTab() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              viewMode === "table"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="size-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              viewMode === "cards"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5" />
            Cards
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "table" ? (
          <motion.div key="table" {...fadeIn}>
            <TableView />
          </motion.div>
        ) : (
          <motion.div key="cards" {...fadeIn}>
            <CardView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
