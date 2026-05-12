"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  FileSignature,
  FileText,
  Filter as FilterIcon,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import {
  CONTRACT_TYPE_LABEL,
  RISK_TINT,
  STATUS_LABEL,
  STATUS_TINT,
  counterpartyById,
  daysBetween,
  formatINR,
  type ContractStatus,
  type ContractType,
} from "@/components/legal/clm/data";

type StatusFilter = "all" | "in_flight" | "active" | "expiring" | "expired";
type SortKey = "lastActivity" | "value" | "expiry" | "alpha";

const STATUS_GROUPS: Record<Exclude<StatusFilter, "all">, ContractStatus[]> = {
  in_flight: [
    "intake",
    "drafting",
    "internal_review",
    "out_to_counterparty",
    "negotiation",
    "approval",
    "out_for_signature",
  ],
  active:    ["active"],
  expiring:  ["expiring_soon"],
  expired:   ["expired", "terminated", "superseded"],
};

const TYPES: { value: ContractType | "all"; label: string }[] = [
  { value: "all",                label: "All types" },
  { value: "msa",                label: "MSA" },
  { value: "sow",                label: "SOW" },
  { value: "nda_mutual",         label: "NDA (mutual)" },
  { value: "nda_one_way",        label: "NDA (one-way)" },
  { value: "dpa",                label: "DPA" },
  { value: "saas_subscription",  label: "SaaS" },
  { value: "vendor_services",    label: "Vendor services" },
  { value: "employment",         label: "Employment" },
  { value: "contractor",         label: "Contractor" },
  { value: "ip_licence",         label: "IP licence" },
  { value: "partner",            label: "Partner" },
];

