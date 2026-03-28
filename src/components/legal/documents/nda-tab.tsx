"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Table2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NDAS,
  NDA_STATUS_CONFIG,
  NDA_RISK_CONFIG,
  type NDA,
  type NDAStatus,
} from "@/components/legal/documents/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const NDA_METRICS = [
  { label: "Active NDAs", value: "47" },
  { label: "Pending Signature", value: "5" },
  { label: "Expiring 90d", value: "8" },
  { label: "This Month", value: "12" },
];

function NDAStatusBadge({ status }: { status: NDAStatus }) {
  const cfg = NDA_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.textClass}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const cfg = NDA_RISK_CONFIG[level];
  if (!cfg) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.colorClass}`}
    >
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
            <th className="px-4 py-3 text-left font-medium">NDA #</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Counterparty</th>
            <th className="px-4 py-3 text-left font-medium">Purpose</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Expiry</th>
            <th className="px-4 py-3 text-left font-medium">Risk</th>
            <th className="px-4 py-3 text-left font-medium">Signature</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {NDAS.map((nda) => {
            const needsBorder =
              nda.status === "under_negotiation" ||
              nda.riskLevel === "review_needed";
            return (
              <tr
                key={nda.id}
                className={`border-b border-border transition-colors hover:bg-surface-overlay ${
                  needsBorder ? "border-l-[2px] border-l-warning" : ""
                }`}
              >
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">
                  {nda.ndaNumber}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {nda.typeLabel}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {nda.counterparty}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px]">
                  <span className="line-clamp-1">{nda.purpose}</span>
                </td>
                <td className="px-4 py-3">
                  <NDAStatusBadge status={nda.status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {nda.expiryDate}
                </td>
                <td className="px-4 py-3">
                  <RiskBadge level={nda.riskLevel} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {nda.signatureStatus}
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
      {NDAS.map((nda) => {
        const needsBorder =
          nda.status === "under_negotiation" ||
          nda.riskLevel === "review_needed";
        return (
          <motion.div
            key={nda.id}
            {...fadeIn}
            className={`bg-card border border-border rounded-xl p-5 space-y-3 ${
              needsBorder ? "border-l-[2px] border-l-warning" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {nda.ndaNumber}
                </span>
                <NDAStatusBadge status={nda.status} />
              </div>
              <RiskBadge level={nda.riskLevel} />
            </div>

            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {nda.counterparty}
              </h3>
              <span className="text-xs text-muted-foreground">
                {nda.typeLabel} &middot; {nda.counterpartyContact}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">{nda.purpose}</p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Duration: </span>
                <span className="text-foreground">{nda.duration}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Governing Law: </span>
                <span className="text-foreground">{nda.governingLaw}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Effective: </span>
                <span className="text-foreground">{nda.effectiveDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Expiry: </span>
                <span className="text-foreground">{nda.expiryDate}</span>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Signature: {nda.signatureStatus}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="xs">
                View Details
              </Button>
              <Button variant="ghost" size="xs">
                <MoreHorizontal className="size-3" />
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function NDATab() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="space-y-4">
      {/* Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {NDA_METRICS.map((m) => (
          <div
            key={m.label}
            className="bg-card border border-border rounded-xl px-4 py-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.label}
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* View Toggle */}
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
