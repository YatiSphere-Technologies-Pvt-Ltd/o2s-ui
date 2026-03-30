"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  X,
  Repeat2,
  Clock,
  Trash2,
  Check,
  Bot,
  User,
} from "lucide-react";
import {
  type ArenaInterviewer,
  type InterviewSlot,
  type ArenaCandidate,
  TIME_SLOTS,
  roundTypeLabel,
  roundTypeBgColor,
  roundTypeColor,
  loadColor,
  scoreColor,
  computeAIScore,
  ARENA_INTERVIEWERS,
} from "./data";

interface ArenaGridProps {
  interviewers: ArenaInterviewer[];
  slots: InterviewSlot[];
  aiMode: boolean;
  selectedCandidate: ArenaCandidate | null;
  selectedSlotId: string | null;
  onSelectSlot: (interviewerId: string, time: string) => void;
  onSelectInterviewer: (interviewerId: string) => void;
  onDropCandidate: (interviewerId: string, time: string) => void;
  onRemoveSlot: (slotId: string) => void;
  dragActive: boolean;
  hoveredCandidateId: string | null;
}

/* ── Ghost Preview ── */

function GhostPreview({
  candidate,
  interviewer,
  aiScore,
  reasons,
  conflicts,
}: {
  candidate: ArenaCandidate;
  interviewer: ArenaInterviewer;
  aiScore: number;
  reasons: string[];
  conflicts: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-50 w-56 pointer-events-none"
    >
      <div className="bg-card border border-border rounded-xl shadow-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">
            {candidate.initials} → {interviewer.initials}
          </span>
          <span className={`text-sm font-bold ${aiScore >= 80 ? "text-success" : aiScore >= 60 ? "text-warning" : "text-destructive"}`}>
            {aiScore}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${aiScore >= 80 ? "bg-success" : aiScore >= 60 ? "bg-warning" : "bg-destructive"}`}
            initial={{ width: 0 }}
            animate={{ width: `${aiScore}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-success">
            <Check className="size-3 shrink-0" /> {r}
          </div>
        ))}
        {conflicts.map((c, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px] text-destructive">
            <AlertTriangle className="size-3 shrink-0" /> {c}
          </div>
        ))}
        <div className="text-[10px] text-muted-foreground/40 pt-1 border-t border-border/50">
          Panel strength: {aiScore >= 80 ? "High" : aiScore >= 60 ? "Medium" : "Low"}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Inline Action Panel ── */

