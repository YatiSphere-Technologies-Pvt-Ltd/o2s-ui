"use client";

import { motion } from "framer-motion";
import { Bell, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACK_SUMMARIES,
  OVERDUE_EMPLOYEES,
  ackRateColor,
  ackBarColor,
} from "@/components/legal/policies/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const sortedOverdue = [...OVERDUE_EMPLOYEES].sort(
  (a, b) => b.daysOverdue - a.daysOverdue
);

export function AcknowledgmentsTab() {
  return (
    <motion.div {...fadeIn} className="space-y-8">
      {/* A) By Policy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Acknowledgment by Policy
        </h3>
        <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
          {ACK_SUMMARIES.map((s) => {
            const isLow = s.rate < 60;
            return (
              <div
                key={s.policyId}
                className={`px-5 py-4 space-y-2 ${
                  isLow ? "bg-destructive/5" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {s.policyTitle}
                    </span>
                    <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
                      v{s.version}
                    </span>
                    {isLow && (
                      <span className="text-[10px] bg-destructive/10 text-destructive rounded-full px-2 py-0.5 font-medium">
                        Low Rate
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${ackRateColor(s.rate)}`}
                  >
                    {s.rate}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-secondary">
                    <div
                      className={`h-1.5 rounded-full ${ackBarColor(s.rate)}`}
                      style={{ width: `${s.rate}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span>
                    <span className="text-success font-medium">
                      {s.acknowledged}
                    </span>{" "}
                    acknowledged
                  </span>
                  <span>
                    <span className="text-warning font-medium">
                      {s.pending}
                    </span>{" "}
                    pending
                  </span>
                  {s.overdue > 0 && (
                    <span>
                      <span className="text-destructive font-medium">
                        {s.overdue}
                      </span>{" "}
                      overdue
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* B) Overdue Employees */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-foreground">
            Overdue Employees
          </h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="xs">
              <Download className="size-3" />
              Export CSV
            </Button>
            <Button
              size="xs"
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              <Bell className="size-3" />
              Send Bulk Reminder
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Department
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Entity
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Policies Overdue
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                    Days Overdue
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedOverdue.map((emp) => (
                  <tr
                    key={emp.name}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {emp.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-xs">{emp.entity}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {emp.policiesOverdue.map((pol) => (
                          <span
                            key={pol}
                            className="text-[10px] bg-destructive/10 text-destructive rounded-full px-2 py-0.5"
                          >
                            {pol}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-destructive font-semibold">
                        {emp.daysOverdue}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
