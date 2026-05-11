"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Filter as FilterIcon,
  Lock,
  Plus,
  Search,
  ShieldAlert,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  type DsarScope,
  type DsarStatus,
} from "@/components/leave/data";

const STATUS_LABEL: Record<DsarStatus, string> = {
  new: "New",
  in_progress: "In progress",
  awaiting_legal: "Awaiting legal",
  completed: "Completed",
  rejected: "Rejected",
};

const STATUS_META: Record<DsarStatus, { tint: string; color: string }> = {
  new:            { tint: "bg-brand/10",          color: "text-brand" },
  in_progress:    { tint: "bg-warning/10",        color: "text-warning" },
  awaiting_legal: { tint: "bg-destructive/10",    color: "text-destructive" },
  completed:      { tint: "bg-success/10",        color: "text-success" },
  rejected:       { tint: "bg-secondary",         color: "text-muted-foreground" },
};

const SCOPE_LABEL: Record<DsarScope, string> = {
  access: "Access",
  deletion: "Deletion",
  portability: "Portability",
};

export default function DsarListPage() {
  const { setScreen } = useScreen();
  const { dsars } = useLeaveStore();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<DsarStatus | "all">("all");
  const [scope, setScope] = useState<DsarScope | "all">("all");

  useEffect(() => {
    setScreen({ module: "Leave", page: "DSAR" });
    return () => setScreen(null);
  }, [setScreen]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dsars
      .filter((d) => (status === "all" ? true : d.status === status))
      .filter((d) => (scope === "all" ? true : d.scope === scope))
      .filter((d) => {
        if (!q) return true;
        return (`${d.subjectName} ${d.id} ${d.reason}`).toLowerCase().includes(q);
      })
      .sort((a, b) => (a.dueDateISO < b.dueDateISO ? -1 : 1));
  }, [dsars, query, status, scope]);

  const counts = useMemo(() => {
    const c: Record<DsarStatus, number> = { new: 0, in_progress: 0, awaiting_legal: 0, completed: 0, rejected: 0 };
    for (const d of dsars) c[d.status]++;
    return c;
  }, [dsars]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/hr"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Data subject requests</h1>
            <p className="text-sm text-muted-foreground">
              Access · deletion · portability. Legal holds override deletion until cleared.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />
          New DSAR
        </button>
      </motion.div>

      {/* Status pill row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {(["new", "in_progress", "awaiting_legal", "completed", "rejected"] as DsarStatus[]).map((s) => {
          const m = STATUS_META[s];
          return (
            <button
              key={s}
              onClick={() => setStatus((cur) => (cur === s ? "all" : s))}
              className={`text-left p-3 rounded-lg border transition-colors ${
                status === s ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
              }`}
            >
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                <span className={`inline-flex items-center gap-1.5 ${m.color}`}>
                  <span className={`size-1.5 rounded-full bg-current`} />
                  {STATUS_LABEL[s]}
                </span>
              </p>
              <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{counts[s]}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subject, id, reason…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as DsarScope | "all")}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All scopes</option>
            <option value="access">Access</option>
            <option value="deletion">Deletion</option>
            <option value="portability">Portability</option>
          </select>
        </div>
      </div>

      {/* Rows */}
      <ul className="space-y-2">
        {rows.map((d) => {
          const m = STATUS_META[d.status];
          const overdue = new Date(d.dueDateISO) < new Date();
          return (
            <li key={d.id}>
              <Link
                href={`/leave/hr/dsar/${d.id}`}
                className="block bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`size-9 rounded-full ${d.subjectAvatar} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>
                    {d.subjectInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${m.tint} ${m.color}`}>
                        {STATUS_LABEL[d.status]}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{SCOPE_LABEL[d.scope]}</span>
                      <span className="text-[10px] text-muted-foreground">· {d.country}</span>
                      <code className="text-[10px] font-mono text-muted-foreground/80">{d.id}</code>
                      {d.legalHold && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-destructive">
                          <Lock className="size-2.5" />
                          Legal hold
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">{d.subjectName}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{d.reason}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                      Submitted {new Date(d.submittedOn).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      {" · "}
                      <span className={overdue && d.status !== "completed" && d.status !== "rejected" ? "text-destructive" : ""}>
                        Due {new Date(d.dueDateISO).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      {d.assigneeName && ` · Assigned to ${d.assigneeName}`}
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
                </div>
              </Link>
            </li>
          );
        })}
        {rows.length === 0 && (
          <li className="text-sm text-muted-foreground italic text-center py-12">No DSARs match these filters.</li>
        )}
      </ul>

      <div className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-2">
        <ShieldAlert className="size-3 mt-0.5" />
        <span>
          GDPR / DPDP / CCPA jurisdictional rules drive default deadlines (typically 30 days). Legal hold pauses deletion clocks but
          access/portability requests still progress.
        </span>
      </div>
    </div>
  );
}
