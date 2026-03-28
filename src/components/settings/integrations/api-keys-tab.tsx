"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_KEYS, SCOPE_CONFIG } from "@/components/settings/integrations/data";

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

export function ApiKeysTab() {
  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground max-w-lg">
          API keys allow programmatic access to O2S. Treat these as passwords.
        </p>
        <Button variant="outline" size="sm">
          <Plus className="size-3.5" />
          New Key
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Key
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Scope
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Last Used
              </th>
              <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                Usage
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
            {API_KEYS.map((key) => {
              const scopeConfig = SCOPE_CONFIG[key.scope];
              const usagePercent = Math.round(
                (key.callsThisMonth / key.callLimit) * 100
              );
              return (
                <motion.tr
                  key={key.id}
                  variants={rowVariants}
                  className="border-b border-border last:border-0 hover:bg-surface-overlay transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {key.name}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                            key.environment === "live"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {key.environment}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Created {key.createdAt}
                      </span>
                      {key.expiresAt && (
                        <span className="block text-xs text-muted-foreground">
                          Expires {key.expiresAt}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {key.keyPreview}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${scopeConfig.bgClass} ${scopeConfig.colorClass}`}
                    >
                      {scopeConfig.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {key.lastUsed}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${Math.min(usagePercent, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {key.callsThisMonth.toLocaleString()} /{" "}
                        {key.callLimit.toLocaleString()}
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
    </div>
  );
}
