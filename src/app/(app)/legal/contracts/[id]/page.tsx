"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileSignature,
  FileText,
  Gavel,
  History,
  MapPin,
  MessageSquare,
  Plus,
  Scale,
  Sparkles,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import {
  CLAUSE_LABEL,
  CLAUSE_TINT,
  CONTRACT_TYPE_LABEL,
  OBLIGATION_KIND_LABEL,
  RISK_TINT,
  STATUS_LABEL,
  STATUS_TINT,
  counterpartyById,
  formatINR,
  obligationsForContract,
  playbookByTopic,
  renewalForContract,
  templateById,
} from "@/components/legal/clm/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

type Tab = "overview" | "clauses" | "rounds" | "obligations" | "approvals" | "signature" | "audit";

const TABS: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "overview",    label: "Overview",    icon: FileText },
  { key: "clauses",     label: "Clauses",     icon: Scale },
  { key: "rounds",      label: "Rounds",      icon: MessageSquare },
  { key: "obligations", label: "Obligations", icon: ClipboardList },
  { key: "approvals",   label: "Approvals",   icon: CheckCircle2 },
  { key: "signature",   label: "Signature",   icon: FileSignature },
  { key: "audit",       label: "Audit",       icon: History },
];

export default function ContractDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const {
    contractById,
    obligations,
    renewals,
    setContractStatus,
    addRound,
    resolveDeviation,
    decideApproval,
    markSigned,
    audit,
  } = useClmStore();

  const contract = contractById(id);
  const cp = contract ? counterpartyById(contract.counterpartyId) : undefined;
  const tpl = contract?.templateId ? templateById(contract.templateId) : undefined;
  const renewal = contract ? renewalForContract(contract.id) : undefined;

  const contractObligations = useMemo(() => {
    if (!contract) return [];
    const seeded = obligationsForContract(contract.id).map((o) => o.id);
    return obligations.filter((o) => seeded.includes(o.id));
  }, [contract, obligations]);

  const [tab, setTab] = useState<Tab>("overview");
  const contractTitle = contract?.title;
  const contractId = contract?.id;

  useEffect(() => {
    if (!contractTitle || !contractId) return;
    setScreen({ module: "Legal", page: "Contract", recordId: contractId, recordLabel: contractTitle });
    return () => setScreen(null);
  }, [contractTitle, contractId, setScreen]);

  if (!contract) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Contract not found</h1>
        <Link href="/legal/contracts" className="text-brand underline mt-3 inline-block">
          Back to repository
        </Link>
      </div>
    );
  }

  const contractAudit = audit.filter((a) => a.contractId === contract.id);
  const openRed = contract.deviations.filter((d) => d.severity === "red" && d.status === "open").length;

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
            href="/legal/contracts"
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
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground tracking-tight">{contract.title}</h1>
                <code className="text-[10px] font-mono text-muted-foreground/60">{contract.id}</code>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${STATUS_TINT[contract.status]}`}>
                  {STATUS_LABEL[contract.status]}
                </span>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${RISK_TINT[contract.risk]}`}>
                  {contract.risk}
                </span>
                {openRed > 0 && (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-destructive/10 text-destructive inline-flex items-center gap-1">
                    <AlertTriangle className="size-2.5" />
                    {openRed} red open
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-3xl">{contract.summary}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1"><Building2 className="size-3" /> {cp?.name}</span>
                <span>·</span>
                <span>{CONTRACT_TYPE_LABEL[contract.type]}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {contract.governingLaw}</span>
                <span>·</span>
                <span>Owner: {contract.owner.name}</span>
                {contract.parentContractId && (
                  <>
                    <span>·</span>
                    <Link href={`/legal/contracts/${contract.parentContractId}`} className="text-brand hover:underline">
                      Parent: {contract.parentContractId}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/legal/contracts/negotiation?contract=${contract.id}`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <MessageSquare className="size-3.5" />
            Negotiation
          </Link>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
              tab === key
                ? "text-destructive border-destructive font-medium"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <Icon className="size-3.5" />
            {label}
            {key === "clauses" && contract.deviations.length > 0 && (
              <span className="text-[10px] bg-secondary text-muted-foreground rounded px-1">{contract.deviations.length}</span>
            )}
            {key === "rounds" && contract.rounds.length > 0 && (
              <span className="text-[10px] bg-secondary text-muted-foreground rounded px-1">{contract.rounds.length}</span>
            )}
            {key === "obligations" && contractObligations.length > 0 && (
              <span className="text-[10px] bg-secondary text-muted-foreground rounded px-1">{contractObligations.length}</span>
            )}
            {key === "approvals" && contract.approvalChain.some((a) => a.status === "pending") && (
              <span className="text-[10px] bg-warning/15 text-warning rounded px-1">pending</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "overview" && (
        <OverviewTab
          contract={contract}
          cp={cp}
          template={tpl}
          renewal={renewal}
          obligationsCount={contractObligations.length}
          onAdvanceStatus={(s) => setContractStatus(contract.id, s)}
        />
      )}
      {tab === "clauses" && (
        <ClausesTab
          deviations={contract.deviations}
          onResolve={(topic, resolution) => resolveDeviation(contract.id, topic, resolution)}
        />
      )}
      {tab === "rounds" && (
        <RoundsTab
          contractId={contract.id}
          rounds={contract.rounds}
          onAdd={(round) => addRound(contract.id, round)}
        />
      )}
      {tab === "obligations" && <ObligationsTab obligations={contractObligations} />}
      {tab === "approvals" && (
        <ApprovalsTab
          chain={contract.approvalChain}
          onDecide={(stepId, decision, comment) => decideApproval(contract.id, stepId, decision, comment)}
        />
      )}
      {tab === "signature" && (
        <SignatureTab
          contract={contract}
          onMarkSigned={(key) => markSigned(contract.id, key, new Date().toISOString())}
        />
      )}
      {tab === "audit" && <AuditTab audit={contractAudit} />}
    </div>
  );
}

/* ─────────── Overview ─────────── */

function OverviewTab({
  contract,
  cp,
  template,
  renewal,
  obligationsCount,
  onAdvanceStatus,
}: {
  contract: ReturnType<typeof useClmStore>["contracts"][number];
  cp?: ReturnType<typeof counterpartyById>;
  template?: ReturnType<typeof templateById>;
  renewal?: ReturnType<typeof renewalForContract>;
  obligationsCount: number;
  onAdvanceStatus: (s: typeof contract.status) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Section icon={Users} title="Parties">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <PartyCard
              role="Us"
              entity={contract.ourEntity}
              person={contract.owner.name}
              personRole={`Legal owner · ${contract.owner.team}`}
              second={contract.businessOwner}
              secondRole="Business owner"
            />
            <PartyCard
              role="Counterparty"
              entity={cp?.name ?? "—"}
              person={contract.counterpartyOwner}
              personRole={`${cp?.country ?? ""} · ${cp?.industry ?? ""}`}
              second={cp?.riskTier ? `Tier: ${cp.riskTier.replace("tier_", "").toUpperCase()}` : undefined}
              secondRole="Counterparty profile"
            />
          </div>
        </Section>

        <Section icon={Scale} title="Terms">
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
            <Term label="Type" value={CONTRACT_TYPE_LABEL[contract.type]} />
            <Term label="Governing law" value={contract.governingLaw} />
            <Term label="Jurisdiction" value={contract.jurisdiction} />
            <Term label="Currency" value={contract.currency} />
            <Term label="Value" value={formatINR(contract.valueINR)} />
            <Term label="Effective" value={contract.effectiveDate ?? "—"} />
            <Term label="Expires" value={contract.expiryDate ?? "—"} />
            <Term label="Term" value={contract.termMonths ? `${contract.termMonths} months` : "—"} />
            <Term label="Auto-renew" value={contract.autoRenew ? `Yes (${contract.renewalNoticeDays}d opt-out)` : "No"} />
            <Term label="Template" value={template?.name ?? "—"} />
            <Term label="Created" value={contract.createdAt} />
            <Term label="Last activity" value={contract.lastActivityAt} />
          </dl>
        </Section>

        {contract.amendments.length > 0 && (
          <Section icon={FileText} title="Amendments">
            <ul>
              {contract.amendments.map((a) => (
                <li key={a.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-center gap-3 text-[12px]">
                  <code className="font-mono text-muted-foreground/60">{a.id}</code>
                  <span className="text-muted-foreground">{a.effectiveDate}</span>
                  <span className="flex-1 text-foreground">{a.summary}</span>
                  {a.cumulativeValueChangeINR !== undefined && (
                    <span className="font-mono text-success">{a.cumulativeValueChangeINR >= 0 ? "+" : "−"}{formatINR(Math.abs(a.cumulativeValueChangeINR))}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {cp && cp.historicalPositions.length > 0 && (
          <Section icon={History} title={`Counterparty history — ${cp.shortName}`}>
            <ul className="text-[12px]">
              {cp.historicalPositions.map((h, i) => (
                <li key={i} className="px-3 py-2 border-b border-border last:border-b-0">
                  <p className="text-muted-foreground/70 text-[10px] uppercase tracking-wider">{h.topic}</p>
                  <p className="text-foreground mt-0.5">They push for: <span className="font-medium">{h.theyPushFor}</span></p>
                  <p className={`mt-1 text-[11px] ${h.weAccepted ? "text-success" : "text-destructive"}`}>
                    {h.weAccepted ? "✓ Previously accepted" : "✗ Previously rejected"}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="space-y-4">
        <Section icon={Clock} title="Workflow">
          <div className="space-y-2">
            <StatusRow contract={contract} onAdvance={onAdvanceStatus} />
            <Link href="/legal/contracts/negotiation" className="text-[11px] text-brand hover:underline inline-flex items-center gap-1">
              Open negotiation tracker <ChevronRight className="size-3" />
            </Link>
          </div>
        </Section>

        <Section icon={Sparkles} title="Risk snapshot">
          <ul className="space-y-2 text-[12px]">
            <Item label="Risk tier" value={contract.risk} tint={RISK_TINT[contract.risk]} />
            <Item label="Deviations" value={`${contract.deviations.length} (${contract.deviations.filter((d) => d.severity === "red").length} red)`} />
            <Item label="Open deviations" value={contract.deviations.filter((d) => d.status === "open").length.toString()} />
            <Item label="Obligations" value={`${obligationsCount} extracted`} />
          </ul>
        </Section>

        {renewal && (
          <Section icon={Calendar} title="Renewal sentinel">
            <p className="text-[12px] text-foreground">
              Event {renewal.daysUntilEvent >= 0 ? "in" : ""} <span className="font-medium">{Math.abs(renewal.daysUntilEvent)} days</span>
              {renewal.daysUntilEvent < 0 ? " ago" : ""}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Notice opens {renewal.noticeWindowOpensISO} · {renewal.kind.replace("_", " ")}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mt-2">Recommendation</p>
            <p className="text-[12px] font-semibold text-foreground capitalize">{renewal.recommendation.replace("_", " ")}</p>
            <Link href="/legal/renewals" className="text-[11px] text-brand hover:underline mt-2 inline-flex items-center gap-1">
              Open renewals <ChevronRight className="size-3" />
            </Link>
          </Section>
        )}

        {contract.tags.length > 0 && (
          <Section icon={FileText} title="Tags">
            <div className="flex flex-wrap gap-1.5">
              {contract.tags.map((t) => (
                <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{t}</span>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function PartyCard({
  role,
  entity,
  person,
  personRole,
  second,
  secondRole,
}: {
  role: string;
  entity: string;
  person: string;
  personRole: string;
  second?: string;
  secondRole?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-overlay/30 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{role}</p>
      <p className="text-sm font-semibold text-foreground mt-1">{entity}</p>
      <p className="text-[12px] text-foreground mt-1.5">{person}</p>
      <p className="text-[11px] text-muted-foreground">{personRole}</p>
      {second && (
        <>
          <p className="text-[12px] text-foreground mt-2">{second}</p>
          <p className="text-[11px] text-muted-foreground">{secondRole}</p>
        </>
      )}
    </div>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</dt>
      <dd className="text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

function Item({ label, value, tint }: { label: string; value: string; tint?: string }) {
  return (
    <li className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={`tabular-nums ${tint ? `inline-flex items-center text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${tint}` : "text-foreground"}`}>
        {value}
      </span>
    </li>
  );
}

function StatusRow({
  contract,
  onAdvance,
}: {
  contract: ReturnType<typeof useClmStore>["contracts"][number];
  onAdvance: (s: typeof contract.status) => void;
}) {
  const FLOW: typeof contract.status[] = [
    "intake",
    "drafting",
    "internal_review",
    "out_to_counterparty",
    "negotiation",
    "approval",
    "out_for_signature",
    "active",
  ];
  const idx = FLOW.indexOf(contract.status);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-8 gap-0.5">
        {FLOW.map((s, i) => (
          <div
            key={s}
            title={STATUS_LABEL[s]}
            className={`h-1.5 rounded ${i <= idx ? "bg-destructive" : "bg-secondary"}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">Currently: <span className="text-foreground font-medium">{STATUS_LABEL[contract.status]}</span></p>
      {idx >= 0 && idx < FLOW.length - 1 && (
        <button
          onClick={() => onAdvance(FLOW[idx + 1])}
          className="text-[11px] text-brand hover:underline inline-flex items-center gap-1"
        >
          Advance to {STATUS_LABEL[FLOW[idx + 1]]} <ChevronRight className="size-3" />
        </button>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
        <Icon className="size-3.5 text-muted-foreground" />
        <p className="text-[11px] font-semibold text-foreground">{title}</p>
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}

/* ─────────── Clauses / Redline ─────────── */

function ClausesTab({
  deviations,
  onResolve,
}: {
  deviations: ReturnType<typeof useClmStore>["contracts"][number]["deviations"];
  onResolve: (topic: string, resolution: "accepted_with_caveat" | "reverted_to_playbook" | "escalated") => void;
}) {
  if (deviations.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <Scale className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">All clauses on playbook</p>
        <p className="text-[11px] text-muted-foreground mt-1">No deviations recorded for this contract.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {deviations.map((d) => {
        const pb = d.playbookId ? playbookByTopic(d.topic) : undefined;
        return (
          <article key={d.topic} className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${CLAUSE_TINT[d.severity]}`}>
                {CLAUSE_LABEL[d.severity]}
              </span>
              <p className="text-sm font-semibold text-foreground">{d.topic}</p>
              <span className="text-[11px] text-muted-foreground ml-auto capitalize">{d.status.replace(/_/g, " ")}</span>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
              <div className="p-3 border-r border-border">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Our playbook</p>
                <p className="text-[12px] text-foreground leading-snug">{d.ourLanguage}</p>
              </div>
              <div className="p-3 bg-surface-overlay/20">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Counterparty proposed</p>
                <p className="text-[12px] text-foreground leading-snug">{d.cpLanguage}</p>
              </div>
            </div>
            <div className="px-3 py-2.5 text-[11px] text-muted-foreground border-b border-border">
              <p>{d.rationale}</p>
              {d.suggestedRedline && (
                <p className="mt-1.5 text-foreground">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Suggested counter</span>
                  {d.suggestedRedline}
                </p>
              )}
              {pb && (
                <p className="mt-1.5">
                  <Link href="/legal/contracts/playbooks" className="text-brand hover:underline inline-flex items-center gap-1">
                    Playbook: {pb.ideal.summary} <ChevronRight className="size-3" />
                  </Link>
                </p>
              )}
            </div>
            {d.status === "open" && (
              <div className="px-3 py-2 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onResolve(d.topic, "reverted_to_playbook")}
                  className="text-[11px] h-7 px-2.5 rounded border border-border hover:bg-surface-overlay transition-colors inline-flex items-center gap-1"
                >
                  <Check className="size-3" />
                  Revert to playbook
                </button>
                <button
                  onClick={() => onResolve(d.topic, "accepted_with_caveat")}
                  className="text-[11px] h-7 px-2.5 rounded border border-warning/40 text-warning hover:bg-warning/10 transition-colors inline-flex items-center gap-1"
                >
                  Accept with caveat
                </button>
                <button
                  onClick={() => onResolve(d.topic, "escalated")}
                  className="text-[11px] h-7 px-2.5 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors inline-flex items-center gap-1"
                >
                  <AlertTriangle className="size-3" />
                  Escalate
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

/* ─────────── Negotiation rounds ─────────── */

function RoundsTab({
  contractId,
  rounds,
  onAdd,
}: {
  contractId: string;
  rounds: ReturnType<typeof useClmStore>["contracts"][number]["rounds"];
  onAdd: (round: Omit<ReturnType<typeof useClmStore>["contracts"][number]["rounds"][number], "id">) => void;
}) {
  void contractId;
  const [showForm, setShowForm] = useState(false);
  const [byParty, setByParty] = useState<"us" | "counterparty">("counterparty");
  const [byPerson, setByPerson] = useState("");
  const [changes, setChanges] = useState("");
  const [fileLabel, setFileLabel] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">
          {rounds.length} {rounds.length === 1 ? "round" : "rounds"} recorded. Newest on top.
        </p>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border text-xs text-foreground hover:bg-surface-overlay transition-colors"
        >
          <Plus className="size-3" />
          Log a round
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-3 space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <select
              value={byParty}
              onChange={(e) => setByParty(e.target.value as "us" | "counterparty")}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none"
            >
              <option value="counterparty">Counterparty</option>
              <option value="us">Us</option>
            </select>
            <input
              value={byPerson}
              onChange={(e) => setByPerson(e.target.value)}
              placeholder="Person name"
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            />
            <input
              value={fileLabel}
              onChange={(e) => setFileLabel(e.target.value)}
              placeholder="File label (e.g. MSA-v5-redline.docx)"
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground"
            />
          </div>
          <textarea
            value={changes}
            onChange={(e) => setChanges(e.target.value)}
            placeholder="One-line summary of changes…"
            className="w-full px-2.5 py-2 rounded-lg border border-input bg-card text-xs text-foreground min-h-16"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="h-8 px-3 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!byPerson || !changes}
              onClick={() => {
                onAdd({
                  round: rounds.length + 1,
                  whenISO: new Date().toISOString(),
                  byParty,
                  byPerson,
                  changes,
                  fileLabel: fileLabel || "—",
                  deviationsAdded: 0,
                  deviationsResolved: 0,
                });
                setShowForm(false);
                setByPerson("");
                setChanges("");
                setFileLabel("");
              }}
              className="h-8 px-3 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 disabled:opacity-40 transition-colors"
            >
              Log round
            </button>
          </div>
        </div>
      )}

      <ol className="space-y-2">
        {[...rounds].reverse().map((r) => (
          <li key={r.id} className="bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${r.byParty === "us" ? "bg-brand/10 text-brand" : "bg-brand-purple/10 text-brand-purple"}`}>
                Round {r.round} · {r.byParty === "us" ? "Us" : "Counterparty"}
              </span>
              <p className="text-sm font-medium text-foreground">{r.byPerson}</p>
              <span className="text-[11px] text-muted-foreground ml-auto tabular-nums">{r.whenISO.slice(0, 10)}</span>
            </div>
            <p className="text-[12px] text-foreground mt-1.5">{r.changes}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-1.5">
              <span className="inline-flex items-center gap-1">
                <Upload className="size-2.5" />
                {r.fileLabel}
              </span>
              {r.deviationsAdded > 0 && <span className="text-destructive">+{r.deviationsAdded} dev added</span>}
              {r.deviationsResolved > 0 && <span className="text-success">{r.deviationsResolved} dev resolved</span>}
            </div>
          </li>
        ))}
        {rounds.length === 0 && (
          <li className="text-center text-sm text-muted-foreground italic py-8">No rounds logged yet.</li>
        )}
      </ol>
    </div>
  );
}

/* ─────────── Obligations ─────────── */

function ObligationsTab({
  obligations,
}: {
  obligations: ReturnType<typeof useClmStore>["obligations"];
}) {
  if (obligations.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <ClipboardList className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">No obligations extracted yet</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          The Obligation Extractor agent runs on signature to populate this list.
        </p>
      </div>
    );
  }
  return (
    <ul className="bg-card border border-border rounded-xl overflow-hidden">
      {obligations.map((o) => (
        <li key={o.id} className="px-4 py-3 border-b border-border last:border-b-0">
          <div className="flex items-start gap-3 flex-wrap">
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
              o.status === "completed"
                ? "bg-success/10 text-success"
                : o.status === "overdue"
                  ? "bg-destructive/10 text-destructive"
                  : o.status === "due_soon"
                    ? "bg-warning/10 text-warning"
                    : "bg-secondary text-muted-foreground"
            }`}>
              {o.status.replace("_", " ")}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{o.description}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-0.5 flex-wrap">
                <span>{OBLIGATION_KIND_LABEL[o.kind]}</span>
                <span>·</span>
                <span>Owner: {o.ownerName} ({o.ownerTeam})</span>
                {o.dueDateISO && (
                  <>
                    <span>·</span>
                    <span>Due {o.dueDateISO}</span>
                  </>
                )}
                {o.cadence && (
                  <>
                    <span>·</span>
                    <span>Cadence: {o.cadence.replace("_", " ")}</span>
                  </>
                )}
                {o.extractedFromClause && (
                  <>
                    <span>·</span>
                    <span>From: {o.extractedFromClause}</span>
                  </>
                )}
              </div>
              {o.evidence && (
                <p className="text-[11px] text-success mt-1">✓ {o.evidence}</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ─────────── Approvals ─────────── */

function ApprovalsTab({
  chain,
  onDecide,
}: {
  chain: ReturnType<typeof useClmStore>["contracts"][number]["approvalChain"];
  onDecide: (stepId: string, decision: "approved" | "rejected", comment?: string) => void;
}) {
  return (
    <ol className="bg-card border border-border rounded-xl overflow-hidden">
      {chain.map((s) => (
        <li key={s.id} className="px-4 py-3 border-b border-border last:border-b-0">
          <div className="flex items-start gap-3 flex-wrap">
            <span className={`size-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${
              s.status === "approved"
                ? "bg-success/15 text-success"
                : s.status === "rejected"
                  ? "bg-destructive/15 text-destructive"
                  : s.status === "skipped"
                    ? "bg-muted-foreground/15 text-muted-foreground"
                    : "bg-warning/15 text-warning"
            }`}>
              {s.step}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{s.approverRole}</p>
              <p className="text-[11px] text-muted-foreground">
                {s.approverName ?? "Unassigned"}
                {s.whenISO && <span> · {s.whenISO.slice(0, 10)}</span>}
              </p>
              {s.comment && <p className="text-[11px] text-foreground mt-1">{s.comment}</p>}
            </div>
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
              s.status === "approved"
                ? "bg-success/10 text-success"
                : s.status === "rejected"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-warning/10 text-warning"
            }`}>
              {s.status}
            </span>
            {s.status === "pending" && (
              <div className="flex items-center gap-1 mt-1 md:mt-0">
                <button
                  onClick={() => onDecide(s.id, "approved")}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
                >
                  <Check className="size-3" />
                  Approve
                </button>
                <button
                  onClick={() => onDecide(s.id, "rejected", "Sent back for revision")}
                  className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
                >
                  <X className="size-3" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─────────── Signature ─────────── */

function SignatureTab({
  contract,
  onMarkSigned,
}: {
  contract: ReturnType<typeof useClmStore>["contracts"][number];
  onMarkSigned: (key: string) => void;
}) {
  if (contract.signatures.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <FileSignature className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">No signature workflow started</p>
        <p className="text-[11px] text-muted-foreground mt-1">
          Contract must clear all approvals before being sent for signature.
        </p>
      </div>
    );
  }
  const signed = contract.signatures.filter((s) => s.status === "signed").length;
  return (
    <div className="space-y-3">
      <div className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 flex-wrap">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Status</p>
        <p className="text-sm font-semibold text-foreground tabular-nums">{signed} / {contract.signatures.length} signed</p>
        <div className="flex-1 h-1.5 bg-secondary rounded overflow-hidden min-w-32 max-w-64">
          <div className="h-full bg-success transition-all" style={{ width: `${(signed / contract.signatures.length) * 100}%` }} />
        </div>
        <span className="text-[11px] text-muted-foreground">
          {signed === contract.signatures.length ? "Fully executed" : "In progress"}
        </span>
      </div>
      <ul className="bg-card border border-border rounded-xl overflow-hidden">
        {contract.signatures.map((s) => {
          const key = `${s.party}:${s.signerName}`;
          return (
            <li key={key} className="px-4 py-3 border-b border-border last:border-b-0 flex items-center gap-3 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${s.party === "us" ? "bg-brand/10 text-brand" : "bg-brand-purple/10 text-brand-purple"}`}>
                {s.party === "us" ? "Us" : "Counterparty"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.signerName}</p>
                <p className="text-[11px] text-muted-foreground">{s.signerTitle}</p>
              </div>
              {s.status === "signed" ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-success">
                  <Check className="size-3" />
                  Signed {s.signedAt?.slice(0, 10)}
                </span>
              ) : (
                <button
                  onClick={() => onMarkSigned(key)}
                  className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-card border border-border hover:bg-surface-overlay transition-colors"
                >
                  Mark signed
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ─────────── Audit ─────────── */

function AuditTab({ audit }: { audit: ReturnType<typeof useClmStore>["audit"] }) {
  if (audit.length === 0) {
    return (
      <div className="bg-card border border-dashed border-border rounded-xl p-8 text-center">
        <Gavel className="size-6 text-muted-foreground mx-auto" />
        <p className="text-sm text-foreground font-medium mt-2">No audit entries for this contract</p>
        <p className="text-[11px] text-muted-foreground mt-1">Every status change, approval, and signature shows up here.</p>
      </div>
    );
  }
  return (
    <ul className="bg-card border border-border rounded-xl overflow-hidden">
      {audit.map((a) => (
        <li key={a.id} className="px-4 py-2.5 border-b border-border last:border-b-0">
          <div className="flex items-center gap-2 flex-wrap text-[12px]">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-28 shrink-0">{a.whenLabel}</span>
            <code className="text-[10px] font-mono text-muted-foreground/60">{a.action}</code>
            <span className="text-foreground">{a.detail}</span>
            <span className="text-[10px] text-muted-foreground ml-auto">{a.actor}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

