"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";
import {
  COMPLIANCE_KPIS,
  COMPLIANCE_TABS,
  JURISDICTION_PROFILES,
  type ComplianceTab,
} from "@/components/legal/compliance/data";
import { CalendarTab } from "@/components/legal/compliance/calendar-tab";
import { FilingsTab } from "@/components/legal/compliance/filings-tab";
import { JurisdictionsTab } from "@/components/legal/compliance/jurisdictions-tab";
import { AuditTab } from "@/components/legal/compliance/audit-tab";
import { ComplianceAnalyticsTab } from "@/components/legal/compliance/compliance-analytics-tab";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const ENTITY_OPTIONS = [
  "All Entities",
  ...JURISDICTION_PROFILES.map((p) => p.entityName),
];

function TabContent({ tab }: { tab: ComplianceTab }) {
  switch (tab) {
    case "calendar":
      return <CalendarTab />;
    case "filings":
      return <FilingsTab />;
    case "jurisdictions":
      return <JurisdictionsTab />;
    case "audit":
      return <AuditTab />;
    case "analytics":
      return <ComplianceAnalyticsTab />;
  }
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<ComplianceTab>("calendar");
  const [entityFilter, setEntityFilter] = useState("All Entities");
  const [entityOpen, setEntityOpen] = useState(false);

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <LegalSubNav activePage="compliance" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
            <ShieldCheck className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Compliance Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Regulatory compliance tracking across all entities
            </p>
          </div>
        </div>

        {/* Entity filter dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEntityOpen(!entityOpen)}
          >
            {entityFilter}
            <ChevronDown className="size-3.5 ml-1" />
          </Button>
          {entityOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-lg shadow-lg py-1 min-w-55">
              {ENTITY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setEntityFilter(opt);
                    setEntityOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-secondary transition-colors ${
                    entityFilter === opt
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {COMPLIANCE_KPIS.map((kpi) => {
          const isOverdue =
            kpi.label === "Overdue Filings" && Number(kpi.value) > 0;
          return (
            <div
              key={kpi.label}
              className={`bg-card border border-border rounded-xl p-4 ${
                isOverdue ? "bg-destructive/5" : ""
              }`}
            >
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
              <div
                className={`font-bold mt-1 ${
                  kpi.isScore ? "text-2xl text-brand" : "text-lg text-foreground"
                }`}
              >
                {kpi.value}
              </div>
              {kpi.trend && (
                <div
                  className={`text-[10px] mt-0.5 ${
                    kpi.positive ? "text-success" : "text-destructive"
                  }`}
                >
                  {kpi.trend}
                </div>
              )}
              {kpi.subtext && (
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {kpi.subtext}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit">
        {COMPLIANCE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...tabVariants}>
          <TabContent tab={activeTab} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
