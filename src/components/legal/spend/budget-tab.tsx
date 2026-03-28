"use client";

import { motion } from "framer-motion";
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BUDGET_CATEGORIES,
  BUDGET_TOTALS,
  ACCRUALS,
} from "@/components/legal/spend/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

export function BudgetTab() {
  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Summary Header */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          FY2026 Legal Budget Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Total Budget
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              {BUDGET_TOTALS.totalBudget}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Actual YTD
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              {BUDGET_TOTALS.totalActual}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Forecast
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              {BUDGET_TOTALS.totalForecast}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Variance
            </div>
            <div
              className={`font-mono font-bold text-lg ${
                BUDGET_TOTALS.variancePositive
                  ? "text-success"
                  : "text-destructive"
              }`}
            >
              {BUDGET_TOTALS.totalVariance}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Utilization
            </div>
            <div className="font-mono font-bold text-lg text-foreground">
              {BUDGET_TOTALS.utilization}%
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${BUDGET_TOTALS.utilization}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget Categories Table */}
      <div className="overflow-x-auto bg-card border border-border rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-2.5 font-medium">Category</th>
              <th className="px-4 py-2.5 font-medium text-right">Budget</th>
              <th className="px-4 py-2.5 font-medium text-right">Actual</th>
              <th className="px-4 py-2.5 font-medium text-right">Forecast</th>
              <th className="px-4 py-2.5 font-medium text-right">Variance</th>
            </tr>
          </thead>
          <tbody>
            {BUDGET_CATEGORIES.map((cat) => (
              <tr
                key={cat.category}
                className="border-b border-border hover:bg-secondary/40 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-foreground">
                  {cat.category}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground text-right">
                  {cat.budget}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground text-right">
                  {cat.actual}
                </td>
                <td className="px-4 py-3 font-mono text-sm text-foreground text-right">
                  {cat.forecast}
                </td>
                <td
                  className={`px-4 py-3 font-mono text-sm text-right ${
                    cat.variancePositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {cat.variance}
                </td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="border-t-2 border-border">
              <td className="px-4 py-3 text-sm font-bold text-foreground">
                Total
              </td>
              <td className="px-4 py-3 font-mono text-sm font-bold text-foreground text-right">
                {BUDGET_TOTALS.totalBudget}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-bold text-foreground text-right">
                {BUDGET_TOTALS.totalActual}
              </td>
              <td className="px-4 py-3 font-mono text-sm font-bold text-foreground text-right">
                {BUDGET_TOTALS.totalForecast}
              </td>
              <td
                className={`px-4 py-3 font-mono text-sm font-bold text-right ${
                  BUDGET_TOTALS.variancePositive
                    ? "text-success"
                    : "text-destructive"
                }`}
              >
                {BUDGET_TOTALS.totalVariance}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Accruals Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">
          Open Accruals
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ACCRUALS.map((accrual) => (
            <div
              key={`${accrual.firm}-${accrual.engagement}`}
              className="bg-card border border-border rounded-xl p-4 space-y-1.5"
            >
              <div className="text-sm font-medium text-foreground">
                {accrual.firm}
              </div>
              <div className="text-xs text-muted-foreground">
                {accrual.engagement}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-sm text-foreground">
                  {accrual.amount}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {accrual.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Download className="size-3.5 mr-1.5" />
          Export Budget Report
        </Button>
        <Button variant="ghost" size="sm">
          <FileSpreadsheet className="size-3.5 mr-1.5" />
          Export to Excel
        </Button>
      </div>
    </motion.div>
  );
}
