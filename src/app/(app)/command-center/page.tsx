"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { MetricsBar } from "@/components/command-center/metrics-bar";
import { DecisionQueue } from "@/components/command-center/decision-queue";
import { DecisionDetailPanel } from "@/components/command-center/decision-detail-panel";
import { AgentFeed } from "@/components/command-center/agent-feed";
import {
  type Decision,
  type QueueFilter,
  DECISIONS,
  AGENT_EVENTS,
  filterDecisions,
} from "@/components/command-center/data";

export default function CommandCenterPage() {
  const [decisions, setDecisions] = useState<Decision[]>(DECISIONS);
  const [selectedId, setSelectedId] = useState<string | null>(DECISIONS[0]?.id ?? null);
  const [agentEvents] = useState(AGENT_EVENTS);
  const [autoPilot, setAutoPilot] = useState(false);
  const [filter, setFilter] = useState<QueueFilter>("all");
  const [aiReasoningExpanded, setAIReasoningExpanded] = useState(false);

  const filteredDecisions = useMemo(
    () => filterDecisions(decisions, filter),
    [decisions, filter]
  );

  const selectedDecision = useMemo(
    () => decisions.find((d) => d.id === selectedId) ?? null,
    [decisions, selectedId]
  );

  const selectNextPending = useCallback(
    (afterId: string) => {
      const currentIndex = filteredDecisions.findIndex((d) => d.id === afterId);
      const next = filteredDecisions[currentIndex + 1] ?? filteredDecisions[currentIndex - 1];
      setSelectedId(next?.id ?? null);
    },
    [filteredDecisions]
  );

  const handleApprove = useCallback(
    (id: string) => {
      setDecisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "approved" as const } : d))
      );
      selectNextPending(id);
    },
    [selectNextPending]
  );

  const handleReject = useCallback(
    (id: string) => {
      setDecisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "rejected" as const } : d))
      );
      selectNextPending(id);
    },
    [selectNextPending]
  );

  const handleDefer = useCallback(
    (id: string) => {
      setDecisions((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "deferred" as const } : d))
      );
      selectNextPending(id);
    },
    [selectNextPending]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key.toLowerCase()) {
        case "j":
        case "arrowdown": {
          e.preventDefault();
          const currentIndex = filteredDecisions.findIndex(
            (d) => d.id === selectedId
          );
          const next = filteredDecisions[currentIndex + 1];
          if (next) setSelectedId(next.id);
          break;
        }
        case "k":
        case "arrowup": {
          e.preventDefault();
          const currentIndex = filteredDecisions.findIndex(
            (d) => d.id === selectedId
          );
          const prev = filteredDecisions[currentIndex - 1];
          if (prev) setSelectedId(prev.id);
          break;
        }
        case "a": {
          if (selectedDecision && selectedDecision.status === "pending") {
            handleApprove(selectedDecision.id);
          }
          break;
        }
        case "r": {
          if (selectedDecision && selectedDecision.status === "pending") {
            handleReject(selectedDecision.id);
          }
          break;
        }
        case "d": {
          if (selectedDecision && selectedDecision.status === "pending") {
            handleDefer(selectedDecision.id);
          }
          break;
        }
        case "e": {
          setAIReasoningExpanded((prev) => !prev);
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    filteredDecisions,
    selectedId,
    selectedDecision,
    handleApprove,
    handleReject,
    handleDefer,
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* Metrics Bar */}
      <div className="shrink-0 px-6 pt-5 lg:px-8">
        <MetricsBar />
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden px-6 pb-4 lg:px-8 pt-4 gap-4">
        {/* Left: Decision Queue */}
        <div className="w-80 shrink-0 hidden lg:block">
          <DecisionQueue
            decisions={decisions}
            selectedId={selectedId}
            onSelect={setSelectedId}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>

        {/* Center: Detail Panel */}
        <div className="flex-1 min-w-0">
          <DecisionDetailPanel
            decision={selectedDecision}
            onApprove={handleApprove}
            onReject={handleReject}
            onDefer={handleDefer}
            aiReasoningExpanded={aiReasoningExpanded}
            onToggleAIReasoning={() => setAIReasoningExpanded((prev) => !prev)}
          />
        </div>

        {/* Right: Agent Feed */}
        <div className="w-80 shrink-0 hidden xl:block">
          <AgentFeed
            events={agentEvents}
            autoPilot={autoPilot}
            onToggleAutoPilot={() => setAutoPilot((prev) => !prev)}
          />
        </div>
      </div>

      {/* Keyboard shortcut hint bar */}
      <div className="shrink-0 border-t border-border bg-card/80 backdrop-blur-sm px-6 py-2 flex items-center gap-5 text-[10px] text-muted-foreground/50">
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">
            J/K
          </kbd>
          Navigate
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">
            A
          </kbd>
          Approve
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">
            R
          </kbd>
          Reject
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">
            D
          </kbd>
          Defer
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">
            E
          </kbd>
          Expand AI
        </span>
      </div>
    </div>
  );
}