export default function ContractsRepositoryPage() {
  const { setScreen } = useScreen();
  const { contracts, stats } = useClmStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ContractType | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("lastActivity");
  const [semantic, setSemantic] = useState(false);

  useEffect(() => {
    setScreen({ module: "Legal", page: "Contracts repository" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = contracts.filter((c) => {
      if (statusFilter !== "all" && !STATUS_GROUPS[statusFilter].includes(c.status)) return false;
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (!q) return true;
      // "Semantic" search is a fiction here — it just adds clause / deviation hits.
      const cpName = counterpartyById(c.counterpartyId)?.name.toLowerCase() ?? "";
      const baseHit =
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        cpName.includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      if (baseHit) return true;
      if (!semantic) return false;
      return c.deviations.some(
        (d) =>
          d.topic.toLowerCase().includes(q) ||
          d.cpLanguage.toLowerCase().includes(q) ||
          d.rationale.toLowerCase().includes(q),
      );
    });
    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "lastActivity": return b.lastActivityAt.localeCompare(a.lastActivityAt);
        case "value":         return b.valueINR - a.valueINR;
        case "expiry":        {
          const av = a.expiryDate ?? "9999-12-31";
          const bv = b.expiryDate ?? "9999-12-31";
          return av.localeCompare(bv);
        }
        case "alpha":         return a.title.localeCompare(b.title);
      }
    });
    return list;
  }, [contracts, query, statusFilter, typeFilter, sortKey, semantic]);

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
            href="/legal"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <FileText className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Contracts</h1>
              <p className="text-sm text-muted-foreground">
                Single source of truth across NDAs, MSAs, SOWs, DPAs, vendor &amp; SaaS agreements.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/legal/contracts/review"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Sparkles className="size-3.5" />
            Review counterparty paper
          </Link>
          <Link
            href="/legal/contracts/authoring"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            <Plus className="size-3.5" />
            New contract
          </Link>
        </div>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <Kpi label="Total" value={stats.total.toString()} hint="in repository" />
        <Kpi label="Active" value={stats.active.toString()} hint="signed &amp; in force" tone="success" />
        <Kpi label="In flight" value={stats.inFlight.toString()} hint="draft → signature" tone="warning" />
        <Kpi label="Out for sig" value={stats.outForSig.toString()} hint="awaiting countersign" />
        <Kpi label="Red flags" value={stats.redOpen.toString()} hint="open deviations" tone={stats.redOpen > 0 ? "destructive" : "muted"} />
        <Kpi label="Renewals ≤ 90d" value={stats.renewalsOpenWithin90.toString()} hint="awaiting decision" tone={stats.renewalsOpenWithin90 > 0 ? "warning" : "muted"} />
      </div>

      {/* Quick-jump tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <QuickJump href="/legal/contracts/templates" icon={FileText}      label="Templates" />
        <QuickJump href="/legal/contracts/playbooks" icon={Sparkles}      label="Playbook" />
        <QuickJump href="/legal/contracts/clauses"   icon={FileText}      label="Clause library" />
        <QuickJump href="/legal/contracts/negotiation" icon={RefreshCw}   label="Negotiation" />
        <QuickJump href="/legal/contracts/signatures"  icon={FileSignature} label="Signatures" />
        <QuickJump href="/legal/obligations"         icon={Receipt}       label="Obligations" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search id, title, counterparty, tags…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <button
          onClick={() => setSemantic((s) => !s)}
          className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs transition-colors ${
            semantic
              ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/40"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
          title="Also search inside clause language and deviations"
        >
          <Sparkles className="size-3.5" />
          Semantic
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All status</option>
            <option value="in_flight">In flight</option>
            <option value="active">Active</option>
            <option value="expiring">Expiring soon</option>
            <option value="expired">Closed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as ContractType | "all")}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="lastActivity">Sort: Last activity</option>
            <option value="value">Sort: Value</option>
            <option value="expiry">Sort: Expiry</option>
            <option value="alpha">Sort: A–Z</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2 bg-surface-overlay/40 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
          <div className="col-span-5">Contract</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Risk</div>
          <div className="col-span-2 text-right">Value</div>
          <div className="col-span-2 text-right">Expiry</div>
        </div>
        <ul>
          {filtered.map((c) => {
            const cp = counterpartyById(c.counterpartyId);
            const expiryDays = c.expiryDate ? daysBetween("2026-05-12", c.expiryDate) : null;
            const expiryClass =
              expiryDays === null
                ? "text-muted-foreground/60"
                : expiryDays < 0
                  ? "text-destructive"
                  : expiryDays <= 60
                    ? "text-warning"
                    : "text-muted-foreground";
            const openRed = c.deviations.filter((d) => d.severity === "red" && d.status === "open").length;
            return (
              <li key={c.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/legal/contracts/${c.id}`}
                  className="group grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-3 hover:bg-surface-overlay/40 transition-colors"
                >
                  <div className="md:col-span-5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                      <code className="text-[10px] font-mono text-muted-foreground/60">{c.id}</code>
                      {openRed > 0 && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
                          <AlertTriangle className="size-2.5" />
                          {openRed} red
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 mt-0.5 flex-wrap">
                      <span>{CONTRACT_TYPE_LABEL[c.type]}</span>
                      <span>·</span>
                      <span>{cp?.name ?? "—"}</span>
                      <span>·</span>
                      <span>{c.ourEntity}</span>
                      <span>·</span>
                      <span>{c.governingLaw}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2 self-center">
                    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${STATUS_TINT[c.status]}`}>
                      {STATUS_LABEL[c.status]}
                    </span>
                  </div>
                  <div className="md:col-span-1 self-center">
                    <span className={`inline-flex items-center text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${RISK_TINT[c.risk]}`}>
                      {c.risk}
                    </span>
                  </div>
                  <div className="md:col-span-2 self-center md:text-right text-[12px] font-mono text-foreground">
                    {formatINR(c.valueINR)}
                  </div>
                  <div className="md:col-span-2 self-center md:text-right text-[11px] flex md:justify-end items-center gap-1">
                    {c.expiryDate ? (
                      <span className={expiryClass}>
                        {c.expiryDate}
                        {expiryDays !== null && (
                          <span className="text-muted-foreground/50 ml-1">
                            ({expiryDays >= 0 ? `${expiryDays}d` : `${Math.abs(expiryDays)}d ago`})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/60">—</span>
                    )}
                    <ChevronRight className="size-3.5 text-muted-foreground/40 group-hover:text-foreground transition-colors hidden md:inline" />
                  </div>
                </Link>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">
              No contracts match these filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  tone = "muted",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "muted" | "success" | "warning" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : tone === "destructive"
          ? "text-destructive"
          : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
      <p className={`text-lg font-bold tabular-nums mt-0.5 ${toneClass}`}>{value}</p>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</p>}
    </div>
  );
}

function QuickJump({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border hover:border-border/80 hover:bg-surface-overlay/40 transition-colors"
    >
      <Icon className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      <span className="text-xs text-foreground">{label}</span>
      <ChevronRight className="size-3 text-muted-foreground/30 ml-auto" />
    </Link>
  );
}
