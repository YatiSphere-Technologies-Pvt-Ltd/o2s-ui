"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Star, Send, Eye, LayoutGrid, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SCORECARDS,
  REC_CONFIG,
  INTERVIEW_COUNTS,
  confidenceColor,
  type Scorecard,
} from "@/components/interviews/data";

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

type FilterStatus = "all" | "pending" | "completed" | "overdue";

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`size-3 ${
            i < score ? "fill-warning text-warning" : "text-secondary"
          }`}
        />
      ))}
    </div>
  );
}

function CompletedCard({ scorecard, index }: { scorecard: Scorecard; index: number }) {
  const rec = scorecard.recommendation ? REC_CONFIG[scorecard.recommendation] : null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{scorecard.candidate}</p>
          <p className="text-xs text-muted-foreground">
            {scorecard.type} &middot; {scorecard.interviewer}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Submitted {scorecard.submittedDate}
          </p>
        </div>
        {rec && (
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${rec.bgClass} ${rec.colorClass}`}>
            {rec.label}
          </span>
        )}
      </div>

      {/* Hire confidence bar */}
      {scorecard.hireConfidence !== null && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-muted-foreground">Hire Confidence</span>
            <span className={`font-bold ${confidenceColor(scorecard.hireConfidence)}`}>
              {scorecard.hireConfidence}%
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-secondary">
            <div
              className={`h-1.5 rounded-full ${
                scorecard.hireConfidence >= 85
                  ? "bg-success"
                  : scorecard.hireConfidence >= 70
                  ? "bg-brand-teal"
                  : scorecard.hireConfidence >= 55
                  ? "bg-warning"
                  : "bg-destructive"
              }`}
              style={{ width: `${scorecard.hireConfidence}%` }}
            />
          </div>
        </div>
      )}

      {/* Criteria ratings */}
      {scorecard.ratings.length > 0 && (
        <div className="mt-3 flex flex-col gap-1.5">
          {scorecard.ratings.map((r) => (
            <div key={r.criterion} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{r.criterion}</span>
              <StarRating score={r.score} />
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 border-t border-border pt-3">
        <button className="text-xs font-medium text-brand hover:underline">
          <Eye className="mr-1 inline size-3" />
          View Full Feedback
        </button>
      </div>
    </motion.div>
  );
}

function PendingCard({ scorecard, index }: { scorecard: Scorecard; index: number }) {
  const isOverdue = scorecard.status === "overdue";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`rounded-xl border border-border bg-card p-5 ${
        isOverdue ? "border-destructive/30 bg-destructive/5" : ""
      }`}
    >
      {isOverdue && scorecard.overdueDays !== undefined && (
        <div className="mb-3 rounded-md bg-destructive/10 px-2 py-1">
          <span className="text-[10px] font-bold text-destructive">
            OVERDUE: {scorecard.overdueDays} days
          </span>
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-foreground">{scorecard.candidate}</p>
        <p className="text-xs text-muted-foreground">
          {scorecard.type} &middot; {scorecard.interviewer}
        </p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Interview: {scorecard.interviewDate}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90" size="sm">
          Submit Feedback
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Send className="size-3" />
          Send Reminder
        </Button>
      </div>
    </motion.div>
  );
}

export function FeedbackTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const overdueCount = INTERVIEW_COUNTS.overdueFeedback;
  const pendingCount = INTERVIEW_COUNTS.pendingFeedback;

  const filtered = SCORECARDS.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
    { key: "overdue", label: "Overdue" },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Alert banner */}
      {(overdueCount > 0 || pendingCount > 0) && (
        <div className="flex items-center gap-2 rounded-lg border-l-[3px] border-destructive bg-destructive/5 p-3">
          <AlertTriangle className="size-4 text-destructive" />
          <span className="text-xs text-foreground">
            <span className="font-semibold text-destructive">{overdueCount} overdue</span>{" "}
            and{" "}
            <span className="font-semibold text-warning">{pendingCount} pending</span>{" "}
            feedback submissions
          </span>
        </div>
      )}

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
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Type</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Interviewer</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Interview Date</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Recommendation</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Confidence</th>
                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sc, i) => {
                const rec = sc.recommendation ? REC_CONFIG[sc.recommendation] : null;
                const statusCfg: Record<string, { dot: string; label: string }> = {
                  completed: { dot: "bg-success", label: "Completed" },
                  pending: { dot: "bg-warning", label: "Pending" },
                  overdue: { dot: "bg-destructive", label: "Overdue" },
                };
                const st = statusCfg[sc.status];
                return (
                  <motion.tr
                    key={sc.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-3 py-3 font-medium text-foreground">{sc.candidate}</td>
                    <td className="px-3 py-3 text-muted-foreground">{sc.type}</td>
                    <td className="px-3 py-3 text-muted-foreground">{sc.interviewer}</td>
                    <td className="px-3 py-3 text-muted-foreground">{sc.interviewDate}</td>
                    <td className="px-3 py-3">
                      <span className="flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {rec ? (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${rec.bgClass} ${rec.colorClass}`}>{rec.label}</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {sc.hireConfidence !== null ? (
                        <span className={`font-bold ${confidenceColor(sc.hireConfidence)}`}>{sc.hireConfidence}%</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {sc.status === "completed" ? (
                        <button className="font-medium text-brand hover:underline">View</button>
                      ) : (
                        <button className="font-medium text-brand hover:underline">Submit</button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Scorecard list */}
      {viewMode === "cards" && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((sc, i) =>
          sc.status === "completed" ? (
            <CompletedCard key={sc.id} scorecard={sc} index={i} />
          ) : (
            <PendingCard key={sc.id} scorecard={sc} index={i} />
          )
        )}
      </div>
      )}
    </div>
  );
}
