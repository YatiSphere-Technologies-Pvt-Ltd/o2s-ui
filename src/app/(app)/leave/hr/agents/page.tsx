"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Eye,
  Pause,
  Play,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import { AgentCard } from "@/components/leave/agent-card";

export default function AgentControlCenterPage() {
  const { setScreen } = useScreen();
  const { agents, setAgentConfig, globalAgentPause, setGlobalAgentPause } = useLeaveStore();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Agent Control Center" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function togglePower(id: string, nextStatus: boolean) {
    setAgentConfig(id as never, { status: nextStatus });
    flashOnce(`${nextStatus ? "Resumed" : "Paused"} agent ${id}.`);
  }

  function toggleGlobal() {
    setGlobalAgentPause(!globalAgentPause);
    flashOnce(globalAgentPause ? "All agents resumed." : "All agents paused.");
  }

  const liveCount = agents.filter((a) => a.status).length;

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Agent control center</h1>
            <p className="text-sm text-muted-foreground">
              Mission control for the agentic layer. Configure scope, autonomy, and pause globally if needed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[11px]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            {globalAgentPause ? "0" : liveCount} of {agents.length} live
          </span>
          <button
            onClick={toggleGlobal}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
              globalAgentPause
                ? "border-success/40 bg-success/5 text-success hover:bg-success/10"
                : "border-warning/40 bg-warning/5 text-warning hover:bg-warning/10"
            }`}
          >
            {globalAgentPause ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
            {globalAgentPause ? "Resume all" : "Pause all"}
          </button>
          <button
            onClick={() => flashOnce("Recent activity audited (logged).")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Eye className="size-3.5" />
            Audit recent activity
          </button>
          <button
            onClick={() => flashOnce("Decision log export queued (CSV).")}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Download className="size-3.5" />
            Export logs
          </button>
        </div>
      </motion.div>

      {globalAgentPause && (
        <div className="p-3 rounded-xl bg-warning/5 border border-warning/30 text-[12px] text-foreground">
          <span className="font-medium text-warning">All agents paused.</span>{" "}
          <span className="text-muted-foreground">
            Recommendations and automated actions are suspended. Human approvers will still see the queue.
          </span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {agents.map((entry) => (
          <AgentCard
            key={entry.agent.id}
            entry={entry}
            globalPaused={globalAgentPause}
            onTogglePower={() => togglePower(entry.agent.id, !entry.status)}
          />
        ))}
      </motion.div>

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
