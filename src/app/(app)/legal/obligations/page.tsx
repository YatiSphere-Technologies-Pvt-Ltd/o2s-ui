"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardList,
  Filter as FilterIcon,
  Search,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import {
  OBLIGATION_KIND_LABEL,
  contractById as seedContractById,
  type Obligation,
  type ObligationKind,
} from "@/components/legal/clm/data";

type StatusFilter = "all" | "open" | "due_soon" | "overdue" | "completed";

export default function ObligationsPage() {
  const { setScreen } = useScreen();
  const { obligations, setObligationStatus } = useClmStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("open");
  const [kindFilter, setKindFilter] = useState<ObligationKind | "all">("all");
  const [ownerFilter, setOwnerFilter] = useState<"all" | "mine">("all");

  useEffect(() => {
    setScreen({ module: "Legal", page: "Obligations" });
    return () => setScreen(null);
  }, [setScreen]);

  const owners = useMemo(() => Array.from(new Set(obligations.map((o) => o.ownerName))).sort(), [obligations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return obligations.filter((o) => {
      if (statusFilter !== "all") {
        if (statusFilter === "open" && (o.status === "completed" || o.status === "waived")) return false;
        if (statusFilter === "due_soon" && o.status !== "due_soon") return false;
        if (statusFilter === "overdue" && o.status !== "overdue") return false;
        if (statusFilter === "completed" && o.status !== "completed") return false;
      }
      if (kindFilter !== "all" && o.kind !== kindFilter) return false;
      if (ownerFilter === "mine" && o.ownerName !== "Aanya Iyer") return false;
      if (!q) return true;
      return (
        o.description.toLowerCase().includes(q) ||
        o.ownerName.toLowerCase().includes(q) ||
        o.contractId.toLowerCase().includes(q)
      );
    });
  }, [obligations, query, statusFilter, kindFilter, ownerFilter]);

  const counts = useMemo(() => {
    return {
      total: obligations.length,
      open: obligations.filter((o) => o.status !== "completed" && o.status !== "waived").length,
      dueSoon: obligations.filter((o) => o.status === "due_soon").length,
      overdue: obligations.filter((o) => o.status === "overdue").length,
      completed: obligations.filter((o) => o.status === "completed").length,
    };
  }, [obligations]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/legal"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <ClipboardList className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Obligation tracker</h1>
            <p className="text-sm text-muted-foreground">
              Every commitment extracted from every signed contract. Owners, due dates, evidence.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Total" value={counts.total.toString()} />
        <Kpi label="Open" value={counts.open.toString()} />
        <Kpi label="Due soon" value={counts.dueSoon.toString()} tone="warning" />
        <Kpi label="Overdue" value={counts.overdue.toString()} tone="destructive" />
        <Kpi label="Completed" value={counts.completed.toString()} tone="success" />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search obligation, owner…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <FilterIcon className="size-3.5 text-muted-foreground" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
        >
          <option value="all">All status</option>
          <option value="open">Open (not done)</option>
          <option value="due_soon">Due soon</option>
          <option value="overdue">Overdue</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={kindFilter}
          onChange={(e) => setKindFilter(e.target.value as ObligationKind | "all")}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
        >
          <option value="all">All kinds</option>
          {(Object.keys(OBLIGATION_KIND_LABEL) as ObligationKind[]).map((k) => (
            <option key={k} value={k}>{OBLIGATION_KIND_LABEL[k]}</option>
          ))}
        </select>
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value as "all" | "mine")}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
        >
          <option value="all">All owners ({owners.length})</option>
          <option value="mine">Mine</option>
        </select>
      </div>

      <ul className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.map((o) => (
          <ObligationRow key={o.id} ob={o} onComplete={() => setObligationStatus(o.id, "completed", "Marked done manually")} />
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No obligations match.</li>
        )}
      </ul>
    </div>
  );
}

function ObligationRow({ ob, onComplete }: { ob: Obligation; onComplete: () => void }) {
  const contract = seedContractById(ob.contractId);
  const tint =
    ob.status === "completed"
      ? "bg-success/10 text-success"
      : ob.status === "overdue"
        ? "bg-destructive/10 text-destructive"
        : ob.status === "due_soon"
          ? "bg-warning/10 text-warning"
          : "bg-secondary text-muted-foreground";
  return (
    <li className="px-4 py-3 border-b border-border last:border-b-0">
      <div className="flex items-start gap-3 flex-wrap">
        {ob.status === "overdue" ? (
          <AlertTriangle className="size-4 text-destructive mt-0.5" />
        ) : ob.status === "completed" ? (
          <Check className="size-4 text-success mt-0.5" />
        ) : (
          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${tint}`}>
            {ob.status.replace("_", " ")}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{ob.description}</p>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-0.5 flex-wrap">
            <span>{OBLIGATION_KIND_LABEL[ob.kind]}</span>
            <span>·</span>
            <span>Owner: {ob.ownerName} ({ob.ownerTeam})</span>
            {ob.dueDateISO && (
              <>
                <span>·</span>
                <span>Due {ob.dueDateISO}</span>
              </>
            )}
            {ob.cadence && (
              <>
                <span>·</span>
                <span>Cadence: {ob.cadence.replace("_", " ")}</span>
              </>
            )}
            <span>·</span>
            <Link href={`/legal/contracts/${ob.contractId}`} className="text-brand hover:underline">
              {contract?.title ?? ob.contractId}
            </Link>
          </div>
          {ob.evidence && <p className="text-[11px] text-success mt-1">✓ {ob.evidence}</p>}
        </div>
        {ob.status !== "completed" && ob.status !== "waived" && (
          <button
            onClick={onComplete}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
          >
            <Check className="size-3" />
            Mark done
          </button>
        )}
        <ChevronRight className="size-3.5 text-muted-foreground/40 mt-1" />
      </div>
    </li>
  );
}

function Kpi({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "success" | "warning" | "destructive";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-lg font-bold tabular-nums mt-0.5 ${toneClass}`}>{value}</p>
    </div>
  );
}
