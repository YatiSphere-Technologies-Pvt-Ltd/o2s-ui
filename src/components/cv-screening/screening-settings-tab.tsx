"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Shield, Sliders } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

/* ── Types ── */

interface ScoringWeight {
  label: string;
  value: number;
  color: string;
}

/* ── Component ── */

export function ScreeningSettingsTab() {
  const [autoScreening, setAutoScreening] = useState(true);
  const [advanceThreshold, setAdvanceThreshold] = useState(80);
  const [rejectThreshold, setRejectThreshold] = useState(30);

  const [biasChecks, setBiasChecks] = useState({
    blindScreening: true,
    removePhotos: true,
    ignoreSchoolPrestige: true,
    flagProtectedCharacteristics: true,
    adverseImpactCheck: true,
  });

  const scoringWeights: ScoringWeight[] = [
    { label: "Skills Match", value: 35, color: "bg-brand-purple" },
    { label: "Experience", value: 25, color: "bg-brand-teal" },
    { label: "Education", value: 10, color: "bg-brand" },
    { label: "Culture Fit", value: 15, color: "bg-warning" },
    { label: "Communication", value: 15, color: "bg-success" },
  ];

  const total = scoringWeights.reduce((acc, w) => acc + w.value, 0);
  const holdMin = rejectThreshold;
  const holdMax = advanceThreshold - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
      className="space-y-6 max-w-3xl"
    >
      {/* ── Auto-Screening Rules ── */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sliders className="size-4 text-brand-purple" />
          Auto-Screening Rules
        </h3>

        {/* Enable toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={autoScreening}
            onCheckedChange={() => setAutoScreening((prev) => !prev)}
          />
          <span className="text-sm text-foreground">
            Enable auto-screening for new applications
          </span>
        </label>

        {/* Auto-advance threshold */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Auto-advance threshold</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">Score &ge;</span>
              <input
                type="number"
                value={advanceThreshold}
                onChange={(e) => setAdvanceThreshold(Number(e.target.value))}
                min={1}
                max={100}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-success transition-all"
              style={{ width: `${advanceThreshold}%` }}
            />
          </div>
        </div>

        {/* Auto-reject threshold */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Auto-reject threshold</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">Score &lt;</span>
              <input
                type="number"
                value={rejectThreshold}
                onChange={(e) => setRejectThreshold(Number(e.target.value))}
                min={0}
                max={99}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground text-center focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-border">
            <div
              className="h-2 rounded-full bg-destructive transition-all"
              style={{ width: `${rejectThreshold}%` }}
            />
          </div>
        </div>

        {/* Hold for manual review */}
        <div className="rounded-lg border border-border bg-surface-overlay/50 px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Hold for manual review: {holdMin}–{holdMax}
          </span>
        </div>
      </div>

      {/* ── Scoring Weights ── */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sliders className="size-4 text-brand-teal" />
          Scoring Weights
        </h3>

        {scoringWeights.map((w) => (
          <div key={w.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{w.label}</span>
              <span className="text-sm font-medium text-foreground">{w.value}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-border">
              <div
                className={`h-2 rounded-full ${w.color}`}
                style={{ width: `${w.value}%` }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className={`text-sm font-bold ${total === 100 ? "text-success" : "text-destructive"}`}>
            {total}%
          </span>
        </div>
      </div>

      {/* ── Bias Safeguards ── */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Shield className="size-4 text-success" />
          Bias Safeguards
        </h3>

        {(
          [
            ["blindScreening", "Blind screening — remove names and identifying info"],
            ["removePhotos", "Remove candidate photos during screening"],
            ["ignoreSchoolPrestige", "Ignore school prestige ranking in scoring"],
            ["flagProtectedCharacteristics", "Flag and redact protected characteristics"],
            ["adverseImpactCheck", "Run adverse impact analysis on screening results"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={biasChecks[key]}
              onCheckedChange={() =>
                setBiasChecks((prev) => ({ ...prev, [key]: !prev[key] }))
              }
            />
            <span className="text-sm text-foreground">{label}</span>
          </label>
        ))}
      </div>

      {/* ── AI Model ── */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
          <Bot className="size-4 text-brand-purple" />
          AI Model
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-foreground">O2S Intelligence v2.4</span>
          <span className="inline-flex items-center rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            Latest
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Multi-modal CV analysis with skill extraction, experience validation, and bias-aware scoring.
        </p>
      </div>
    </motion.div>
  );
}
