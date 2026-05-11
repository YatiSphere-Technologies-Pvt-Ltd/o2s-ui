"use client";

import { useState } from "react";
import { Minus, Plus, Wallet } from "lucide-react";
import { Drawer } from "@/components/leave/drawer";
import {
  LEAVE_TYPES,
  TEAM_MEMBERS,
  balancesFor,
  type LeaveTypeKey,
  type TeamMember,
} from "@/components/leave/data";

interface Props {
  open: boolean;
  /** Pre-selected employee, optional. */
  member?: TeamMember | null;
  onClose: () => void;
  onSubmit: (payload: {
    employeeId: string;
    type: LeaveTypeKey;
    delta: number;
    reason: string;
  }) => void;
}

export function ManualBalanceAdjustmentDrawer({ open, member, onClose, onSubmit }: Props) {
  const [employeeId, setEmployeeId] = useState<string>(member?.id ?? "");
  const [type, setType] = useState<LeaveTypeKey | "">("");
  const [delta, setDelta] = useState<number>(1);
  const [sign, setSign] = useState<"add" | "subtract">("add");
  const [reason, setReason] = useState("");

  const balances = employeeId ? balancesFor(employeeId) : undefined;
  const current = type && balances ? balances.byType.find((b) => b.type === type)?.balance ?? 0 : 0;
  const signed = sign === "add" ? delta : -delta;
  const next = current + signed;

  function submit() {
    if (!employeeId || !type || delta <= 0) return;
    onSubmit({ employeeId, type, delta: signed, reason });
    setReason("");
    onClose();
  }

  const ready = !!employeeId && !!type && delta > 0 && reason.trim().length > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Manual balance adjustment"
      subtitle="HR override — writes to the employee's audit trail."
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!ready}
            className="h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            Apply adjustment
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Employee</label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">Pick an employee…</option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>{m.name} · {m.role}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Leave type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LeaveTypeKey)}
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          >
            <option value="">Pick a type…</option>
            {LEAVE_TYPES.filter((t) => t.available).map((t) => (
              <option key={t.key} value={t.key}>{t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Adjustment</label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-secondary rounded-lg p-1 text-[11px]">
              <button
                onClick={() => setSign("add")}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  sign === "add" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Plus className="size-3" />
                Add
              </button>
              <button
                onClick={() => setSign("subtract")}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  sign === "subtract" ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Minus className="size-3" />
                Subtract
              </button>
            </div>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={delta}
              onChange={(e) => setDelta(Math.max(0, Number(e.target.value)))}
              className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40 tabular-nums"
            />
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </div>

        {type && (
          <div className="flex items-center gap-3 p-3 bg-surface-overlay/40 border border-border rounded-lg">
            <Wallet className="size-4 text-brand shrink-0" />
            <p className="text-xs text-foreground tabular-nums">
              {current}
              <span className="text-muted-foreground"> →</span>{" "}
              <span className={next < 0 ? "text-destructive" : ""}>{next}</span>
              <span className="ml-2 text-[10px] text-muted-foreground">after adjustment</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
            Reason <span className="text-destructive">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Compensatory grant — weekend release work on May 10."
            className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
          />
        </div>

        <p className="text-[10px] text-muted-foreground/60">
          This action is audited. The employee will see the adjustment + your note on their balance card.
        </p>
      </div>
    </Drawer>
  );
}
