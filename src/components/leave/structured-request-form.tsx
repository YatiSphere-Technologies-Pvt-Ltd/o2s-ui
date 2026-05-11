"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, X } from "lucide-react";
import {
  COVERAGE_CANDIDATES,
  LEAVE_TYPES,
  type CoverageCandidate,
  type LeaveTypeKey,
} from "@/components/leave/data";
import type { ParsedIntent } from "@/components/leave/parser";

export interface StructuredFormSubmission {
  intent: ParsedIntent;
  reason: string;
  attachments: { name: string; size: number }[];
  delegate: CoverageCandidate | null;
}

interface Props {
  intent: ParsedIntent | null;
  delegate: CoverageCandidate | null;
  onChangeIntent: (next: ParsedIntent) => void;
  onChangeDelegate: (next: CoverageCandidate | null) => void;
  onSubmit: (s: StructuredFormSubmission) => void;
  onSaveDraft: () => void;
  blocked: boolean;
}

function workingDaysBetween(startISO: string, endISO: string): number {
  const s = new Date(startISO);
  const e = new Date(endISO);
  if (e < s) return 0;
  let count = 0;
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

export function StructuredRequestForm({
  intent,
  delegate,
  onChangeIntent,
  onChangeDelegate,
  onSubmit,
  onSaveDraft,
  blocked,
}: Props) {
  const [reason, setReason] = useState("");
  const [attachments, setAttachments] = useState<{ name: string; size: number }[]>([]);
  const [hoursStart, setHoursStart] = useState("10:00");
  const [hoursEnd, setHoursEnd] = useState("13:00");

  // Local mirrors so the inputs stay controlled with empty initial values
  const [type, setType] = useState<LeaveTypeKey | "">(intent?.leaveType ?? "");
  const [start, setStart] = useState<string>(intent?.startDate ?? "");
  const [end, setEnd] = useState<string>(intent?.endDate ?? "");
  const [granularity, setGranularity] = useState<ParsedIntent["granularity"]>(intent?.granularity ?? "FULL");

  // When external intent changes (e.g. from Aurora conversation), pull values in
  useEffect(() => {
    if (!intent) return;
    if (intent.leaveType && intent.leaveType !== type) setType(intent.leaveType);
    if (intent.startDate && intent.startDate !== start) setStart(intent.startDate);
    if (intent.endDate && intent.endDate !== end) setEnd(intent.endDate);
    if (intent.granularity !== granularity) setGranularity(intent.granularity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intent?.leaveType, intent?.startDate, intent?.endDate, intent?.granularity]);

  // Push form changes back up so the right-pane preview stays in sync
  useEffect(() => {
    if (!start) return;
    const computedEnd = end || start;
    const workingDays = granularity === "FULL" ? workingDaysBetween(start, computedEnd) : 0.5;
    const next: ParsedIntent = {
      raw: "form input",
      startDate: start,
      endDate: computedEnd,
      workingDays,
      granularity,
      leaveType: type || undefined,
      notes: [],
      unresolved: [],
    };
    onChangeIntent(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, start, end, granularity]);

  const days = useMemo(
    () => (start ? (granularity === "FULL" ? workingDaysBetween(start, end || start) : 0.5) : 0),
    [start, end, granularity],
  );

  const ready = !!type && !!start && !blocked;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const items = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
    setAttachments((prev) => [...prev, ...items]);
  }

  function removeFile(idx: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !type || !start) return;
    onSubmit({
      intent: {
        raw: "form input",
        startDate: start,
        endDate: end || start,
        workingDays: days,
        granularity,
        leaveType: type,
        notes: hoursStart && hoursEnd && granularity === "HOURS" ? [`${hoursStart} – ${hoursEnd}`] : [],
        unresolved: [],
      },
      reason,
      attachments,
      delegate,
    });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden"
    >
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Structured request</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Same preview on the right, just classic form fields here. Switch to Aurora any time.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Leave type */}
        <Field label="Leave type" required>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveTypeKey)}
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="" disabled>
              Select leave type…
            </option>
            {LEAVE_TYPES.map((t) => (
              <option key={t.key} value={t.key} disabled={!t.available}>
                {t.label}
                {!t.available ? " — not available" : ""}
              </option>
            ))}
          </select>
        </Field>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start date" required>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            />
          </Field>
          <Field label="End date">
            <input
              type="date"
              value={end}
              min={start || undefined}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              placeholder="Same as start"
            />
          </Field>
        </div>

        {/* Granularity */}
        <Field label="Duration">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            {(
              [
                { key: "FULL", label: "Full day(s)" },
                { key: "FH",   label: "Half · AM" },
                { key: "SH",   label: "Half · PM" },
                { key: "HOURS",label: "Hourly" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setGranularity(opt.key)}
                className={`flex-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                  granularity === opt.key
                    ? "bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {granularity === "HOURS" && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input
                type="time"
                value={hoursStart}
                onChange={(e) => setHoursStart(e.target.value)}
                className="h-9 px-2 rounded-md bg-secondary text-xs text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              />
              <input
                type="time"
                value={hoursEnd}
                onChange={(e) => setHoursEnd(e.target.value)}
                className="h-9 px-2 rounded-md bg-secondary text-xs text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>
          )}
        </Field>

        {/* Reason */}
        <Field label="Reason">
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional — adds context for your approver."
            className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
          />
        </Field>

        {/* Delegate */}
        <Field label="Delegate">
          <select
            value={delegate?.id ?? ""}
            onChange={(e) => {
              const next = COVERAGE_CANDIDATES.find((c) => c.id === e.target.value) ?? null;
              onChangeDelegate(next);
            }}
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">No delegate</option>
            {COVERAGE_CANDIDATES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        {/* Attachments */}
        <Field label="Attachments">
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground cursor-pointer hover:bg-surface-overlay transition-colors">
            <Paperclip className="size-4" />
            <span>Add file…</span>
            <input
              type="file"
              multiple
              onChange={(e) => addFiles(e.target.files)}
              className="hidden"
            />
          </label>
          {attachments.length > 0 && (
            <ul className="mt-2 space-y-1">
              {attachments.map((f, i) => (
                <li
                  key={f.name + i}
                  className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface-overlay/60 text-xs"
                >
                  <Paperclip className="size-3 text-muted-foreground shrink-0" />
                  <span className="flex-1 min-w-0 truncate text-foreground">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground/60 shrink-0">
                    {(f.size / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="p-0.5 text-muted-foreground/60 hover:text-destructive"
                    aria-label="Remove"
                  >
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Field>
      </div>

      <div className="border-t border-border p-4 flex items-center gap-2">
        <button
          type="button"
          onClick={onSaveDraft}
          className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Save draft
        </button>
        <button
          type="submit"
          disabled={!ready}
          className="ml-auto px-4 py-2 rounded-lg bg-linear-to-r from-brand to-brand-purple text-white text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          Submit
        </button>
      </div>
    </motion.form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
