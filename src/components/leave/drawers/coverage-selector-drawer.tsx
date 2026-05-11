"use client";

import { useState } from "react";
import { Drawer } from "@/components/leave/drawer";
import { COVERAGE_CANDIDATES, type CoverageCandidate } from "@/components/leave/data";

interface Props {
  open: boolean;
  initial?: CoverageCandidate | null;
  onClose: () => void;
  onSubmit: (c: CoverageCandidate | null, note: string) => void;
}

export function CoverageSelectorDrawer({ open, initial = null, onClose, onSubmit }: Props) {
  const [pickedId, setPickedId] = useState<string | null>(initial?.id ?? null);
  const [note, setNote] = useState("");

  function submit() {
    const c = COVERAGE_CANDIDATES.find((x) => x.id === pickedId) ?? null;
    onSubmit(c, note);
    setNote("");
    onClose();
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Pick a delegate"
      subtitle="Pre-sorted by Coverage Agent — lowest current load first."
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            className="h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Confirm coverage
          </button>
        </div>
      }
    >
      <div className="space-y-3">
        <div className="space-y-2">
          {[...COVERAGE_CANDIDATES].sort((a, b) => a.loadScore - b.loadScore).map((c) => {
            const selected = pickedId === c.id;
            const heavy = c.loadScore >= 6;
            return (
              <button
                key={c.id}
                onClick={() => setPickedId(selected ? null : c.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selected
                    ? "border-brand bg-brand/5"
                    : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`size-8 rounded-full ${c.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{c.reason}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                        heavy ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      }`}
                    >
                      Load {c.loadScore}/10
                    </span>
                    <span className={`size-3.5 rounded-full border-2 ${selected ? "border-brand bg-brand" : "border-border"}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
            Handover note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="What they need to know to cover you."
            className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
          />
        </div>
      </div>
    </Drawer>
  );
}
