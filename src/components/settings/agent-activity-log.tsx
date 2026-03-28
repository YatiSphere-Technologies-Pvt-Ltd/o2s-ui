"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACTIVITY_LOG,
  TOTAL_ACTIONS_MTD,
  confidenceColor,
  confidenceDotClass,
  logStatusConfig,
} from "@/components/settings/ai-data";

export function ActivityLog() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Agent Activity Log
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Agent
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Action
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Confidence
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {ACTIVITY_LOG.map((entry) => {
                const statusCfg = logStatusConfig(entry.status);
                const isError = entry.status === "error";
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors cursor-pointer ${
                      isError ? "border-l-2 border-l-destructive" : ""
                    }`}
                  >
                    {/* Agent */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center justify-center size-6 rounded-full text-[10px] font-bold text-white ${entry.agentColorClass}`}
                      >
                        {entry.agentAbbr}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {entry.timestamp}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">
                        {entry.action}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {entry.detail}
                      </div>
                    </td>

                    {/* Confidence */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {entry.confidence !== null ? (
                        <span
                          className={`flex items-center gap-1.5 text-sm font-medium ${confidenceColor(entry.confidence)}`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${confidenceDotClass(entry.confidence)} inline-block`}
                          />
                          {entry.confidence}%
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          &mdash;
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`flex items-center gap-1 text-xs font-medium ${statusCfg.colorClass}`}
                      >
                        <span>{statusCfg.icon}</span>
                        {statusCfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-4 py-2.5 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1-{ACTIVITY_LOG.length} of{" "}
            {TOTAL_ACTIONS_MTD.toLocaleString()} actions
          </p>
        </div>
      </div>
    </div>
  );
}
