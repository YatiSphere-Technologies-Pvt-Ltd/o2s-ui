"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SCREENING_HISTORY,
  HISTORY_STATUS_CONFIG,
  scoreColor,
  scoreBgColor,
} from "@/components/cv-screening/data";

/** Score-based badge colors for history items (recommendation is a display string) */
function historyRecBg(score: number): string {
  if (score >= 90) return "bg-success/10";
  if (score >= 75) return "bg-brand-teal/10";
  if (score >= 60) return "bg-brand/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-destructive/10";
}

/* ── Component ── */

export function HistoryTab() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-overlay/50 text-xs text-muted-foreground">
              <th className="text-left py-3 px-4 font-medium">Candidate</th>
              <th className="text-left py-3 px-3 font-medium">Screened Against</th>
              <th className="text-left py-3 px-3 font-medium">Score</th>
              <th className="text-left py-3 px-3 font-medium">Recommendation</th>
              <th className="text-left py-3 px-3 font-medium hidden lg:table-cell">Screened By</th>
              <th className="text-left py-3 px-3 font-medium">Status</th>
              <th className="text-left py-3 px-3 font-medium hidden md:table-cell">Action Taken</th>
              <th className="text-right py-3 px-4 font-medium" />
            </tr>
          </thead>
          <tbody>
            {SCREENING_HISTORY.map((item, i) => {
              const statusCfg = HISTORY_STATUS_CONFIG[item.status];
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.15,
                    delay: i * 0.04,
                    ease: [0.4, 0, 0.2, 1] as const,
                  }}
                  className="border-b border-border/50 hover:bg-surface-overlay transition-colors"
                >
                  {/* Candidate */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 text-[11px] font-bold text-brand-purple">
                        {item.candidateInitials}
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {item.candidateName}
                      </span>
                    </div>
                  </td>

                  {/* Requisition */}
                  <td className="py-3 px-3">
                    <div className="text-sm text-foreground whitespace-nowrap">{item.requisition}</div>
                    <div className="text-[11px] text-muted-foreground">{item.requisitionId}</div>
                  </td>

                  {/* Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${scoreColor(item.overallScore)}`}>
                        {item.overallScore}
                      </span>
                      <div className="h-1.5 w-12 rounded-full bg-border">
                        <div
                          className={`h-1.5 rounded-full ${scoreBgColor(item.overallScore)}`}
                          style={{ width: `${item.overallScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Recommendation */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${historyRecBg(item.overallScore)} ${scoreColor(item.overallScore)}`}
                    >
                      {item.recommendation}
                    </span>
                  </td>

                  {/* Screened By */}
                  <td className="py-3 px-3 text-sm text-muted-foreground hidden lg:table-cell whitespace-nowrap">
                    {item.screenedBy}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {statusCfg && (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <span className={`size-2 rounded-full ${statusCfg.dotClass}`} />
                        <span className={`text-xs font-medium ${statusCfg.textClass}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Action Taken */}
                  <td className="py-3 px-3 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap">
                    {item.action ?? "—"}
                  </td>

                  {/* View */}
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="icon-xs">
                      <Eye className="size-3.5" />
                    </Button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
