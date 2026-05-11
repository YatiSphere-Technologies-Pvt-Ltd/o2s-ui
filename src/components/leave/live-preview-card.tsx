"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarRange, Upload, FileText, Users, ChevronDown } from "lucide-react";
import {
  CURRENT_BALANCES,
  COVERAGE_CANDIDATES,
  LEAVE_TYPE_MAP,
  type CoverageCandidate,
  type PolicyCheck,
} from "@/components/leave/data";
import { PolicyChecks } from "@/components/leave/policy-checks";
import type { ParsedIntent } from "@/components/leave/parser";

function fmtRange(start?: string, end?: string): string {
  if (!start) return "—";
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  const sameDay = start === end;
  if (sameDay) {
    return s.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  }
  return `${s.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} → ${e.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}`;
}

export interface PreviewState {
  ooo: boolean;
  handover: boolean;
  delegate: CoverageCandidate | null;
  hasDocs: boolean;
}

interface Props {
  intent: ParsedIntent | null;
  checks: PolicyCheck[];
  state: PreviewState;
  onStateChange: (next: PreviewState) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
  onEscalate: () => void;
}

export function LivePreviewCard({ intent, checks, state, onStateChange, onSubmit, onSaveDraft, onEscalate }: Props) {
  const type = intent?.leaveType ? LEAVE_TYPE_MAP[intent.leaveType] : undefined;
  const balance = useMemo(
    () => (type ? CURRENT_BALANCES.find((b) => b.type === type.key) : undefined),
    [type],
  );
  const [coverageOpen, setCoverageOpen] = useState(true);

  const days = intent?.workingDays ?? 0;
  const before = balance?.balance ?? 0;
  const after = Math.max(0, before - days);

  const docNeeded = checks.some((c) => c.id === "documents" && c.severity === "warn");
  const blocked = checks.some((c) => c.blocking);
  const hasYellow = checks.some((c) => c.severity === "warn");

  const ready =
    !!intent?.startDate &&
    !!intent?.endDate &&
    !!type &&
    !blocked &&
    (!docNeeded || state.hasDocs);

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <CalendarRange className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Request preview</h3>
        </div>

        <div className="flex items-baseline justify-between">
          <p className="text-base font-medium text-foreground">{fmtRange(intent?.startDate, intent?.endDate)}</p>
          {intent?.workingDays != null && (
            <p className="text-[11px] text-muted-foreground">
              {intent.workingDays} working day{intent.workingDays !== 1 ? "s" : ""}
              {intent.granularity === "FH" && " · first half"}
              {intent.granularity === "SH" && " · second half"}
              {intent.granularity === "HOURS" && " · hourly"}
            </p>
          )}
        </div>

        {type ? (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary">
            <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
            <span className="text-[11px] text-foreground">{type.label}</span>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-muted-foreground italic">Tell Aurora which leave type to use.</p>
        )}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin">
        {/* Balance impact */}
        {type && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
              Balance impact
            </h4>
            <div className="flex items-center gap-3 bg-surface-overlay/40 border border-border rounded-lg p-3">
              <div className="flex-1 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Before</p>
                <p className="text-lg font-bold text-foreground">{before}</p>
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="flex-1 text-center">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">After</p>
                <p className={`text-lg font-bold ${after === 0 ? "text-destructive" : "text-foreground"}`}>
                  {after}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Policy checks */}
        <div>
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
            Policy checks
          </h4>
          {checks.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Waiting for parsed dates…</p>
          ) : (
            <PolicyChecks checks={checks} />
          )}
        </div>

        {/* Coverage suggestion */}
        <div>
          <button
            onClick={() => setCoverageOpen((p) => !p)}
            className="w-full flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2"
          >
            <Users className="size-3" />
            Coverage suggestion
            <ChevronDown className={`size-3 ml-auto transition-transform ${coverageOpen ? "" : "-rotate-90"}`} />
          </button>
          {coverageOpen && (
            <div className="space-y-1.5">
              {COVERAGE_CANDIDATES.map((c) => {
                const selected = state.delegate?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => onStateChange({ ...state, delegate: selected ? null : c })}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border transition-colors text-left ${
                      selected
                        ? "border-brand bg-brand/5"
                        : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                    }`}
                  >
                    <div className={`size-7 rounded-full ${c.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{c.reason}</p>
                    </div>
                    <span
                      className={`size-3.5 rounded-full border-2 shrink-0 ${
                        selected ? "border-brand bg-brand" : "border-border"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Documents */}
        {docNeeded && (
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-2 flex items-center gap-1">
              <FileText className="size-3" /> Document required
            </h4>
            <label
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                state.hasDocs
                  ? "border-success/60 bg-success/5"
                  : "border-border bg-surface-overlay/30 hover:border-brand/60 hover:bg-brand/5"
              }`}
            >
              <input
                type="file"
                className="hidden"
                onChange={(e) => onStateChange({ ...state, hasDocs: !!e.target.files?.length })}
              />
              <Upload className={`size-5 ${state.hasDocs ? "text-success" : "text-muted-foreground"}`} />
              <p className="text-xs text-foreground">
                {state.hasDocs ? "Certificate attached" : "Drop or click to upload certificate"}
              </p>
              <p className="text-[10px] text-muted-foreground">PDF, JPG up to 10 MB</p>
            </label>
          </div>
        )}

        {/* Auto-draft toggles */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">
            Aurora will prepare
          </h4>
          <ToggleRow
            label="Auto-draft OOO message"
            description="Out-of-office for your email and calendar"
            checked={state.ooo}
            onChange={(v) => onStateChange({ ...state, ooo: v })}
          />
          <ToggleRow
            label="Auto-draft handover note"
            description={state.delegate ? `Briefing for ${state.delegate.name}` : "Briefing for your delegate"}
            checked={state.handover}
            onChange={(v) => onStateChange({ ...state, handover: v })}
            disabled={!state.delegate}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 flex items-center gap-2">
        <button
          onClick={onSaveDraft}
          className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Save draft
        </button>
        <button
          onClick={onEscalate}
          className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
        >
          Escalate to HR
        </button>
        <button
          onClick={onSubmit}
          disabled={!ready}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          title={blocked ? "Blocked by a policy check" : hasYellow ? "Submit — your manager will see the flags" : undefined}
        >
          Submit
        </button>
      </div>
    </motion.div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-start justify-between gap-3 p-2.5 rounded-lg bg-surface-overlay/40 border border-border ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <button
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-brand" : "bg-secondary"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
