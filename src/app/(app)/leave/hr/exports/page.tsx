"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Database,
  Pause,
  Play,
  Plug,
  PlayCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  HR_COUNTRIES,
  type ExportDestination,
  type ExportDestinationKind,
  type ExportRunStatus,
} from "@/components/leave/data";

const KIND_META: Record<
  ExportDestinationKind,
  { icon: React.ComponentType<{ className?: string }>; label: string; tint: string; color: string }
> = {
  payroll:      { icon: Plug,       label: "Payroll",      tint: "bg-brand/10",        color: "text-brand" },
  warehouse:    { icon: Database,   label: "Warehouse",    tint: "bg-brand-purple/10", color: "text-brand-purple" },
  finance_erp:  { icon: Calculator, label: "Finance ERP",  tint: "bg-brand-teal/10",   color: "text-brand-teal" },
};

const STATUS_META: Record<ExportRunStatus, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  success: { icon: CheckCircle2, color: "text-success" },
  failed:  { icon: XCircle,      color: "text-destructive" },
  running: { icon: RefreshCw,    color: "text-brand" },
};

function flagFor(code?: string): string {
  if (!code) return "🌐";
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

function fmtWhen(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

function fmtDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${Math.round(s - m * 60)}s`;
}

function timeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "now";
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes - hours * 60}m`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function ScheduledExportsPage() {
  const { setScreen } = useScreen();
  const { scheduledExports, toggleExportEnabled, runExportNow } = useLeaveStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Scheduled exports" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function handleToggle(d: ExportDestination) {
    toggleExportEnabled(d.id, !d.enabled);
    flashOnce(d.enabled ? `Paused ${d.name}.` : `Resumed ${d.name}.`);
  }

  function handleRunNow(d: ExportDestination) {
    runExportNow(d.id);
    flashOnce(`Run started for ${d.name}.`);
  }

  function handleRetry(d: ExportDestination) {
    runExportNow(d.id);
    flashOnce(`Retry queued for ${d.name}.`);
  }

  const successCount = scheduledExports.reduce(
    (s, d) => s + d.runs.filter((r) => r.status === "success").length,
    0,
  );
  const failedCount = scheduledExports.reduce(
    (s, d) => s + d.runs.filter((r) => r.status === "failed").length,
    0,
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/leave/hr"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Scheduled exports</h1>
          <p className="text-sm text-muted-foreground">
            Recurring data deliveries to payroll, the warehouse, and the finance ledger.
          </p>
        </div>
      </motion.div>

      {/* Summary chips */}
      <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="size-3 text-success" />
          {successCount} successful run{successCount !== 1 ? "s" : ""}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <XCircle className="size-3 text-destructive" />
          {failedCount} failed run{failedCount !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto">
          {scheduledExports.length} active destinations
        </span>
      </div>

      {/* Destination list */}
      <ul className="space-y-3">
        {scheduledExports.map((d) => {
          const kind = KIND_META[d.kind];
          const KIcon = kind.icon;
          const isExpanded = expanded === d.id;
          const lastFailed = d.runs.find((r) => r.status === "failed");
          return (
            <li key={d.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 flex items-start gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center ${kind.tint}`}>
                  <KIcon className={`size-5 ${kind.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{d.name}</h3>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${kind.tint} ${kind.color}`}>
                        {kind.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{flagFor(d.country)} · {d.system}</span>
                      {!d.enabled && (
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded">Paused</span>
                      )}
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {d.enabled ? `Next in ${timeUntil(d.nextRunISO)}` : "Paused — no next run"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{d.cadenceLabel}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleRunNow(d)}
                    disabled={!d.enabled}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-md border border-border bg-card text-[11px] text-foreground hover:bg-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlayCircle className="size-3" />
                    Run now
                  </button>
                  <button
                    onClick={() => handleToggle(d)}
                    aria-pressed={d.enabled}
                    className={`size-8 inline-flex items-center justify-center rounded-md border transition-colors ${
                      d.enabled
                        ? "border-success/40 bg-success/10 text-success hover:bg-success/15"
                        : "border-border bg-card text-muted-foreground hover:bg-surface-overlay"
                    }`}
                    title={d.enabled ? "Pause" : "Resume"}
                  >
                    {d.enabled ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  </button>
                </div>
              </div>

              {/* Most recent run preview */}
              {d.runs[0] && (
                <div className="px-5 pb-3 -mt-2 flex items-center gap-3 flex-wrap text-[11px]">
                  <RunStatus run={d.runs[0]} />
                  <span className="text-muted-foreground tabular-nums">{fmtWhen(d.runs[0].startedISO)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground tabular-nums">{fmtDuration(d.runs[0].durationMs)}</span>
                  {d.runs[0].rowsExported > 0 && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-foreground tabular-nums">{d.runs[0].rowsExported.toLocaleString("en-IN")} rows</span>
                    </>
                  )}
                  {lastFailed && (
                    <button
                      onClick={() => handleRetry(d)}
                      className="ml-auto inline-flex items-center gap-1 text-warning hover:underline"
                    >
                      <RefreshCw className="size-3" />
                      Retry last failed
                    </button>
                  )}
                </div>
              )}

              {/* Toggle history */}
              <button
                onClick={() => setExpanded(isExpanded ? null : d.id)}
                className="w-full text-left px-5 py-2 border-t border-border text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay/30 transition-colors"
              >
                {isExpanded ? "Hide" : "Show"} run history ({d.runs.length})
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden border-t border-border bg-surface-overlay/30"
                >
                  <ul className="p-3 space-y-1.5">
                    {d.runs.map((r) => (
                      <li key={r.id} className="flex items-center gap-3 px-2 py-1.5 rounded-md text-[11px]">
                        <RunStatus run={r} />
                        <span className="text-muted-foreground tabular-nums">{fmtWhen(r.startedISO)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground tabular-nums">{fmtDuration(r.durationMs)}</span>
                        {r.status === "success" && r.rowsExported > 0 && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-foreground tabular-nums">{r.rowsExported.toLocaleString("en-IN")} rows</span>
                          </>
                        )}
                        {r.status === "failed" && r.errorMessage && (
                          <span className="text-destructive flex-1 min-w-0 truncate ml-2">{r.errorMessage}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </li>
          );
        })}
      </ul>

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

function RunStatus({ run }: { run: { status: ExportRunStatus } }) {
  const m = STATUS_META[run.status];
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 ${m.color}`}>
      <Icon className="size-3" />
      <span className="uppercase tracking-wider text-[10px]">{run.status}</span>
    </span>
  );
}
