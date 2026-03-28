"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Contact,
  Search,
  ChevronDown,
  Eye,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CANDIDATES_LIST,
  CANDIDATE_TABS,
  STAGE_CONFIG,
  scoreColor,
  type CandidateListItem,
  type CandidateTab,
} from "@/components/candidates/data";
import { TASubNav } from "@/components/ta/ta-sub-nav";
import { OverviewTab } from "@/components/candidates/overview-tab";
import { ResumeTab } from "@/components/candidates/resume-tab";
import { InterviewsTab } from "@/components/candidates/interviews-tab";
import { ScorecardsTab } from "@/components/candidates/scorecards-tab";
import { CommunicationTab } from "@/components/candidates/communication-tab";
import { OfferTab } from "@/components/candidates/offer-tab";
import { DocumentsTab } from "@/components/candidates/documents-tab";
import { ActivityTab } from "@/components/candidates/activity-tab";

/* ================================================================
   Animation variants
   ================================================================ */

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const slideOverVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 300,
      duration: 0.3,
    },
  },
  exit: {
    x: "100%",
    transition: {
      duration: 0.2,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

/* ================================================================
   Helpers
   ================================================================ */

function tagStyle(tag: string): string {
  switch (tag) {
    case "Strong Hire":
      return "bg-success/10 text-success";
    case "Fast Track":
      return "bg-brand/10 text-brand";
    case "AI Sourced":
      return "bg-brand-purple/10 text-brand-purple";
    case "Referred":
      return "bg-info/10 text-info";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

function avatarBgFromName(name: string): string {
  const colors = [
    "bg-brand",
    "bg-brand-purple",
    "bg-brand-teal",
    "bg-success",
    "bg-warning",
    "bg-info",
    "bg-destructive",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function renderTab(tab: CandidateTab) {
  switch (tab) {
    case "overview":
      return <OverviewTab />;
    case "resume":
      return <ResumeTab />;
    case "interviews":
      return <InterviewsTab />;
    case "scorecards":
      return <ScorecardsTab />;
    case "communication":
      return <CommunicationTab />;
    case "offer":
      return <OfferTab />;
    case "documents":
      return <DocumentsTab />;
    case "activity":
      return <ActivityTab />;
    default:
      return null;
  }
}

/* ================================================================
   Dropdown Component
   ================================================================ */

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}: {value === "All" ? "All" : value}
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-40 w-48 rounded-lg border border-border bg-card shadow-lg py-1 max-h-60 overflow-y-auto scrollbar-thin">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                  value === opt
                    ? "bg-brand/10 text-brand font-medium"
                    : "text-muted-foreground hover:bg-surface-overlay hover:text-foreground"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================================================================
   Stats computation
   ================================================================ */

function useStats(candidates: CandidateListItem[]) {
  return useMemo(() => {
    const total = candidates.length;
    const interviewing = candidates.filter(
      (c) => c.stage === "Interview"
    ).length;
    const finalRound = candidates.filter(
      (c) => c.stage === "Final Round"
    ).length;
    const offer = candidates.filter((c) => c.stage === "Offer").length;
    const hired = candidates.filter((c) => c.stage === "Hired").length;
    return { total, interviewing, finalRound, offer, hired };
  }, [candidates]);
}

/* ================================================================
   CandidateDetailSlideOver
   ================================================================ */

function CandidateDetailSlideOver({
  candidate,
  onClose,
}: {
  candidate: CandidateListItem;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<CandidateTab>("overview");

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const stageConfig = STAGE_CONFIG[candidate.stage];

  return (
    <>
      {/* Overlay */}
      <motion.div
        key="overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        key="panel"
        variants={slideOverVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed right-0 top-0 z-50 flex h-full w-160 max-w-full flex-col border-l border-border bg-card shadow-2xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="shrink-0 border-b border-border px-5 pt-5 pb-4">
          <div className="flex items-start gap-3.5 pr-8">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarBgFromName(candidate.name)}`}
            >
              {candidate.initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-foreground truncate">
                {candidate.name}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                {candidate.role} &middot; {candidate.company}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {stageConfig && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <span
                      className={`size-2 rounded-full ${stageConfig.dotClass}`}
                    />
                    {stageConfig.label}
                  </span>
                )}
                {candidate.aiScore !== null && (
                  <span
                    className={`text-sm font-bold tabular-nums ${scoreColor(candidate.aiScore)}`}
                  >
                    {candidate.aiScore}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="shrink-0 border-b border-border px-5 py-3 overflow-x-auto scrollbar-thin">
          <div className="flex gap-1.5">
            {CANDIDATE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "bg-brand text-white"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {renderTab(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

/* ================================================================
   Main Page
   ================================================================ */

type ViewMode = "table" | "cards";

export default function CandidatesPage() {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateListItem | null>(null);

  const stageOptions = useMemo(
    () => ["All", ...Object.keys(STAGE_CONFIG)],
    []
  );

  const sourceOptions = useMemo(() => {
    const sources = Array.from(
      new Set(CANDIDATES_LIST.map((c) => c.source))
    ).sort();
    return ["All", ...sources];
  }, []);

  const filteredCandidates = useMemo(() => {
    let result = CANDIDATES_LIST;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (stageFilter !== "All") {
      result = result.filter((c) => c.stage === stageFilter);
    }

    if (sourceFilter !== "All") {
      result = result.filter((c) => c.source === sourceFilter);
    }

    return result;
  }, [search, stageFilter, sourceFilter]);

  const stats = useStats(CANDIDATES_LIST);

  const handleRowClick = useCallback((c: CandidateListItem) => {
    setSelectedCandidate(c);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedCandidate(null);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      <div className="px-6 pt-6 lg:px-8 lg:pt-8">
        <TASubNav activePage="candidates" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 lg:px-8 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <Contact className="size-5 text-brand-purple" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Candidates
                </h1>
                <p className="text-sm text-muted-foreground">
                  All candidates across active requisitions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                />
              </div>

              {/* Filters */}
              <FilterDropdown
                label="Stage"
                value={stageFilter}
                options={stageOptions}
                onChange={setStageFilter}
              />
              <FilterDropdown
                label="Source"
                value={sourceFilter}
                options={sourceOptions}
                onChange={setSourceFilter}
              />
            </div>
          </div>

          {/* Stats bar + View toggle */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {stats.total} total
              </span>{" "}
              &middot; {stats.interviewing} interviewing &middot;{" "}
              {stats.finalRound} in final round &middot; {stats.offer} offer
              &middot; {stats.hired} hired
            </p>

            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-md p-1.5 transition-colors ${
                  viewMode === "table"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Table view"
              >
                <List className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-md p-1.5 transition-colors ${
                  viewMode === "cards"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Card view"
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                      Candidate
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Company
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Requisition
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Stage
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      AI Score
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Source
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Applied
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Days
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3">
                      Tags
                    </th>
                    <th className="text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-3 w-10">
                      {/* Actions */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((c, i) => {
                    const stageConfig = STAGE_CONFIG[c.stage];
                    const isHired = c.stage === "Hired";
                    const isRejected = c.stage === "Rejected";

                    return (
                      <motion.tr
                        key={c.id}
                        custom={i}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={() => handleRowClick(c)}
                        className={`border-b border-border last:border-b-0 cursor-pointer transition-colors hover:bg-surface-overlay ${
                          isHired ? "border-l-2 border-l-success" : ""
                        } ${isRejected ? "opacity-60" : ""}`}
                      >
                        {/* Candidate */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarBgFromName(c.name)}`}
                            >
                              {c.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {c.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {c.role}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-3 py-3">
                          <span className="text-sm text-muted-foreground">
                            {c.company}
                          </span>
                        </td>

                        {/* Requisition */}
                        <td className="px-3 py-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {c.requisition}
                          </span>
                        </td>

                        {/* Stage */}
                        <td className="px-3 py-3">
                          {stageConfig && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <span
                                className={`size-2 rounded-full ${stageConfig.dotClass}`}
                              />
                              {stageConfig.label}
                            </span>
                          )}
                        </td>

                        {/* AI Score */}
                        <td className="px-3 py-3">
                          {c.aiScore !== null ? (
                            <span
                              className={`text-sm font-bold tabular-nums ${scoreColor(c.aiScore)}`}
                            >
                              {c.aiScore}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              &mdash;
                            </span>
                          )}
                        </td>

                        {/* Source */}
                        <td className="px-3 py-3">
                          <span className="text-xs text-muted-foreground">
                            {c.source}
                          </span>
                        </td>

                        {/* Applied */}
                        <td className="px-3 py-3">
                          <span className="text-xs text-muted-foreground">
                            {c.appliedDate}
                          </span>
                        </td>

                        {/* Days */}
                        <td className="px-3 py-3">
                          <span
                            className={`text-xs ${
                              c.daysInPipeline > 45
                                ? "text-destructive"
                                : c.daysInPipeline > 30
                                  ? "text-warning"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {c.daysInPipeline}d
                          </span>
                        </td>

                        {/* Tags */}
                        <td className="px-3 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {c.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagStyle(tag)}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(c);
                            }}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredCandidates.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No candidates match your filters.
              </div>
            )}
          </div>
        )}

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCandidates.map((c, i) => {
              const stageConfig = STAGE_CONFIG[c.stage];

              return (
                <motion.div
                  key={c.id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleRowClick(c)}
                  className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:bg-surface-overlay transition-colors"
                >
                  {/* Top: Avatar + Name */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarBgFromName(c.name)}`}
                    >
                      {c.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm text-foreground truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.role}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {c.company}
                      </p>
                    </div>
                  </div>

                  {/* Stage + AI Score */}
                  <div className="flex items-center gap-3 mb-3">
                    {stageConfig && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                        <span
                          className={`size-2 rounded-full ${stageConfig.dotClass}`}
                        />
                        {stageConfig.label}
                      </span>
                    )}
                    {c.aiScore !== null ? (
                      <span
                        className={`text-xs font-bold tabular-nums ${scoreColor(c.aiScore)}`}
                      >
                        AI: {c.aiScore}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        AI: &mdash;
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                    <span className="font-mono text-[10px]">
                      {c.requisition}
                    </span>
                    <span>{c.source}</span>
                    <span>{c.appliedDate}</span>
                  </div>

                  {/* Tags */}
                  {c.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagStyle(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredCandidates.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                No candidates match your filters.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Candidate Detail Slide-Over */}
      <AnimatePresence>
        {selectedCandidate && (
          <CandidateDetailSlideOver
            candidate={selectedCandidate}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
