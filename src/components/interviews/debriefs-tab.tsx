"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Video, LayoutGrid, Table2 } from "lucide-react";
import {
  DEBRIEFS,
  REC_CONFIG,
  confidenceColor,
  type Debrief,
} from "@/components/interviews/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

type FilterStatus = "all" | "pending" | "in_progress" | "completed";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: "Pending", bg: "bg-warning/10", text: "text-warning" },
  in_progress: { label: "In Progress", bg: "bg-brand/10", text: "text-brand" },
  completed: { label: "Completed", bg: "bg-success/10", text: "text-success" },
};

function DebriefCard({ debrief, index }: { debrief: Debrief; index: number }) {
  const statusCfg = STATUS_CONFIG[debrief.status];
  const rec = debrief.aiRecommendation ? REC_CONFIG[debrief.aiRecommendation] : null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="rounded-xl border border-border bg-card p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{debrief.candidate}</p>
          <p className="text-xs text-muted-foreground">{debrief.role}</p>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>
          {statusCfg.label}
        </span>
      </div>

      {/* Scorecards progress */}
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">
          {debrief.scorecardsSubmitted}/{debrief.scorecardsTotal} submitted
        </p>
        <div className="mt-1 flex items-center gap-1">
          {Array.from({ length: debrief.scorecardsTotal }, (_, i) => (
            <div
              key={i}
              className={`size-2.5 rounded-full ${
                i < debrief.scorecardsSubmitted ? "bg-success" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </div>

      {/* AI composite score */}
      {debrief.aiCompositeScore !== null && (
        <div className="mt-3 flex items-center gap-3">
          <span className={`text-2xl font-bold ${confidenceColor(debrief.aiCompositeScore)}`}>
            {debrief.aiCompositeScore}
          </span>
          {rec && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rec.bgClass} ${rec.colorClass}`}>
              {rec.label}
            </span>
          )}
        </div>
      )}

      {/* Interviewer scores */}
      {debrief.interviewerScores.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {debrief.interviewerScores.map((is) => (
            <span key={is.name} className="text-xs text-muted-foreground">
              {is.name.split(" ")[0]}:{" "}
              <span className="font-semibold text-foreground">{is.score}</span>
            </span>
          ))}
        </div>
      )}

      {/* AI summary */}
      {debrief.aiSummary && (
        <div className="mt-3 rounded-md border-l-[3px] border-brand-purple bg-brand-purple/5 p-3">
          <div className="mb-1 flex items-center gap-1">
            <Sparkles className="size-3 text-brand-purple" />
            <span className="text-[10px] font-semibold text-brand-purple">AI Summary</span>
          </div>
          <p className="text-xs text-muted-foreground">{debrief.aiSummary}</p>
        </div>
      )}

      {/* Decision badge */}
      {debrief.decision && (
        <div className="mt-3">
          <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
            {debrief.decision}
          </span>
          {debrief.decidedBy && (
            <span className="ml-2 text-[10px] text-muted-foreground">
              by {debrief.decidedBy} &middot; {debrief.decidedDate}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3 border-t border-border pt-3">
        <button className="text-xs font-medium text-brand hover:underline">
          Open Debrief
        </button>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Video className="size-3" />
          Schedule Sync Debrief
        </button>
      </div>
    </motion.div>
  );
}

export function DebriefsTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "in_progress", label: "In-Progress" },
    { key: "completed", label: "Completed" },
  ];

  const filtered = DEBRIEFS.filter((d) => {
    if (filter === "all") return true;
    return d.status === filter;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Filter pills + view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-brand/10 text-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button onClick={() => setViewMode("cards")} className={`p-1.5 rounded-md transition-colors ${viewMode === "cards" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="size-4" />
          </button>
          <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
            <Table2 className="size-4" />
          </button>
        </div>
      </div>

      {viewMode === "table" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Candidate</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Scorecards</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">AI Score</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Recommendation</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Decision</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((debrief, i) => {
                const statusCfg = STATUS_CONFIG[debrief.status];
                const rec = debrief.aiRecommendation ? REC_CONFIG[debrief.aiRecommendation] : null;
                return (
                  <motion.tr
                    key={debrief.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-3 py-3 font-medium text-foreground">{debrief.candidate}</td>
                    <td className="px-3 py-3 text-muted-foreground">{debrief.role}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5">
                        {Array.from({ length: debrief.scorecardsTotal }, (_, j) => (
                          <span key={j} className={`size-2 rounded-full ${j < debrief.scorecardsSubmitted ? "bg-success" : "bg-secondary"}`} />
                        ))}
                        <span className="ml-1 text-muted-foreground">{debrief.scorecardsSubmitted}/{debrief.scorecardsTotal}</span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {debrief.aiCompositeScore !== null ? (
                        <span className={`font-bold ${confidenceColor(debrief.aiCompositeScore)}`}>{debrief.aiCompositeScore}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {rec ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${rec.bgClass} ${rec.colorClass}`}>{rec.label}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {debrief.decision ? (
                        <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">{debrief.decision}</span>
                      ) : (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusCfg.bg} ${statusCfg.text}`}>{statusCfg.label}</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <button className="font-medium text-brand hover:underline">Open</button>
                        <button className="font-medium text-muted-foreground hover:text-foreground">Schedule</button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Debrief cards */}
      {viewMode === "cards" && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((debrief, i) => (
          <DebriefCard key={debrief.id} debrief={debrief} index={i} />
        ))}
      </div>
      )}
    </div>
  );
}
