"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import { LeaveDonut } from "@/components/leave/leave-donut";
import { HistoryTable } from "@/components/leave/history-table";

export default function LeaveHistoryPage() {
  const { setScreen } = useScreen();
  const { requests } = useLeaveStore();

  useEffect(() => {
    setScreen({ module: "Leave", page: "My Leaves · History" });
    return () => setScreen(null);
  }, [setScreen]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    for (const r of requests) set.add(new Date(r.startDate).getFullYear());
    return Array.from(set).sort((a, b) => b - a);
  }, [requests]);

  const [year, setYear] = useState<number>(availableYears[0] ?? new Date().getFullYear());

  const inYear = useMemo(
    () => requests.filter((r) => new Date(r.startDate).getFullYear() === year),
    [requests, year],
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/leave"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">My leaves</h1>
            <p className="text-sm text-muted-foreground">
              Every request you&apos;ve made. Filter, edit pending, or withdraw approved.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
            type="button"
          >
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Donut */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05 }}
      >
        <LeaveDonut requests={requests} year={year} />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.1 }}
      >
        <HistoryTable requests={inYear} year={year} />
      </motion.div>
    </div>
  );
}
