"use client";

import { use, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  CalendarRange,
  Heart,
  Lock,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  CURRENT_BALANCES,
  LEAVE_TYPE_MAP,
  TEAM_REQUESTS,
  WELLBEING_SIGNALS,
  balancesFor,
  findTeamMember,
  historyFor,
  patternFor,
} from "@/components/leave/data";
import { EmployeeLeaveTimeline } from "@/components/leave/employee-leave-timeline";
import { WeekdayDistributionChart } from "@/components/leave/weekday-distribution";
import { NoticeHistogram } from "@/components/leave/notice-histogram";
import { StatusPill } from "@/components/leave/status-pill";

const NOTES_KEY = "o2s.managerNotes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DirectReportDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const member = findTeamMember(id);

  // Notes keyed by employee id, kept private to the manager
  const [notesMap, setNotesMap] = useLocalStorage<Record<string, string>>(NOTES_KEY, {});
  const note = notesMap[id] ?? "";

  const memberId = member?.id;
  const memberName = member?.name;
  useEffect(() => {
    if (!memberId) return;
    setScreen({
      module: "Leave",
      page: "Direct Report",
      recordId: memberId,
      recordLabel: memberName,
    });
    return () => setScreen(null);
  }, [memberId, memberName, setScreen]);

  const history = useMemo(() => (member ? historyFor(member.id) : undefined), [member]);
  const pattern = useMemo(() => (member ? patternFor(member.id) : undefined), [member]);
  const signals = useMemo(
    () => (member ? WELLBEING_SIGNALS.filter((s) => s.employeeId === member.id) : []),
    [member],
  );
  const requests = useMemo(
    () => (member ? TEAM_REQUESTS.filter((r) => r.employeeId === member.id) : []),
    [member],
  );

  // Per-employee balances from the HR fixture, falling back to Priya's if not seeded.
  const perEmployee = member ? balancesFor(member.id) : undefined;
  const balances = perEmployee
    ? perEmployee.byType.map((b) => ({
        type: b.type,
        balance: b.balance,
        used: b.used,
        pending: 0,
        expiringDays: 0,
        annualAllotment: b.annualAllotment,
      }))
    : CURRENT_BALANCES.filter((b) => b.type !== "maternity" && b.type !== "bereavement");

  if (!member) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Teammate not found</h1>
        <p className="text-sm text-muted-foreground mt-2">
          <code className="text-foreground">{id}</code> isn&apos;t in your reports.
        </p>
        <Link
          href="/leave/manager"
          className="inline-flex items-center gap-1.5 mt-6 px-3 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Manager Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/leave/manager"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-center gap-4 min-w-0">
          <div className={`size-12 rounded-full ${member.avatarColor} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
            {member.initials}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{member.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {member.role} · {member.subTeam}
              {member.isOnCall && <span className="ml-2 text-warning">· on-call rota</span>}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Two-column main */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — history + patterns + recent requests */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="lg:col-span-2 space-y-6"
        >
          {history ? (
            <EmployeeLeaveTimeline strip={history} />
          ) : (
            <EmptyCard title="No leave history" body="No leaves recorded for this teammate yet." />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pattern ? (
              <>
                <WeekdayDistributionChart data={pattern.weekday} />
                <NoticeHistogram samples={pattern.notice} />
              </>
            ) : (
              <EmptyCard title="No patterns yet" body="Not enough data to surface patterns." />
            )}
          </div>

          {/* Recent requests */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Recent requests</h3>
              <span className="text-[11px] text-muted-foreground">{requests.length} on file</span>
            </div>
            {requests.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No requests on file.</p>
            ) : (
              <ul className="space-y-2">
                {requests.slice(0, 5).map((r) => {
                  const type = LEAVE_TYPE_MAP[r.type];
                  return (
                    <li
                      key={r.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-surface-overlay/40 border border-border"
                    >
                      <div className={`size-8 rounded-md flex items-center justify-center ${type.tint}`}>
                        <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground tabular-nums">
                          {new Date(r.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          {r.startDate !== r.endDate
                            ? ` – ${new Date(r.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                            : ""}
                          <span className="ml-2 text-muted-foreground">· {r.days} day{r.days !== 1 ? "s" : ""}</span>
                        </p>
                        {r.reason && <p className="text-[11px] text-muted-foreground truncate">{r.reason}</p>}
                      </div>
                      <StatusPill status={r.status} />
                      <Link
                        href={`/leave/manager/${r.id}`}
                        className="text-[11px] text-brand hover:underline"
                      >
                        Open →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </motion.div>

        {/* Right 1/3 — balances, wellbeing, manager notes */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="space-y-6"
        >
          {/* Balance summary */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="size-4 text-brand" />
              <h3 className="text-sm font-semibold text-foreground">Current balances</h3>
            </div>
            <ul className="space-y-1.5">
              {balances.slice(0, 5).map((b) => {
                const type = LEAVE_TYPE_MAP[b.type];
                return (
                  <li key={b.type} className="flex items-center gap-2 text-xs">
                    <span className={`size-2 rounded-full bg-current ${type.color}`} />
                    <span className="text-foreground flex-1">{type.label}</span>
                    <span className="tabular-nums text-foreground font-medium">{b.balance}</span>
                    <span className="text-[10px] text-muted-foreground">of {b.annualAllotment}</span>
                  </li>
                );
              })}
            </ul>
            <p className="text-[10px] text-muted-foreground/60 mt-3">
              {perEmployee ? "Per-teammate balances." : "Demo values — production wires per-teammate balances."}
            </p>
          </div>

          {/* Wellbeing signals — private */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="size-4 text-pink-400" />
              <h3 className="text-sm font-semibold text-foreground">Wellbeing</h3>
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-muted-foreground/60">
                <Lock className="size-2.5" />
                Private
              </span>
            </div>
            {signals.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">No flags right now.</p>
            ) : (
              <ul className="space-y-2.5">
                {signals.map((s) => (
                  <li key={s.id} className="flex items-start gap-2.5">
                    <ShieldAlert className={`size-3.5 shrink-0 mt-0.5 ${s.severity === "high" ? "text-destructive" : s.severity === "medium" ? "text-warning" : "text-brand"}`} />
                    <div>
                      <p className="text-xs text-foreground leading-snug">{s.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Manager private notes */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Manager notes</h3>
              <span className="ml-auto text-[10px] text-muted-foreground/60">Private to you</span>
            </div>
            <textarea
              value={note}
              onChange={(e) =>
                setNotesMap((prev) => ({ ...prev, [id]: e.target.value }))
              }
              rows={6}
              placeholder="Personal context, talking points for next 1:1, anything you don't want shared with HR or the employee."
              className="w-full px-3 py-2 rounded-lg bg-secondary text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none leading-relaxed"
            />
            <p className="text-[10px] text-muted-foreground/60 mt-2">
              Saved locally to your browser. {note.length} character{note.length !== 1 ? "s" : ""}.
            </p>
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick links</h3>
            <div className="space-y-1.5 text-xs">
              <Link href="/leave/team" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CalendarRange className="size-3.5 text-muted-foreground" />
                Team capacity heatmap
              </Link>
              <Link href="/leave/manager" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                Manager Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function EmptyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-8 text-center">
      <p className="text-sm text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{body}</p>
    </div>
  );
}
