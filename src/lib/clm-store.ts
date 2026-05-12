"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  CONTRACTS,
  OBLIGATIONS,
  RENEWAL_EVENTS,
  type ApprovalStep,
  type ClauseDeviation,
  type ContractRecord,
  type ContractStatus,
  type NegotiationRound,
  type Obligation,
  type RenewalEvent,
  type RenewalRecommendation,
  type SignatureRecord,
} from "@/components/legal/clm/data";

/* ────────────────────────────────────────────────────────────────
   Overlay shape — kept narrow on purpose.
   Seed data is the source of truth; overlay holds the user's edits.
   ──────────────────────────────────────────────────────────────── */

interface ContractPatch {
  status?: ContractStatus;
  /** Appended rounds. */
  addedRounds?: NegotiationRound[];
  /** Patches by deviation topic (one per topic). */
  deviationPatches?: Record<string, Partial<ClauseDeviation>>;
  /** Patches by approval step id. */
  approvalPatches?: Record<string, Partial<ApprovalStep>>;
  /** Signature patches keyed by `${party}:${signerName}`. */
  signaturePatches?: Record<string, Partial<SignatureRecord>>;
}

interface ObligationPatch {
  status?: Obligation["status"];
  ownerName?: string;
  evidence?: string;
}

interface RenewalPatch {
  decisionStatus?: RenewalEvent["decisionStatus"];
  decisionBy?: string;
  decisionWhenISO?: string;
  /** Allow user to override the recommendation. */
  recommendationOverride?: RenewalRecommendation;
}

export interface ClmAuditEntry {
  id: string;
  whenISO: string;
  whenLabel: string;
  actor: string;
  contractId?: string;
  action: string;
  detail: string;
}

interface ClmOverlay {
  contractPatches: Record<string, ContractPatch>;
  obligationPatches: Record<string, ObligationPatch>;
  renewalPatches: Record<string, RenewalPatch>;
  /** Counter-supplied "drop-in review" sessions (review workspace). */
  reviews: ReviewSession[];
  /** Intakes / draft assembly requests (authoring workspace). */
  intakes: IntakeRequest[];
  audit: ClmAuditEntry[];
}

export interface ReviewSession {
  id: string;
  whenISO: string;
  counterpartyName: string;
  contractType: string;
  /** What the user pasted in / "uploaded". */
  pasted: string;
  /** Synthetic clause findings the page generates. */
  findings: {
    topic: string;
    severity: "green" | "yellow" | "red";
    cpLanguage: string;
    ourLanguage: string;
    suggestion: string;
  }[];
  decisionsByTopic: Record<string, "accept" | "redline" | "escalate" | undefined>;
}

export interface IntakeRequest {
  id: string;
  whenISO: string;
  templateId: string;
  counterpartyName: string;
  purpose: string;
  answers: Record<string, string>;
  status: "queued" | "drafted" | "sent_to_legal";
  requestedBy: string;
}

const DEFAULT_OVERLAY: ClmOverlay = {
  contractPatches: {},
  obligationPatches: {},
  renewalPatches: {},
  reviews: [],
  intakes: [],
  audit: [],
};

function normalize(raw: Partial<ClmOverlay> | undefined | null): ClmOverlay {
  const r = raw ?? {};
  return {
    contractPatches:   r.contractPatches   ?? {},
    obligationPatches: r.obligationPatches ?? {},
    renewalPatches:    r.renewalPatches    ?? {},
    reviews:           r.reviews           ?? [],
    intakes:           r.intakes           ?? [],
    audit:             r.audit             ?? [],
  };
}

const STORAGE_KEY = "o2s.clm";

