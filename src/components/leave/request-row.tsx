"use client";

import { Pencil, Trash2 } from "lucide-react";
import { LEAVE_TYPE_MAP, type LeaveRequest } from "@/components/leave/data";
import { StatusPill } from "@/components/leave/status-pill";

function fmtRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sameDay = start === end;
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (sameDay) {
    return s.toLocaleDateString("en-IN", { ...opts, year: "numeric" });
  }
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) {
    return `${s.toLocaleDateString("en-IN", { day: "numeric" })}–${e.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  }
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
}

const GRAN_LABEL = {
  FULL: "",
  FH: "First half",
  SH: "Second half",
  HOURS: "Hourly",
} as const;

export function RequestRow({ r, onEdit, onCancel }: { r: LeaveRequest; onEdit?: () => void; onCancel?: () => void }) {
  const type = LEAVE_TYPE_MAP[r.type];
  const canModify = r.status === "pending" || r.status === "approved";
  const grnLabel = GRAN_LABEL[r.granularity];

  return (
    <div className="flex items-center gap-3 p-3 bg-surface-overlay/40 rounded-lg hover:bg-surface-overlay transition-colors">
      <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${type.tint}`}>
        <span className={`text-[10px] font-bold ${type.color}`}>{type.shortLabel}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{fmtRange(r.startDate, r.endDate)}</span>
          <span className="text-xs text-muted-foreground">
            {r.days} day{r.days !== 1 ? "s" : ""}
            {grnLabel ? ` · ${grnLabel}` : ""}
          </span>
          <StatusPill status={r.status} />
        </div>
        {r.reason && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.reason}</p>
        )}
      </div>

      {canModify && (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Edit"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={onCancel}
            className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Cancel"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
