"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ReqTab,
  REQ_TABS,
  REQ_COUNTS,
} from "@/components/requisitions/data";
import { CreateRequisitionWizard } from "@/components/requisitions/create-requisition-wizard";
import { TASubNav } from "@/components/ta/ta-sub-nav";
import { AllReqsTab } from "@/components/requisitions/all-reqs-tab";
import { PendingTab } from "@/components/requisitions/pending-tab";
import { TAQueueTab } from "@/components/requisitions/ta-queue-tab";
import { HRQueueTab } from "@/components/requisitions/hr-queue-tab";
import { HeadcountTab } from "@/components/requisitions/headcount-tab";
import { ReqAnalyticsTab } from "@/components/requisitions/req-analytics-tab";

const tabTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function RequisitionsPage() {
  const [activeTab, setActiveTab] = useState<ReqTab>("all");
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  return (
    <div className="h-full flex flex-col">
      <TASubNav activePage="requisitions" />

      {/* Header */}
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="size-5 text-brand-purple" />
            <h1 className="text-xl font-bold text-foreground">Requisitions</h1>
          </div>
          <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{REQ_COUNTS.total} total</span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-brand" />
              {REQ_COUNTS.openPositions} open positions
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-warning" />
              {REQ_COUNTS.pending} pending
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-brand-purple" />
              {REQ_COUNTS.taQueue} TA queue
            </span>
            <span className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-brand-teal" />
              {REQ_COUNTS.hrQueue} HR queue
            </span>
          </p>
        </div>
        <Button className="bg-brand-purple text-white hover:bg-brand-purple/90 gap-1.5" onClick={() => setShowCreateWizard(true)}>
          <Plus className="size-4" />
          + New Requisition
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {REQ_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand-purple text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`inline-flex items-center justify-center rounded-full px-1.5 min-w-[18px] h-4 text-[10px] font-semibold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-warning/15 text-warning"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === "all" && (
            <motion.div key="all" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <AllReqsTab />
            </motion.div>
          )}
          {activeTab === "pending" && (
            <motion.div key="pending" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <PendingTab />
            </motion.div>
          )}
          {activeTab === "taQueue" && (
            <motion.div key="taQueue" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <TAQueueTab />
            </motion.div>
          )}
          {activeTab === "hrQueue" && (
            <motion.div key="hrQueue" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <HRQueueTab />
            </motion.div>
          )}
          {activeTab === "headcount" && (
            <motion.div key="headcount" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <HeadcountTab />
            </motion.div>
          )}
          {activeTab === "analytics" && (
            <motion.div key="analytics" {...tabTransition} className="h-full overflow-y-auto scrollbar-thin pb-6">
              <ReqAnalyticsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CreateRequisitionWizard open={showCreateWizard} onClose={() => setShowCreateWizard(false)} />
    </div>
  );
}
