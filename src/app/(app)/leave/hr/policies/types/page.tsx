"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Archive,
  Check,
  Copy,
  Filter as FilterIcon,
  Layers,
  PencilLine,
  RotateCcw,
  Search,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  LEAVE_TYPE_MAP,
  LEAVE_TYPES,
  POLICY_COHORTS,
  type LeaveTypeKey,
  type PolicyRule,
} from "@/components/leave/data";

export default function LeaveTypesLibraryPage() {
  const { setScreen } = useScreen();
  const { policies, archivePolicy, unarchivePolicy, clonePolicy } = useLeaveStore();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<LeaveTypeKey | "all">("all");
  const [archivedFilter, setArchivedFilter] = useState<"active" | "archived" | "all">("active");
  const [cloning, setCloning] = useState<PolicyRule | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Leave Types Library" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = policies.filter((p) => {
      const t = LEAVE_TYPE_MAP[p.leaveTypeKey];
      const cohort = POLICY_COHORTS.find((c) => c.id === p.cohortId);
      if (typeFilter !== "all" && p.leaveTypeKey !== typeFilter) return false;
      if (archivedFilter === "active" && p.archived) return false;
      if (archivedFilter === "archived" && !p.archived) return false;
      if (q) {
        const hay = `${t.label} ${p.nameOverride ?? ""} ${cohort?.name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const byType: Record<string, PolicyRule[]> = {};
    for (const p of filtered) {
      const key = p.leaveTypeKey;
      if (!byType[key]) byType[key] = [];
      byType[key].push(p);
    }
    return byType;
  }, [policies, query, typeFilter, archivedFilter]);

  const counts = useMemo(() => {
    const all = policies.length;
    const active = policies.filter((p) => !p.archived).length;
    const archived = policies.filter((p) => p.archived).length;
    return { all, active, archived };
  }, [policies]);

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
            href="/leave/hr/policies"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Leave types library</h1>
            <p className="text-sm text-muted-foreground">
              Every leave-type definition across cohorts. Clone to start a new cohort, archive to retire.
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <Layers className="size-3" />
            {counts.active} active · {counts.archived} archived
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2"
          >
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search type, cohort, name…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as LeaveTypeKey | "all")}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All types</option>
            {LEAVE_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          <select
            value={archivedFilter}
            onChange={(e) => setArchivedFilter(e.target.value as typeof archivedFilter)}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>

      {/* Grouped list */}
      <div className="space-y-4">
        {LEAVE_TYPES.map((lt) => {
          const list = groups[lt.key];
          if (!list || list.length === 0) return null;
          return (
            <section key={lt.key} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <span className={`inline-flex items-center justify-center size-7 rounded-md text-[10px] font-bold ${lt.tint} ${lt.color}`}>
                  {lt.shortLabel}
                </span>
                <div className="flex-1">
                  <h2 className="text-sm font-semibold text-foreground">{lt.label}</h2>
                  <p className="text-[10px] text-muted-foreground/70">
                    {list.length} cohort{list.length === 1 ? "" : "s"} use this type
                  </p>
                </div>
              </div>
              <ul>
                {list.map((p) => {
                  const cohort = POLICY_COHORTS.find((c) => c.id === p.cohortId);
                  return (
                    <li
                      key={p.id}
                      className="border-b border-border last:border-b-0 px-4 py-3 flex items-center gap-3 hover:bg-surface-overlay/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-foreground">{cohort?.name ?? p.cohortId}</p>
                          <code className="text-[10px] font-mono text-muted-foreground/60">{p.id}</code>
                          {p.archived && (
                            <span className="text-[9px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                              Archived
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">v{p.version}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {p.daysPerYear} days/yr · carryover {p.carryoverMaxDays || "0"} · {p.encashable ? "encashable" : "non-encashable"} · effective {p.effectiveFromISO}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="size-3" />
                        {(cohort?.userCount ?? 0).toLocaleString("en-IN")}
                      </span>
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/leave/hr/policies?cohort=${p.cohortId}`}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="Edit"
                          title="Open in builder"
                        >
                          <PencilLine className="size-3.5" />
                        </Link>
                        <button
                          onClick={() => setCloning(p)}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="Clone"
                          title="Clone to another cohort"
                        >
                          <Copy className="size-3.5" />
                        </button>
                        {p.archived ? (
                          <button
                            onClick={() => {
                              unarchivePolicy(p.id);
                              flashOnce(`Restored ${cohort?.name ?? p.cohortId}.`);
                            }}
                            className="p-1.5 rounded text-muted-foreground hover:text-success hover:bg-surface-overlay transition-colors"
                            aria-label="Restore"
                            title="Restore"
                          >
                            <RotateCcw className="size-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              archivePolicy(p.id);
                              flashOnce(`Archived ${cohort?.name ?? p.cohortId}.`);
                            }}
                            className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-surface-overlay transition-colors"
                            aria-label="Archive"
                            title="Archive"
                          >
                            <Archive className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {Object.keys(groups).length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-12">
            No leave types match these filters.
          </p>
        )}
      </div>

      {/* Clone modal */}
      <AnimatePresence>
        {cloning && (
          <CloneModal
            source={cloning}
            onClose={() => setCloning(null)}
            onClone={(targetCohortId) => {
              const c = clonePolicy(cloning.id, targetCohortId);
              setCloning(null);
              if (c) {
                const target = POLICY_COHORTS.find((x) => x.id === targetCohortId);
                flashOnce(`Cloned to ${target?.name ?? targetCohortId}.`);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CloneModal({
  source,
  onClose,
  onClone,
}: {
  source: PolicyRule;
  onClose: () => void;
  onClone: (targetCohortId: string) => void;
}) {
  const sourceCohort = POLICY_COHORTS.find((c) => c.id === source.cohortId);
  const otherCohorts = POLICY_COHORTS.filter((c) => c.id !== source.cohortId);
  const [target, setTarget] = useState<string>(otherCohorts[0]?.id ?? "");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md min-w-80"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Clone policy</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <p className="text-sm text-foreground">
            Clone <strong>{LEAVE_TYPE_MAP[source.leaveTypeKey].label}</strong> from{" "}
            <strong>{sourceCohort?.name}</strong> to another cohort. All rules carry over; you can edit after.
          </p>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Target cohort</span>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {otherCohorts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onClone(target)}
            disabled={!target}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Copy className="size-3.5" />
            Clone
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
