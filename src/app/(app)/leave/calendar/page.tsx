"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarRange,
  CalendarDays,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  List,
  Plane,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  CURRENT_BALANCES,
  LEAVE_TYPES,
  UPCOMING_HOLIDAYS,
  TEAM_LEAVES,
} from "@/components/leave/data";
import { CalendarMonth } from "@/components/leave/calendar-month";
import { CalendarWeek } from "@/components/leave/calendar-week";
import { CalendarList } from "@/components/leave/calendar-list";
import { MiniStats } from "@/components/leave/mini-stats";
import {
  computeYearStats,
  toISO,
  weekDays,
} from "@/components/leave/calendar-utils";

type View = "month" | "week" | "list";

const VIEW_META: Record<View, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  month: { label: "Month", icon: CalendarRange },
  week:  { label: "Week",  icon: CalendarClock },
  list:  { label: "List",  icon: List },
};

export default function LeaveCalendarPage() {
  const { setScreen } = useScreen();
  const { requests } = useLeaveStore();

  const [view, setView] = useState<View>("month");
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [selected, setSelected] = useState<Date | null>(null);
  const [showTeam, setShowTeam] = useState(true);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Calendar" });
    return () => setScreen(null);
  }, [setScreen]);

  function navigate(delta: number) {
    setAnchor((a) => {
      const next = new Date(a);
      if (view === "week") {
        next.setDate(next.getDate() + delta * 7);
      } else {
        next.setMonth(next.getMonth() + delta);
      }
      return next;
    });
  }

  function goToToday() {
    const today = new Date();
    setAnchor(today);
    setSelected(today);
  }

  const stats = useMemo(
    () => computeYearStats(requests, CURRENT_BALANCES, toISO(new Date())),
    [requests],
  );

  const periodLabel = useMemo(() => {
    if (view === "week") {
      const days = weekDays(anchor);
      const start = days[0];
      const end = days[6];
      const sameMonth =
        start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
      return sameMonth
        ? `${start.toLocaleDateString("en-IN", { day: "numeric" })}–${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
        : `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    return anchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [anchor, view]);

  const requestHref = selected
    ? `/leave/request?q=${encodeURIComponent(toISO(selected))}`
    : "/leave/request";

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/leave"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">My calendar</h1>
            <p className="text-sm text-muted-foreground">
              Your leaves, teammates&apos; time off, and India public holidays in one view.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 text-[11px]">
            {(Object.keys(VIEW_META) as View[]).map((v) => {
              const m = VIEW_META[v];
              const Icon = m.icon;
              const active = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                    active
                      ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                  {m.label}
                </button>
              );
            })}
          </div>

          {/* Team-out toggle */}
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground cursor-pointer hover:bg-surface-overlay transition-colors">
            <input
              type="checkbox"
              checked={showTeam}
              onChange={(e) => setShowTeam(e.target.checked)}
              className="size-3.5 accent-brand"
            />
            Team out
          </label>
        </div>
      </motion.div>

      {/* Navigation + legend */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="text-base font-semibold text-foreground min-w-44 text-center tabular-nums">
            {periodLabel}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            onClick={goToToday}
            className="ml-2 px-3 py-1 rounded-md border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors"
          >
            Today
          </button>
        </div>

        {/* Type legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {LEAVE_TYPES.filter((t) => t.available)
            .slice(0, 5)
            .map((t) => (
              <span
                key={t.key}
                className={`inline-flex items-center gap-1.5 text-[11px] text-muted-foreground ${t.color}`}
              >
                <span className="size-2 rounded-full bg-current" />
                <span className="text-muted-foreground">{t.shortLabel}</span>
              </span>
            ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="lg:col-span-3"
        >
          {view === "month" && (
            <CalendarMonth
              anchor={anchor}
              selected={selected}
              onSelect={setSelected}
              personalRequests={requests}
              teamLeaves={TEAM_LEAVES}
              holidays={UPCOMING_HOLIDAYS}
              showTeam={showTeam}
            />
          )}
          {view === "week" && (
            <CalendarWeek
              anchor={anchor}
              selected={selected}
              onSelect={setSelected}
              personalRequests={requests}
              teamLeaves={TEAM_LEAVES}
              holidays={UPCOMING_HOLIDAYS}
              showTeam={showTeam}
            />
          )}
          {view === "list" && (
            <CalendarList
              anchor={anchor}
              personalRequests={requests}
              teamLeaves={TEAM_LEAVES}
              holidays={UPCOMING_HOLIDAYS}
              showTeam={showTeam}
            />
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="space-y-6"
        >
          <MiniStats stats={stats} year={anchor.getFullYear()} />

          {selected && (
            <SelectedDayCard
              date={selected}
              onClear={() => setSelected(null)}
            />
          )}
        </motion.aside>
      </div>

      {/* Sticky CTA when a date is selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 right-6 z-30"
          >
            <Link
              href={requestHref}
              className="inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium shadow-[0_8px_24px_rgba(99,102,241,0.35)] hover:shadow-[0_10px_28px_rgba(99,102,241,0.5)] transition-shadow"
            >
              <Plane className="size-4" />
              Request from {selected.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectedDayCard({ date, onClear }: { date: Date; onClear: () => void }) {
  const label = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Selected day</h3>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      </div>
      <p className="text-base text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mt-1">
        Use the floating button bottom-right to request leave from this date.
      </p>
    </div>
  );
}
