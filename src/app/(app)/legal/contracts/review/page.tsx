"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  CheckCircle2,
  ChevronRight,
  Pencil,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import { CLAUSE_LABEL, CLAUSE_TINT, PLAYBOOK } from "@/components/legal/clm/data";

/** Synthetic clause finding generator. Builds a believable G/Y/R map from heuristic keyword hits
 *  in pasted counterparty paper. This is a demo of what the Contract Review Agent does, not a
 *  real NLP model.
 */
function generateFindings(pasted: string): Array<{
  topic: string;
  severity: "green" | "yellow" | "red";
  cpLanguage: string;
  ourLanguage: string;
  suggestion: string;
}> {
  const text = pasted.toLowerCase();
  const findings: Array<{ topic: string; severity: "green" | "yellow" | "red"; cpLanguage: string; ourLanguage: string; suggestion: string }> = [];

  // Limitation of Liability
  if (text.includes("unlimited") && text.includes("liability")) {
    findings.push({
      topic: "Limitation of Liability",
      severity: "red",
      cpLanguage: "Detected 'unlimited liability' wording.",
      ourLanguage: PLAYBOOK.find((p) => p.id === "PB-LOL")?.ideal.summary ?? "",
      suggestion: "Push back to 12-month fees cap with mutual carve-outs. Off-playbook → escalate to GC if accepted.",
    });
  } else if (text.includes("liability")) {
    findings.push({
      topic: "Limitation of Liability",
      severity: text.includes("12 months") || text.includes("twelve") ? "green" : "yellow",
      cpLanguage: "Liability clause present.",
      ourLanguage: "12-month fees cap, mutual, with confidentiality/indemnity carve-outs.",
      suggestion: "Confirm cap aligns with our playbook (12 months). 18-month band acceptable with HoL sign-off.",
    });
  }

  // Data Protection
  if (text.includes("personal data") || text.includes("gdpr") || text.includes("dpdp")) {
    findings.push({
      topic: "Data Protection",
      severity: text.includes("data residency") && !text.includes("eu") && !text.includes("india")
        ? "red"
        : text.includes("standard contractual clauses") || text.includes("sccs")
          ? "green"
          : "yellow",
      cpLanguage: "Data protection language present.",
      ourLanguage: "Standard DPA (GDPR + DPDP) with SCC Module 2 for cross-border transfers.",
      suggestion: "Attach our DPA as schedule. Privacy team review required.",
    });
  }

  // Auto-renewal
  if (text.includes("auto") && (text.includes("renew") || text.includes("renewal"))) {
    findings.push({
      topic: "Auto-renewal",
      severity: text.includes("30 days") ? "green" : text.includes("90 days") ? "yellow" : "red",
      cpLanguage: "Auto-renewal language detected.",
      ourLanguage: "Auto-renew 12 months unless 30 days' opt-out; no uncapped CPI escalation.",
      suggestion: "Cap opt-out window at 30 days and CPI at 5%.",
    });
  }

  // Indemnity
  if (text.includes("indemnif")) {
    findings.push({
      topic: "Indemnity",
      severity: text.includes("ip") || text.includes("intellectual property") ? "green" : "yellow",
      cpLanguage: "Indemnity language detected.",
      ourLanguage: "Supplier indemnifies for IP infringement + data breach. Mutual indemnity for third-party claims.",
      suggestion: "Tighten to IP + data breach. Reject blanket indemnity asks.",
    });
  }

  // Payment
  if (text.includes("net 60") || text.includes("net sixty")) {
    findings.push({
      topic: "Payment terms",
      severity: "red",
      cpLanguage: "Detected Net 60.",
      ourLanguage: "Net 30 ideal; Net 45 acceptable with team_lead sign-off.",
      suggestion: "Counter with Net 30 / Net 45 max.",
    });
  } else if (text.includes("net 45") || text.includes("net forty-five")) {
    findings.push({
      topic: "Payment terms",
      severity: "yellow",
      cpLanguage: "Detected Net 45.",
      ourLanguage: "Net 30 ideal; Net 45 acceptable with team_lead sign-off.",
      suggestion: "Accept with team-lead sign-off.",
    });
  }

  // Governing law
  if (text.includes("governing law") || text.includes("jurisdiction")) {
    const isOffshore = text.includes("cayman") || text.includes("bvi") || text.includes("seychelles");
    findings.push({
      topic: "Governing law",
      severity: isOffshore ? "red" : text.includes("india") || text.includes("england") || text.includes("singapore") ? "green" : "yellow",
      cpLanguage: "Governing law clause present.",
      ourLanguage: "India / Mumbai courts ideal. Neutral seats (London/LCIA, Singapore/SIAC, Delaware) acceptable.",
      suggestion: isOffshore ? "Reject offshore seat — no enforcement treaty." : "Confirm enforceability and check if our entity has subsidiary cover.",
    });
  }

  if (findings.length === 0) {
    findings.push({
      topic: "(No flags detected)",
      severity: "green",
      cpLanguage: "The pasted text contains no clauses on our hot-list. Proceed to full review.",
      ourLanguage: "—",
      suggestion: "Forward to legal for line-by-line review.",
    });
  }
  return findings;
}