function InlineActionPanel({
  slot,
  interviewer,
  onClose,
  onRemove,
}: {
  slot: InterviewSlot;
  interviewer: ArenaInterviewer;
  onClose: () => void;
  onRemove: () => void;
}) {
  const [showSwap, setShowSwap] = useState(false);
  const swapOptions = ARENA_INTERVIEWERS.filter(
    (i) => i.id !== interviewer.id && i.load < i.maxLoad
  ).slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 4 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary/30 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple">
              {slot.candidateInitials}
            </div>
            <div>
              <span className="text-xs font-semibold text-foreground block">{slot.candidateName}</span>
              <span className={`text-[10px] ${roundTypeColor(slot.roundType!)}`}>{roundTypeLabel(slot.roundType!)}</span>
            </div>
          </div>
          <button onClick={onClose} className="size-6 flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground/40 hover:text-foreground cursor-pointer">
            <X className="size-3.5" />
          </button>
        </div>

        {/* Details */}
        <div className="px-4 py-3 space-y-2 text-xs">
          <div className="flex justify-between"><span className="text-muted-foreground">Interviewer</span><span className="text-foreground font-medium">{interviewer.name}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground font-mono">{slot.time}</span></div>
          {slot.fitScore && <div className="flex justify-between"><span className="text-muted-foreground">Fit Score</span><span className={`font-bold ${scoreColor(slot.fitScore)}`}>{slot.fitScore}</span></div>}
          <div className="flex justify-between"><span className="text-muted-foreground">Load</span><span className={`font-bold ${loadColor(interviewer.load, interviewer.maxLoad)}`}>{interviewer.load}/{interviewer.maxLoad}</span></div>
        </div>

        {/* Swap */}
        <AnimatePresence>
          {showSwap && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden border-t border-border/50">
              <div className="px-4 py-2.5 space-y-1.5">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-wider font-medium">Swap to</span>
                {swapOptions.map((s) => (
                  <button key={s.id} className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer text-left transition-colors">
                    <div className="size-6 rounded-md bg-brand-purple/10 flex items-center justify-center text-[9px] font-bold text-brand-purple">{s.initials}</div>
                    <span className="text-xs text-foreground flex-1">{s.name}</span>
                    <span className={`text-[10px] font-bold ${loadColor(s.load, s.maxLoad)}`}>{s.load}/{s.maxLoad}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center border-t border-border/50">
          <button onClick={() => setShowSwap(!showSwap)} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-brand-teal hover:bg-brand-teal/5 cursor-pointer transition-colors">
            <Repeat2 className="size-3.5" /> Swap
          </button>
          <div className="w-px h-6 bg-border/50" />
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-muted-foreground hover:bg-secondary/30 cursor-pointer transition-colors">
            <Clock className="size-3.5" /> Move
          </button>
          <div className="w-px h-6 bg-border/50" />
          <button onClick={onRemove} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium text-destructive hover:bg-destructive/5 cursor-pointer transition-colors">
            <Trash2 className="size-3.5" /> Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Slot Cell ── */

function SlotCell({
  interviewer,
  time,
  slot,
  aiMode,
  selectedCandidate,
  isSelected,
  onSelect,
  onDrop,
  onRemove,
  dragActive,
  allSlots,
}: {
  interviewer: ArenaInterviewer;
  time: string;
  slot: InterviewSlot | null;
  aiMode: boolean;
  selectedCandidate: ArenaCandidate | null;
  isSelected: boolean;
  onSelect: () => void;
  onDrop: () => void;
  onRemove: (id: string) => void;
  dragActive: boolean;
  allSlots: InterviewSlot[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showGhost, setShowGhost] = useState(false);

  const isAvailable = interviewer.availability.includes(time);
  const isBooked = slot?.status === "booked";

  const aiData = useMemo(() => {
    if (!selectedCandidate || isBooked || !isAvailable) return null;
    return computeAIScore(interviewer, selectedCandidate, time, allSlots);
  }, [selectedCandidate, isBooked, isAvailable, interviewer, time, allSlots]);

  const aiScoreValue = aiData?.score ?? 0;
  const hasConflicts = aiData ? aiData.conflicts.length > 0 : false;
  const showAI = aiMode && selectedCandidate && !isBooked && isAvailable && aiData;
  const isDropTarget = dragActive && isAvailable && !isBooked;
  const bestMatch = showAI && !hasConflicts && aiScoreValue >= 80;

  // Cell classes
  let cellBg = "";
  let cellBorder = "border-transparent";
  let cellOpacity = "";

  if (isBooked && slot) {
    cellBg = roundTypeBgColor(slot.roundType!);
    cellBorder = "border-border/40";
  } else if (!isAvailable) {
    cellOpacity = "opacity-20";
  } else if (showAI) {
    if (hasConflicts) {
      cellBg = "bg-destructive/8";
      cellBorder = "border-destructive/25";
    } else if (aiScoreValue >= 80) {
      cellBg = "bg-success/12";
      cellBorder = "border-success/30";
    } else if (aiScoreValue >= 60) {
      cellBg = "bg-warning/10";
      cellBorder = "border-warning/25";
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsHovered(true);
        if (isDropTarget && selectedCandidate && aiData) setShowGhost(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowGhost(false);
      }}
    >
      <motion.div
        onClick={() => {
          if (isBooked) { setShowPanel(!showPanel); onSelect(); }
          else if (isAvailable && !isBooked && (dragActive || selectedCandidate)) { onDrop(); }
        }}
        onDragOver={(e) => { if (isDropTarget) e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); if (isDropTarget) onDrop(); }}
        whileHover={isAvailable ? { scale: 1.05, transition: { duration: 0.1 } } : undefined}
        animate={bestMatch ? {
          boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 16px rgba(16,185,129,0.25)", "0 0 0px rgba(16,185,129,0)"],
        } : undefined}
        transition={bestMatch ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : undefined}
        className={`
          relative w-full h-14 rounded-xl border flex items-center justify-center transition-colors duration-75
          ${cellBg} ${cellBorder} ${cellOpacity}
          ${isSelected ? "ring-2 ring-brand" : ""}
          ${isDropTarget && isHovered ? "ring-2 ring-brand/40 bg-brand/5" : ""}
          ${isAvailable ? "cursor-pointer" : "cursor-default"}
        `}
      >
        {/* Booked content */}
        {isBooked && slot && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-[11px] font-bold text-foreground leading-none">
              {slot.candidateInitials}
            </span>
            <span className={`text-[9px] font-semibold leading-none ${roundTypeColor(slot.roundType!)}`}>
              {roundTypeLabel(slot.roundType!)}
            </span>
          </motion.div>
        )}

        {/* Blocked pattern */}
        {!isAvailable && !isBooked && (
          <div className="size-1 rounded-full bg-muted-foreground/15" />
        )}

        {/* AI score badge */}
        {showAI && aiScoreValue > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -top-1.5 -right-1.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none shadow-sm ${
              hasConflicts ? "bg-destructive text-white" :
              aiScoreValue >= 80 ? "bg-success text-white" :
              aiScoreValue >= 60 ? "bg-warning text-white" :
              "bg-secondary text-muted-foreground"
            }`}
          >
            {hasConflicts ? "!" : aiScoreValue}
          </motion.span>
        )}

        {/* Conflict pulsing icon */}
        {slot?.conflictReason && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute -top-1 -right-1 z-10"
          >
            <AlertTriangle className="size-3.5 text-destructive drop-shadow-sm" />
          </motion.div>
        )}

        {/* Drop ghost */}
        {isDropTarget && isHovered && selectedCandidate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} className="absolute inset-0 rounded-xl flex items-center justify-center">
            <span className="text-xs font-bold text-brand">{selectedCandidate.initials}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Ghost Preview */}
      <AnimatePresence>
        {showGhost && selectedCandidate && aiData && isDropTarget && (
          <GhostPreview candidate={selectedCandidate} interviewer={interviewer} aiScore={aiScoreValue} reasons={aiData.reasons} conflicts={aiData.conflicts} />
        )}
      </AnimatePresence>

      {/* Inline Action Panel */}
      <AnimatePresence>
        {showPanel && isBooked && slot && (
          <InlineActionPanel
            slot={slot}
            interviewer={interviewer}
            onClose={() => setShowPanel(false)}
            onRemove={() => { onRemove(slot.id); setShowPanel(false); }}
          />
        )}
      </AnimatePresence>

      {/* Hover tooltip for booked */}
      <AnimatePresence>
        {isHovered && isBooked && slot && !showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 z-40 pointer-events-none"
          >
            <div className="bg-card border border-border rounded-xl shadow-xl px-3.5 py-2.5 whitespace-nowrap space-y-1">
              <div className="flex items-center gap-2">
                <User className="size-3 text-muted-foreground/40" />
                <span className="text-xs font-semibold text-foreground">{slot.candidateName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Bot className="size-3 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground">{interviewer.name}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50 pt-0.5">
                <span className={roundTypeColor(slot.roundType!)}>{roundTypeLabel(slot.roundType!)}</span>
                <span>Load: <span className={loadColor(interviewer.load, interviewer.maxLoad)}>{interviewer.load}/{interviewer.maxLoad}</span></span>
                {slot.fitScore && <span>Fit: <span className={scoreColor(slot.fitScore)}>{slot.fitScore}</span></span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Grid ── */

export function ArenaGrid({
  interviewers,
  slots,
  aiMode,
  selectedCandidate,
  selectedSlotId,
  onSelectSlot,
  onSelectInterviewer,
  onDropCandidate,
  onRemoveSlot,
  dragActive,
  hoveredCandidateId,
}: ArenaGridProps) {
  const congestionMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const time of TIME_SLOTS) {
      map[time] = slots.filter((s) => s.time === time && s.status === "booked").length;
    }
    return map;
  }, [slots]);
  const maxCongestion = Math.max(...Object.values(congestionMap), 1);

  // Show fewer time columns for better cell size
  const visibleSlots = TIME_SLOTS;

  return (
    <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse" style={{ minWidth: 960 }}>
          {/* Header */}
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-20 bg-card/90 backdrop-blur-sm w-48 min-w-48 px-4 py-3 text-left">
                <span className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest">
                  Interviewer
                </span>
              </th>
              {visibleSlots.map((time) => {
                const congestion = congestionMap[time];
                const intensity = congestion / maxCongestion;
                return (
                  <th key={time} className="px-1 py-3 text-center min-w-[60px]">
                    <span className="text-xs font-medium text-muted-foreground/60 tabular-nums block">
                      {time}
                    </span>
                    {/* Congestion dot */}
                    <div className="flex justify-center mt-1">
                      <div className={`size-1.5 rounded-full ${
                        intensity >= 0.7 ? "bg-destructive/50" : intensity >= 0.4 ? "bg-warning/40" : "bg-success/20"
                      }`} />
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {interviewers.map((interviewer, rowIdx) => {
              const isOverloaded = interviewer.load >= interviewer.maxLoad;
              return (
                <motion.tr
                  key={interviewer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: rowIdx * 0.04 }}
                  className={`border-b border-border/20 ${isOverloaded ? "bg-destructive/[0.015]" : "hover:bg-surface-overlay/30"} transition-colors`}
                >
                  {/* Interviewer cell — clickable to open insights */}
                  <td className="sticky left-0 z-10 bg-card/90 backdrop-blur-sm px-4 py-2">
                    <button
                      onClick={() => onSelectInterviewer(interviewer.id)}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity text-left w-full"
                    >
                      <div className="size-8 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple shrink-0">
                        {interviewer.initials}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-foreground block truncate">
                          {interviewer.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground/50 truncate">
                            {interviewer.skills[0]}
                          </span>
                          <span className={`text-[10px] font-bold ${loadColor(interviewer.load, interviewer.maxLoad)}`}>
                            {interviewer.load}/{interviewer.maxLoad}
                          </span>
                          {isOverloaded && <AlertTriangle className="size-3 text-destructive/60" />}
                        </div>
                      </div>
                    </button>
                  </td>

                  {/* Slot cells */}
                  {visibleSlots.map((time) => {
                    const slot = slots.find(
                      (s) => s.interviewerId === interviewer.id && s.time === time
                    );
                    const slotKey = `${interviewer.id}-${time}`;
                    return (
                      <td key={time} className="px-1 py-1.5 text-center">
                        <SlotCell
                          interviewer={interviewer}
                          time={time}
                          slot={slot ?? null}
                          aiMode={aiMode}
                          selectedCandidate={selectedCandidate}
                          isSelected={selectedSlotId === slotKey}
                          onSelect={() => onSelectSlot(interviewer.id, time)}
                          onDrop={() => onDropCandidate(interviewer.id, time)}
                          onRemove={onRemoveSlot}
                          dragActive={dragActive}
                          allSlots={slots}
                        />
                      </td>
                    );
                  })}
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 px-4 py-2.5 border-t border-border/30 bg-card/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-3.5 rounded-md border border-border/30" />
          <span className="text-[10px] text-muted-foreground">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3.5 rounded-md bg-brand/15 border border-border/30" />
          <span className="text-[10px] text-muted-foreground">Booked</span>
        </div>
        {aiMode && (
          <>
            <div className="w-px h-3 bg-border/30" />
            <div className="flex items-center gap-2">
              <div className="w-4 h-3.5 rounded-md bg-success/12 border border-success/30" />
              <span className="text-[10px] text-success">Best</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3.5 rounded-md bg-warning/10 border border-warning/25" />
              <span className="text-[10px] text-warning">OK</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3.5 rounded-md bg-destructive/8 border border-destructive/25" />
              <span className="text-[10px] text-destructive">Conflict</span>
            </div>
          </>
        )}
        <div className="ml-auto text-[10px] text-muted-foreground/30">
          Hover = insight · Click booked = actions
        </div>
      </div>
    </div>
  );
}