function logAudit(entry: Omit<ClmAuditEntry, "id" | "whenISO" | "whenLabel" | "actor">): ClmAuditEntry {
  const now = new Date();
  return {
    id: `ca-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    whenISO: now.toISOString(),
    whenLabel:
      now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
      ", " +
      now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    actor: "Aanya Iyer",
    ...entry,
  };
}

/* ────────────────────────── Hook ────────────────────────── */

export function useClmStore() {
  const [rawOverlay, setRawOverlay] = useLocalStorage<ClmOverlay>(STORAGE_KEY, DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(rawOverlay), [rawOverlay]);

  const setOverlay = useCallback(
    (v: ClmOverlay | ((prev: ClmOverlay) => ClmOverlay)) => {
      if (typeof v === "function") {
        setRawOverlay((prev) => (v as (p: ClmOverlay) => ClmOverlay)(normalize(prev)));
      } else {
        setRawOverlay(v);
      }
    },
    [setRawOverlay],
  );

  /* ──── Contracts ──── */

  const contracts = useMemo<ContractRecord[]>(() => {
    return CONTRACTS.map((c) => {
      const p = overlay.contractPatches[c.id];
      if (!p) return c;
      const rounds = p.addedRounds ? [...c.rounds, ...p.addedRounds] : c.rounds;
      const deviations = p.deviationPatches
        ? c.deviations.map((d) => {
            const patch = p.deviationPatches![d.topic];
            return patch ? { ...d, ...patch } : d;
          })
        : c.deviations;
      const approvalChain = p.approvalPatches
        ? c.approvalChain.map((s) => {
            const patch = p.approvalPatches![s.id];
            return patch ? { ...s, ...patch } : s;
          })
        : c.approvalChain;
      const signatures = p.signaturePatches
        ? c.signatures.map((s) => {
            const key = `${s.party}:${s.signerName}`;
            const patch = p.signaturePatches![key];
            return patch ? { ...s, ...patch } : s;
          })
        : c.signatures;
      return {
        ...c,
        status: p.status ?? c.status,
        rounds,
        deviations,
        approvalChain,
        signatures,
      };
    });
  }, [overlay.contractPatches]);

  const contractById = useCallback(
    (id: string) => contracts.find((c) => c.id === id),
    [contracts],
  );

  const setContractStatus = useCallback(
    (id: string, status: ContractStatus) => {
      setOverlay((prev) => ({
        ...prev,
        contractPatches: {
          ...prev.contractPatches,
          [id]: { ...prev.contractPatches[id], status },
        },
        audit: [logAudit({ contractId: id, action: "status_changed", detail: `Status → ${status}` }), ...prev.audit],
      }));
    },
    [setOverlay],
  );

  const addRound = useCallback(
    (id: string, round: Omit<NegotiationRound, "id">) => {
      setOverlay((prev) => {
        const base = prev.contractPatches[id] ?? {};
        const existing = base.addedRounds ?? [];
        const seedCount = (CONTRACTS.find((c) => c.id === id)?.rounds.length ?? 0);
        const newRound: NegotiationRound = {
          ...round,
          id: `NR-${Date.now()}`,
          round: seedCount + existing.length + 1,
        };
        return {
          ...prev,
          contractPatches: {
            ...prev.contractPatches,
            [id]: { ...base, addedRounds: [...existing, newRound] },
          },
          audit: [logAudit({ contractId: id, action: "round_added", detail: `Round ${newRound.round} — ${round.changes}` }), ...prev.audit],
        };
      });
    },
    [setOverlay],
  );

  const resolveDeviation = useCallback(
    (
      contractId: string,
      topic: string,
      resolution: "accepted_with_caveat" | "reverted_to_playbook" | "escalated",
    ) => {
      setOverlay((prev) => {
        const base = prev.contractPatches[contractId] ?? {};
        const dp = base.deviationPatches ?? {};
        return {
          ...prev,
          contractPatches: {
            ...prev.contractPatches,
            [contractId]: {
              ...base,
              deviationPatches: { ...dp, [topic]: { status: resolution } },
            },
          },
          audit: [logAudit({ contractId, action: "deviation_resolved", detail: `${topic}: ${resolution}` }), ...prev.audit],
        };
      });
    },
    [setOverlay],
  );

  const decideApproval = useCallback(
    (
      contractId: string,
      stepId: string,
      decision: "approved" | "rejected",
      comment?: string,
    ) => {
      setOverlay((prev) => {
        const base = prev.contractPatches[contractId] ?? {};
        const ap = base.approvalPatches ?? {};
        return {
          ...prev,
          contractPatches: {
            ...prev.contractPatches,
            [contractId]: {
              ...base,
              approvalPatches: {
                ...ap,
                [stepId]: {
                  status: decision,
                  whenISO: new Date().toISOString(),
                  comment,
                },
              },
            },
          },
          audit: [
            logAudit({
              contractId,
              action: decision === "approved" ? "approval_granted" : "approval_rejected",
              detail: `${stepId}${comment ? ` — ${comment}` : ""}`,
            }),
            ...prev.audit,
          ],
        };
      });
    },
    [setOverlay],
  );

  const markSigned = useCallback(
    (contractId: string, key: string, signedAt: string) => {
      setOverlay((prev) => {
        const base = prev.contractPatches[contractId] ?? {};
        const sp = base.signaturePatches ?? {};
        return {
          ...prev,
          contractPatches: {
            ...prev.contractPatches,
            [contractId]: {
              ...base,
              signaturePatches: { ...sp, [key]: { status: "signed", signedAt } },
            },
          },
          audit: [logAudit({ contractId, action: "signed", detail: key }), ...prev.audit],
        };
      });
    },
    [setOverlay],
  );

  /* ──── Obligations ──── */

  const obligations = useMemo<Obligation[]>(() => {
    return OBLIGATIONS.map((o) => {
      const p = overlay.obligationPatches[o.id];
      if (!p) return o;
      return { ...o, ...p };
    });
  }, [overlay.obligationPatches]);

  const setObligationStatus = useCallback(
    (id: string, status: Obligation["status"], evidence?: string) => {
      setOverlay((prev) => ({
        ...prev,
        obligationPatches: {
          ...prev.obligationPatches,
          [id]: { ...prev.obligationPatches[id], status, evidence },
        },
        audit: [logAudit({ action: "obligation_updated", detail: `${id} → ${status}` }), ...prev.audit],
      }));
    },
    [setOverlay],
  );

  const reassignObligation = useCallback(
    (id: string, ownerName: string) => {
      setOverlay((prev) => ({
        ...prev,
        obligationPatches: {
          ...prev.obligationPatches,
          [id]: { ...prev.obligationPatches[id], ownerName },
        },
        audit: [logAudit({ action: "obligation_reassigned", detail: `${id} → ${ownerName}` }), ...prev.audit],
      }));
    },
    [setOverlay],
  );

  /* ──── Renewals ──── */

  const renewals = useMemo<RenewalEvent[]>(() => {
    return RENEWAL_EVENTS.map((r) => {
      const p = overlay.renewalPatches[r.id];
      if (!p) return r;
      return {
        ...r,
        decisionStatus: p.decisionStatus ?? r.decisionStatus,
        decisionBy:     p.decisionBy     ?? r.decisionBy,
        decisionWhenISO: p.decisionWhenISO ?? r.decisionWhenISO,
        recommendation: p.recommendationOverride ?? r.recommendation,
      };
    });
  }, [overlay.renewalPatches]);

  const decideRenewal = useCallback(
    (id: string, decision: "renew" | "renegotiate" | "terminate") => {
      setOverlay((prev) => ({
        ...prev,
        renewalPatches: {
          ...prev.renewalPatches,
          [id]: {
            ...prev.renewalPatches[id],
            decisionStatus:
              decision === "renew"
                ? "decided_renew"
                : decision === "renegotiate"
                  ? "decided_renegotiate"
                  : "decided_terminate",
            decisionBy: "Aanya Iyer",
            decisionWhenISO: new Date().toISOString(),
          },
        },
        audit: [logAudit({ action: "renewal_decided", detail: `${id} → ${decision}` }), ...prev.audit],
      }));
    },
    [setOverlay],
  );

  /* ──── Reviews (drop-in third-party) ──── */

  const reviews = overlay.reviews;

  const addReview = useCallback(
    (session: Omit<ReviewSession, "id" | "whenISO" | "decisionsByTopic">) => {
      setOverlay((prev) => {
        const r: ReviewSession = {
          ...session,
          id: `RV-${Date.now()}`,
          whenISO: new Date().toISOString(),
          decisionsByTopic: {},
        };
        return {
          ...prev,
          reviews: [r, ...prev.reviews],
          audit: [logAudit({ action: "review_created", detail: `${session.counterpartyName} ${session.contractType}` }), ...prev.audit],
        };
      });
    },
    [setOverlay],
  );

  const setReviewDecision = useCallback(
    (
      reviewId: string,
      topic: string,
      decision: "accept" | "redline" | "escalate",
    ) => {
      setOverlay((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r.id === reviewId
            ? { ...r, decisionsByTopic: { ...r.decisionsByTopic, [topic]: decision } }
            : r,
        ),
      }));
    },
    [setOverlay],
  );

  /* ──── Intakes (self-serve assembly) ──── */

  const intakes = overlay.intakes;

  const addIntake = useCallback(
    (intake: Omit<IntakeRequest, "id" | "whenISO" | "status">) => {
      setOverlay((prev) => {
        const r: IntakeRequest = {
          ...intake,
          id: `IN-${Date.now()}`,
          whenISO: new Date().toISOString(),
          status: "queued",
        };
        return {
          ...prev,
          intakes: [r, ...prev.intakes],
          audit: [logAudit({ action: "intake_created", detail: `${intake.counterpartyName} — ${intake.purpose}` }), ...prev.audit],
        };
      });
    },
    [setOverlay],
  );

  const advanceIntake = useCallback(
    (id: string, status: IntakeRequest["status"]) => {
      setOverlay((prev) => ({
        ...prev,
        intakes: prev.intakes.map((i) => (i.id === id ? { ...i, status } : i)),
        audit: [logAudit({ action: "intake_advanced", detail: `${id} → ${status}` }), ...prev.audit],
      }));
    },
    [setOverlay],
  );

  /* ──── Stats ──── */

  const stats = useMemo(() => {
    const active = contracts.filter((c) => c.status === "active").length;
    const inFlight = contracts.filter((c) =>
      ["drafting", "internal_review", "out_to_counterparty", "negotiation", "approval", "out_for_signature", "intake"].includes(c.status),
    ).length;
    const outForSig = contracts.filter((c) => c.status === "out_for_signature").length;
    const redOpen = contracts.reduce(
      (sum, c) => sum + c.deviations.filter((d) => d.severity === "red" && d.status === "open").length,
      0,
    );
    const obOpen = obligations.filter((o) => o.status === "due_soon" || o.status === "overdue").length;
    const renewalsOpenWithin90 = renewals.filter(
      (r) => r.decisionStatus === "open" && r.daysUntilEvent <= 90,
    ).length;
    return {
      total: contracts.length,
      active,
      inFlight,
      outForSig,
      redOpen,
      obOpen,
      renewalsOpenWithin90,
    };
  }, [contracts, obligations, renewals]);

  return {
    contracts,
    contractById,
    setContractStatus,
    addRound,
    resolveDeviation,
    decideApproval,
    markSigned,
    obligations,
    setObligationStatus,
    reassignObligation,
    renewals,
    decideRenewal,
    reviews,
    addReview,
    setReviewDecision,
    intakes,
    addIntake,
    advanceIntake,
    audit: overlay.audit,
    stats,
  };
}
