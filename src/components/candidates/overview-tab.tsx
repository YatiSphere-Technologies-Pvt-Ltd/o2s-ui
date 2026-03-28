"use client";

import { Sparkles, Check } from "lucide-react";
import {
  CANDIDATE,
  PIPELINE_STAGES,
  SKILLS_MATCH,
  CANDIDATE_INTERVIEWS,
  stageColor,
  skillStatusColor,
  skillStatusIcon,
} from "@/components/candidates/data";

function recBadgeClass(rec: string): string {
  if (rec === "Strong Yes") return "bg-success/10 text-success";
  if (rec === "Advance") return "bg-brand/10 text-brand";
  if (rec === "No") return "bg-destructive/10 text-destructive";
  return "bg-secondary text-secondary-foreground";
}

export function OverviewTab() {
  const completedInterviews = CANDIDATE_INTERVIEWS.filter(
    (i) => i.status === "completed"
  );

  return (
    <div className="space-y-6">
      {/* AI Assessment */}
      <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-brand-purple" />
          <span className="text-sm font-semibold text-brand-purple">
            AI Assessment
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sarah Chen is a highly qualified candidate with 7 years of frontend
          engineering experience at Google and Stripe. Her deep expertise in
          React, TypeScript, and performance optimization aligns strongly with
          the Senior Frontend Engineer role. Minor gaps in GraphQL and backend
          Node.js are offset by exceptional communication skills and proven
          leadership in mentoring junior engineers. Recommend advancing to final
          round.
        </p>
      </div>

      {/* Application Details */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Application Details</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {[
            { label: "Requisition", value: CANDIDATE.requisition },
            { label: "Applied Date", value: CANDIDATE.appliedDate },
            { label: "Source", value: CANDIDATE.source },
            { label: "Current Role", value: `${CANDIDATE.role} @ ${CANDIDATE.company}` },
            { label: "Notice Period", value: CANDIDATE.noticePeriod },
            { label: "Expected CTC", value: CANDIDATE.expectedCtc },
          ].map((item) => (
            <div key={item.label}>
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Timeline */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Pipeline Timeline</h3>
        <div className="flex items-center justify-between">
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.name} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`size-8 rounded-full flex items-center justify-center ${stageColor(stage.status)} ${
                    stage.status === "current" ? "animate-pulse" : ""
                  }`}
                >
                  {stage.status === "completed" ? (
                    <Check className="size-4 text-white" />
                  ) : stage.status === "current" ? (
                    <span className="size-2 rounded-full bg-white" />
                  ) : (
                    <span className="size-2 rounded-full bg-muted-foreground/30" />
                  )}
                </div>
                <span className="text-xs font-medium">{stage.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {stage.date}
                </span>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    stage.status === "completed"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Skills Match */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Skills Match</h3>
          <span className="text-xs text-muted-foreground">
            {SKILLS_MATCH.matchCount}/{SKILLS_MATCH.totalRequired} required
            matched
          </span>
        </div>
        <div className="space-y-2">
          {SKILLS_MATCH.required.map((skill) => (
            <div
              key={skill.skill}
              className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold ${skillStatusColor(skill.status)}`}
                >
                  {skillStatusIcon(skill.status)}
                </span>
                <span className="text-sm font-medium">{skill.skill}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {skill.detail}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Summary */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Decision Summary</h3>
        <div className="flex gap-3 overflow-x-auto">
          {completedInterviews.map((interview) => (
            <div
              key={interview.id}
              className="flex-shrink-0 bg-surface-raised border border-border rounded-lg p-3 w-64"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {interview.interviewer}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span
                      key={j}
                      className={`text-xs ${
                        j < (interview.rating ?? 0)
                          ? "text-warning"
                          : "text-muted-foreground/30"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <span
                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${recBadgeClass(
                  interview.recommendation ?? ""
                )}`}
              >
                {interview.recommendation}
              </span>
              <p className="text-xs italic text-muted-foreground mt-2 line-clamp-2">
                &ldquo;{interview.summary}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
