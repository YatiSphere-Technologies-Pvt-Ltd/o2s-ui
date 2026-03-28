"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Table2,
  ChevronDown,
  ChevronRight,
  FileSignature,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CONTRACTS,
  STATUS_CONFIG,
  RISK_CONFIG,
  type Contract,
} from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function StatusBadge({ status }: { status: Contract["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.textClass}`}>
      <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}

function RiskDot({ level }: { level: string }) {
  const cfg = RISK_CONFIG[level];
  if (!cfg) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${cfg.dotClass}`} />
      <span className={`text-[10px] ${cfg.textClass}`}>{cfg.label}</span>
    </span>
  );
}

function ContractDetail({ contract }: { contract: Contract }) {
  return (
    <motion.tr {...fadeIn}>
      <td colSpan={9} className="bg-surface-raised px-6 py-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {contract.riskFlags.length > 0 && (
            <div className="md:col-span-3 border-l-[2px] border-destructive bg-destructive/5 rounded-r-lg p-3 space-y-2">
              <div className="flex items-center gap-1.5 text-destructive font-medium text-xs">
                <AlertTriangle className="size-3.5" />
                AI Risk Flags
              </div>
              {contract.riskFlags.map((flag, i) => (
                <div key={i} className="ml-5">
                  <span className="font-medium text-foreground">{flag.clause}</span>
                  <span className="text-muted-foreground"> — {flag.description}</span>
                  <span className="block text-brand text-[10px] mt-0.5">Suggestion: {flag.suggestion}</span>
                </div>
              ))}
            </div>
          )}
          {contract.financialTerms && (
            <div>
              <span className="text-muted-foreground">Financial Terms</span>
              <p className="font-medium text-foreground mt-0.5">{contract.financialTerms}</p>
            </div>
          )}
          <div>
            <span className="text-muted-foreground">Jurisdiction</span>
            <p className="font-medium text-foreground mt-0.5">{contract.jurisdiction}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Governing Law</span>
            <p className="font-medium text-foreground mt-0.5">{contract.governingLaw}</p>
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

function TableViewComponent() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground text-xs">
            <th className="px-4 py-3 text-left font-medium">ID</th>
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Party</th>
            <th className="px-4 py-3 text-left font-medium">Entity</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Signatures</th>
            <th className="px-4 py-3 text-left font-medium">Effective</th>
            <th className="px-4 py-3 text-left font-medium">Risk</th>
          </tr>
        </thead>
        <tbody>
          {CONTRACTS.map((c) => (
            <React.Fragment key={c.id}>
              <tr
                className={`border-b border-border cursor-pointer transition-colors hover:bg-surface-overlay ${
                  c.riskLevel === "high" ? "border-l-2 border-l-destructive" : ""
                }`}
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
              >
                <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground">{c.id}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-1.5">
                    {expanded === c.id ? <ChevronDown className="size-3 text-muted-foreground" /> : <ChevronRight className="size-3 text-muted-foreground" />}
                    {c.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.typeLabel}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-foreground">{c.partyB.name}</span>
                    <span className="inline-flex rounded-full bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">{c.partyB.type}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.partyA.entity}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.signatureProgress} {c.signatures.some(s => s.status === "pending") ? "⏳" : ""}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{c.effectiveDate ?? "—"}</td>
                <td className="px-4 py-3"><RiskDot level={c.riskLevel} /></td>
              </tr>
              {expanded === c.id && <ContractDetail contract={c} />}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardViewComponent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {CONTRACTS.map((c) => {
        const hasRiskFlags = c.riskFlags.length > 0;
        return (
          <motion.div
            key={c.id}
            {...fadeIn}
            className={`bg-card border border-border rounded-xl p-5 space-y-3 ${
              hasRiskFlags ? "border-l-[2px] border-l-destructive" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <RiskDot level={c.riskLevel} />
            </div>

            {/* Title & Type */}
            <div>
              <h3 className="font-semibold text-sm text-foreground">{c.title}</h3>
              <span className="text-xs text-muted-foreground">{c.typeLabel} / {c.category}</span>
            </div>

            {/* Parties */}
            <div className="text-xs">
              <span className="text-muted-foreground">Party B: </span>
              <span className="text-foreground">{c.partyB.name}</span>
              <span className="ml-1.5 inline-flex rounded-full bg-secondary px-1.5 py-0.5 text-[9px] text-muted-foreground">{c.partyB.type}</span>
            </div>

            {/* Jurisdiction */}
            <div className="text-xs text-muted-foreground">{c.jurisdiction}</div>

            {/* Signatures */}
            <div className="text-xs text-muted-foreground">
              Signatures: {c.signatureProgress}
              {c.signatures.map((s, i) => (
                <span key={i} className="ml-2">
                  {s.status === "signed" ? "✓" : "⏳"} {s.name}
                </span>
              ))}
            </div>

            {/* Risk flags */}
            {hasRiskFlags && (
              <div className="border-l-[2px] border-destructive bg-destructive/5 rounded-r-lg p-2 space-y-1">
                {c.riskFlags.map((flag, i) => (
                  <div key={i} className="text-[10px]">
                    <span className="text-destructive font-medium">{flag.clause}</span>
                    <span className="text-muted-foreground"> — {flag.description}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Financial */}
            {c.financialTerms && (
              <div className="text-xs">
                <span className="text-muted-foreground">Financial: </span>
                <span className="font-medium text-foreground">{c.financialTerms}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="xs">View Details</Button>
              <Button variant="outline" size="xs">
                <FileSignature className="size-3" />
                Send for Signature
              </Button>
              <Button variant="ghost" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function AllContractsTab() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="size-3.5" />
            Table
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
              viewMode === "cards" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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
            <TableViewComponent />
          </motion.div>
        ) : (
          <motion.div key="cards" {...fadeIn}>
            <CardViewComponent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
