"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Check,
  Filter as FilterIcon,
  Plus,
  Timer,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  PEOPLE_MAP,
  PROJECTS_MAP,
  type TimeEntry,
  type TimeEntryKind,
} from "@/components/delivery/data";

const KIND_TINT: Record<TimeEntryKind, string> = {
  manual:      "bg-secondary text-foreground",
  timer:       "bg-brand/10 text-brand",
  calendar:    "bg-brand-purple/10 text-brand-purple",
  integration: "bg-brand-teal/10 text-brand-teal",
};

const STATUS_TINT: Record<TimeEntry["status"], string> = {
  draft:     "bg-secondary text-muted-foreground",
  submitted: "bg-warning/10 text-warning",
  approved:  "bg-success/10 text-success",
  rejected:  "bg-destructive/10 text-destructive",
};

export default function TimeTrackingPage() {
  const { setScreen } = useScreen();
  const { timeEntries, setTimeEntryStatus } = useDeliveryStore();
  const [statusFilter, setStatusFilter] = useState<TimeEntry["status"] | "all">("submitted");
  const [billableFilter, setBillableFilter] = useState<"all" | "billable" | "nonbillable">("all");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Time tracking" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    return timeEntries.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (billableFilter === "billable" && !t.billable) return false;
      if (billableFilter === "nonbillable" && t.billable) return false;
      return true;
    });
  }, [timeEntries, statusFilter, billableFilter]);

  const totals = useMemo(() => {
    const hours = filtered.reduce((s, t) => s + t.hours, 0);
    const billable = filtered.filter((t) => t.billable).reduce((s, t) => s + t.hours, 0);
    return { hours, billable };
  }, [filtered]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Time tracking</h1>
            <p className="text-sm text-muted-foreground">
              {timeEntries.length} entries · {totals.hours.toFixed(1)}h total · {totals.billable.toFixed(1)}h billable.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />
          Log time
        </button>
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterIcon className="size-3.5 text-muted-foreground" />
        <div className="flex items-center gap-1">
          {(["all", "draft", "submitted", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                statusFilter === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {(["all", "billable", "nonbillable"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBillableFilter(b)}
              className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                billableFilter === b ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {b === "all" ? "All" : b === "billable" ? "Billable" : "Non-billable"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2 font-semibold">Person</th>
              <th className="text-left px-3 py-2 font-semibold">Project</th>
              <th className="text-left px-3 py-2 font-semibold">Date</th>
              <th className="text-left px-3 py-2 font-semibold">Source</th>
              <th className="text-right px-3 py-2 font-semibold">Hours</th>
              <th className="text-center px-3 py-2 font-semibold">Billable</th>
              <th className="text-left px-3 py-2 font-semibold">Status</th>
              <th className="text-right px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const person = PEOPLE_MAP[t.personId];
              const project = PROJECTS_MAP[t.projectId];
              return (
                <tr key={t.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-2.5">
                    {person && (
                      <div className="flex items-center gap-2">
                        <span className={`size-6 rounded-full ${person.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>{person.initials}</span>
                        <p className="text-[12px] text-foreground">{person.name}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-foreground">{project?.shortName ?? "—"}</td>
                  <td className="px-3 py-2.5 text-[11px] text-muted-foreground tabular-nums inline-flex items-center gap-1"><Calendar className="size-3" />{t.dateISO}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${KIND_TINT[t.kind]}`}>
                      <Timer className="size-2.5" />
                      {t.kind}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-[12px] tabular-nums font-medium text-foreground">{t.hours}h</td>
                  <td className="px-3 py-2.5 text-center">
                    {t.billable ? <Check className="size-3.5 text-success inline" /> : <X className="size-3.5 text-muted-foreground/40 inline" />}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[t.status]}`}>{t.status}</span>
                    {t.note && <p className="text-[10px] text-muted-foreground/80 mt-1">{t.note}</p>}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {t.status === "submitted" && (
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setTimeEntryStatus(t.id, "approved")}
                          className="size-7 rounded-md flex items-center justify-center bg-success/10 text-success hover:bg-success/20 transition-colors"
                          aria-label="Approve"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setTimeEntryStatus(t.id, "rejected")}
                          className="size-7 rounded-md flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          aria-label="Reject"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground italic">No time entries match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
