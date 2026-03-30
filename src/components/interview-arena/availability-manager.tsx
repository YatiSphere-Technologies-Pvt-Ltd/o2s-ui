"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Link2,
  PenLine,
  RefreshCw,
  Check,
  Clock,
  AlertTriangle,
  Star,
  Ban,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type ArenaInterviewer,
  type AvailabilitySource,
  TIME_SLOTS,
  loadColor,
} from "./data";

interface AvailabilityManagerProps {
  interviewers: ArenaInterviewer[];
  onUpdateAvailability: (
    interviewerId: string,
    availability: string[],
    preferredTimes: string[],
    blockedTimes: string[]
  ) => void;
  onClose: () => void;
}

const SOURCE_CONFIG: Record<AvailabilitySource, { label: string; icon: typeof Calendar; color: string; bgColor: string }> = {
  calendar_sync: { label: "Calendar Sync", icon: Calendar, color: "text-success", bgColor: "bg-success/10" },
  manual: { label: "Manual", icon: PenLine, color: "text-brand", bgColor: "bg-brand/10" },
  link: { label: "Booking Link", icon: Link2, color: "text-brand-purple", bgColor: "bg-brand-purple/10" },
};

type SlotState = "available" | "preferred" | "blocked";

function InterviewerAvailabilityEditor({
  interviewer,
  onUpdate,
}: {
  interviewer: ArenaInterviewer;
  onUpdate: (availability: string[], preferred: string[], blocked: string[]) => void;
}) {
  const pref = interviewer.availabilityPreference;

  // Build slot states from current data
  const getSlotState = (time: string): SlotState => {
    if (pref.blockedTimes.includes(time)) return "blocked";
    if (pref.preferredTimes.includes(time)) return "preferred";
    if (interviewer.availability.includes(time)) return "available";
    return "blocked";
  };

  const [slotStates, setSlotStates] = useState<Record<string, SlotState>>(() => {
    const states: Record<string, SlotState> = {};
    for (const time of TIME_SLOTS) {
      states[time] = getSlotState(time);
    }
    return states;
  });

  const [maxPerWeek, setMaxPerWeek] = useState(pref.maxInterviewsPerWeek);
  const [maxPerDay, setMaxPerDay] = useState(pref.maxInterviewsPerDay);
  const [minGap, setMinGap] = useState(pref.minGapMinutes);
  const [saved, setSaved] = useState(false);

  const cycleSlot = (time: string) => {
    setSlotStates((prev) => {
      const current = prev[time];
      const next: SlotState =
        current === "blocked" ? "available" :
        current === "available" ? "preferred" :
        "blocked";
      return { ...prev, [time]: next };
    });
    setSaved(false);
  };

  const handleSave = () => {
    const available: string[] = [];
    const preferred: string[] = [];
    const blocked: string[] = [];

    for (const [time, state] of Object.entries(slotStates)) {
      if (state === "available" || state === "preferred") available.push(time);
      if (state === "preferred") preferred.push(time);
      if (state === "blocked") blocked.push(time);
    }

    onUpdate(available, preferred, blocked);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const availableCount = Object.values(slotStates).filter((s) => s !== "blocked").length;
  const preferredCount = Object.values(slotStates).filter((s) => s === "preferred").length;

  const sourceInfo = SOURCE_CONFIG[pref.source];
  const SourceIcon = sourceInfo.icon;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple">
            {interviewer.initials}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{interviewer.name}</h3>
            <p className="text-[11px] text-muted-foreground">{interviewer.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Source badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sourceInfo.bgColor}`}>
            <SourceIcon className={`size-3 ${sourceInfo.color}`} />
            <span className={`text-[10px] font-semibold ${sourceInfo.color}`}>{sourceInfo.label}</span>
          </div>
          {pref.calendarConnected && pref.lastSynced && (
            <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
              <RefreshCw className="size-2.5" />
              {pref.lastSynced}
            </span>
          )}
        </div>
      </div>

      {/* Slot picker grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
            Time Slots — Click to cycle: Blocked → Available → Preferred
          </span>
          <span className="text-[10px] text-muted-foreground">
            {availableCount} available · {preferredCount} preferred
          </span>
        </div>

        <div className="grid grid-cols-9 gap-1.5">
          {TIME_SLOTS.map((time) => {
            const state = slotStates[time];
            return (
              <button
                key={time}
                onClick={() => cycleSlot(time)}
                className={`relative h-10 rounded-lg border text-center transition-all duration-100 cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  state === "preferred"
                    ? "bg-success/15 border-success/30 ring-1 ring-success/20"
                    : state === "available"
                      ? "bg-brand/8 border-brand/20"
                      : "bg-secondary/30 border-border/20 opacity-40"
                }`}
              >
                <span className={`text-[10px] font-medium tabular-nums ${
                  state === "preferred" ? "text-success" :
                  state === "available" ? "text-foreground" :
                  "text-muted-foreground/50"
                }`}>
                  {time}
                </span>
                {state === "preferred" && (
                  <Star className="size-2.5 text-success" />
                )}
                {state === "blocked" && (
                  <Ban className="size-2.5 text-muted-foreground/30" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-success/15 border border-success/30" />
            <span>Preferred</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-brand/8 border border-brand/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-3 rounded bg-secondary/30 border border-border/20 opacity-40" />
            <span>Blocked</span>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
            Max / Week
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={maxPerWeek}
            onChange={(e) => { setMaxPerWeek(Number(e.target.value) || 1); setSaved(false); }}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-brand tabular-nums"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
            Max / Day
          </label>
          <input
            type="number"
            min={1}
            max={8}
            value={maxPerDay}
            onChange={(e) => { setMaxPerDay(Number(e.target.value) || 1); setSaved(false); }}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-brand tabular-nums"
          />
        </div>
        <div>
          <label className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
            Min Gap (min)
          </label>
          <input
            type="number"
            min={0}
            max={120}
            step={15}
            value={minGap}
            onChange={(e) => { setMinGap(Number(e.target.value) || 0); setSaved(false); }}
            className="w-full h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground outline-none focus:border-brand tabular-nums"
          />
        </div>
      </div>

      {/* Calendar sync option */}
      {!pref.calendarConnected && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-brand/20 bg-brand/[0.02]">
          <Calendar className="size-5 text-brand/60 shrink-0" />
          <div className="flex-1">
            <span className="text-xs font-medium text-foreground">Connect Google Calendar</span>
            <p className="text-[10px] text-muted-foreground mt-0.5">Auto-sync availability from their calendar. Blocked meetings automatically hide slots.</p>
          </div>
          <Button variant="outline" size="sm" className="text-xs cursor-pointer rounded-lg shrink-0">
            Connect
          </Button>
        </div>
      )}

      {/* Save button */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
          <Clock className="size-3" />
          <span>
            Current load: <span className={`font-bold ${loadColor(interviewer.load, interviewer.maxLoad)}`}>{interviewer.load}/{interviewer.maxLoad}</span>
          </span>
        </div>
        <Button
          onClick={handleSave}
          size="sm"
          className={`rounded-lg cursor-pointer text-xs gap-1.5 ${
            saved ? "bg-success hover:bg-success/90" : "bg-brand hover:bg-brand/90"
          } text-white`}
        >
          {saved ? (
            <><Check className="size-3.5" /> Saved</>
          ) : (
            "Save Availability"
          )}
        </Button>
      </div>
    </div>
  );
}

/* ── Main Manager Drawer ── */

export function AvailabilityManager({
  interviewers,
  onUpdateAvailability,
  onClose,
}: AvailabilityManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(interviewers[0]?.id ?? null);

  const syncedCount = interviewers.filter((i) => i.availabilityPreference.calendarConnected).length;
  const manualCount = interviewers.length - syncedCount;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-40"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-card border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Settings2 className="size-4 text-brand" />
              Panel Availability
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {syncedCount} synced · {manualCount} manual · {interviewers.length} total interviewers
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* How it works */}
        <div className="shrink-0 px-5 py-3 border-b border-border/50 bg-secondary/20">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Panel members set their interview availability here. The Arena grid only shows slots that interviewers have marked as available.
            Connect Google Calendar to auto-sync, or let interviewers set slots manually.
            <span className="text-success font-medium"> Green (preferred)</span> slots are prioritized by the AI scheduling agent.
          </p>
        </div>

        {/* Interviewer list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
          {interviewers.map((interviewer) => {
            const isExpanded = expandedId === interviewer.id;
            const pref = interviewer.availabilityPreference;
            const sourceInfo = SOURCE_CONFIG[pref.source];
            const SourceIcon = sourceInfo.icon;

            return (
              <div key={interviewer.id}>
                {/* Collapsed row */}
                {!isExpanded && (
                  <button
                    onClick={() => setExpandedId(interviewer.id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-secondary/20 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-brand-purple/10 flex items-center justify-center text-[11px] font-bold text-brand-purple">
                        {interviewer.initials}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-foreground">{interviewer.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{interviewer.role}</span>
                          <span className={`text-[10px] font-bold ${loadColor(interviewer.load, interviewer.maxLoad)}`}>
                            {interviewer.load}/{interviewer.maxLoad}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${sourceInfo.bgColor}`}>
                        <SourceIcon className={`size-2.5 ${sourceInfo.color}`} />
                        <span className={`text-[9px] font-semibold ${sourceInfo.color}`}>{sourceInfo.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {interviewer.availability.length} slots
                      </span>
                    </div>
                  </button>
                )}

                {/* Expanded editor */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="relative">
                        <button
                          onClick={() => setExpandedId(null)}
                          className="absolute top-3 right-3 text-[10px] text-muted-foreground hover:text-foreground cursor-pointer z-10"
                        >
                          Collapse
                        </button>
                        <InterviewerAvailabilityEditor
                          interviewer={interviewer}
                          onUpdate={(availability, preferred, blocked) =>
                            onUpdateAvailability(interviewer.id, availability, preferred, blocked)
                          }
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-t border-border">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
            <AlertTriangle className="size-3" />
            Changes apply to today&apos;s arena grid immediately
          </div>
          <Button onClick={onClose} variant="outline" className="rounded-lg cursor-pointer text-xs">
            Done
          </Button>
        </div>
      </motion.div>
    </>
  );
}
