"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  ArrowLeft,
  CalendarPlus,
  CheckCircle2,
  Filter,
  Gavel,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  HR_COUNTRIES,
  type ComplianceItem,
  type ComplianceItemKind,
  type ComplianceItemStatus,
} from "@/components/leave/data";

type Tab = "new" | "approved" | "dismissed";

const KIND_LABEL: Record<ComplianceItemKind, string> = {
  statutory_rate: "Statutory rate",
  holiday_addition: "Holiday addition",
  law_change: "Law change",
  filing_deadline: "Filing deadline",
};

const KIND_ICON: Record<ComplianceItemKind, React.ComponentType<{ className?: string }>> = {
  statutory_rate: ShieldAlert,
  holiday_addition: CalendarPlus,
  law_change: Gavel,
  filing_deadline: AlertOctagon,
};

const SEVERITY: Record<ComplianceItem["severity"], { tint: string; color: string; label: string }> = {
  high: { tint: "bg-destructive/10", color: "text-destructive", label: "High" },
  medium: { tint: "bg-warning/10",     color: "text-warning",     label: "Medium" },
  low: { tint: "bg-secondary",      color: "text-muted-foreground", label: "Low" },
};

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

export default function ComplianceWatchdogPage() {
  const { setScreen } = useScreen();
  const { complianceFeed, recordComplianceAction } = useLeaveStore();

  const [tab, setTab] = useState<Tab>("new");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [actionTarget, setActionTarget] = useState<
    | { kind: "approve" | "dismiss"; item: ComplianceItem }
    | null
  >(null);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Compliance Watchdog" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  const filtered = useMemo(() => {
    return complianceFeed.filter(({ item }) => countryFilter === "all" || item.country === countryFilter);
  }, [complianceFeed, countryFilter]);

  const counts = useMemo(() => {
    const c: Record<Tab, number> = { new: 0, approved: 0, dismissed: 0 };
    for (const x of filtered) {
      const s = x.state.status;
      if (s === "new" || s === "draft") c.new++;
      else if (s === "approved") c.approved++;
      else if (s === "dismissed") c.dismissed++;
    }
    return c;
  }, [filtered]);

  const rows = useMemo(() => {
    return filtered
      .filter((x) =>
        tab === "new"
          ? x.state.status === "new" || x.state.status === "draft"
          : x.state.status === tab,
      )
      .sort((a, b) => b.item.detectedAt.localeCompare(a.item.detectedAt));
  }, [filtered, tab]);

  function commit() {
    if (!actionTarget) return;
    const status: ComplianceItemStatus =
      actionTarget.kind === "approve" ? "approved" : "dismissed";
    recordComplianceAction(actionTarget.item.id, status, note || undefined);
    flashOnce(actionTarget.kind === "approve" ? "Redline approved." : "Item dismissed.");
    setActionTarget(null);
    setNote("");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/leave/hr"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Compliance Watchdog</h1>
          <p className="text-sm text-muted-foreground">
            Regulatory and statutory changes the watchdog detected, with redlines for review.
          </p>
        </div>
      </motion.div>

      {/* Tabs + filter */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center border-b border-border">
          {(["new", "approved", "dismissed"] as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "new" ? "New" : t === "approved" ? "Approved" : "Dismissed"}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-4.5 h-4 px-1 rounded-full text-[10px] tabular-nums ${
                    active ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {counts[t]}
                </span>
                {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-3.5 text-muted-foreground" />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="h-8 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All countries</option>
            {HR_COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <Globe className="size-6 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-foreground">No items in this view.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ item, state }) => {
            const KIcon = KIND_ICON[item.kind];
            const sev = SEVERITY[item.severity];
            return (
              <li key={item.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className={`size-10 shrink-0 rounded-lg flex items-center justify-center ${sev.tint}`}>
                    <KIcon className={`size-4 ${sev.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${sev.tint} ${sev.color}`}>
                        {sev.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {KIND_LABEL[item.kind]}
                      </span>
                      <span className="text-[11px] text-foreground inline-flex items-center gap-1">
                        <span className="text-base leading-none">{flagFor(item.country)}</span>
                        {item.country}
                      </span>
                      {item.affectedCases !== undefined && (
                        <span className="text-[10px] text-muted-foreground">
                          · {item.affectedCases} case{item.affectedCases !== 1 ? "s" : ""}
                        </span>
                      )}
                      {item.effectiveDate && (
                        <span className="text-[10px] text-muted-foreground">
                          · effective {new Date(item.effectiveDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{item.summary}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2">{item.source.label}</p>

                    {item.redline && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold mb-1">Before</p>
                          <p className="text-[11px] font-mono text-foreground leading-snug">{item.redline.before}</p>
                        </div>
                        <div className="rounded-lg border border-success/30 bg-success/5 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-success font-semibold mb-1">After</p>
                          <p className="text-[11px] font-mono text-foreground leading-snug">{item.redline.after}</p>
                        </div>
                      </div>
                    )}

                    {state.status === "approved" && (
                      <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-success">
                        <CheckCircle2 className="size-3" />
                        Approved by HR · {state.whenLabel}
                        {state.note && <span className="text-muted-foreground ml-2">— {state.note}</span>}
                      </div>
                    )}
                    {state.status === "dismissed" && (
                      <div className="mt-3 text-[11px] text-muted-foreground">
                        Dismissed · {state.whenLabel}
                        {state.note && <span className="ml-2">— {state.note}</span>}
                      </div>
                    )}

                    {(state.status === "new" || state.status === "draft") && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => setActionTarget({ kind: "approve", item })}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-success text-white text-[11px] font-medium hover:opacity-90 transition-opacity"
                        >
                          <CheckCircle2 className="size-3" />
                          Approve redline
                        </button>
                        <button
                          onClick={() => setActionTarget({ kind: "dismiss", item })}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Action modal */}
      <AnimatePresence>
        {actionTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 bg-black/50"
              onClick={() => {
                setActionTarget(null);
                setNote("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  {actionTarget.kind === "approve" ? "Approve redline?" : "Dismiss item?"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
                  {actionTarget.kind === "approve"
                    ? "The redline will be merged into the live policy. Affected cases get recalculated on next sync."
                    : "Item stays in the audit trail but won't appear in the active feed."}
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Reason / context (kept in audit trail)…"
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setActionTarget(null);
                      setNote("");
                    }}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={commit}
                    className={`h-9 px-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity ${
                      actionTarget.kind === "approve" ? "bg-success" : "bg-secondary text-foreground"
                    }`}
                  >
                    {actionTarget.kind === "approve" ? "Approve" : "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
