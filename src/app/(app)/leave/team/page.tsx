"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, ShieldAlert, Users } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  EMPLOYEE_ROLES,
  SUB_TEAMS,
  TEAM_MEMBERS,
  type EmployeeRole,
  type SubTeam,
} from "@/components/leave/data";
import { CapacityHeatmap } from "@/components/leave/capacity-heatmap";

export default function LeaveTeamPage() {
  const router = useRouter();
  const { setScreen } = useScreen();

  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [subTeam, setSubTeam] = useState<SubTeam | "all">("all");
  const [role, setRole] = useState<EmployeeRole | "all">("all");
  const [watchOnCall, setWatchOnCall] = useState(true);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Team Capacity" });
    return () => setScreen(null);
  }, [setScreen]);

  function navigate(delta: number) {
    setAnchor((a) => {
      const next = new Date(a);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/leave/manager"
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Team capacity</h1>
            <p className="text-sm text-muted-foreground">
              Plan around availability. Hover a day to see who&apos;s out and who&apos;s covering.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="flex items-center justify-between gap-3 flex-wrap"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="text-base font-semibold text-foreground min-w-44 text-center tabular-nums">
            {anchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
          <button
            onClick={() => setAnchor(new Date())}
            className="ml-1 px-3 py-1 rounded-md border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={subTeam}
            onChange={(e) => setSubTeam(e.target.value as SubTeam | "all")}
            className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All sub-teams</option>
            {SUB_TEAMS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as EmployeeRole | "all")}
            className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All roles</option>
            {EMPLOYEE_ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground cursor-pointer hover:bg-surface-overlay transition-colors">
            <input
              type="checkbox"
              checked={watchOnCall}
              onChange={(e) => setWatchOnCall(e.target.checked)}
              className="size-3.5 accent-brand"
            />
            <ShieldAlert className="size-3.5 text-warning" />
            On-call overlay
          </label>
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] flex-wrap">
        <Legend color="bg-success/15" text="text-success" label="≥ 80% present" />
        <Legend color="bg-warning/15" text="text-warning" label="50–80% present" />
        <Legend color="bg-destructive/15" text="text-destructive" label="< 50% present" />
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <ShieldAlert className="size-3 text-destructive" />
          Critical role breach
        </span>
        <span className="ml-auto text-muted-foreground tabular-nums">
          <Users className="size-3 inline align-baseline mr-1 text-muted-foreground/60" />
          {TEAM_MEMBERS.length} total members
        </span>
      </div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <CapacityHeatmap
          anchor={anchor}
          filters={{ subTeam, role, watchOnCall }}
          onPickEmployee={(id) => router.push(`/leave/manager/report/${id}`)}
        />
      </motion.div>
    </div>
  );
}

function Legend({ color, text, label }: { color: string; text: string; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${text}`}>
      <span className={`size-3 rounded ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
