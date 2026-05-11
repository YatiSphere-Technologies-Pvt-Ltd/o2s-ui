"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  CalendarClock,
  ChevronDown,
  ChevronRight,
  Cpu,
  Download,
  Filter as FilterIcon,
  Lock,
  Search,
  Shield,
  User,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  type AuditAction,
  type AuditActorKind,
  type AuditEntity,
  type AuditEntry,
} from "@/components/leave/data";
import { hashChain } from "@/lib/audit-hash";

const ENTITY_LABEL: Record<AuditEntity, string> = {
  leave_request: "Leave request",
  team_request: "Team request",
  wellbeing_signal: "Wellbeing signal",
  anomaly: "Anomaly",
  compliance_item: "Compliance item",
  policy: "Policy",
  balance: "Balance",
  delegation: "Delegation",
  agent_config: "Agent config",
};

const ACTOR_META: Record<AuditActorKind, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  human:  { icon: User, color: "text-brand",            bg: "bg-brand/10",            label: "Human" },
  agent:  { icon: Bot,  color: "text-brand-purple",     bg: "bg-brand-purple/10",     label: "Agent" },
  system: { icon: Cpu,  color: "text-muted-foreground", bg: "bg-secondary",           label: "System" },
};

export default function AuditLogPage() {
  const { setScreen } = useScreen();
  const { auditLog } = useLeaveStore();

  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState<AuditEntity | "all">("all");
  const [actorKind, setActorKind] = useState<AuditActorKind | "all">("all");
  const [actorFilter, setActorFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [hashes, setHashes] = useState<Record<string, { rowHash: string; prevHash: string | null }>>({});

  useEffect(() => {
    setScreen({ module: "Leave", page: "Audit log" });
    return () => setScreen(null);
  }, [setScreen]);

  // Compute hash chain over the *full* log (chronological order) so verifying
  // a single row also verifies its position. We then map by id for lookup.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = [...auditLog]
        .sort((a, b) => (a.whenISO === b.whenISO ? a.seq - b.seq : a.whenISO < b.whenISO ? -1 : 1))
        .map((e) => ({
          id: e.id,
          whenISO: e.whenISO,
          body: JSON.stringify({
            seq: e.seq,
            actor: e.actor,
            entity: e.entity,
            entityId: e.entityId,
            action: e.action,
            before: e.before,
            after: e.after,
            reason: e.reason ?? "",
          }),
        }));
      const chain = await hashChain(rows);
      if (cancelled) return;
      const m: Record<string, { rowHash: string; prevHash: string | null }> = {};
      rows.forEach((r, i) => (m[r.id] = chain[i]));
      setHashes(m);
    })();
    return () => {
      cancelled = true;
    };
  }, [auditLog]);

  const actors = useMemo(() => {
    const map = new Map<string, AuditActorKind>();
    for (const e of auditLog) map.set(e.actor.name, e.actor.kind);
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [auditLog]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLog.filter((e) => {
      if (entity !== "all" && e.entity !== entity) return false;
      if (actorKind !== "all" && e.actor.kind !== actorKind) return false;
      if (actorFilter !== "all" && e.actor.name !== actorFilter) return false;
      if (actionFilter !== "all" && e.action !== actionFilter) return false;
      if (fromDate && e.whenISO.slice(0, 10) < fromDate) return false;
      if (toDate && e.whenISO.slice(0, 10) > toDate) return false;
      if (q) {
        const hay = `${e.summary} ${e.entityId} ${e.actor.name} ${e.action} ${e.reason ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [auditLog, entity, actorKind, actorFilter, actionFilter, fromDate, toDate, query]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/hr"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Audit log</h1>
            <p className="text-sm text-muted-foreground">
              Immutable record of every state change. Tamper-evident via SHA-256 chain.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Download className="size-3.5" />
          Export
        </button>
      </motion.div>

      {/* Tamper-evident banner */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-brand/5 border border-brand/30">
        <Shield className="size-4 text-brand shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed text-foreground">
          <span className="font-medium">Tamper-evident.</span>{" "}
          <span className="text-muted-foreground">
            Each row carries a SHA-256 hash of its contents plus the previous row&apos;s hash. Re-run the chain to verify nothing
            has been altered. {Object.keys(hashes).length > 0 && <>· Latest tip: <code className="text-foreground font-mono">{shortHash(Object.values(hashes)[Object.values(hashes).length - 1]?.rowHash ?? "")}</code></>}
          </span>
        </p>
      </div>

      {/* Search + filters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-44 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search summary, entity, actor, action…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <p className="text-xs text-muted-foreground tabular-nums ml-auto">
            {rows.length} of {auditLog.length} rows
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 items-end">
          <FilterSelect label="Entity" value={entity} onChange={(v) => setEntity(v as AuditEntity | "all")}
            options={[{ value: "all", label: "All entities" }, ...Object.entries(ENTITY_LABEL).map(([v, l]) => ({ value: v, label: l }))]} />
          <FilterSelect label="Actor kind" value={actorKind} onChange={(v) => setActorKind(v as AuditActorKind | "all")}
            options={[{ value: "all", label: "All kinds" }, { value: "human", label: "Human" }, { value: "agent", label: "Agent" }, { value: "system", label: "System" }]} />
          <FilterSelect label="Actor" value={actorFilter} onChange={setActorFilter}
            options={[{ value: "all", label: "All actors" }, ...actors.map(([name]) => ({ value: name, label: name }))]} />
          <FilterSelect label="Action" value={actionFilter} onChange={(v) => setActionFilter(v as AuditAction | "all")}
            options={[{ value: "all", label: "All actions" }, ...ACTIONS.map((a) => ({ value: a, label: a.replace(/_/g, " ") }))]} />
          <FilterDate label="From" value={fromDate} onChange={setFromDate} />
          <FilterDate label="To" value={toDate} onChange={setToDate} />
        </div>
      </div>

      {/* Rows */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-16">No audit entries match these filters.</p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((e) => (
              <AuditRow
                key={e.id}
                entry={e}
                expanded={expanded === e.id}
                onToggle={() => setExpanded((p) => (p === e.id ? null : e.id))}
                hash={hashes[e.id]}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const ACTIONS: AuditAction[] = [
  "created", "updated", "submitted", "approved", "rejected", "cancelled",
  "force_approved", "force_cancelled", "reassigned", "dismissed", "escalated",
  "marked_addressed", "marked_investigating", "ran_suggested",
  "balance_adjusted", "config_changed", "exported",
];

function AuditRow({
  entry,
  expanded,
  onToggle,
  hash,
}: {
  entry: AuditEntry;
  expanded: boolean;
  onToggle: () => void;
  hash?: { rowHash: string; prevHash: string | null };
}) {
  const actor = ACTOR_META[entry.actor.kind];
  const ActorIcon = actor.icon;
  return (
    <li className={`px-4 py-3 transition-colors ${expanded ? "bg-surface-overlay/40" : "hover:bg-surface-overlay/30"}`}>
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start gap-3">
          <div className={`size-7 shrink-0 rounded-md flex items-center justify-center ${actor.bg}`}>
            <ActorIcon className={`size-3.5 ${actor.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className={`text-[10px] uppercase tracking-wider ${actor.color}`}>{actor.label}</span>
                <span className="text-xs font-medium text-foreground">{entry.actor.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">· {entry.action.replace(/_/g, " ")}</span>
                <span className="text-[10px] text-muted-foreground">· {ENTITY_LABEL[entry.entity]}</span>
                <code className="text-[10px] font-mono text-muted-foreground/80">{entry.entityId}</code>
              </div>
              <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                <CalendarClock className="size-2.5 inline-block align-baseline mr-0.5" />
                {entry.whenLabel}
              </span>
            </div>
            <p className="text-xs text-foreground leading-snug mt-1">{entry.summary}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {hash && (
                <code
                  title={`SHA-256 ${hash.rowHash}\nPrev ${hash.prevHash ?? "(genesis)"}`}
                  className="text-[10px] font-mono text-muted-foreground/80 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary/50"
                >
                  <Lock className="size-2.5" />
                  {shortHash(hash.rowHash)}
                </code>
              )}
              <span className="text-[10px] text-muted-foreground/40">
                {expanded ? <ChevronDown className="size-3 inline" /> : <ChevronRight className="size-3 inline" />} details
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
          {entry.before && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Before</p>
              <pre className="text-[10px] font-mono text-muted-foreground p-2 rounded bg-destructive/5 border border-destructive/20 overflow-x-auto">
                {JSON.stringify(entry.before, null, 2)}
              </pre>
            </div>
          )}
          {entry.after && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">After</p>
              <pre className="text-[10px] font-mono text-foreground p-2 rounded bg-success/5 border border-success/20 overflow-x-auto">
                {JSON.stringify(entry.after, null, 2)}
              </pre>
            </div>
          )}
          {entry.reason && (
            <div className="md:col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Reason</p>
              <p className="text-[11px] text-foreground italic">&ldquo;{entry.reason}&rdquo;</p>
            </div>
          )}
          {hash && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] font-mono">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Row hash (SHA-256)</p>
                <p className="break-all text-foreground/80">{hash.rowHash}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Previous hash</p>
                <p className="break-all text-muted-foreground/80">{hash.prevHash ?? "(genesis)"}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5 flex items-center gap-1">
        <FilterIcon className="size-2.5" />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
      <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </div>
  );
}

function shortHash(h: string): string {
  return h ? h.slice(0, 8) : "—";
}
