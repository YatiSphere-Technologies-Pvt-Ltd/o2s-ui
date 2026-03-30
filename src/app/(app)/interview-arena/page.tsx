"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Wand2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CandidateQueue } from "@/components/interview-arena/candidate-queue";
import { ArenaGrid } from "@/components/interview-arena/arena-grid";
import { PanelInsights } from "@/components/interview-arena/panel-insights";
import {
  type InterviewSlot,
  type ArenaCandidate,
  ARENA_INTERVIEWERS,
  ARENA_CANDIDATES,
  INITIAL_SLOTS,
} from "@/components/interview-arena/data";

export default function InterviewArenaPage() {
  const [slots, setSlots] = useState<InterviewSlot[]>(INITIAL_SLOTS);
  const [candidates, setCandidates] = useState<ArenaCandidate[]>(ARENA_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(true);
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);
  const [hoveredCandidateId, setHoveredCandidateId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [interviewers, setInterviewers] = useState(ARENA_INTERVIEWERS);

  const selectedCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedCandidateId) ?? null,
    [candidates, selectedCandidateId]
  );

  const selectedInterviewerFromSlot = useMemo(() => {
    if (!selectedSlotKey) return null;
    const parts = selectedSlotKey.split("-");
    const interviewerId = parts.slice(0, 2).join("-");
    return interviewers.find((i) => i.id === interviewerId) ?? null;
  }, [selectedSlotKey]);

  const selectedSlot = useMemo(() => {
    if (!selectedSlotKey) return null;
    const parts = selectedSlotKey.split("-");
    const interviewerId = parts.slice(0, 2).join("-");
    const time = parts.slice(2).join(":");
    return slots.find((s) => s.interviewerId === interviewerId && s.time === time) ?? null;
  }, [selectedSlotKey, slots]);

  const bookedCount = slots.filter((s) => s.status === "booked").length;
  const conflicts = slots.filter((s) => s.conflictReason).length;

  const handleDropCandidate = useCallback(
    (interviewerId: string, time: string) => {
      const candidateId = draggedCandidateId || selectedCandidateId;
      if (!candidateId) return;
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) return;

      const existing = slots.find(
        (s) => s.interviewerId === interviewerId && s.time === time && s.status === "booked"
      );
      if (existing) return;

      setSlots((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          interviewerId,
          time,
          status: "booked",
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateInitials: candidate.initials,
          roundType: candidate.requiredRoundType,
          fitScore: candidate.fitScore,
          aiScore: null,
          conflictReason: null,
        },
      ]);
      setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      setSelectedCandidateId(null);
      setDraggedCandidateId(null);
    },
    [draggedCandidateId, selectedCandidateId, candidates, slots]
  );

  const handleUpdateAvailability = useCallback(
    (interviewerId: string, availability: string[], preferredTimes: string[], blockedTimes: string[]) => {
      setInterviewers((prev) =>
        prev.map((i) =>
          i.id === interviewerId
            ? {
                ...i,
                availability,
                availabilityPreference: {
                  ...i.availabilityPreference,
                  preferredTimes,
                  blockedTimes,
                },
              }
            : i
        )
      );
    },
    []
  );

  const handleRemoveSlot = useCallback((slotId: string) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot?.candidateId) {
      const candidate = ARENA_CANDIDATES.find((c) => c.id === slot.candidateId);
      if (candidate) {
        setCandidates((prev) => prev.some((c) => c.id === candidate.id) ? prev : [...prev, candidate]);
      }
    }
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  }, [slots]);

  const handleSelectSlot = useCallback((interviewerId: string, time: string) => {
    setSelectedSlotKey(`${interviewerId}-${time}`);
  }, []);

  const handleSelectInterviewer = useCallback((interviewerId: string) => {
    // Select a "virtual" slot key for the interviewer so insights panel opens
    setSelectedSlotKey(`${interviewerId}-9:00`);
  }, []);

  const handleAutoSchedule = useCallback(() => {
    let currentSlots = [...slots];
    const scheduled: string[] = [];

    for (const candidate of candidates) {
      let bestSlot: { interviewerId: string; time: string; score: number } | null = null;

      for (const interviewer of interviewers) {
        for (const time of interviewer.availability) {
          if (currentSlots.some((s) => s.interviewerId === interviewer.id && s.time === time && s.status === "booked")) continue;

          const skillMatch = candidate.preferredInterviewerSkills.filter((s) =>
            interviewer.skills.some((is) => is.toLowerCase().includes(s.toLowerCase()))
          ).length;
          const score = skillMatch * 20 + 50 + (interviewer.load >= interviewer.maxLoad ? -50 : 0);

          if (!bestSlot || score > bestSlot.score) {
            bestSlot = { interviewerId: interviewer.id, time, score };
          }
        }
      }

      if (bestSlot) {
        currentSlots.push({
          id: `s-auto-${Date.now()}-${candidate.id}`,
          interviewerId: bestSlot.interviewerId,
          time: bestSlot.time,
          status: "booked",
          candidateId: candidate.id,
          candidateName: candidate.name,
          candidateInitials: candidate.initials,
          roundType: candidate.requiredRoundType,
          fitScore: candidate.fitScore,
          aiScore: bestSlot.score,
          conflictReason: null,
        });
        scheduled.push(candidate.id);
      }
    }

    setSlots(currentSlots);
    setCandidates((prev) => prev.filter((c) => !scheduled.includes(c.id)));
  }, [slots, candidates]);

  const handleResolveConflicts = useCallback(() => {
    setResolving(true);
    setTimeout(() => {
      setSlots((prev) => prev.map((s) => ({ ...s, conflictReason: null })));
      setResolving(false);
    }, 1500);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      switch (e.key.toLowerCase()) {
        case "a":
          if (e.shiftKey) handleAutoSchedule();
          break;
        case "i":
          setAiMode((prev) => !prev);
          break;
        case "escape":
          setSelectedCandidateId(null);
          setSelectedSlotKey(null);
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleAutoSchedule]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-6 lg:-m-8">
      {/* ── Header ── */}
      <div className="shrink-0 px-6 py-3.5 border-b border-border flex items-center justify-between gap-4 bg-card/30">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-linear-to-br from-brand-purple to-brand flex items-center justify-center">
            <Calendar className="size-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground">Interview Arena</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>Today</span>
              <span className="text-muted-foreground/20">·</span>
              <span className="text-foreground font-medium">{bookedCount}</span> booked
              <span className="text-muted-foreground/20">·</span>
              <span className={candidates.length > 0 ? "text-warning font-medium" : "text-success font-medium"}>{candidates.length}</span> pending
              {conflicts > 0 && (
                <>
                  <span className="text-muted-foreground/20">·</span>
                  <span className="text-destructive font-medium">{conflicts}</span> conflicts
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAiMode(!aiMode)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              aiMode
                ? "bg-brand-purple/15 text-brand-purple ring-1 ring-brand-purple/25"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="size-3.5" />
            AI Mode
            <kbd className="px-1 py-0.5 rounded bg-brand-purple/10 text-[8px] font-mono">I</kbd>
          </button>

          <Button
            onClick={handleAutoSchedule}
            disabled={candidates.length === 0}
            size="sm"
            className="bg-brand hover:bg-brand/90 text-white text-xs font-semibold rounded-xl gap-2 cursor-pointer disabled:opacity-40 h-9 px-4"
          >
            <Zap className="size-3.5" />
            Auto Schedule
            <kbd className="px-1 py-0.5 rounded bg-white/15 text-[8px] font-mono">⇧A</kbd>
          </Button>

          {conflicts > 0 && (
            <Button
              onClick={handleResolveConflicts}
              disabled={resolving}
              variant="outline"
              size="sm"
              className="text-xs gap-2 cursor-pointer rounded-xl h-9 border-destructive/20 text-destructive hover:bg-destructive/5"
            >
              <Wand2 className={`size-3.5 ${resolving ? "animate-spin" : ""}`} />
              Fix Conflicts
            </Button>
          )}
        </div>
      </div>

      {/* ── Main 3-Column Layout ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Candidate Queue */}
        <div className="w-64 shrink-0 p-3 border-r border-border/50 hidden lg:block">
          <CandidateQueue
            candidates={candidates}
            selectedId={selectedCandidateId}
            onSelect={(id) => {
              setSelectedCandidateId(id === selectedCandidateId ? null : id);
              setSelectedSlotKey(null);
            }}
            draggedId={draggedCandidateId}
            onDragStart={(id) => {
              setDraggedCandidateId(id);
              setSelectedCandidateId(id);
            }}
            onDragEnd={() => setDraggedCandidateId(null)}
          />
        </div>

        {/* Center: Arena Grid */}
        <div className="flex-1 overflow-auto p-4">
          <ArenaGrid
            interviewers={interviewers}
            slots={slots}
            aiMode={aiMode}
            selectedCandidate={selectedCandidate}
            selectedSlotId={selectedSlotKey}
            onSelectSlot={handleSelectSlot}
            onSelectInterviewer={handleSelectInterviewer}
            onDropCandidate={handleDropCandidate}
            onRemoveSlot={handleRemoveSlot}
            dragActive={!!draggedCandidateId}
            hoveredCandidateId={hoveredCandidateId}
          />
        </div>

        {/* Right: Panel Insights */}
        <div className="w-72 shrink-0 p-3 border-l border-border/50 hidden xl:block">
          <PanelInsights
            interviewer={selectedInterviewerFromSlot}
            slot={selectedSlot}
            candidate={selectedCandidate}
            allInterviewers={interviewers}
            onUpdateAvailability={handleUpdateAvailability}
          />
        </div>
      </div>

      {/* ── Bottom Shortcut Bar ── */}
      <div className="shrink-0 border-t border-border bg-card/50 px-6 py-2 flex items-center gap-6 text-[10px] text-muted-foreground/40">
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">I</kbd> Toggle AI</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">⇧A</kbd> Auto Schedule</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono mr-1">Esc</kbd> Deselect</span>
        <span className="ml-auto">Select a candidate → hover grid for AI insights → click or drag to schedule</span>
      </div>

    </div>
  );
}
