"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Inbox,
  TrendingUp,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  HR_COUNTRIES,
  LEAVE_TYPES,
  SUB_TEAMS,
  type LeaveTypeKey,
  type OrgRequest,
  type RequestStatus,
  type SubTeam,
} from "@/components/leave/data";
import { OrgRequestsTable } from "@/components/leave/org-requests-table";
import { ReassignApproverModal } from "@/components/leave/reassign-approver-modal";

const STATUS_OPTIONS: { value: RequestStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "taken", label: "Taken" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

type Preset = "pending" | "over_sla" | "long" | null;

export default function AllRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <AllRequestsInner />
    </Suspense>
  );
}

function AllRequestsInner() {
  const { setScreen } = useScreen();
  const params = useSearchParams();
  const initialStatus = (params.get("status") as RequestStatus | null) ?? null;

  const { orgRequests, forceApproveRequest, forceCancelRequest, reassignApprover } = useLeaveStore();

  const [preset, setPreset] = useState<Preset>(initialStatus === "pending" ? "pending" : null);
  const [country, setCountry] = useState<string>("all");
  const [team, setTeam] = useState<SubTeam | "all">("all");
  const [status, setStatus] = useState<RequestStatus | "all">(initialStatus ?? "all");
  const [leaveType, setLeaveType] = useState<LeaveTypeKey | "all">("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [reassignTarget, setReassignTarget] = useState<OrgRequest | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "All Requests" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  /* Apply preset on click — composes with current filters. */
  function applyPreset(p: Preset) {
    setPreset(p);
    if (p === "pending") {
      setStatus("pending");
    } else if (p === "over_sla") {
      setStatus("pending");
    } else if (p === "long") {
      setStatus("all");
    } else {
      setStatus("all");
    }
  }

  /* Filter compose */
  const rows = useMemo(() => {
    return orgRequests
      .filter((r) => {
        if (country !== "all" && r.country !== country) return false;
        if (team !== "all" && r.subTeam !== team) return false;
        if (status !== "all" && r.status !== status) return false;
        if (leaveType !== "all" && r.type !== leaveType) return false;
        if (fromDate && r.endDate < fromDate) return false;
        if (toDate && r.startDate > toDate) return false;
        if (preset === "over_sla") {
          if (r.status !== "pending") return false;
          if (!r.overSlaBy || r.overSlaBy <= 0) return false;
        }
        if (preset === "long") {
          if (r.days < 5) return false;
        }
        return true;
      })
      .sort((a, b) => b.submittedOn.localeCompare(a.submittedOn));
  }, [orgRequests, country, team, status, leaveType, fromDate, toDate, preset]);

  // Counts for the preset chips (computed against current filter context minus the preset itself)
  const baseFiltered = useMemo(
    () =>
      orgRequests.filter((r) => {
        if (country !== "all" && r.country !== country) return false;
        if (team !== "all" && r.subTeam !== team) return false;
        if (leaveType !== "all" && r.type !== leaveType) return false;
        if (fromDate && r.endDate < fromDate) return false;
        if (toDate && r.startDate > toDate) return false;
        return true;
      }),
    [orgRequests, country, team, leaveType, fromDate, toDate],
  );
  const pendingCount = baseFiltered.filter((r) => r.status === "pending").length;
  const overSlaCount = baseFiltered.filter((r) => r.status === "pending" && (r.overSlaBy ?? 0) > 0).length;
  const longCount = baseFiltered.filter((r) => r.days >= 5).length;

  function resetFilters() {
    setCountry("all");
    setTeam("all");
    setStatus("all");
    setLeaveType("all");
    setFromDate("");
    setToDate("");
    setPreset(null);
  }

  function handleForceApprove(r: OrgRequest) {
    forceApproveRequest(r.id, "HR override");
    flashOnce(`Force-approved ${r.employeeName.split(" ")[0]}'s request.`);
  }
  function handleForceCancel(r: OrgRequest) {
    forceCancelRequest(r.id, "HR override");
    flashOnce(`Force-cancelled ${r.employeeName.split(" ")[0]}'s request.`);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/leave/hr"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">All requests</h1>
          <p className="text-sm text-muted-foreground">
            Cross-org inbox. Filter, drill in, intervene when you need to.
          </p>
        </div>
      </motion.div>

      {/* Preset chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <PresetChip
          icon={Inbox}
          label="Pending org-wide"
          count={pendingCount}
          active={preset === "pending"}
          onClick={() => applyPreset(preset === "pending" ? null : "pending")}
        />
        <PresetChip
          icon={AlertCircle}
          label="Over SLA"
          count={overSlaCount}
          active={preset === "over_sla"}
          tone="destructive"
          onClick={() => applyPreset(preset === "over_sla" ? null : "over_sla")}
        />
        <PresetChip
          icon={TrendingUp}
          label="High-value (≥ 5 days)"
          count={longCount}
          active={preset === "long"}
          tone="warning"
          onClick={() => applyPreset(preset === "long" ? null : "long")}
        />
        <button
          onClick={resetFilters}
          className="ml-auto text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="size-3.5 text-muted-foreground" />
          <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Filters</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <FilterSelect
            label="Country"
            value={country}
            onChange={setCountry}
            options={[{ value: "all", label: "All countries" }, ...HR_COUNTRIES.map((c) => ({ value: c.code, label: `${c.flag} ${c.name}` }))]}
          />
          <FilterSelect
            label="Team"
            value={team}
            onChange={(v) => setTeam(v as SubTeam | "all")}
            options={[{ value: "all", label: "All teams" }, ...SUB_TEAMS.map((s) => ({ value: s, label: s }))]}
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={(v) => setStatus(v as RequestStatus | "all")}
            options={STATUS_OPTIONS}
          />
          <FilterSelect
            label="Type"
            value={leaveType}
            onChange={(v) => setLeaveType(v as LeaveTypeKey | "all")}
            options={[{ value: "all", label: "All types" }, ...LEAVE_TYPES.map((t) => ({ value: t.key, label: t.label }))]}
          />
          <FilterDate label="From" value={fromDate} onChange={setFromDate} />
          <FilterDate label="To" value={toDate} onChange={setToDate} />
        </div>
      </div>

      {/* Result count + table */}
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted-foreground tabular-nums">
          {rows.length} request{rows.length !== 1 ? "s" : ""} match.
        </p>
      </div>

      <OrgRequestsTable
        rows={rows}
        onForceApprove={handleForceApprove}
        onForceCancel={handleForceCancel}
        onReassign={(r) => setReassignTarget(r)}
      />

      <ReassignApproverModal
        request={reassignTarget}
        onClose={() => setReassignTarget(null)}
        onSubmit={(name, initials, note) => {
          if (!reassignTarget) return;
          reassignApprover(reassignTarget.id, name, initials, note || undefined);
          flashOnce(`Reassigned to ${name}.`);
          setReassignTarget(null);
        }}
      />

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PresetChip({
  icon: Icon,
  label,
  count,
  active,
  onClick,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone?: "destructive" | "warning";
}) {
  const activeColor =
    tone === "destructive"
      ? "text-destructive border-destructive/40 bg-destructive/10"
      : tone === "warning"
      ? "text-warning border-warning/40 bg-warning/10"
      : "text-brand border-brand/40 bg-brand/10";
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium transition-colors ${
        active
          ? activeColor
          : "border-border bg-surface-overlay/40 text-foreground hover:bg-surface-overlay"
      }`}
    >
      <Icon className={`size-3 ${active ? "" : "opacity-60"}`} />
      {label}
      <span className={`tabular-nums ${active ? "opacity-90" : "opacity-60"}`}>· {count}</span>
    </button>
  );
}

function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FilterDate({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
        {label}
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  );
}
