"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Pencil, Undo2 } from "lucide-react";
import {
  LEAVE_TYPES,
  LEAVE_TYPE_MAP,
  type LeaveRequest,
  type LeaveTypeKey,
  type RequestStatus,
} from "@/components/leave/data";
import { StatusPill } from "@/components/leave/status-pill";
import { RequestDetailExpand } from "@/components/leave/request-detail-expand";

type Tab = "all" | "pending" | "approved" | "rejected" | "cancelled";

const TAB_LABEL: Record<Tab, string> = {
  all: "All",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
};

const TAB_MATCHES: Record<Tab, (s: RequestStatus) => boolean> = {
  all: () => true,
  pending: (s) => s === "pending" || s === "draft",
  approved: (s) => s === "approved" || s === "taken",
  rejected: (s) => s === "rejected",
  cancelled: (s) => s === "cancelled",
};

function fmtRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (start === end) {
    return s.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-IN", { day: "numeric" })}–${e.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  }
  return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
}

function fmtShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export interface HistoryTableProps {
  requests: LeaveRequest[];
  year: number;
}

export function HistoryTable({ requests, year }: HistoryTableProps) {
  const [tab, setTab] = useState<Tab>("all");
  const [typeFilter, setTypeFilter] = useState<LeaveTypeKey | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Counts per tab respect the year + type filters but not the tab itself
  const filteredByYearAndType = useMemo(
    () =>
      requests.filter((r) => {
        if (new Date(r.startDate).getFullYear() !== year) return false;
        if (typeFilter !== "all" && r.type !== typeFilter) return false;
        return true;
      }),
    [requests, year, typeFilter],
  );

  const counts: Record<Tab, number> = useMemo(() => {
    const c: Record<Tab, number> = { all: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    for (const r of filteredByYearAndType) {
      c.all++;
      (Object.keys(TAB_MATCHES) as Tab[]).forEach((t) => {
        if (t !== "all" && TAB_MATCHES[t](r.status)) c[t]++;
      });
    }
    return c;
  }, [filteredByYearAndType]);

  const rows = useMemo(
    () =>
      filteredByYearAndType
        .filter((r) => TAB_MATCHES[tab](r.status))
        .sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [filteredByYearAndType, tab],
  );

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center border-b border-border overflow-x-auto scrollbar-thin">
        {(Object.keys(TAB_LABEL) as Tab[]).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_LABEL[t]}
              <span
                className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] tabular-nums ${
                  active ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
                }`}
              >
                {counts[t]}
              </span>
              {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
            </button>
          );
        })}

        <div className="ml-auto px-4 py-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LeaveTypeKey | "all")}
            className="h-8 px-2 rounded-md border border-input bg-transparent text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All types</option>
            {LEAVE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-180">
          <thead>
            <tr className="border-b border-border bg-surface-overlay/30">
              <Th className="w-[36%]">Date range</Th>
              <Th className="w-[8%]">Days</Th>
              <Th className="w-[16%]">Type</Th>
              <Th className="w-[14%]">Status</Th>
              <Th className="w-[14%]">Approver</Th>
              <Th className="w-[12%]">Applied on</Th>
              <Th className="w-12 text-right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  No requests match these filters.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const type = LEAVE_TYPE_MAP[r.type];
                const isExpanded = expandedId === r.id;
                const canEdit = r.status === "pending" || r.status === "draft";
                const canWithdraw = r.status === "approved";
                return (
                  <ExpandableRow
                    key={r.id}
                    expanded={isExpanded}
                    onToggle={() => setExpandedId(isExpanded ? null : r.id)}
                    detail={<RequestDetailExpand request={r} />}
                  >
                    <td className="py-3 px-4 text-xs text-foreground">{fmtRange(r.startDate, r.endDate)}</td>
                    <td className="py-3 px-4 text-xs text-foreground tabular-nums">{r.days}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] ${type.tint}`}>
                        <span className={`text-[9px] font-bold ${type.color}`}>{type.shortLabel}</span>
                        <span className="text-foreground">{type.label}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="py-3 px-4">
                      {r.approverName ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-5 rounded-full bg-brand-purple text-white text-[9px] font-bold flex items-center justify-center">
                            {r.approverInitials}
                          </span>
                          <span className="text-xs text-foreground">{r.approverName}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{fmtShort(r.submittedOn)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-0.5">
                        {canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                            aria-label="Edit"
                            title="Edit"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        )}
                        {canWithdraw && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-1.5 rounded text-muted-foreground hover:text-warning hover:bg-warning/10 transition-colors"
                            aria-label="Withdraw"
                            title="Withdraw"
                          >
                            <Undo2 className="size-3.5" />
                          </button>
                        )}
                        <ChevronDown
                          className={`size-4 text-muted-foreground/60 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        />
                      </div>
                    </td>
                  </ExpandableRow>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold py-2 px-4 ${className ?? ""}`}>
      {children}
    </th>
  );
}

function ExpandableRow({
  expanded,
  onToggle,
  detail,
  children,
}: {
  expanded: boolean;
  onToggle: () => void;
  detail: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-border last:border-0 cursor-pointer transition-colors ${
          expanded ? "bg-surface-overlay/40" : "hover:bg-surface-overlay/40"
        }`}
      >
        {children}
      </tr>
      <AnimatePresence>
        {expanded && (
          <tr>
            <td colSpan={7} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="overflow-hidden"
              >
                {detail}
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
}
