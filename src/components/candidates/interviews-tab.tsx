"use client";

import {
  Sparkles,
  Check,
  AlertTriangle,
} from "lucide-react";
import { CANDIDATE_INTERVIEWS } from "@/components/candidates/data";

function recBadgeClass(rec: string): string {
  if (rec === "Strong Yes") return "bg-success/10 text-success";
  if (rec === "Advance") return "bg-brand/10 text-brand";
  if (rec === "No") return "bg-destructive/10 text-destructive";
  return "bg-secondary text-secondary-foreground";
}

export function InterviewsTab() {
  return (
    <div className="space-y-6">
      {/* Interview Timeline */}
      <div className="space-y-4">
        {CANDIDATE_INTERVIEWS.map((interview) => {
          const isCompleted = interview.status === "completed";
          const isScheduled = interview.status === "scheduled";

          return (
            <div
              key={interview.id}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-start gap-3">
                {/* Status dot */}
                <div
                  className={`mt-1 size-3 rounded-full shrink-0 ${
                    isCompleted ? "bg-success" : "bg-brand"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold">{interview.type}</h4>
                    {isScheduled && (
                      <span className="text-[10px] font-semibold bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {interview.interviewer} · {interview.date} ·{" "}
                    {interview.time} · {interview.duration} ·{" "}
                    {interview.platform}
                  </div>

                  {/* Completed details */}
                  {isCompleted && (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        {/* Rating stars */}
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <span
                              key={j}
                              className={`text-sm ${
                                j < (interview.rating ?? 0)
                                  ? "text-warning"
                                  : "text-muted-foreground/30"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {/* Recommendation */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${recBadgeClass(
                            interview.recommendation ?? ""
                          )}`}
                        >
                          {interview.recommendation}
                        </span>
                      </div>

                      {/* Summary quote */}
                      <p className="text-xs italic text-muted-foreground mb-3">
                        &ldquo;{interview.summary}&rdquo;
                      </p>

                      {/* Criteria ratings */}
                      <div className="flex flex-wrap gap-2">
                        {interview.criteriaRatings.map((cr) => (
                          <div
                            key={cr.criterion}
                            className="flex items-center gap-1.5 bg-surface-raised px-2 py-1 rounded-md"
                          >
                            <span className="text-xs text-muted-foreground">
                              {cr.criterion}
                            </span>
                            <span className="text-xs font-semibold">
                              {cr.score}/5
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Scheduled details */}
                  {isScheduled && (
                    <p className="text-xs text-muted-foreground">
                      Scheduled for {interview.date} at {interview.time} via{" "}
                      {interview.platform}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Synthesis */}
      <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple rounded-r-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-brand-purple" />
          <span className="text-sm font-semibold text-brand-purple">
            AI Interview Synthesis
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Across 3 completed interviews, Sarah Chen has demonstrated exceptional
          technical depth, particularly in frontend architecture and React
          ecosystem mastery. All interviewers rated her communication skills as
          outstanding (avg 4.7/5). She shows strong cultural alignment with team
          values around mentorship and collaboration.
        </p>

        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key Observations
          </h4>
          <div className="space-y-1.5">
            {[
              {
                icon: "check" as const,
                text: "Exceptional problem-solving with clear reasoning approach",
              },
              {
                icon: "check" as const,
                text: "Strong leadership signals — mentored 4 junior engineers at Google",
              },
              {
                icon: "check" as const,
                text: "Deep React/TypeScript expertise validated by technical screen",
              },
              {
                icon: "warning" as const,
                text: "Backend/system design depth needs further evaluation in final round",
              },
            ].map((obs) => (
              <div key={obs.text} className="flex items-start gap-2">
                {obs.icon === "check" ? (
                  <Check className="size-3.5 mt-0.5 text-success shrink-0" />
                ) : (
                  <AlertTriangle className="size-3.5 mt-0.5 text-warning shrink-0" />
                )}
                <span className="text-xs text-muted-foreground">{obs.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recommendation
          </h4>
          <p className="text-xs text-muted-foreground">
            Advance to System Design round with Rajesh Kumar. Focus areas:
            backend architecture understanding, distributed systems, and API
            design patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
