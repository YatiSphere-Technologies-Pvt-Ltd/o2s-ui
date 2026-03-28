"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Plus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OUTGOING_WEBHOOKS,
  INCOMING_WEBHOOKS,
  WEBHOOK_STATUS_CONFIG,
  healthBarColor,
} from "@/components/settings/integrations/data";

const rowVariants = {
  initial: { opacity: 0, x: -8 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

type SubTab = "outgoing" | "incoming";

export function WebhooksTab() {
  const [subTab, setSubTab] = useState<SubTab>("outgoing");

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          <button
            onClick={() => setSubTab("outgoing")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              subTab === "outgoing"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Outgoing ({OUTGOING_WEBHOOKS.length})
          </button>
          <button
            onClick={() => setSubTab("incoming")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              subTab === "incoming"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Incoming ({INCOMING_WEBHOOKS.length})
          </button>
        </div>
        <Button variant="ghost" size="sm">
          <Plus className="size-3.5" />
          New Webhook
        </Button>
      </div>

      {/* ── Outgoing Table ── */}
      {subTab === "outgoing" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  URL
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Events
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Health
                </th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {OUTGOING_WEBHOOKS.map((wh) => {
                const statusConfig = WEBHOOK_STATUS_CONFIG[wh.status];
                const isFailing = wh.status === "failing";
                return (
                  <motion.tr
                    key={wh.id}
                    variants={rowVariants}
                    className={`border-b border-border last:border-0 hover:bg-surface-overlay transition-colors ${
                      isFailing ? "border-l-2 border-l-warning" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {wh.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground max-w-[200px] truncate block">
                        {wh.url}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {wh.events.length} events
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`size-1.5 rounded-full ${statusConfig.dotClass}`}
                        />
                        <span className={statusConfig.textClass}>
                          {statusConfig.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${healthBarColor(wh.healthPercent)}`}
                            style={{ width: `${wh.healthPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {wh.healthPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      )}

      {/* ── Incoming Table ── */}
      {subTab === "incoming" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Endpoint URL
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Source
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Events / 24h
                </th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                  Last Received
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {INCOMING_WEBHOOKS.map((wh) => (
                <motion.tr
                  key={wh.id}
                  variants={rowVariants}
                  className="border-b border-border last:border-0 hover:bg-surface-overlay transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {wh.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-muted-foreground max-w-[220px] truncate block">
                        {wh.endpointUrl}
                      </span>
                      <button className="shrink-0 text-muted-foreground hover:text-foreground">
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {wh.source}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {wh.eventsReceived24h}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {wh.lastReceived}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}
    </div>
  );
}