export default function ReviewPage() {
  const { setScreen } = useScreen();
  const { reviews, addReview, setReviewDecision } = useClmStore();
  const [contractType, setContractType] = useState("MSA");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [pasted, setPasted] = useState("");
  const [activeReview, setActiveReview] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Legal", page: "Contract review" });
    return () => setScreen(null);
  }, [setScreen]);

  const currentReview = useMemo(() => reviews.find((r) => r.id === activeReview), [reviews, activeReview]);

  function runReview() {
    if (!pasted.trim() || !counterpartyName.trim()) return;
    const findings = generateFindings(pasted);
    addReview({
      counterpartyName,
      contractType,
      pasted: pasted.slice(0, 4000),
      findings,
    });
    setPasted("");
    setCounterpartyName("");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/legal/contracts"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Review counterparty paper</h1>
            <p className="text-sm text-muted-foreground">
              Drop in a third-party draft. Contract Review agent flags every deviation from our playbook.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Drop-in */}
        <section className="bg-card border border-border rounded-xl p-4 space-y-3">
          <header className="flex items-center gap-2">
            <Upload className="size-3.5 text-muted-foreground" />
            <p className="text-[11px] font-semibold text-foreground">Paste counterparty draft</p>
          </header>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              placeholder="Counterparty name"
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none"
            />
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none"
            >
              <option>MSA</option>
              <option>SOW</option>
              <option>NDA</option>
              <option>DPA</option>
              <option>SaaS subscription</option>
              <option>Vendor agreement</option>
            </select>
          </div>
          <textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="Paste relevant clauses or upload Word doc (mock — paste any text here)…"
            className="w-full px-2.5 py-2 rounded-lg border border-input bg-card text-xs text-foreground outline-none min-h-56 font-mono"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground/70">Tip: include words like &quot;unlimited liability&quot;, &quot;net 60&quot;, &quot;auto-renew&quot;, &quot;GDPR&quot;, &quot;indemnify&quot;, &quot;governing law&quot; to see the detector light up.</p>
            <button
              disabled={!pasted.trim() || !counterpartyName.trim()}
              onClick={runReview}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-40 transition-colors"
            >
              <Sparkles className="size-3.5" />
              Run review
            </button>
          </div>
        </section>

        {/* Findings or session list */}
        {currentReview ? (
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <Bot className="size-3.5 text-brand-purple" />
              <p className="text-[11px] font-semibold text-foreground">{currentReview.counterpartyName} · {currentReview.contractType}</p>
              <button onClick={() => setActiveReview(null)} className="ml-auto text-[10px] text-muted-foreground hover:text-foreground">Close</button>
            </header>
            <ul>
              {currentReview.findings.map((f) => {
                const decision = currentReview.decisionsByTopic[f.topic];
                return (
                  <li key={f.topic} className="px-3 py-2.5 border-b border-border last:border-b-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${CLAUSE_TINT[f.severity]}`}>
                        {CLAUSE_LABEL[f.severity]}
                      </span>
                      <p className="text-sm font-medium text-foreground">{f.topic}</p>
                      {decision && (
                        <span className="text-[10px] text-muted-foreground capitalize ml-auto">→ {decision}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">{f.cpLanguage}</p>
                    <p className="text-[11px] text-foreground mt-1"><span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Our position</span>{f.ourLanguage}</p>
                    <p className="text-[11px] text-foreground mt-1"><span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Suggestion</span>{f.suggestion}</p>
                    {!decision && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <button
                          onClick={() => setReviewDecision(currentReview.id, f.topic, "accept")}
                          className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
                        >
                          <CheckCircle2 className="size-3" />
                          Accept
                        </button>
                        <button
                          onClick={() => setReviewDecision(currentReview.id, f.topic, "redline")}
                          className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-warning/10 text-warning border border-warning/40 hover:bg-warning/20 transition-colors"
                        >
                          <Pencil className="size-3" />
                          Redline
                        </button>
                        <button
                          onClick={() => setReviewDecision(currentReview.id, f.topic, "escalate")}
                          className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
                        >
                          <AlertTriangle className="size-3" />
                          Escalate
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : (
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <Bot className="size-3.5 text-brand-purple" />
              <p className="text-[11px] font-semibold text-foreground">Recent review sessions ({reviews.length})</p>
            </header>
            <ul>
              {reviews.length === 0 && (
                <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">
                  Paste a draft on the left to start a review session.
                </li>
              )}
              {reviews.map((r) => {
                const red = r.findings.filter((f) => f.severity === "red").length;
                const yellow = r.findings.filter((f) => f.severity === "yellow").length;
                const green = r.findings.filter((f) => f.severity === "green").length;
                return (
                  <li key={r.id} className="border-b border-border last:border-b-0">
                    <button
                      onClick={() => setActiveReview(r.id)}
                      className="w-full px-4 py-3 text-left hover:bg-surface-overlay/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{r.counterpartyName}</p>
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">{r.contractType}</span>
                        <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto" />
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                        <span>{r.whenISO.slice(0, 10)}</span>
                        <span>·</span>
                        {red > 0 && <span className="inline-flex items-center gap-1 text-destructive"><XCircle className="size-2.5" />{red} red</span>}
                        {yellow > 0 && <span className="inline-flex items-center gap-1 text-warning"><AlertTriangle className="size-2.5" />{yellow} yellow</span>}
                        {green > 0 && <span className="inline-flex items-center gap-1 text-success"><CheckCircle2 className="size-2.5" />{green} green</span>}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
