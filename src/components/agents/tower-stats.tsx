"use client";

import { Activity, Bot, Gauge, History, Pause, Play, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  live: number;
  total: number;
  customised: number;
  last24h: number;
  pendingReview: number;
  accuracy: number;
  overrideRate: number;
  globalPause: boolean;
  onGlobalToggle: () => void;
}

export function TowerStats({
  live,
  total,
  customised,
  last24h,
  pendingReview,
  accuracy,
  overrideRate,
  globalPause,
  onGlobalToggle,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Headline strip */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-[11px] font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {globalPause ? "0" : live} of {total} live
        </span>
        {customised > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 text-brand text-[11px] font-medium">
            {customised} customised
          </span>
        )}
        {pendingReview > 0 && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning/10 text-warning text-[11px] font-medium">
            <ShieldAlert className="size-3" />
            {pendingReview} need review
          </span>
        )}
        <div className="ml-auto">
          <button
            onClick={onGlobalToggle}
            className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors ${
              globalPause
                ? "border-success/40 bg-success/10 text-success hover:bg-success/20"
                : "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
            }`}
          >
            {globalPause ? (
              <>
                <Play className="size-3.5" />
                Resume all
              </>
            ) : (
              <>
                <Pause className="size-3.5" />
                Pause all
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile icon={Bot}     label="Decisions / 24h" value={last24h.toLocaleString("en-IN")} tint="bg-brand/10 text-brand" />
        <Tile icon={Gauge}   label="Avg accuracy 30d" value={`${Math.round(accuracy * 100)}%`} tint="bg-success/10 text-success" />
        <Tile icon={Activity}label="Override rate 30d" value={`${Math.round(overrideRate * 100)}%`} tint="bg-warning/10 text-warning" />
        <Tile icon={History} label="Pending review"   value={pendingReview.toString()} tint="bg-secondary text-muted-foreground" />
      </div>

      <AnimatePresence>
        {globalPause && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive inline-flex items-center gap-2"
          >
            <Pause className="size-3.5" />
            All agents in this module are paused. Click <strong>Resume all</strong> when you&apos;re ready.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <div className={`size-7 rounded-md flex items-center justify-center ${tint}`}>
          <Icon className="size-3.5" />
        </div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
