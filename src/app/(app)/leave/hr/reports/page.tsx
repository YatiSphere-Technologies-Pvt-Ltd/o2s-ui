"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Download,
  Pin,
  PinOff,
  Send,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import { PREBUILT_DASHBOARDS, type PrebuiltDashboard } from "@/components/leave/data";
import { Sparkline } from "@/components/leave/sparkline";
import { WarehouseSyncDrawer } from "@/components/leave/drawers/warehouse-sync-drawer";

const TONE: Record<PrebuiltDashboard["tone"], { ring: string; spark: string; chipBg: string; chipText: string }> = {
  brand:          { ring: "ring-brand/20",         spark: "text-brand",         chipBg: "bg-brand/10",         chipText: "text-brand" },
  "brand-purple": { ring: "ring-brand-purple/20",  spark: "text-brand-purple",  chipBg: "bg-brand-purple/10",  chipText: "text-brand-purple" },
  "brand-teal":   { ring: "ring-brand-teal/20",    spark: "text-brand-teal",    chipBg: "bg-brand-teal/10",    chipText: "text-brand-teal" },
  warning:        { ring: "ring-warning/20",       spark: "text-warning",       chipBg: "bg-warning/10",       chipText: "text-warning" },
  destructive:    { ring: "ring-destructive/20",   spark: "text-destructive",   chipBg: "bg-destructive/10",   chipText: "text-destructive" },
  success:        { ring: "ring-success/20",       spark: "text-success",       chipBg: "bg-success/10",       chipText: "text-success" },
};

export default function ReportsHubPage() {
  const { setScreen } = useScreen();
  const { warehouseSync, setWarehouseSync, pinnedReports, togglePinnedReport } = useLeaveStore();

  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Reports & Analytics" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function exportChart(d: PrebuiltDashboard, fmt: "csv" | "png") {
    flashOnce(`Exporting ${d.title} as ${fmt.toUpperCase()}…`);
  }
  function scheduleChart(d: PrebuiltDashboard) {
    flashOnce(`Scheduled ${d.title} (weekly Mon 09:00 IST) to #people-ops.`);
  }

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Reports &amp; analytics</h1>
            <p className="text-sm text-muted-foreground">
              Pre-built dashboards, a custom report builder, and warehouse sync.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/leave/hr/reports/builder"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Wrench className="size-3.5" />
            Custom report
          </Link>
          <button
            onClick={() => setWarehouseOpen(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Database className="size-3.5" />
            Warehouse sync
            {warehouseSync.connector !== "off" && (
              <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-success/10 text-success">
                {warehouseSync.connector}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Sync status */}
      {warehouseSync.connector !== "off" && (
        <div className="text-[11px] text-muted-foreground flex items-center gap-2">
          <Sparkles className="size-3 text-success" />
          Warehouse: <span className="text-foreground">{warehouseSync.connector}</span> ·{" "}
          {warehouseSync.interval} · last synced {warehouseSync.lastSyncedISO
            ? new Date(warehouseSync.lastSyncedISO).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })
            : "—"}
        </div>
      )}

      {/* Pre-built grid */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {PREBUILT_DASHBOARDS.map((d) => {
          const meta = TONE[d.tone];
          const pinned = pinnedReports.includes(d.id);
          return (
            <div
              key={d.id}
              className={`bg-card border border-border rounded-xl p-5 flex flex-col gap-4 ring-1 ${meta.ring} hover:border-border/80 transition-colors`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">{d.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{d.description}</p>
                </div>
                <button
                  onClick={() => {
                    togglePinnedReport(d.id);
                    flashOnce(pinned ? `Unpinned ${d.title}.` : `Pinned ${d.title} to home.`);
                  }}
                  title={pinned ? "Unpin from home" : "Pin to home"}
                  className={`size-7 inline-flex items-center justify-center rounded-md border text-[11px] transition-colors ${
                    pinned ? "border-brand/40 bg-brand/10 text-brand" : "border-border text-muted-foreground hover:text-foreground hover:bg-surface-overlay"
                  }`}
                >
                  {pinned ? <Pin className="size-3.5" /> : <PinOff className="size-3.5" />}
                </button>
              </div>

              {/* Preview */}
              {d.preview.length > 0 && (
                <Sparkline values={d.preview} color={meta.spark} width={320} height={48} />
              )}

              {/* Chart actions */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => exportChart(d, "csv")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                >
                  <Download className="size-3" /> CSV
                </button>
                <button
                  onClick={() => exportChart(d, "png")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                >
                  <Download className="size-3" /> PNG
                </button>
                <button
                  onClick={() => scheduleChart(d)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                >
                  <Send className="size-3" /> Schedule
                </button>

                {d.href && (
                  <Link
                    href={d.href}
                    className="ml-auto inline-flex items-center gap-1 text-[11px] text-brand hover:underline"
                  >
                    Open <ArrowRight className="size-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      <WarehouseSyncDrawer
        open={warehouseOpen}
        current={warehouseSync}
        onClose={() => setWarehouseOpen(false)}
        onSave={(next) => {
          setWarehouseSync(next);
          flashOnce(`Warehouse settings saved.`);
        }}
      />

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
