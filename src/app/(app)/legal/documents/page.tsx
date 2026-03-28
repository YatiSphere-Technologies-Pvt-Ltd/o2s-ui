"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";
import { SOWTab } from "@/components/legal/documents/sow-tab";
import { NDATab } from "@/components/legal/documents/nda-tab";
import { ComparisonTab } from "@/components/legal/documents/comparison-tab";
import { ObligationsTab } from "@/components/legal/documents/obligations-tab";
import { RenewalsTab } from "@/components/legal/documents/renewals-tab";
import {
  DOC_TABS,
  DOC_KPIS,
  type DocTab,
} from "@/components/legal/documents/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function TabContent({ tab }: { tab: DocTab }) {
  switch (tab) {
    case "sow":
      return <SOWTab />;
    case "nda":
      return <NDATab />;
    case "comparison":
      return <ComparisonTab />;
    case "obligations":
      return <ObligationsTab />;
    case "renewals":
      return <RenewalsTab />;
  }
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<DocTab>("sow");

  return (
    <div className="space-y-6">
      <LegalSubNav activePage="documents" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
            <FileText className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Document Generation &amp; Intelligence
            </h1>
            <p className="text-sm text-muted-foreground">
              Build, compare, and track legal documents with AI assistance
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-destructive text-white hover:bg-destructive/90"
            size="sm"
          >
            <Plus className="size-3.5" />
            New SOW
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="size-3.5" />
            NDA
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DOC_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className={`bg-card border border-border rounded-xl px-4 py-3 ${
              !kpi.positive ? "bg-destructive/5" : ""
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {kpi.label}
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {kpi.value}
            </div>
            {kpi.subtext && (
              <div
                className={`text-[10px] mt-0.5 ${
                  kpi.positive ? "text-success" : "text-destructive"
                }`}
              >
                {kpi.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1">
        {DOC_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-destructive/15 text-destructive font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  activeTab === tab.key
                    ? "bg-destructive/20 text-destructive"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...fadeIn}>
          <TabContent tab={activeTab} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
