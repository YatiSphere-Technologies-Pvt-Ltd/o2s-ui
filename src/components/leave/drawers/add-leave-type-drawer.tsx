"use client";

import { useState } from "react";
import { Drawer } from "@/components/leave/drawer";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    key: string;
    label: string;
    shortLabel: string;
    annualAllotment: number;
    accrualRate: number;
    accrualEveryMonths: number;
    carryForwardCap: number | null;
    expiryRule: string;
  }) => void;
}

export function AddLeaveTypeDrawer({ open, onClose, onSubmit }: Props) {
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [shortLabel, setShortLabel] = useState("");
  const [annualAllotment, setAnnual] = useState<number>(12);
  const [accrualRate, setAccrual] = useState<number>(1);
  const [accrualEveryMonths, setEveryMonths] = useState<number>(1);
  const [carryForwardCap, setCap] = useState<string>("");
  const [expiryRule, setExpiry] = useState<string>("Lapses on Dec 31");

  function submit() {
    if (!key.trim() || !label.trim() || !shortLabel.trim()) return;
    const cap = carryForwardCap.trim() === "" ? null : Number(carryForwardCap);
    onSubmit({
      key: key.trim(),
      label: label.trim(),
      shortLabel: shortLabel.trim(),
      annualAllotment,
      accrualRate,
      accrualEveryMonths,
      carryForwardCap: cap,
      expiryRule,
    });
    onClose();
  }

  const ready = key.trim().length > 0 && label.trim().length > 0 && shortLabel.trim().length > 0;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add leave type"
      subtitle="New leave type becomes available across the org once published."
      width="lg"
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
            Create leave type
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value.replace(/\s+/g, "_").toLowerCase())}
              placeholder="e.g. study_leave"
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Short label</label>
            <input
              type="text"
              value={shortLabel}
              onChange={(e) => setShortLabel(e.target.value.toUpperCase().slice(0, 3))}
              placeholder="SL"
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm font-mono text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Display name</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Study Leave"
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Annual allotment (days)</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={annualAllotment}
              onChange={(e) => setAnnual(Math.max(0, Number(e.target.value)))}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40 tabular-nums"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Carry-forward cap</label>
            <input
              type="number"
              min={0}
              value={carryForwardCap}
              onChange={(e) => setCap(e.target.value)}
              placeholder="leave blank for none"
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 tabular-nums"
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Accrual</p>
          <div className="flex items-center gap-2 text-xs text-foreground">
            <input
              type="number"
              min={0}
              step={0.25}
              value={accrualRate}
              onChange={(e) => setAccrual(Math.max(0, Number(e.target.value)))}
              className="h-10 w-20 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40 tabular-nums"
            />
            <span>days every</span>
            <select
              value={accrualEveryMonths}
              onChange={(e) => setEveryMonths(Number(e.target.value))}
              className="h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value={1}>1 month</option>
              <option value={3}>3 months</option>
              <option value={6}>6 months</option>
              <option value={12}>12 months</option>
              <option value={0}>No accrual (lump)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Expiry rule</label>
          <input
            type="text"
            value={expiryRule}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder="e.g. Lapses on Dec 31"
            className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <p className="text-[10px] text-muted-foreground/60">
          Country-specific overrides (e.g. UK SSP-equivalent) can be configured after creation.
        </p>
      </div>
    </Drawer>
  );
}
