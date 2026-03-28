"use client";

import { useState } from "react";
import { Cable, Search, Plus, AlertTriangle, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConnectedTab } from "@/components/settings/integrations/connected-tab";
import { BrowseTab } from "@/components/settings/integrations/browse-tab";
import { WebhooksTab } from "@/components/settings/integrations/webhooks-tab";
import { ApiKeysTab } from "@/components/settings/integrations/api-keys-tab";
import {
  CONNECTED_COUNT,
  AVAILABLE_COUNT,
  COMING_SOON_COUNT,
  ERROR_INTEGRATIONS,
} from "@/components/settings/integrations/data";

const TABS = [
  { key: "connected", label: `Connected (${CONNECTED_COUNT})` },
  { key: "browse", label: "Browse All" },
  { key: "webhooks", label: "Webhooks" },
  { key: "api_keys", label: "API Keys" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("connected");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-brand/10">
            <Cable className="size-5 text-brand" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Integrations Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Connect your tools to unify HR workflows and power AI agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-80 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>
          <Button variant="ghost" size="sm">
            <Plus className="size-3.5" />
            Request Integration
          </Button>
        </div>
      </div>

      {/* ── Health Summary Bar ── */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card px-4 py-3 text-xs">
        <span className="flex items-center gap-1.5">
          <CircleDot className="size-3 text-success" />
          <span className="text-muted-foreground">
            {CONNECTED_COUNT} connected
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <CircleDot className="size-3 text-brand" />
          <span className="text-muted-foreground">
            {AVAILABLE_COUNT} available
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <CircleDot className="size-3 text-warning" />
          <span className="text-muted-foreground">
            {COMING_SOON_COUNT} coming soon
          </span>
        </span>

        {ERROR_INTEGRATIONS.length > 0 && (
          <span className="ml-auto flex items-center gap-1.5 text-warning">
            <AlertTriangle className="size-3" />
            {ERROR_INTEGRATIONS.length} integration
            {ERROR_INTEGRATIONS.length > 1 ? "s" : ""} need attention
          </span>
        )}
      </div>

      {/* ── Tab Pills ── */}
      <div className="flex gap-1 rounded-lg bg-secondary p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === "connected" && (
            <ConnectedTab searchQuery={searchQuery} />
          )}
          {activeTab === "browse" && <BrowseTab searchQuery={searchQuery} />}
          {activeTab === "webhooks" && <WebhooksTab />}
          {activeTab === "api_keys" && <ApiKeysTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
