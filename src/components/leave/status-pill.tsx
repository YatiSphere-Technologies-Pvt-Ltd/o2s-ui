"use client";

import { Check, Clock, X, Ban, CalendarCheck } from "lucide-react";
import type { RequestStatus } from "@/components/leave/data";

const META: Record<RequestStatus, { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }> = {
  draft:     { label: "Draft",     classes: "bg-secondary text-muted-foreground",     icon: Clock },
  pending:   { label: "Pending",   classes: "bg-warning/10 text-warning",             icon: Clock },
  approved:  { label: "Approved",  classes: "bg-success/10 text-success",             icon: Check },
  rejected:  { label: "Rejected",  classes: "bg-destructive/10 text-destructive",     icon: X },
  cancelled: { label: "Cancelled", classes: "bg-secondary text-muted-foreground",     icon: Ban },
  taken:     { label: "Taken",     classes: "bg-brand/10 text-brand",                 icon: CalendarCheck },
};

export function StatusPill({ status }: { status: RequestStatus }) {
  const m = META[status];
  const Icon = m.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${m.classes}`}
    >
      <Icon className="size-3" />
      {m.label}
    </span>
  );
}
