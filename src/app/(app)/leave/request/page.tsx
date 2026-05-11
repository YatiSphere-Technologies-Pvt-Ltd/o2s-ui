"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle, FormInput } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useScreen } from "@/lib/screen-context";
import {
  checksFor,
  COVERAGE_CANDIDATES,
  LEAVE_TYPE_MAP,
  negotiateAlternatives,
  TEAM_OUT_TODAY,
  type CoverageCandidate,
  type PolicyCheck,
} from "@/components/leave/data";
import { parseLeaveIntent, summarizeIntent, type ParsedIntent } from "@/components/leave/parser";
import { ConversationPane, type Bubble } from "@/components/leave/conversation-pane";
import { LivePreviewCard, type PreviewState } from "@/components/leave/live-preview-card";
import {
  StructuredRequestForm,
  type StructuredFormSubmission,
} from "@/components/leave/structured-request-form";

type Mode = "aurora" | "form";

export default function LeaveRequestPage() {
  return (
    <Suspense fallback={<RequestPageFallback />}>
      <LeaveRequestInner />
    </Suspense>
  );
}

function RequestPageFallback() {
  return (
    <div className="flex items-center justify-center h-[60vh] text-sm text-muted-foreground">
      Loading conversation…
    </div>
  );
}

function fmtRangeShort(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return start === end
    ? s.toLocaleDateString("en-IN", opts)
    : `${s.toLocaleDateString("en-IN", opts)} → ${e.toLocaleDateString("en-IN", opts)}`;
}

