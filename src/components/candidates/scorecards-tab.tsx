"use client";

import { Info } from "lucide-react";
import {
  CANDIDATE_INTERVIEWS,
  SCORECARD_COMPARISON,
} from "@/components/candidates/data";

function recBadgeClass(rec: string): string {
  if (rec === "Strong Yes") return "bg-success/10 text-success";
  if (rec === "Advance") return "bg-brand/10 text-brand";
  if (rec === "No") return "bg-destructive/10 text-destructive";
  return "bg-secondary text-secondary-foreground";
}

function scoreTextColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score === 5) return "text-success";
  if (score === 4) return "text-brand-teal";
  if (score === 3) return "text-brand";
  if (score === 2) return "text-warning";
  return "text-destructive";
}

export function ScorecardsTab() {
  const completedInterviews = CANDIDATE_INTERVIEWS.filter(
    (i) => i.status === "completed"
  );

  return (
    <div className="space-y-6">
      {/* Anti-anchoring note */}
      <div className="bg-brand/5 border-l-[3px] border-brand p-3 rounded-r-lg flex items-start gap-2">
        <Info className="size-4 text-brand shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Anti-anchoring note:
          </span>{" "}
          Each interviewer submitted their scorecard independently before seeing
          other evaluations. Scores are shown together here for comparison
          purposes only.
        </p>
      </div>

      {/* Individual Scorecards */}
      <div className="space-y-4">
        {completedInterviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-card border border-border rounded-xl p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-brand-purple/20 text-brand-purple flex items-center justify-center text-xs font-bold">
                  {interview.interviewerInitials}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {interview.interviewer}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {interview.type} · {interview.date}
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${recBadgeClass(
                  interview.recommendation ?? ""
                )}`}
              >
                {interview.recommendation}
              </span>
            </div>

            {/* Criteria ratings */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {interview.criteriaRatings.map((cr) => (
                <div
                  key={cr.criterion}
                  className="flex items-center justify-between bg-surface-raised px-3 py-2 rounded-lg"
                >
                  <span className="text-xs text-muted-foreground">
                    {cr.criterion}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <span
                        key={j}
                        className={`text-xs ${
                          j < cr.score
                            ? "text-warning"
                            : "text-muted-foreground/30"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <p className="text-xs text-muted-foreground italic">
              &ldquo;{interview.summary}&rdquo;
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Matrix */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs text-muted-foreground font-medium py-2 pr-4">
                  Criteria
                </th>
                <th className="text-center text-xs text-muted-foreground font-medium py-2 px-4">
                  Alex Rivera
                </th>
                <th className="text-center text-xs text-muted-foreground font-medium py-2 px-4">
                  Sarah Kim
                </th>
                <th className="text-center text-xs text-muted-foreground font-medium py-2 px-4">
                  Maria Lopez
                </th>
              </tr>
            </thead>
            <tbody>
              {SCORECARD_COMPARISON.map((row) => (
                <tr key={row.criterion} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4 text-xs font-medium">
                    {row.criterion}
                  </td>
                  {(["alex", "sarah", "maria"] as const).map((col) => {
                    const val = row[col];
                    return (
                      <td
                        key={col}
                        className={`text-center py-2 px-4 text-sm font-semibold ${scoreTextColor(val)}`}
                      >
                        {val !== null ? val : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Overall recommendation row */}
              <tr className="border-t-2 border-border">
                <td className="py-2 pr-4 text-xs font-semibold">
                  Overall
                </td>
                <td className="text-center py-2 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                    Strong Yes
                  </span>
                </td>
                <td className="text-center py-2 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                    Advance
                  </span>
                </td>
                <td className="text-center py-2 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
                    Advance
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
