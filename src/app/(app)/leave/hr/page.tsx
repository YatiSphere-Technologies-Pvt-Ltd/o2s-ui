"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, CheckCircle2, FileText, Plus, Wallet } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  HR_AGENT_STREAM,
  HR_ATTENTION,
  HR_COUNTRIES,
  HR_FIRST_NAME,
  HR_KPIS,
  LEAVE_TRENDS_6M,
} from "@/components/leave/data";
import { HrKpiStrip } from "@/components/leave/hr-kpi-strip";
import { CountryTiles } from "@/components/leave/country-tiles";
import { LeaveTrendsChart } from "@/components/leave/leave-trends-chart";
import { AnomalyFeed } from "@/components/leave/anomaly-feed";
import { AgentActivityStream } from "@/components/leave/agent-activity-stream";
import { AttentionPanel } from "@/components/leave/attention-panel";
import { ManualBalanceAdjustmentDrawer } from "@/components/leave/drawers/manual-balance-drawer";
import { AddHolidayDrawer } from "@/components/leave/drawers/add-holiday-drawer";
import { AddLeaveTypeDrawer } from "@/components/leave/drawers/add-leave-type-drawer";
import { DocumentViewerDrawer } from "@/components/leave/drawers/document-viewer-drawer";

export default function HrOverviewPage() {
  const { setScreen } = useScreen();
  const { hrAnomalies } = useLeaveStore();

  const [openDrawer, setOpenDrawer] = useState<null | "balance" | "holiday" | "leaveType" | "doc">(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "HR Overview" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Hi {HR_FIRST_NAME} — here&apos;s the org today.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Situational awareness across countries, agents and anomalies.
        </p>
      </motion.div>

      {/* KPI strip */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <HrKpiStrip kpis={HR_KPIS} />
      </motion.div>

      {/* Admin quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.07 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-1">Admin</span>
        <AdminTrigger icon={Wallet} label="Manual balance adjustment" onClick={() => setOpenDrawer("balance")} />
        <AdminTrigger icon={CalendarPlus} label="Add holiday" onClick={() => setOpenDrawer("holiday")} />
        <AdminTrigger icon={Plus} label="Add leave type" onClick={() => setOpenDrawer("leaveType")} />
        <AdminTrigger icon={FileText} label="Document viewer demo" onClick={() => setOpenDrawer("doc")} />
      </motion.div>

      {/* Countries + Trends side by side */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
      >
        <div className="lg:col-span-3">
          <CountryTiles countries={HR_COUNTRIES} />
        </div>
        <div className="lg:col-span-2">
          <LeaveTrendsChart points={LEAVE_TRENDS_6M} />
        </div>
      </motion.div>

      {/* Anomalies + Activity stream + Attention */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="space-y-6">
          <AnomalyFeed anomalies={hrAnomalies} />
        </div>
        <div className="lg:col-span-1">
          <AgentActivityStream items={HR_AGENT_STREAM} />
        </div>
        <div className="space-y-6">
          <AttentionPanel items={HR_ATTENTION} />
        </div>
      </motion.div>

      <ManualBalanceAdjustmentDrawer
        open={openDrawer === "balance"}
        onClose={() => setOpenDrawer(null)}
        onSubmit={(p) => flashOnce(`${p.delta > 0 ? "+" : ""}${p.delta} ${p.type} day(s) for employee ${p.employeeId}.`)}
      />
      <AddHolidayDrawer
        open={openDrawer === "holiday"}
        onClose={() => setOpenDrawer(null)}
        onSubmit={(p) => flashOnce(`Added ${p.name} on ${p.date} (${p.countryCode}).`)}
      />
      <AddLeaveTypeDrawer
        open={openDrawer === "leaveType"}
        onClose={() => setOpenDrawer(null)}
        onSubmit={(p) => flashOnce(`Leave type ${p.label} (${p.shortLabel}) created.`)}
      />
      <DocumentViewerDrawer
        open={openDrawer === "doc"}
        attachment={{
          id: "demo",
          requestId: "demo",
          filename: "medical-certificate.pdf",
          sizeKB: 144,
          mime: "application/pdf",
          uploadedOn: "2025-10-14",
        }}
        containsMedical
        onAuditEvent={(k) => flashOnce(`Audit: ${k}`)}
        onClose={() => setOpenDrawer(null)}
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

function AdminTrigger({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors"
    >
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </button>
  );
}
