"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, AlertTriangle, RefreshCw } from "lucide-react";
import {
  CONNECTED_INTEGRATIONS,
  ERROR_INTEGRATIONS,
  SYNC_STATUS_CONFIG,
  DATA_FLOW_LABELS,
  AGENT_CONFIG,
  CATEGORY_LABELS,
  type Integration,
} from "@/components/settings/integrations/data";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface ConnectedTabProps {
  searchQuery: string;
}

export function ConnectedTab({ searchQuery }: ConnectedTabProps) {
  const filtered = CONNECTED_INTEGRATIONS.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* ── Error Banner ── */}
      {ERROR_INTEGRATIONS.length > 0 && (
        <div className="rounded-lg border-l-[3px] border-warning bg-warning/5 p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 size-4 text-warning shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {ERROR_INTEGRATIONS.length} integration
                {ERROR_INTEGRATIONS.length > 1 ? "s" : ""} need attention
              </p>
              <ul className="space-y-0.5">
                {ERROR_INTEGRATIONS.map((i) => (
                  <li
                    key={i.id}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <span>{i.name}</span>
                    <span className="text-muted-foreground/60">—</span>
                    <span>{i.connection?.errorMessage}</span>
                    <button className="ml-1 text-brand font-medium hover:underline">
                      Fix Now
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Cards Grid ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filtered.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No connected integrations match your search.
        </p>
      )}
    </div>
  );
}

function IntegrationCard({ integration }: { integration: Integration }) {
  const conn = integration.connection!;
  const syncConfig = SYNC_STATUS_CONFIG[conn.syncStatus];
  const flowConfig = DATA_FLOW_LABELS[conn.dataFlow];
  const isError = conn.syncStatus === "error";
  const isAuthExpired = conn.syncStatus === "auth_expired";

  return (
    <motion.div
      variants={cardVariants}
      className={`bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all ${
        isError ? "border-l-2 border-l-warning" : ""
      }`}
    >
      {/* ── Top Row ── */}
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: integration.logoColor }}
        >
          {integration.logoInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate">
              {integration.name}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            {CATEGORY_LABELS[integration.category]}
          </span>
        </div>
      </div>

      {/* ── Status Line ── */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`size-1.5 rounded-full ${syncConfig.dotClass}`}
        />
        <span className={syncConfig.textClass}>{syncConfig.label}</span>
        <span className="text-muted-foreground/40">|</span>
        <span className="text-muted-foreground">{conn.lastSync}</span>
      </div>

      {/* ── Data Flow ── */}
      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span>{flowConfig.icon}</span>
        <span>{flowConfig.label}</span>
      </div>

      {/* ── AI Agents ── */}
      {conn.aiAgentsUsing.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {conn.aiAgentsUsing.map((agentId) => {
            const agent = AGENT_CONFIG[agentId];
            return (
              <span
                key={agentId}
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${agent.bgClass} ${agent.colorClass}`}
              >
                {agent.label}
              </span>
            );
          })}
        </div>
      )}

      {/* ── Divider & Actions ── */}
      <div className="border-t border-border mt-3 pt-3 flex items-center gap-3">
        {isAuthExpired ? (
          <button className="text-xs font-medium text-destructive hover:underline">
            Re-authenticate
          </button>
        ) : (
          <button className="text-xs font-medium text-brand hover:underline">
            Configure
          </button>
        )}
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <RefreshCw className="size-3" />
          Sync Now
        </button>
        <button className="ml-auto text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}
