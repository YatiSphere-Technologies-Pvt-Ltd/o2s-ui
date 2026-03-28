"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TASubNav } from "@/components/ta/ta-sub-nav";
import {
  VENDOR_TABS,
  VENDOR_COUNTS,
  type VendorTab,
  type Vendor,
} from "@/components/vendors/data";
import { AllVendorsTab } from "@/components/vendors/all-vendors-tab";
import { SubmissionsTab } from "@/components/vendors/submissions-tab";
import { AssignmentsTab } from "@/components/vendors/assignments-tab";
import { FeesTab } from "@/components/vendors/fees-tab";
import { PerformanceTab } from "@/components/vendors/performance-tab";
import { ComplianceTab } from "@/components/vendors/compliance-tab";
import { VendorDetailSlideOver } from "@/components/vendors/vendor-detail-slide-over";
import { AddVendorForm } from "@/components/vendors/add-vendor-form";
import { AutoSourcePanel } from "@/components/vendors/auto-source-panel";

const TAB_COMPONENTS_STATIC: Record<Exclude<VendorTab, "all">, React.ComponentType> = {
  submissions: SubmissionsTab,
  assignments: AssignmentsTab,
  fees: FeesTab,
  performance: PerformanceTab,
  compliance: ComplianceTab,
};

const tabTransition = { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const };

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState<VendorTab>("all");
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [autoSourceVendor, setAutoSourceVendor] = useState<Vendor | null>(null);

  const ActiveComponent = activeTab === "all" ? null : TAB_COMPONENTS_STATIC[activeTab];

  return (
    <div className="h-full flex flex-col">
      <TASubNav activePage="vendors" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-purple/10">
            <Building2 className="size-5 text-brand-purple" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Vendors</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {VENDOR_COUNTS.total} vendors &middot; {VENDOR_COUNTS.active} active &middot;{" "}
              {VENDOR_COUNTS.activeAssignments} assignments &middot;{" "}
              {VENDOR_COUNTS.pendingSubmissions} pending submissions
            </p>
          </div>
        </div>
        <Button
          className="bg-brand-purple text-white hover:bg-brand-purple/90"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="size-4 mr-1.5" />
          Add Vendor
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border pb-0 mb-6">
        {VENDOR_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-t-lg ${
              activeTab === tab.key
                ? "text-brand-purple"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-1.5">
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center h-5 min-w-[20px] rounded-full px-1.5 text-xs font-medium ${
                    activeTab === tab.key
                      ? "bg-brand-purple/15 text-brand-purple"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {activeTab === tab.key && (
              <motion.div
                layoutId="vendor-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-purple rounded-full"
                transition={tabTransition}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={tabTransition}
          className="flex-1"
        >
          {activeTab === "all" ? (
            <AllVendorsTab
              onSelectVendor={setSelectedVendor}
              onAutoSource={setAutoSourceVendor}
            />
          ) : (
            ActiveComponent && <ActiveComponent />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide-overs & Modals */}
      <VendorDetailSlideOver
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onAutoSource={(v) => {
          setSelectedVendor(null);
          setAutoSourceVendor(v);
        }}
      />
      <AddVendorForm open={showAddForm} onClose={() => setShowAddForm(false)} />
      <AutoSourcePanel
        vendor={autoSourceVendor}
        open={autoSourceVendor !== null}
        onClose={() => setAutoSourceVendor(null)}
      />
    </div>
  );
}
