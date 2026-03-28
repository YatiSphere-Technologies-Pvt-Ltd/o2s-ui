"use client";

import { ChevronLeft, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  JOURNEY_STAGES,
  journeyStageStatus,
  healthBgColor,
  healthColor,
  type HiringJourney,
  type TAPage,
} from "@/components/ta/journey-data";

interface JourneyContextBarProps {
  journey: HiringJourney;
  currentPage: TAPage;
  onBack?: () => void;
}

const PAGE_LABELS: Record<TAPage, string> = {
  pipeline: "Pipeline",
  requisitions: "Requisitions",
  pool: "Talent Pool",
  vendors: "Vendors",
  interviews: "Interviews",
  candidates: "Candidates",
};

export function JourneyContextBar({ journey, currentPage, onBack }: JourneyContextBarProps) {
  const stageStatuses = journeyStageStatus(journey);

  return (
    <div className="bg-brand-purple/[0.04] border border-brand-purple/10 rounded-xl p-4 mb-6">
      {/* Top row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="gap-1 text-muted-foreground hover:text-foreground h-7 px-2"
            >
              <ChevronLeft className="size-4" />
              All {PAGE_LABELS[currentPage]}
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {journey.requisitionId} &rsaquo; {journey.jobTitle} &rsaquo;{" "}
            {journey.totalCandidates} candidates
          </span>
        </div>
      </div>

      {/* Stage indicators */}
      <div className="flex items-start gap-0 mb-4">
        {JOURNEY_STAGES.map((stage, i) => {
          const status = stageStatuses[stage.key];
          return (
            <div key={stage.key} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                {/* Dot + connector row */}
                <div className="flex items-center w-full">
                  {/* Left connector */}
                  {i > 0 && (
                    <div
                      className={`h-[2px] flex-1 ${
                        status === "completed" || stageStatuses[JOURNEY_STAGES[i - 1].key] === "completed"
                          ? "bg-success"
                          : "bg-border"
                      }`}
                    />
                  )}
                  {i === 0 && <div className="flex-1" />}

                  {/* Dot */}
                  <div
                    className={`size-5 rounded-full flex items-center justify-center shrink-0 ${
                      status === "completed"
                        ? "bg-success"
                        : status === "active"
                          ? "bg-brand-purple ring-4 ring-brand-purple/20 animate-pulse"
                          : "bg-secondary"
                    }`}
                  >
                    {status === "completed" && (
                      <Check className="size-3 text-white" />
                    )}
                  </div>

                  {/* Right connector */}
                  {i < JOURNEY_STAGES.length - 1 && (
                    <div
                      className={`h-[2px] flex-1 ${
                        status === "completed" ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}
                  {i === JOURNEY_STAGES.length - 1 && <div className="flex-1" />}
                </div>

                {/* Label */}
                <span className="text-[10px] text-muted-foreground mt-1.5 text-center">
                  {stage.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row: Health + Bottleneck */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[160px]">
          <span className="text-xs text-muted-foreground">
            Health: {journey.healthScore}/100
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-secondary max-w-[80px]">
            <div
              className={`h-1.5 rounded-full ${healthBgColor(journey.healthScore)}`}
              style={{ width: `${journey.healthScore}%` }}
            />
          </div>
        </div>

        {journey.bottleneck && (
          <span className="inline-flex items-center gap-1 bg-warning/10 text-warning text-xs rounded-full px-2 py-0.5">
            <AlertTriangle className="size-3" />
            {journey.bottleneck}
          </span>
        )}
      </div>
    </div>
  );
}
