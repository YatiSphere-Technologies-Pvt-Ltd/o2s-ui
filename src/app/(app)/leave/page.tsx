"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CalendarRange } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRole } from "@/lib/role-context";
import {
  CURRENT_BALANCES,
  EMPLOYEE_FIRST_NAME,
  MY_REQUESTS,
  SUGGESTIONS,
  totalAvailable,
  totalUsedYTD,
  type AgentSuggestion,
  type LeaveRequest,
} from "@/components/leave/data";
import { BalanceCard } from "@/components/leave/balance-card";
import { RequestRow } from "@/components/leave/request-row";
import { AuroraIntakeBox } from "@/components/leave/aurora-intake-box";
import { SuggestionCard } from "@/components/leave/suggestion-card";
import { TeamOutList } from "@/components/leave/team-out-list";
import { HolidayList } from "@/components/leave/holiday-list";
import { ActivityFeed } from "@/components/leave/activity-feed";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function isUpcoming(r: LeaveRequest): boolean {
  if (r.status === "taken" || r.status === "cancelled" || r.status === "rejected") return false;
  return new Date(r.endDate) >= new Date(new Date().setHours(0, 0, 0, 0));
}

export default function LeaveHomePage() {
  const router = useRouter();
  const { setScreen } = useScreen();
  const { activeRole } = useRole();
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>(SUGGESTIONS);

  // Manager/HR/Admin see the team-side dashboard on /leave.
  useEffect(() => {
    if (activeRole === "hr" || activeRole === "admin") {
      router.replace("/leave/hr");
    } else if (activeRole === "manager") {
      router.replace("/leave/manager");
    }
  }, [activeRole, router]);

  useEffect(() => {
    setScreen({ module: "Leave", page: "My Leave" });
    return () => setScreen(null);
  }, [setScreen]);

  const available = totalAvailable(CURRENT_BALANCES);
  const usedYtd = totalUsedYTD(CURRENT_BALANCES);

  const upcoming = useMemo(
    () =>
      [...MY_REQUESTS]
        .filter(isUpcoming)
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, 3),
    [],
  );

  if (activeRole !== "employee") {
    return (
      <div className="flex items-center justify-center h-[60vh] text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  function handleAuroraSubmit(text: string) {
    router.push(`/leave/request?q=${encodeURIComponent(text)}`);
  }

  function dismissSuggestion(s: AgentSuggestion) {
    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
  }

  function actSuggestion(s: AgentSuggestion) {
    setSuggestions((prev) => prev.filter((x) => x.id !== s.id));
    router.push(`/leave/request?q=${encodeURIComponent(s.primary.label)}`);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting strip */}
      <motion.div {...fadeUp} className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Hi {EMPLOYEE_FIRST_NAME} — you have{" "}
            <span className="text-brand">{available} days</span> available
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {usedYtd} days used this year · FY2026 Q2
          </p>
        </div>
        <Link
          href="/leave/calendar"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <CalendarRange className="size-4" />
          View calendar
          <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>

      {/* Conversational entry — primary CTA */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
        <AuroraIntakeBox onSubmit={handleAuroraSubmit} />
      </motion.div>

      {/* Smart suggestions */}
      {suggestions.length > 0 && (
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="space-y-3">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold">
            Suggested for you
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {suggestions.map((s) => (
              <SuggestionCard
                key={s.id}
                s={s}
                onPrimary={actSuggestion}
                onDismiss={dismissSuggestion}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Balance cards */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground/70 font-semibold">
            Your balances
          </h2>
          <Link
            href="/leave/balances"
            className="text-[11px] text-brand hover:underline"
          >
            See breakdown →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {CURRENT_BALANCES.map((b) => (
            <BalanceCard key={b.type} b={b} />
          ))}
        </div>
      </motion.div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — upcoming + activity */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Your upcoming leaves</h3>
              <Link href="/leave/history" className="text-[11px] text-brand hover:underline">
                See all
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                Nothing scheduled. Use the box above to plan something.
              </p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((r) => (
                  <RequestRow key={r.id} r={r} />
                ))}
              </div>
            )}
          </div>

          <ActivityFeed />
        </motion.div>

        {/* Right 1/3 — team out + holidays */}
        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.25 }}
          className="space-y-6"
        >
          <TeamOutList />
          <HolidayList />
        </motion.div>
      </div>
    </div>
  );
}
