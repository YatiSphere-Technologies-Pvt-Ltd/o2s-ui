"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Plus,
  Pencil,
  Pause,
  CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SAVED_REPORTS, SCHEDULED_REPORTS } from "@/components/analytics/data";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/* ── Saved Report Card ── */

function SavedReportCard({ report }: { report: (typeof SAVED_REPORTS)[number] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
          <FileText className="h-4 w-4 text-brand" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{report.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{report.desc}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Saved {report.saved}
        </span>
        <Button variant="outline" size="xs">
          Open
        </Button>
      </div>
    </motion.div>
  );
}

/* ── Scheduled Report Card ── */

function ScheduledReportCard({ report }: { report: (typeof SCHEDULED_REPORTS)[number] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-card border border-border rounded-lg p-4"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
          <CalendarClock className="h-4 w-4 text-brand-teal" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{report.name}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
            <span>To: {report.recipients}</span>
            <span>{report.frequency}</span>
            <span>Last sent: {report.lastSent}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 justify-end">
        <Button variant="ghost" size="xs">
          <Pencil className="h-3 w-3" />
          Edit
        </Button>
        <Button variant="ghost" size="xs">
          <Pause className="h-3 w-3" />
          Pause
        </Button>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function CustomReports() {
  return (
    <div className="space-y-8">
      {/* My Reports */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-4">My Reports</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {SAVED_REPORTS.map((report) => (
            <SavedReportCard key={report.id} report={report} />
          ))}
        </motion.div>
        <div className="mt-4">
          <Button variant="ghost" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Create Custom Report
          </Button>
        </div>
      </section>

      {/* Scheduled Reports */}
      <section>
        <h2 className="text-sm font-semibold text-foreground mb-4">Scheduled Reports</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {SCHEDULED_REPORTS.map((report) => (
            <ScheduledReportCard key={report.id} report={report} />
          ))}
        </motion.div>
        <div className="mt-4">
          <Button variant="ghost" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Schedule New Report
          </Button>
        </div>
      </section>
    </div>
  );
}
