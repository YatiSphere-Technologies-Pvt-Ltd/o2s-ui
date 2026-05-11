"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  ChevronRight,
  FileText,
  History,
  Library,
  Lock,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  LEAVE_TYPE_MAP,
  LEAVE_TYPES,
  POLICY_COHORTS,
  simulatePolicyChange,
  type AccrualCadence,
  type EntitlementModel,
  type LeaveTypeKey,
  type PolicyRule,
} from "@/components/leave/data";

const ENTITLEMENT_LABEL: Record<EntitlementModel, string> = {
  fixed: "Fixed",
  tenure_tiered: "Tenure-tiered",
  hours_worked: "Hours-worked",
};

const ACCRUAL_LABEL: Record<AccrualCadence, string> = {
  monthly_grant: "Monthly grant",
  annual_upfront: "Annual upfront",
  hours_based: "Hours-based",
};

export default function PolicyBuilderPage() {
  const { setScreen } = useScreen();
  const {
    policies,
    findPolicy,
    policyRevisions,
    savePolicy,
    rollbackPolicy,
    archivePolicy,
    unarchivePolicy,
  } = useLeaveStore();

  const [cohortId, setCohortId] = useState<string>("co-in-ft-all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [historyForId, setHistoryForId] = useState<string | null>(null);
  const [simulateForId, setSimulateForId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Policy Builder" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const cohort = POLICY_COHORTS.find((c) => c.id === cohortId);
  const rows = useMemo(
    () => policies.filter((p) => p.cohortId === cohortId && !p.archived),
    [policies, cohortId],
  );
  const archived = useMemo(
    () => policies.filter((p) => p.cohortId === cohortId && p.archived),
    [policies, cohortId],
  );

  const editing = editingId ? findPolicy(editingId) : null;
  const historyRule = historyForId ? findPolicy(historyForId) : null;
  const simRule = simulateForId ? findPolicy(simulateForId) : null;

  const availableLeaveTypes = LEAVE_TYPES.filter(
    (t) => !rows.some((r) => r.leaveTypeKey === t.key) && !archived.some((r) => r.leaveTypeKey === t.key),
  );

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
            href="/leave/hr"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Policy Builder</h1>
            <p className="text-sm text-muted-foreground">
              Edit leave entitlements per cohort. Changes are versioned, simulate-able, and rollback-able.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/leave/hr/policies/types"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Library className="size-3.5" />
            Types library
          </Link>
          <button
            onClick={() => setShowAdd(true)}
            disabled={availableLeaveTypes.length === 0}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus className="size-3.5" />
            Add type
          </button>
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

      {/* Cohort selector */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Cohort</p>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={cohortId}
                onChange={(e) => setCohortId(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {POLICY_COHORTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {cohort && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Users className="size-3" />
                  {cohort.userCount.toLocaleString("en-IN")} {cohort.userCount === 1 ? "user" : "users"}
                </span>
              )}
            </div>
          </div>
          {cohort && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Country · type</p>
              <p className="text-sm text-foreground">
                {cohort.country} · {cohort.employmentType.replace("_", "-")}
                {cohort.minLevel ? ` · ${cohort.minLevel}+` : ""}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leave types table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                <th className="text-left px-4 py-2.5 font-semibold">Type</th>
                <th className="text-right px-3 py-2.5 font-semibold">Days/yr</th>
                <th className="text-left px-3 py-2.5 font-semibold">Accrual</th>
                <th className="text-right px-3 py-2.5 font-semibold">Carryover</th>
                <th className="text-center px-3 py-2.5 font-semibold">Encashable</th>
                <th className="text-center px-3 py-2.5 font-semibold">Half-day</th>
                <th className="text-right px-3 py-2.5 font-semibold">v</th>
                <th className="text-right px-4 py-2.5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const t = LEAVE_TYPE_MAP[p.leaveTypeKey];
                return (
                  <tr
                    key={p.id}
                    onClick={() => setEditingId(p.id)}
                    className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center justify-center size-7 rounded-md text-[10px] font-bold ${t.tint} ${t.color}`}>
                          {t.shortLabel}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{p.nameOverride ?? t.label}</p>
                          <p className="text-[10px] text-muted-foreground/70">{ENTITLEMENT_LABEL[p.entitlementModel]}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-medium text-foreground">{p.daysPerYear}</td>
                    <td className="px-3 py-3 text-foreground">{ACCRUAL_LABEL[p.accrualCadence]}</td>
                    <td className="px-3 py-3 text-right tabular-nums text-foreground">
                      {p.carryoverMaxDays === 0 ? <span className="text-muted-foreground/60">—</span> : `${p.carryoverMaxDays}`}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {p.encashable ? (
                        <Check className="size-3.5 text-success inline" />
                      ) : (
                        <X className="size-3.5 text-muted-foreground/40 inline" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-center">
                      {p.halfDayAllowed ? (
                        <Check className="size-3.5 text-success inline" />
                      ) : (
                        <X className="size-3.5 text-muted-foreground/40 inline" />
                      )}
                    </td>
                    <td className="px-3 py-3 text-right text-[11px] text-muted-foreground tabular-nums">v{p.version}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistoryForId(p.id);
                          }}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="History"
                        >
                          <History className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(p.id);
                          }}
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                          aria-label="Edit"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            archivePolicy(p.id);
                            flashOnce(`Archived ${p.nameOverride ?? t.label}.`);
                          }}
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-surface-overlay transition-colors"
                          aria-label="Archive"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground italic">
                    No active policies for this cohort. Add the first leave type to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archived */}
      {archived.length > 0 && (
        <details className="bg-card border border-border rounded-xl">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-foreground flex items-center justify-between">
            <span className="inline-flex items-center gap-2">
              <Trash2 className="size-3.5 text-muted-foreground" />
              Archived ({archived.length})
            </span>
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </summary>
          <ul className="border-t border-border">
            {archived.map((p) => {
              const t = LEAVE_TYPE_MAP[p.leaveTypeKey];
              return (
                <li
                  key={p.id}
                  className="px-4 py-2.5 border-b border-border last:border-b-0 flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-muted-foreground">
                    {p.nameOverride ?? t.label}{" "}
                    <code className="text-[10px] font-mono text-muted-foreground/60">{p.id}</code>
                  </span>
                  <button
                    onClick={() => {
                      unarchivePolicy(p.id);
                      flashOnce(`Restored ${p.nameOverride ?? t.label}.`);
                    }}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-border bg-card text-[11px] text-foreground hover:bg-surface-overlay transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Restore
                  </button>
                </li>
              );
            })}
          </ul>
        </details>
      )}

      {/* Add policy modal */}
      <AnimatePresence>
        {showAdd && (
          <AddPolicyModal
            cohortId={cohortId}
            available={availableLeaveTypes}
            onClose={() => setShowAdd(false)}
            onCreate={(input) => {
              savePolicy(input, `Added ${LEAVE_TYPE_MAP[input.leaveTypeKey].label} to cohort.`);
              setShowAdd(false);
              setEditingId(input.id);
              flashOnce(`Added ${LEAVE_TYPE_MAP[input.leaveTypeKey].label}.`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Rule editor side panel */}
      <AnimatePresence>
        {editing && (
          <RuleEditorPanel
            rule={editing}
            onClose={() => setEditingId(null)}
            onSave={(next, summary) => {
              savePolicy(next, summary);
              setEditingId(null);
              flashOnce(`Saved v${(next.version ?? 0) + 1} of ${LEAVE_TYPE_MAP[next.leaveTypeKey].label}.`);
            }}
            onSimulate={() => {
              setSimulateForId(editing.id);
            }}
          />
        )}
      </AnimatePresence>

      {/* History drawer */}
      <AnimatePresence>
        {historyRule && (
          <HistoryDrawer
            rule={historyRule}
            revisions={policyRevisions.filter((r) => r.policyId === historyRule.id)}
            onClose={() => setHistoryForId(null)}
            onRollback={(version) => {
              rollbackPolicy(historyRule.id, version);
              setHistoryForId(null);
              flashOnce(`Rolled back ${LEAVE_TYPE_MAP[historyRule.leaveTypeKey].label} to v${version}.`);
            }}
          />
        )}
      </AnimatePresence>

      {/* Simulation modal */}
      <AnimatePresence>
        {simRule && (
          <SimulationModal
            rule={simRule}
            onClose={() => setSimulateForId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Add Policy modal                                              */
/* ────────────────────────────────────────────────────────────── */

function AddPolicyModal({
  cohortId,
  available,
  onClose,
  onCreate,
}: {
  cohortId: string;
  available: typeof LEAVE_TYPES;
  onClose: () => void;
  onCreate: (rule: PolicyRule) => void;
}) {
  const [key, setKey] = useState<LeaveTypeKey>(available[0]?.key ?? "privileged");
  const [days, setDays] = useState(12);

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
          <h3 className="text-base font-semibold text-foreground">Add leave type</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Type</span>
            <select
              value={key}
              onChange={(e) => setKey(e.target.value as LeaveTypeKey)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {available.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Days per year</span>
            <input
              type="number"
              min={0}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <p className="text-[11px] text-muted-foreground">
            You can edit accrual, carryover, and documentation rules after creating.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            Cancel
          </button>
          <button
            onClick={() => {
              const id = `pr-${cohortId}-${key}-${Date.now()}`;
              const rule: PolicyRule = {
                id,
                cohortId,
                leaveTypeKey: key,
                daysPerYear: days,
                entitlementModel: "fixed",
                accrualCadence: "monthly_grant",
                carryoverMaxDays: 0,
                encashable: false,
                halfDayAllowed: true,
                probationGated: false,
                eligibilityFilters: ["Active employee"],
                version: 0,
                effectiveFromISO: new Date().toISOString().slice(0, 10),
                archived: false,
              };
              onCreate(rule);
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Rule editor                                                    */
/* ────────────────────────────────────────────────────────────── */

function RuleEditorPanel({
  rule,
  onClose,
  onSave,
  onSimulate,
}: {
  rule: PolicyRule;
  onClose: () => void;
  onSave: (next: PolicyRule, summary: string) => void;
  onSimulate: () => void;
}) {
  const t = LEAVE_TYPE_MAP[rule.leaveTypeKey];
  const [draft, setDraft] = useState<PolicyRule>(rule);
  const [summary, setSummary] = useState("");

  function patch<K extends keyof PolicyRule>(key: K, value: PolicyRule[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function addTier() {
    const tiers = draft.tenureTiers ?? [];
    const last = tiers[tiers.length - 1];
    patch("tenureTiers", [
      ...tiers,
      { fromYears: (last?.fromYears ?? -1) + 1, daysPerYear: (last?.daysPerYear ?? 18) + 3 },
    ]);
  }

  function removeTier(index: number) {
    const next = (draft.tenureTiers ?? []).filter((_, i) => i !== index);
    patch("tenureTiers", next);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: 480 }}
        animate={{ x: 0 }}
        exit={{ x: 480 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-140 bg-card border-l border-border h-full flex flex-col"
      >
        <div className="flex items-start justify-between px-5 py-3 border-b border-border">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`inline-flex items-center justify-center size-9 rounded-md text-xs font-bold ${t.tint} ${t.color}`}>
              {t.shortLabel}
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate">
                {rule.nameOverride ?? t.label}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                v{rule.version} · effective {rule.effectiveFromISO}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
          {/* Entitlement */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Entitlement</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["fixed", "tenure_tiered", "hours_worked"] as EntitlementModel[]).map((m) => (
                <button
                  key={m}
                  onClick={() => patch("entitlementModel", m)}
                  className={`text-left p-2.5 rounded-lg border transition-colors ${
                    draft.entitlementModel === m ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{ENTITLEMENT_LABEL[m]}</p>
                </button>
              ))}
            </div>
            <label className="block mt-3">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Days per year</span>
              <input
                type="number"
                min={0}
                value={draft.daysPerYear}
                onChange={(e) => patch("daysPerYear", Number(e.target.value))}
                className="mt-1 w-full sm:max-w-40 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            {draft.entitlementModel === "tenure_tiered" && (
              <div className="mt-3 border border-border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-foreground">Tenure tiers</p>
                  <button
                    onClick={addTier}
                    className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-brand hover:bg-brand/10 transition-colors"
                  >
                    <Plus className="size-3" />
                    Add tier
                  </button>
                </div>
                <ul className="space-y-1.5">
                  {(draft.tenureTiers ?? []).map((tier, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground w-20">From year</span>
                      <input
                        type="number"
                        min={0}
                        value={tier.fromYears}
                        onChange={(e) =>
                          patch(
                            "tenureTiers",
                            (draft.tenureTiers ?? []).map((x, j) =>
                              j === i ? { ...x, fromYears: Number(e.target.value) } : x,
                            ),
                          )
                        }
                        className="w-16 h-8 px-2 rounded border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring"
                      />
                      <span className="text-[11px] text-muted-foreground">→</span>
                      <input
                        type="number"
                        min={0}
                        value={tier.daysPerYear}
                        onChange={(e) =>
                          patch(
                            "tenureTiers",
                            (draft.tenureTiers ?? []).map((x, j) =>
                              j === i ? { ...x, daysPerYear: Number(e.target.value) } : x,
                            ),
                          )
                        }
                        className="w-16 h-8 px-2 rounded border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring"
                      />
                      <span className="text-[11px] text-muted-foreground">days/yr</span>
                      <button
                        onClick={() => removeTier(i)}
                        className="ml-auto p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove tier"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {draft.entitlementModel === "hours_worked" && (
              <label className="block mt-3">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Hours per accrued day</span>
                <input
                  type="number"
                  min={1}
                  value={draft.hoursPerDay ?? 8}
                  onChange={(e) => patch("hoursPerDay", Number(e.target.value))}
                  className="mt-1 w-full sm:max-w-40 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
            )}
          </section>

          {/* Accrual cadence */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Accrual cadence</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(["monthly_grant", "annual_upfront", "hours_based"] as AccrualCadence[]).map((c) => (
                <button
                  key={c}
                  onClick={() => patch("accrualCadence", c)}
                  className={`text-left p-2.5 rounded-lg border transition-colors ${
                    draft.accrualCadence === c ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{ACCRUAL_LABEL[c]}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Carryover */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Carryover</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[11px] text-muted-foreground">Max days</span>
                <input
                  type="number"
                  min={0}
                  value={draft.carryoverMaxDays}
                  onChange={(e) => patch("carryoverMaxDays", Number(e.target.value))}
                  className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
              <label className="block">
                <span className="text-[11px] text-muted-foreground">Expiry (MM-DD)</span>
                <input
                  value={draft.carryoverExpiry ?? ""}
                  placeholder="03-31"
                  onChange={(e) => patch("carryoverExpiry", e.target.value || undefined)}
                  className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
            </div>
          </section>

          {/* Encashment + half-day */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Encashment &amp; half-day</p>
            <FieldToggle
              label="Encashable"
              description="Allow employees to convert unused days to cash at year end."
              value={draft.encashable}
              onChange={(v) => patch("encashable", v)}
            />
            {draft.encashable && (
              <label className="block ml-8">
                <span className="text-[11px] text-muted-foreground">Max encashable days/yr</span>
                <input
                  type="number"
                  min={0}
                  value={draft.encashableMaxPerYear ?? 0}
                  onChange={(e) => patch("encashableMaxPerYear", Number(e.target.value))}
                  className="mt-1 w-full sm:max-w-32 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
            )}
            <FieldToggle
              label="Half-day allowed"
              description="Employees can take 0.5-day units."
              value={draft.halfDayAllowed}
              onChange={(v) => patch("halfDayAllowed", v)}
            />
          </section>

          {/* Probation */}
          <section className="space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Probation</p>
            <FieldToggle
              label="Gate during probation"
              description="Locks this leave type until the probation period clears."
              value={draft.probationGated}
              onChange={(v) => patch("probationGated", v)}
            />
            {draft.probationGated && (
              <label className="block ml-8">
                <span className="text-[11px] text-muted-foreground">Probation duration (months)</span>
                <input
                  type="number"
                  min={1}
                  value={draft.probationMonths ?? 3}
                  onChange={(e) => patch("probationMonths", Number(e.target.value))}
                  className="mt-1 w-full sm:max-w-32 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
              </label>
            )}
          </section>

          {/* Documentation */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Documentation thresholds</p>
              <button
                onClick={() =>
                  patch("documentation", [
                    ...(draft.documentation ?? []),
                    { thresholdDays: 3, docType: "Medical certificate" },
                  ])
                }
                className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-brand hover:bg-brand/10 transition-colors"
              >
                <Plus className="size-3" />
                Add rule
              </button>
            </div>
            <ul className="space-y-1.5">
              {(draft.documentation ?? []).map((d, i) => (
                <li key={i} className="flex items-center gap-2 p-2 rounded border border-border bg-card/50">
                  <span className="text-[11px] text-muted-foreground">After</span>
                  <input
                    type="number"
                    min={0}
                    value={d.thresholdDays}
                    onChange={(e) =>
                      patch(
                        "documentation",
                        (draft.documentation ?? []).map((x, j) =>
                          j === i ? { ...x, thresholdDays: Number(e.target.value) } : x,
                        ),
                      )
                    }
                    className="w-14 h-8 px-2 rounded border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring"
                  />
                  <span className="text-[11px] text-muted-foreground">days, require</span>
                  <input
                    value={d.docType}
                    onChange={(e) =>
                      patch(
                        "documentation",
                        (draft.documentation ?? []).map((x, j) =>
                          j === i ? { ...x, docType: e.target.value } : x,
                        ),
                      )
                    }
                    className="flex-1 min-w-0 h-8 px-2 rounded border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring"
                  />
                  <button
                    onClick={() =>
                      patch(
                        "documentation",
                        (draft.documentation ?? []).filter((_, j) => j !== i),
                      )
                    }
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove rule"
                  >
                    <X className="size-3" />
                  </button>
                </li>
              ))}
              {(draft.documentation ?? []).length === 0 && (
                <li className="text-[11px] text-muted-foreground italic">No documentation rules.</li>
              )}
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Eligibility filters</p>
            <div className="space-y-1.5">
              {draft.eligibilityFilters.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={f}
                    onChange={(e) =>
                      patch(
                        "eligibilityFilters",
                        draft.eligibilityFilters.map((x, j) => (j === i ? e.target.value : x)),
                      )
                    }
                    className="flex-1 h-8 px-2 rounded border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring"
                  />
                  <button
                    onClick={() =>
                      patch(
                        "eligibilityFilters",
                        draft.eligibilityFilters.filter((_, j) => j !== i),
                      )
                    }
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => patch("eligibilityFilters", [...draft.eligibilityFilters, "New filter"])}
                className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-brand hover:bg-brand/10 transition-colors"
              >
                <Plus className="size-3" />
                Add filter
              </button>
            </div>
          </section>

          {/* Effective date */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Effective from</p>
            <div className="relative max-w-50">
              <CalendarIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={draft.effectiveFromISO}
                onChange={(e) => patch("effectiveFromISO", e.target.value)}
                className="w-full h-9 pl-8 pr-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </section>

          {/* Summary for revision log */}
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Change note (optional)</p>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Why are you making this change?"
              className="w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
            />
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onSimulate}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <TriangleAlert className="size-3.5" />
            Simulate impact
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
              Cancel
            </button>
            <button
              onClick={() => onSave(draft, summary)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Check className="size-3.5" />
              Save new version
            </button>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function FieldToggle({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground leading-snug">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={`Toggle ${label}`}
        onClick={() => onChange(!value)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-brand" : "bg-secondary"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${value ? "left-5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* History drawer                                                */
/* ────────────────────────────────────────────────────────────── */

function HistoryDrawer({
  rule,
  revisions,
  onClose,
  onRollback,
}: {
  rule: PolicyRule;
  revisions: ReturnType<typeof useLeaveStore>["policyRevisions"];
  onClose: () => void;
  onRollback: (version: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-105 bg-card border-l border-border h-full flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Version history</h3>
            <p className="text-[11px] text-muted-foreground">
              {LEAVE_TYPE_MAP[rule.leaveTypeKey].label} · current v{rule.version}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {revisions.length === 0 && (
            <li className="px-5 py-12 text-center text-sm text-muted-foreground italic">
              No revisions yet.
            </li>
          )}
          {revisions.map((r) => (
            <li key={r.id} className="border-b border-border last:border-b-0 px-5 py-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">v{r.version}</span>
                    {r.version === rule.version && (
                      <span className="text-[9px] uppercase tracking-wider bg-success/10 text-success px-1.5 py-0.5 rounded">Active</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{r.whenLabel} · {r.authorName}</p>
                </div>
                {r.version !== rule.version && (
                  <button
                    onClick={() => onRollback(r.version)}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-border bg-card text-[11px] text-foreground hover:bg-surface-overlay transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Rollback
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground mt-1">{r.summary}</p>
              {r.changes.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {r.changes.map((c, i) => (
                    <li key={i} className="text-[11px] flex items-center gap-2">
                      <code className="font-mono text-muted-foreground/70 min-w-30 truncate">{c.field}</code>
                      <span className="text-destructive line-through truncate">{c.before}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-success truncate">{c.after}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </motion.aside>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Simulation modal (3.2.8 stub)                                 */
/* ────────────────────────────────────────────────────────────── */

function SimulationModal({ rule, onClose }: { rule: PolicyRule; onClose: () => void }) {
  const [newDays, setNewDays] = useState(rule.daysPerYear + 3);
  const sim = simulatePolicyChange(rule, newDays);
  const t = LEAVE_TYPE_MAP[rule.leaveTypeKey];

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
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl min-w-80"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Simulate impact</h3>
            <p className="text-[11px] text-muted-foreground">{t.label} · {rule.cohortId}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">New days/yr</span>
              <input
                type="number"
                min={0}
                value={newDays}
                onChange={(e) => setNewDays(Number(e.target.value))}
                className="mt-1 w-32 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <p className="text-[11px] text-muted-foreground">
              Current: <strong className="text-foreground">{rule.daysPerYear}</strong> · Delta:{" "}
              <strong className={sim.avgDaysDeltaPerEmployee >= 0 ? "text-success" : "text-destructive"}>
                {sim.avgDaysDeltaPerEmployee >= 0 ? "+" : ""}{sim.avgDaysDeltaPerEmployee} days
              </strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Metric label="Affected" value={sim.affectedEmployees.toLocaleString("en-IN")} />
            <Metric label="Total Δ days" value={`${sim.totalDaysDelta >= 0 ? "+" : ""}${sim.totalDaysDelta.toLocaleString("en-IN")}`} />
            <Metric
              label="Liability Δ"
              value={`${sim.liabilityDeltaINR >= 0 ? "+" : "−"}₹${Math.abs(sim.liabilityDeltaINR).toLocaleString("en-IN")}`}
              tone={sim.liabilityDeltaINR >= 0 ? "warn" : "good"}
            />
            <Metric
              label="Invalidated"
              value={sim.invalidRequestsCount.toString()}
              tone={sim.invalidRequestsCount > 0 ? "warn" : "neutral"}
            />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Sample employees</p>
            <ul className="border border-border rounded-lg overflow-hidden">
              {sim.sampleEmployees.map((s) => (
                <li key={s.name} className="px-3 py-2 border-b border-border last:border-b-0 flex items-center justify-between text-[12px]">
                  <span className="text-foreground">{s.name}</span>
                  <span>
                    <span className="text-muted-foreground tabular-nums">{s.currentDays}</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="text-foreground tabular-nums font-medium">{s.newDays}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {sim.warnings.length > 0 && (
            <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
              <p className="text-[10px] uppercase tracking-wider text-warning/80 font-semibold mb-1 inline-flex items-center gap-1">
                <TriangleAlert className="size-3" /> Warnings
              </p>
              <ul className="space-y-1">
                {sim.warnings.map((w, i) => (
                  <li key={i} className="text-[12px] text-foreground">{w}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-[11px] text-muted-foreground flex items-start gap-2">
            <Lock className="size-3 mt-0.5" />
            Simulation is read-only. Apply by editing the policy and saving a new version.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
}) {
  const valueClass =
    tone === "good" ? "text-success" : tone === "warn" ? "text-warning" : "text-foreground";
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold flex items-center gap-1.5">
        <FileText className="size-3" />
        {label}
      </p>
      <p className={`text-lg font-bold tabular-nums ${valueClass} mt-1`}>{value}</p>
    </div>
  );
}
