"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Check,
  X,
  Minus,
  CircleAlert,
  CircleCheck,
  Flag,
  HelpCircle,
  ArrowUpRight,
  Download,
  CalendarCheck,
  UserPlus,
  XCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SCREENING_RESULTS,
  scoreColor,
  scoreBgColor,
  recLabel,
  recBgColor,
  recColor,
  proficiencyColor,
  proficiencyBar,
  type ScreeningResult,
} from "@/components/cv-screening/data";

/* ── Component ── */

export function ResultsTab() {
  const [selectedId, setSelectedId] = useState(SCREENING_RESULTS[0].id);
  const result = SCREENING_RESULTS.find((r) => r.id === selectedId) ?? SCREENING_RESULTS[0];

  const matchedSkills = result.skillMatches.filter((s) => s.required && s.found).length;
  const totalRequired = result.skillMatches.filter((s) => s.required).length;

  const breakdownItems = [
    { label: "Skills", score: result.skillsScore },
    { label: "Experience", score: result.experienceScore },
    { label: "Education", score: result.educationScore },
    { label: "Culture Fit", score: result.cultureFitScore },
    { label: "Communication", score: result.communicationScore },
  ];

  const trajectoryConfig: Record<string, { label: string; colorClass: string }> = {
    ascending: { label: "Ascending", colorClass: "text-success bg-success/10" },
    lateral: { label: "Lateral", colorClass: "text-warning bg-warning/10" },
    mixed: { label: "Mixed", colorClass: "text-muted-foreground bg-muted" },
    declining: { label: "Declining", colorClass: "text-destructive bg-destructive/10" },
  };

  const relevanceConfig: Record<string, { colorClass: string }> = {
    high: { colorClass: "text-success bg-success/10" },
    medium: { colorClass: "text-warning bg-warning/10" },
    low: { colorClass: "text-muted-foreground bg-muted" },
  };

  const severityConfig: Record<string, { colorClass: string }> = {
    high: { colorClass: "text-destructive bg-destructive/10" },
    medium: { colorClass: "text-warning bg-warning/10" },
    low: { colorClass: "text-muted-foreground bg-muted" },
  };

  return (
    <div className="space-y-6">
      {/* ── Result Selector ── */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {SCREENING_RESULTS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setSelectedId(r.id)}
            className={`flex items-center gap-3 shrink-0 rounded-xl border px-4 py-3 transition-colors ${
              r.id === selectedId
                ? "border-brand-purple bg-brand-purple/5"
                : "border-border bg-card hover:bg-surface-overlay"
            }`}
          >
            <div className="flex size-9 items-center justify-center rounded-full bg-brand-purple/15 text-xs font-bold text-brand-purple">
              {r.candidateInitials}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{r.candidateName}</p>
              <span className={`text-lg font-bold ${scoreColor(r.overallScore)}`}>
                {r.overallScore}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* ── A. Score Overview Card ── */}
      <motion.div
        key={result.id + "-score"}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Circular Score */}
          <div className="flex flex-col items-center gap-3">
            <div
              className={`flex size-24 items-center justify-center rounded-full border-4 ${scoreColor(result.overallScore).replace("text-", "border-")}`}
            >
              <span className={`text-3xl font-bold ${scoreColor(result.overallScore)}`}>
                {result.overallScore}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${recBgColor(result.recommendation)} ${recColor(result.recommendation)}`}
            >
              {recLabel(result.recommendation)}
            </span>
            <span className="text-xs text-muted-foreground">
              {result.confidence}% confidence
            </span>
          </div>

          {/* Right: Breakdown Bars */}
          <div className="flex-1 space-y-3">
            {breakdownItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className={`text-xs font-medium ${scoreColor(item.score)}`}>
                    {item.score}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-border">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${scoreBgColor(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Top {result.percentileRank > 50 ? 100 - result.percentileRank : result.percentileRank}% of {result.comparedTo} candidates screened for this role
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── B. AI Summary ── */}
      <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-4 rounded-r-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="size-4 text-brand-purple" />
          <span className="text-sm font-semibold text-brand-purple">AI Assessment</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{result.aiSummary}</p>
        <p className="text-sm font-semibold text-foreground mt-3">{result.aiRecommendation}</p>
      </div>

      {/* ── C. Skills Analysis ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Skills Match</h3>
          <span className="text-xs text-muted-foreground">
            {matchedSkills}/{totalRequired} required skills matched
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="text-left py-2 pr-3 font-medium">Skill</th>
                <th className="text-center py-2 px-2 font-medium">Required</th>
                <th className="text-center py-2 px-2 font-medium">Found</th>
                <th className="text-left py-2 px-2 font-medium">Proficiency</th>
                <th className="text-left py-2 px-2 font-medium hidden lg:table-cell">Evidence</th>
                <th className="text-right py-2 pl-2 font-medium">Exp</th>
              </tr>
            </thead>
            <tbody>
              {result.skillMatches.map((skill) => {
                const isRequiredMissing = skill.required && !skill.found;
                const isPreferredFound = !skill.required && skill.found;
                const rowBg = isRequiredMissing
                  ? "bg-destructive/5"
                  : isPreferredFound
                    ? "bg-success/5"
                    : "";
                return (
                  <tr key={skill.skill} className={`border-b border-border/50 ${rowBg}`}>
                    <td className="py-2.5 pr-3 font-medium text-foreground">{skill.skill}</td>
                    <td className="text-center py-2.5 px-2">
                      {skill.required ? (
                        <Check className="inline size-4 text-foreground" />
                      ) : (
                        <Minus className="inline size-4 text-muted-foreground" />
                      )}
                    </td>
                    <td className="text-center py-2.5 px-2">
                      {skill.found ? (
                        <Check className="inline size-4 text-success" />
                      ) : (
                        <X className="inline size-4 text-destructive" />
                      )}
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-border">
                          <div
                            className={`h-1.5 rounded-full ${scoreBgColor(proficiencyBar(skill.proficiency))}`}
                            style={{ width: `${proficiencyBar(skill.proficiency)}%` }}
                          />
                        </div>
                        <span className={`text-xs capitalize ${proficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency === "not_found" ? "N/A" : skill.proficiency}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                      {skill.evidence}
                    </td>
                    <td className="text-right py-2.5 pl-2 text-xs text-muted-foreground">
                      {skill.yearsOfExperience != null ? `${skill.yearsOfExperience}y` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── D. Strengths & Concerns ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-l-[3px] border-success bg-success/5 p-4 rounded-r-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Strengths</h3>
          <ul className="space-y-2">
            {result.aiStrengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CircleCheck className="size-4 text-success shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="border-l-[3px] border-warning bg-warning/5 p-4 rounded-r-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Concerns</h3>
          <ul className="space-y-2">
            {result.aiConcerns.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CircleAlert className="size-4 text-warning shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── E. Green Flags & Red Flags ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Green Flags */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Flag className="size-4 text-success" />
            Green Flags
          </h3>
          {result.greenFlags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No green flags detected</p>
          ) : (
            <ul className="space-y-3">
              {result.greenFlags.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="inline-flex shrink-0 items-center rounded-md bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success capitalize">
                    {f.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-sm text-foreground">{f.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Red Flags */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Flag className="size-4 text-destructive" />
            Red Flags
          </h3>
          {result.redFlags.length === 0 ? (
            <p className="text-sm text-muted-foreground">No red flags detected</p>
          ) : (
            <ul className="space-y-3">
              {result.redFlags.map((f, i) => (
                <li key={i} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <span
                      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize ${severityConfig[f.severity]?.colorClass ?? "text-muted-foreground bg-muted"}`}
                    >
                      {f.severity}
                    </span>
                    <span className="text-sm text-foreground">{f.description}</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-[calc(0.375rem+0.5rem+4ch)]">
                    {f.recommendation}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── F. Experience Timeline ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="size-4 text-muted-foreground" />
            Experience Timeline
          </h3>
          {trajectoryConfig[result.experience.careerTrajectory] && (
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${trajectoryConfig[result.experience.careerTrajectory].colorClass}`}
            >
              <ArrowUpRight className="size-3" />
              {trajectoryConfig[result.experience.careerTrajectory].label}
            </span>
          )}
        </div>
        <div className="relative ml-3 border-l-2 border-border pl-6 space-y-5">
          {result.experience.companies.map((company, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[calc(1.5rem+5px)] top-1 size-2.5 rounded-full bg-brand-purple" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">{company.name}</span>
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium capitalize ${relevanceConfig[company.relevance]?.colorClass ?? "bg-muted text-muted-foreground"}`}
                >
                  {company.relevance}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{company.role}</p>
              <p className="text-xs text-muted-foreground">{company.duration}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          {result.experience.totalYears} years total · {result.experience.relevantYears} years relevant · {result.experience.industryMatch}% industry match
        </p>
      </div>

      {/* ── G. Suggested Interview Focus ── */}
      {result.suggestedInterviewFocus.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <HelpCircle className="size-4 text-muted-foreground" />
            Suggested Interview Focus
          </h3>
          <ol className="space-y-2">
            {result.suggestedInterviewFocus.map((q, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-purple/10 text-[10px] font-bold text-brand-purple">
                  {i + 1}
                </span>
                {q}
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground mt-4 italic">
            These questions are AI-generated based on the candidate&apos;s profile and role requirements
          </p>
        </div>
      )}

      {/* ── H. Actions Bar ── */}
      <div className="sticky bottom-0 flex items-center gap-3 bg-background/80 backdrop-blur-sm border-t border-border py-4 -mx-1 px-1">
        <Button className="bg-success text-white hover:bg-success/90">
          <UserPlus className="size-4" />
          Advance to Pipeline
        </Button>
        <Button variant="outline">
          <CalendarCheck className="size-4" />
          Schedule Interview
        </Button>
        <Button variant="outline" className="text-destructive hover:text-destructive">
          <XCircle className="size-4" />
          Reject
        </Button>
        <Button variant="ghost" className="ml-auto">
          <Download className="size-4" />
          Download Report (PDF)
        </Button>
      </div>
    </div>
  );
}
