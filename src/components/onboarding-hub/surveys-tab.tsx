"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import {
  AGGREGATE_SCORES,
  SURVEY_RESPONSES,
} from "@/components/onboarding-hub/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

function TrendArrow({ trend }: { trend: number }) {
  if (trend > 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-success">
        <TrendingUp className="size-3" />+{trend.toFixed(1)}
      </span>
    );
  if (trend < 0)
    return (
      <span className="flex items-center gap-0.5 text-xs text-destructive">
        <TrendingDown className="size-3" />
        {trend.toFixed(1)}
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
      <Minus className="size-3" />
      0.0
    </span>
  );
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="w-16 truncate">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-brand-teal"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right font-medium text-foreground">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

export function SurveysTab() {
  return (
    <div className="space-y-6">
      {/* Aggregate Scores */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          Aggregate Pulse Scores
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {AGGREGATE_SCORES.map((score) => (
            <motion.div
              key={score.dimension}
              variants={cardVariants}
              transition={{
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className="flex items-center gap-3"
            >
              <span className="w-40 truncate text-sm text-foreground">
                {score.dimension}
              </span>
              <div className="h-2 flex-1 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-brand-teal transition-all"
                  style={{ width: `${(score.score / 5) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-sm font-semibold text-foreground">
                {score.score.toFixed(1)}
              </span>
              <TrendArrow trend={score.trend} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Individual Responses */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">
          Individual Responses
        </h3>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {SURVEY_RESPONSES.map((response) => (
            <motion.div
              key={response.id}
              variants={cardVariants}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94] as const,
              }}
              className={`rounded-xl border border-border bg-card p-5 ${
                response.atRisk
                  ? "border-l-[3px] border-l-destructive bg-destructive/5"
                  : ""
              }`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {response.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {response.role}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>{response.surveyType} Survey</div>
                  <div>{response.date}</div>
                </div>
              </div>

              {/* Dimension Scores */}
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <ScoreBar score={response.overall} label="Overall" />
                <ScoreBar score={response.manager} label="Manager" />
                <ScoreBar score={response.clarity} label="Clarity" />
                <ScoreBar score={response.belonging} label="Belonging" />
              </div>

              {/* Comment */}
              <p className="mt-3 text-xs text-muted-foreground italic">
                &ldquo;{response.comment}&rdquo;
              </p>

              {/* AI Action */}
              {response.aiAction && (
                <div className="mt-3 flex items-start gap-2 rounded-r-lg border-l-[3px] border-brand-teal bg-brand-teal/5 p-2">
                  <Sparkles className="size-3.5 flex-shrink-0 text-brand-teal mt-0.5" />
                  <p className="text-[10px] text-brand-teal">
                    {response.aiAction}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* AI Sentiment Section */}
      <div className="rounded-r-lg border-l-[3px] border-brand-teal bg-brand-teal/5 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="size-4 text-brand-teal" />
          <h3 className="text-sm font-semibold text-brand-teal">
            AI Sentiment Analysis
          </h3>
        </div>

        <div className="space-y-3 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-success">Positive themes:</span>{" "}
            Team culture, buddy program effectiveness, tool access speed
          </div>
          <div>
            <span className="font-medium text-warning">Neutral themes:</span>{" "}
            Onboarding documentation completeness, cross-team introductions
          </div>
          <div>
            <span className="font-medium text-destructive">
              Negative themes:
            </span>{" "}
            Role clarity for marketing hires, insufficient product training for
            sales
          </div>
          <div className="mt-2 rounded-lg bg-card p-3 text-xs">
            <span className="font-medium text-foreground">
              Recommendations:
            </span>{" "}
            (1) Add department-specific onboarding tracks for Sales and
            Marketing. (2) Schedule mid-week manager check-ins during Week 1.
            (3) Create pre-read library for product knowledge.
          </div>
        </div>
      </div>
    </div>
  );
}
