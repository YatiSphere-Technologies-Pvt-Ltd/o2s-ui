"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  FileDown,
  Printer,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  ABSENCE_LAST_6_MONTHS,
  BRADFORD_LAST_12_MONTHS,
  DISTRIBUTION_BY_EMPLOYEE,
  DISTRIBUTION_BY_TYPE,
  TEAM_NOTICE_SAMPLES,
} from "@/components/leave/data";
import { AbsenteeismChart } from "@/components/leave/absenteeism-chart";
import { BradfordFactorTable } from "@/components/leave/bradford-table";
import { LeaveDistribution } from "@/components/leave/leave-distribution";
import { NoticeHistogram } from "@/components/leave/notice-histogram";

export default function ManagerReportsPage() {
  const { setScreen } = useScreen();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Manager Reports" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function exportCSV() {
    const filename = `manager-leave-report-${new Date().toISOString().slice(0, 10)}.csv`;
    flashOnce(`Generating ${filename}…`);
  }
  function exportPDF() {
    const filename = `manager-leave-report-${new Date().toISOString().slice(0, 10)}.pdf`;
    flashOnce(`Generating ${filename}…`);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/manager"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Manager reports</h1>
            <p className="text-sm text-muted-foreground">
              Absenteeism, Bradford Factor, advance-notice pattern, distribution across the team.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <FileDown className="size-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportPDF}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Printer className="size-3.5" />
            Export PDF
          </button>
        </div>
      </motion.div>

      {/* Absenteeism + Notice (side by side on lg) */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <AbsenteeismChart points={ABSENCE_LAST_6_MONTHS} />
        <NoticeHistogram samples={TEAM_NOTICE_SAMPLES} />
      </motion.div>

      {/* Bradford */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <BradfordFactorTable entries={BRADFORD_LAST_12_MONTHS} />
      </motion.div>

      {/* Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <LeaveDistribution byType={DISTRIBUTION_BY_TYPE} byEmployee={DISTRIBUTION_BY_EMPLOYEE} />
      </motion.div>

      {/* Caveat footer */}
      <p className="text-[11px] text-muted-foreground/60 text-center pt-4 border-t border-border">
        Manager view only. Sensitive metrics like Bradford Factor are guidance, not performance scores —
        use them to start conversations, not as a basis for decisions.
      </p>

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