function LeaveRequestInner() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const { setScreen } = useScreen();

  const [mode, setMode] = useState<Mode>("aurora");
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [intent, setIntent] = useState<ParsedIntent | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({
    ooo: true,
    handover: false,
    delegate: null,
    hasDocs: false,
  });
  const idRef = useRef(0);

  useEffect(() => {
    setScreen({ module: "Leave", page: "New request" });
    return () => setScreen(null);
  }, [setScreen]);

  const nextId = useCallback(() => `m-${++idRef.current}`, []);

  // Recompute policy checks reactively as intent changes
  const checks: PolicyCheck[] = useMemo(() => {
    if (!intent?.startDate || !intent.leaveType) return [];
    const conflictsToday = TEAM_OUT_TODAY.length;
    return checksFor(intent.leaveType, {
      days: intent.workingDays ?? 0,
      conflictsToday,
    });
  }, [intent]);

  const autoSelectDelegate = useCallback(() => {
    setPreview((prev) =>
      prev.delegate ? prev : { ...prev, delegate: COVERAGE_CANDIDATES[0] ?? null },
    );
  }, []);

  // Conversation orchestration
  const processInput = useCallback(
    (text: string) => {
      // Push user bubble
      setMessages((prev) => [...prev, { id: `u-${prev.length + 1}`, role: "user", text }]);
      setBusy(true);

      // Simulate tool-call timing for legibility
      window.setTimeout(() => {
        const parsed = parseLeaveIntent(text);

        // Tool line: Intake Agent
        const queue: Bubble[] = [];
        queue.push({
          id: `t-${nextId()}`,
          role: "tool",
          agent: "Intake Agent",
          text: "parsing dates, leave type, partial-day",
        });
        queue.push({
          id: `a-${nextId()}`,
          role: "aurora",
          text: summarizeIntent(parsed),
        });

        // If type missing, ask
        if (!parsed.leaveType) {
          queue.push({
            id: `c-${nextId()}`,
            role: "chip",
            chips: ["Privileged Leave", "Sick Leave", "Casual Leave", "Comp-Off", "WFA"],
          });
        }

        // Tool: Policy Explainer
        if (parsed.startDate && parsed.leaveType) {
          queue.push({
            id: `t2-${nextId()}`,
            role: "tool",
            agent: "Policy Explainer",
            text: "checking probation, blackout, balance, notice, coverage",
          });

          // Coverage Agent suggestion
          queue.push({
            id: `t3-${nextId()}`,
            role: "tool",
            agent: "Coverage Agent",
            text: "scanning teammate workloads for a delegate",
          });
          queue.push({
            id: `a2-${nextId()}`,
            role: "aurora",
            text: `Coverage suggestion: ${COVERAGE_CANDIDATES[0].name} — ${COVERAGE_CANDIDATES[0].reason}`,
          });

          // Holiday Negotiator: if today has 2+ teammates already out, propose alternatives
          if (TEAM_OUT_TODAY.length >= 2 && parsed.workingDays && parsed.workingDays >= 1) {
            const alts = negotiateAlternatives(parsed.startDate);
            queue.push({
              id: `t4-${nextId()}`,
              role: "tool",
              agent: "Holiday Negotiator",
              text: "found cleaner windows nearby",
            });
            queue.push({
              id: `a3-${nextId()}`,
              role: "aurora",
              text: `Two other engineers are already out on ${fmtRangeShort(parsed.startDate, parsed.endDate ?? parsed.startDate)}. How about ${fmtRangeShort(alts[0].startDate, alts[0].endDate)} instead? ${alts[0].rationale}`,
            });
            queue.push({
              id: `c2-${nextId()}`,
              role: "chip",
              chips: [
                `Switch to ${fmtRangeShort(alts[0].startDate, alts[0].endDate)}`,
                "Keep current dates",
              ],
            });
          }
        }

        // Sick leaves ≥ 3 days warning
        if (parsed.leaveType === "sick" && (parsed.workingDays ?? 0) >= 3) {
          queue.push({
            id: `a4-${nextId()}`,
            role: "aurora",
            text: "Heads up: sick leave of 3+ consecutive days needs a medical certificate before HR final-approves. Drop it on the right when you have it.",
          });
        }

        setMessages((prev) => [...prev, ...queue]);
        setIntent(parsed);
        if (parsed.leaveType && parsed.startDate) autoSelectDelegate();
        setBusy(false);
      }, 350);
    },
    [autoSelectDelegate, nextId],
  );

  // Seed the conversation from the URL query
  useEffect(() => {
    if (initialQuery) {
      processInput(initialQuery);
    } else {
      setMessages([
        {
          id: "a-greet",
          role: "aurora",
          text: "Hi Priya. What do you need? You can say things like “next Friday off”, “sick today”, or “Mon–Wed for a family trip”.",
        },
        {
          id: "c-greet",
          role: "chip",
          chips: ["Next Friday off", "Half-day Friday", "Sick today", "Mon to Wed", "WFA next week"],
        },
      ]);
    }
    // intentionally run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle quick-reply chips that mean "switch dates"
  const handleSubmit = useCallback(
    (text: string) => {
      // Quick chip: "Keep current dates"
      if (/^keep current dates$/i.test(text.trim())) {
        setMessages((prev) => [
          ...prev,
          { id: `u-keep-${prev.length + 1}`, role: "user", text },
          { id: `a-keep-${prev.length + 2}`, role: "aurora", text: "Sticking with your original dates. The right pane has the policy flags — review before submitting." },
        ]);
        return;
      }
      // Quick chip: "Switch to <range>"
      const m = text.match(/^Switch to (.+)$/i);
      if (m && intent?.leaveType) {
        // Synthesize a new intent based on the proposed range string by re-parsing
        processInput(`${m[1]} ${intent.leaveType}`);
        return;
      }
      processInput(text);
    },
    [intent, processInput],
  );

  const onSelectCoverage = useCallback((c: CoverageCandidate | null) => {
    setPreview((prev) => ({ ...prev, delegate: c }));
  }, []);

  const onSubmit = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      {
        id: `a-submit-${prev.length + 1}`,
        role: "aurora",
        text: "Submitted to Meera Krishnan. You'll get a Slack ping when she decides. Drafted OOO and handover are saved as drafts — review them on /leave.",
      },
    ]);
    // In a real app: POST to /api/leave/requests, then redirect
    window.setTimeout(() => router.push("/leave"), 1200);
  }, [router]);

  const onSaveDraft = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { id: `a-draft-${prev.length + 1}`, role: "aurora", text: "Saved as a draft. You can pick this up again from /leave." },
    ]);
  }, []);

  const onEscalate = useCallback(() => {
    setMessages((prev) => [
      ...prev,
      { id: `a-esc-${prev.length + 1}`, role: "aurora", text: "Looping in HR. They'll reach out within one working day." },
    ]);
  }, []);

  // Form-mode submit: narrate into the transcript so the conversation has a record,
  // then route through the same submit path.
  const onFormSubmit = useCallback(
    (s: StructuredFormSubmission) => {
      const type = s.intent.leaveType ? LEAVE_TYPE_MAP[s.intent.leaveType] : undefined;
      const fmt = (iso?: string) =>
        iso ? new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }) : "—";
      const range =
        s.intent.startDate === s.intent.endDate
          ? fmt(s.intent.startDate)
          : `${fmt(s.intent.startDate)} → ${fmt(s.intent.endDate)}`;
      const gran =
        s.intent.granularity === "FH" ? " (first half)" :
        s.intent.granularity === "SH" ? " (second half)" :
        s.intent.granularity === "HOURS" ? " (hourly)" : "";
      const attach = s.attachments.length
        ? ` · ${s.attachments.length} attachment${s.attachments.length > 1 ? "s" : ""}`
        : "";
      setMessages((prev) => [
        ...prev,
        {
          id: `u-form-${prev.length + 1}`,
          role: "user",
          text: `Submitted via form: ${type?.label ?? "leave"} on ${range}${gran}${attach}${
            s.reason ? ` — ${s.reason}` : ""
          }`,
        },
      ]);
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)] flex flex-col gap-4">
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
            <h1 className="text-xl font-bold text-foreground tracking-tight">New leave request</h1>
            <p className="text-xs text-muted-foreground">
              {mode === "aurora"
                ? "Aurora handles the form. Refine on the left, preview on the right."
                : "Classic form on the left, live preview on the right. Switch to Aurora any time."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 text-[11px]">
          <button
            onClick={() => setMode("aurora")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === "aurora"
                ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageCircle className="size-3.5" />
            Aurora
          </button>
          <button
            onClick={() => setMode("form")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              mode === "form"
                ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FormInput className="size-3.5" />
            Form
          </button>
        </div>
      </motion.div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 min-h-0">
          {mode === "aurora" ? (
            <ConversationPane messages={messages} onSubmit={handleSubmit} busy={busy} />
          ) : (
            <StructuredRequestForm
              intent={intent}
              delegate={preview.delegate}
              onChangeIntent={setIntent}
              onChangeDelegate={(d) => setPreview((p) => ({ ...p, delegate: d }))}
              onSubmit={onFormSubmit}
              onSaveDraft={onSaveDraft}
              blocked={checks.some((c) => c.blocking)}
            />
          )}
        </div>
        <div className="lg:col-span-2 min-h-0">
          <LivePreviewCard
            intent={intent}
            checks={checks}
            state={preview}
            onStateChange={(next) => {
              setPreview(next);
              // Selecting a coverage candidate via the card also toggles delegate state
              if (next.delegate?.id !== preview.delegate?.id) onSelectCoverage(next.delegate);
            }}
            onSubmit={onSubmit}
            onSaveDraft={onSaveDraft}
            onEscalate={onEscalate}
          />
        </div>
      </div>
    </div>
  );
}
