"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Table2,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Bell,
  Eye,
  Sparkles,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FILINGS,
  FILING_STATUS_CONFIG,
  type ComplianceFiling,
  type FilingStatus,
} from "@/components/legal/compliance/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const STATUS_ORDER: Record<FilingStatus, number> = {
  overdue: 0,
  due_soon: 1,
  in_progress: 2,
  upcoming: 3,
  filed: 4,
  acknowledged: 5,
  not_applicable: 6,
};

function sortedFilings(filings: ComplianceFiling[]) {
  return [...filings].sort(
    (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
  );
}

function DueDateLabel({ filing }: { filing: ComplianceFiling }) {
  if (filing.status === "filed" || filing.status === "acknowledged") {
    return (
      <span className="text-muted-foreground/60 text-xs">{filing.dueDate}</span>
    );
  }
  if (filing.status === "overdue") {
    return (
      <div>
        <span className="text-xs">{filing.dueDate}</span>
        <span className="text-[10px] text-destructive ml-1.5 font-medium">
          {Math.abs(filing.daysLateOrRemaining)}d late
        </span>
      </div>
    );
  }
  if (filing.status === "due_soon") {
    return (
      <div>
        <span className="text-xs">{filing.dueDate}</span>
        <span className="text-[10px] text-warning ml-1.5 font-medium">
          {filing.daysLateOrRemaining}d left
        </span>
      </div>
    );
  }
  return (
    <div>
      <span className="text-xs">{filing.dueDate}</span>
      <span className="text-[10px] text-muted-foreground ml-1.5">
        {filing.daysLateOrRemaining}d left
      </span>
    </div>
  );
}

function StatusDot({ status }: { status: FilingStatus }) {
  const cfg = FILING_STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`size-2 rounded-full ${cfg.dotClass}`} />
      <span className={`text-xs ${cfg.textClass}`}>{cfg.label}</span>
    </span>
  );
}

function FilingDetail({ filing }: { filing: ComplianceFiling }) {
  return (
    <motion.tr {...fadeIn}>
      <td
        colSpan={8}
        className="bg-surface-raised px-6 py-4 border-b border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2">
            <div className="text-muted-foreground">Authority</div>
            <div className="font-medium">{filing.authority}</div>
            <div className="text-muted-foreground">Period</div>
            <div className="font-medium">
              {filing.periodStart} — {filing.periodEnd}
            </div>
            <div className="text-muted-foreground">Frequency</div>
            <div className="font-medium">{filing.frequency}</div>
          </div>
          <div className="space-y-2">
            {filing.penaltyOnLate && (
              <>
                <div className="text-muted-foreground">Penalty on Late</div>
                <div className="text-destructive font-medium">
                  {filing.penaltyDescription}
                </div>
                {filing.penaltyAmount && (
                  <>
                    <div className="text-muted-foreground">Penalty Amount</div>
                    <div className="text-destructive font-medium">
                      {filing.penaltyCurrency} {filing.penaltyAmount.toLocaleString()}
                    </div>
                  </>
                )}
              </>
            )}
            {filing.filedDate && (
              <>
                <div className="text-muted-foreground">Filed Date</div>
                <div className="font-medium">{filing.filedDate}</div>
              </>
            )}
            {filing.acknowledgedRef && (
              <>
                <div className="text-muted-foreground">Reference</div>
                <div className="font-mono text-[11px]">{filing.acknowledgedRef}</div>
              </>
            )}
          </div>
          {filing.aiNote && (
            <div className="bg-destructive/5 border-l-[2px] border-destructive rounded-r-lg p-3">
              <div className="flex items-center gap-1.5 text-destructive font-medium text-xs mb-1">
                <Sparkles className="size-3" />
                AI Note
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {filing.aiNote}
              </p>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
}

function FilingCard({ filing }: { filing: ComplianceFiling }) {
  const cfg = FILING_STATUS_CONFIG[filing.status];
  return (
    <div
      className={`bg-card border border-border rounded-xl p-4 space-y-3 ${
        filing.status === "overdue"
          ? "bg-destructive/5 border-l-[3px] border-l-destructive"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.textClass}`}
        >
          <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
          {cfg.label}
        </span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {filing.id}
        </span>
      </div>
      <div>
        <div className="font-medium text-sm">{filing.filingName}</div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {filing.entityName}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Jurisdiction</span>
          <div>{filing.jurisdiction}</div>
        </div>
        <div>
          <span className="text-muted-foreground">Due</span>
          <DueDateLabel filing={filing} />
        </div>
        <div>
          <span className="text-muted-foreground">Assignee</span>
          <div>{filing.assignedTo}</div>
        </div>
        {filing.penaltyOnLate && filing.penaltyDescription && (
          <div>
            <span className="text-muted-foreground">Penalty</span>
            <div className="text-destructive text-[11px]">
              {filing.penaltyDescription}
            </div>
          </div>
        )}
      </div>
      {filing.aiNote && (
        <div className="bg-destructive/5 border-l-[2px] border-destructive rounded-r-lg p-2 text-[11px]">
          <div className="flex items-center gap-1 text-destructive font-medium mb-0.5">
            <Sparkles className="size-3" />
            AI Note
          </div>
          <p className="text-muted-foreground">{filing.aiNote}</p>
        </div>
      )}
    </div>
  );
}

export function FilingsTab() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const sorted = sortedFilings(FILINGS);

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {FILINGS.length} filings
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "cards"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "table" ? (
          <motion.div
            key="table"
            {...fadeIn}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground w-8" />
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Filing Name
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Entity
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Jurisdiction
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((f) => {
                    const isExpanded = expandedId === f.id;
                    const isOverdue = f.status === "overdue";
                    const isDueSoon = f.status === "due_soon";
                    const isFiled =
                      f.status === "filed" || f.status === "acknowledged";

                    return (
                      <AnimatePresence key={f.id}>
                        <tr
                          className={`border-b border-border cursor-pointer hover:bg-secondary/50 transition-colors ${
                            isOverdue
                              ? "bg-destructive/5 border-l-[3px] border-l-destructive"
                              : isDueSoon
                                ? "bg-warning/5"
                                : isFiled
                                  ? "text-muted-foreground/60"
                                  : ""
                          }`}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : f.id)
                          }
                        >
                          <td className="px-4 py-3">
                            {isExpanded ? (
                              <ChevronDown className="size-3.5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="size-3.5 text-muted-foreground" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <StatusDot status={f.status} />
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-foreground">
                              {f.filingName}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {f.id}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {f.entityName.length > 20
                              ? f.entityName.split(" ").slice(0, 3).join(" ")
                              : f.entityName}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {f.jurisdiction}
                          </td>
                          <td className="px-4 py-3">
                            <DueDateLabel filing={f} />
                          </td>
                          <td className="px-4 py-3 text-xs">{f.assignedTo}</td>
                          <td className="px-4 py-3">
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {!isFiled && (
                                <Button variant="ghost" size="icon-xs">
                                  <CheckCircle2 className="size-3 text-success" />
                                </Button>
                              )}
                              {!isFiled && (
                                <Button variant="ghost" size="icon-xs">
                                  <Bell className="size-3 text-warning" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon-xs">
                                <Eye className="size-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && <FilingDetail filing={f} />}
                      </AnimatePresence>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cards"
            {...fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {sorted.map((f) => (
              <FilingCard key={f.id} filing={f} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
