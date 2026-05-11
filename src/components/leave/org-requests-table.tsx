"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  Check,
  ExternalLink,
  MoreVertical,
  UserCog,
} from "lucide-react";
import {
  HR_COUNTRIES,
  LEAVE_TYPE_MAP,
  type OrgRequest,
} from "@/components/leave/data";
import { StatusPill } from "@/components/leave/status-pill";

interface Props {
  rows: OrgRequest[];
  onForceApprove: (r: OrgRequest) => void;
  onForceCancel: (r: OrgRequest) => void;
  onReassign: (r: OrgRequest) => void;
}

function fmtRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (start === end) return s.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-IN", { day: "numeric" })}–${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  }
  return `${s.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
}

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

export function OrgRequestsTable({ rows, onForceApprove, onForceCancel, onReassign }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[920px]">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <Th>Employee</Th>
              <Th>Country</Th>
              <Th>Team</Th>
              <Th>Type</Th>
              <Th>Dates</Th>
              <Th align="right">Days</Th>
              <Th>Status</Th>
              <Th>Approver</Th>
              <Th>Submitted</Th>
              <Th className="w-10 text-right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-sm text-muted-foreground">
                  No requests match these filters.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const type = LEAVE_TYPE_MAP[r.type];
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-overlay/30 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-7 rounded-full ${r.employeeAvatar} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                          {r.employeeInitials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{r.employeeName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{r.employeeTitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                        <span className="text-base leading-none">{flagFor(r.country)}</span>
                        {r.country}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-foreground">{r.subTeam}</td>
                    <td className="py-2.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded ${type.tint}`}>
                        <span className={`text-[9px] font-bold ${type.color}`}>{type.shortLabel}</span>
                        <span className="text-[11px] text-foreground">{type.label}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-foreground tabular-nums whitespace-nowrap">
                      {fmtRange(r.startDate, r.endDate)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{r.days}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <StatusPill status={r.status} />
                        {r.status === "pending" && r.overSlaBy && r.overSlaBy > 0 && (
                          <span className="text-[10px] text-destructive">+{r.overSlaBy}d over SLA</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-5 rounded-full bg-brand-purple text-white text-[9px] font-bold flex items-center justify-center">
                          {r.approverInitials}
                        </span>
                        <span className="text-xs text-foreground">{r.approverName}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="py-2.5 px-4 text-right relative">
                      <div className="inline-flex items-center gap-0.5">
                        <Link
                          href={`/leave/manager/${r.id}`}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="Open request"
                          title="Open request"
                        >
                          <ExternalLink className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => setOpenMenuId((p) => (p === r.id ? null : r.id))}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="Intervene"
                          title="Intervene"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>
                      </div>
                      <AnimatePresence>
                        {openMenuId === r.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.12 }}
                            className="absolute right-3 top-9 z-20 w-44 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                            onMouseLeave={() => setOpenMenuId(null)}
                          >
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onForceApprove(r);
                              }}
                              disabled={r.status === "approved" || r.status === "taken"}
                              className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Check className="size-3 text-success" />
                              Force approve
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onForceCancel(r);
                              }}
                              disabled={r.status === "cancelled"}
                              className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Ban className="size-3 text-muted-foreground" />
                              Force cancel
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onReassign(r);
                              }}
                              disabled={r.status === "approved" || r.status === "taken" || r.status === "cancelled" || r.status === "rejected"}
                              className="w-full text-left px-3 py-2 text-[11px] text-foreground hover:bg-surface-overlay flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed border-t border-border"
                            >
                              <UserCog className="size-3 text-brand" />
                              Reassign approver…
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className, align }: { children: React.ReactNode; className?: string; align?: "right" }) {
  return (
    <th
      className={`text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold py-2 px-4 whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      } ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
