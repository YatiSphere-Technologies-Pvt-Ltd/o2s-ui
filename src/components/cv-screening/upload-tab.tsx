"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Sparkles,
  Check,
  Loader2,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SCREENING_RESULTS,
  scoreColor,
  recLabel,
  recBgColor,
  recColor,
  type ScreeningResult,
} from "@/components/cv-screening/data";

/* ── Processing Steps ── */

interface ProcessingStep {
  label: string;
  delayMs: number;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { label: "Parsing resume...", delayMs: 500 },
  { label: "Extracting skills & experience...", delayMs: 1000 },
  { label: "Matching against requirements...", delayMs: 1500 },
  { label: "Generating detailed analysis...", delayMs: 2000 },
  { label: "Complete!", delayMs: 2500 },
];

/* ── Requisition Options ── */

const REQUISITIONS = [
  { id: "REQ-2026-001", label: "REQ-2026-001: Senior Frontend Engineer" },
  { id: "REQ-2026-002", label: "REQ-2026-002: Backend Engineer" },
  { id: "REQ-2026-003", label: "REQ-2026-003: Product Designer" },
  { id: "REQ-2026-007", label: "REQ-2026-007: DevOps Engineer" },
];

/* ── Component ── */

interface UploadTabProps {
  onSwitchToResults?: () => void;
}

export function UploadTab({ onSwitchToResults }: UploadTabProps) {
  const [selectedReq, setSelectedReq] = useState(REQUISITIONS[0].id);
  const [useCustomReq, setUseCustomReq] = useState(false);
  const [customReq, setCustomReq] = useState("");
  const [optionsExpanded, setOptionsExpanded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [files, setFiles] = useState<string[]>([]);

  const [screeningOptions, setScreeningOptions] = useState({
    deepSkillAnalysis: true,
    experienceValidation: true,
    educationMatching: true,
    cultureFitSignals: true,
    redGreenFlagDetection: true,
    salaryRangeValidation: false,
  });

  const toggleOption = useCallback((key: keyof typeof screeningOptions) => {
    setScreeningOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleFileDrop = useCallback(() => {
    setFiles(["Sarah_Chen_Resume_2026.pdf", "Rahul_Sharma_CV.pdf", "Priya_Desai_Resume.pdf"]);
  }, []);

  const handleScreen = useCallback(() => {
    if (processing) return;
    setProcessing(true);
    setCompletedSteps([]);
    setActiveStep(0);

    PROCESSING_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setActiveStep(i);
        if (i > 0) {
          setCompletedSteps((prev) => [...prev, i - 1]);
        }
        if (i === PROCESSING_STEPS.length - 1) {
          setTimeout(() => {
            setCompletedSteps((prev) => [...prev, i]);
            setTimeout(() => {
              setProcessing(false);
              setActiveStep(-1);
              setCompletedSteps([]);
              if (onSwitchToResults) {
                onSwitchToResults();
              } else {
                window.location.href = "/cv-screening/results";
              }
            }, 600);
          }, 400);
        }
      }, step.delayMs);
    });
  }, [processing, onSwitchToResults]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Left: Upload & Configure (60%) ── */}
      <div className="flex-1 lg:w-[60%] space-y-6">
        {/* Drag & Drop Zone */}
        <button
          type="button"
          onClick={handleFileDrop}
          className="w-full border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-brand-purple/40 transition-colors cursor-pointer"
        >
          <Upload className="mx-auto size-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium text-foreground mb-1">
            Drop CVs here or click to browse
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports PDF, DOCX, DOC — up to 10 files at once
          </p>
          <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-overlay transition-colors">
            <FileText className="size-4" />
            Choose Files
          </span>
        </button>

        {/* Uploaded Files Preview */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="space-y-2"
            >
              {files.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5"
                >
                  <FileText className="size-4 text-brand-purple" />
                  <span className="text-sm text-foreground">{f}</span>
                  <Check className="ml-auto size-4 text-success" />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen Against */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Screen Against</h3>

          {!useCustomReq ? (
            <select
              value={selectedReq}
              onChange={(e) => setSelectedReq(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
            >
              {REQUISITIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          ) : (
            <textarea
              value={customReq}
              onChange={(e) => setCustomReq(e.target.value)}
              placeholder="Paste custom job requirements here..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-purple/50 min-h-[100px] resize-y"
            />
          )}

          <button
            type="button"
            onClick={() => setUseCustomReq((prev) => !prev)}
            className="text-xs text-brand-purple hover:underline"
          >
            {useCustomReq ? "Use Requisition Selector" : "Use Custom Requirements"}
          </button>
        </div>

        {/* AI Screening Options */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setOptionsExpanded((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            AI Screening Options
            {optionsExpanded ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {optionsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
                className="space-y-3 overflow-hidden"
              >
                {(
                  [
                    ["deepSkillAnalysis", "Deep skill analysis"],
                    ["experienceValidation", "Experience validation"],
                    ["educationMatching", "Education matching"],
                    ["cultureFitSignals", "Culture fit signals"],
                    ["redGreenFlagDetection", "Red/green flag detection"],
                    ["salaryRangeValidation", "Salary range validation"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={screeningOptions[key]}
                      onCheckedChange={() => toggleOption(key)}
                    />
                    <span className="text-sm text-foreground">{label}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Processing State */}
        <AnimatePresence>
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as const }}
              className="rounded-xl border border-brand-purple/30 bg-brand-purple/5 p-5 space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="size-4 text-brand-purple" />
                <span className="text-sm font-semibold text-brand-purple">
                  AI Screening in Progress
                </span>
              </div>
              {PROCESSING_STEPS.map((step, i) => {
                const isCompleted = completedSteps.includes(i);
                const isActive = activeStep === i && !isCompleted;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    {isCompleted ? (
                      <Check className="size-4 text-success" />
                    ) : isActive ? (
                      <Loader2 className="size-4 text-brand-purple animate-spin" />
                    ) : (
                      <div className="size-4 rounded-full border border-border" />
                    )}
                    <span
                      className={`text-sm ${
                        isCompleted
                          ? "text-success"
                          : isActive
                            ? "text-foreground"
                            : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <Button
          onClick={handleScreen}
          disabled={processing}
          className="w-full h-12 bg-brand-purple text-white hover:bg-brand-purple/90 text-base font-semibold"
        >
          {processing ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Screening...
            </>
          ) : (
            <>
              <Sparkles className="size-5" />
              Screen CVs with AI
            </>
          )}
        </Button>
      </div>

      {/* ── Right: Recent Results Preview (40%) ── */}
      <div className="lg:w-[40%] space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Screenings</h3>

        <div className="space-y-3">
          {SCREENING_RESULTS.map((result: ScreeningResult) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              className="bg-card border border-border rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 text-xs font-bold text-brand-purple">
                  {result.candidateInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {result.candidateName}
                    </span>
                    <span className={`text-lg font-bold ${scoreColor(result.overallScore)}`}>
                      {result.overallScore}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${recBgColor(result.recommendation)} ${recColor(result.recommendation)}`}
                  >
                    {recLabel(result.recommendation)}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {result.screenedAgainst} · {result.screenedAt}
                </span>
                <button
                  type="button"
                  onClick={() => onSwitchToResults ? onSwitchToResults() : (window.location.href = "/cv-screening/results")}
                  className="inline-flex items-center gap-1 text-xs text-brand-purple hover:underline"
                >
                  <Eye className="size-3" />
                  View Analysis
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
