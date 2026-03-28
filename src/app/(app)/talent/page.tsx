"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TalentHeader } from "@/components/talent/talent-header";
import { TalentToolbar, type ViewMode } from "@/components/talent/talent-toolbar";
import { KanbanBoard } from "@/components/talent/kanban-board";
import { TableView } from "@/components/talent/table-view";
import { ListView } from "@/components/talent/list-view";
import { PipelineView } from "@/components/talent/pipeline-view";
import { CandidateSlideOver } from "@/components/talent/candidate-slide-over";
import { AICopilotBar } from "@/components/talent/ai-copilot-bar";
import {
  type Candidate,
  type CandidateFilters,
  CANDIDATES,
  filterCandidates,
} from "@/components/talent/data";
import { TASubNav } from "@/components/ta/ta-sub-nav";

export default function TalentPage() {
  const [activeView, setActiveView] = useState<ViewMode>("pipeline");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [filters, setFilters] = useState<CandidateFilters>({
    search: "",
    stages: [],
    sources: [],
    tags: [],
  });
  const [sortBy, setSortBy] = useState("recent");

  const filteredCandidates = useMemo(() => {
    const filtered = filterCandidates(candidates, filters);

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.aiScore ?? -1) - (a.aiScore ?? -1);
        case "days":
          return b.daysInStage - a.daysInStage;
        case "name":
          return a.name.localeCompare(b.name);
        case "recent":
        default:
          return a.daysInStage - b.daysInStage;
      }
    });
  }, [candidates, filters, sortBy]);

  const handleSelectCandidate = (c: Candidate) => {
    setSelectedCandidate(c);
  };

  return (
    <div className="h-full flex flex-col">
      <TASubNav activePage="pipeline" />
      <TalentHeader />
      <TalentToolbar
        activeView={activeView}
        onViewChange={setActiveView}
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={candidates.length}
        filteredCount={filteredCandidates.length}
      />
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeView === "pipeline" && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <PipelineView candidates={filteredCandidates} onSelectCandidate={handleSelectCandidate} />
            </motion.div>
          )}
          {activeView === "kanban" && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <KanbanBoard
                candidates={filteredCandidates}
                allCandidates={candidates}
                onSelectCandidate={handleSelectCandidate}
                onCandidatesChange={setCandidates}
              />
            </motion.div>
          )}
          {activeView === "table" && (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <TableView candidates={filteredCandidates} onSelectCandidate={handleSelectCandidate} />
            </motion.div>
          )}
          {activeView === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              <ListView candidates={filteredCandidates} onSelectCandidate={handleSelectCandidate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CandidateSlideOver
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
      <AICopilotBar />
    </div>
  );
}
