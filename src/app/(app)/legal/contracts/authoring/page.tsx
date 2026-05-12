"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, CheckCircle2, ChevronRight, FileText, Send, Sparkles, Wand2 } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import { TEMPLATES, templateById } from "@/components/legal/clm/data";

export default function AuthoringPage() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto py-12 text-sm text-muted-foreground">Loading…</div>}>
      <AuthoringPageInner />
    </Suspense>
  );
}

function AuthoringPageInner() {
  const { setScreen } = useScreen();
  const { addIntake, advanceIntake, intakes } = useClmStore();
  const sp = useSearchParams();

  const [templateId, setTemplateId] = useState(sp.get("template") ?? TEMPLATES.find((t) => t.selfServeAllowed)?.id ?? TEMPLATES[0].id);
  const [counterpartyName, setCounterpartyName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Legal", page: "Authoring" });
    return () => setScreen(null);
  }, [setScreen]);

  const template = useMemo(() => templateById(templateId), [templateId]);

  const ready = useMemo(() => {
    if (!template || !counterpartyName.trim() || !purpose.trim()) return false;
    for (const v of template.variables) {
      if (v.required && !answers[v.key]?.trim()) return false;
    }
    return true;
  }, [template, counterpartyName, purpose, answers]);

  if (!template) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-sm text-muted-foreground">Pick a template to start.</p>
      </div>
    );
  }

  function submit() {
    if (!template) return;
    addIntake({
      templateId: template.id,
      counterpartyName,
      purpose,
      answers,
      requestedBy: "Anita Verma",
    });
    setSubmitted(`Intake created. ${template.selfServeAllowed ? "Draft will assemble in seconds." : "Routed to Legal for drafting."}`);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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
          <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <Wand2 className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">New contract — authoring</h1>
            <p className="text-sm text-muted-foreground">
              Pick a template. Answer the questions. The Contract Drafting agent assembles your first draft.
            </p>
          </div>
        </div>
      </motion.div>

      {submitted && (
        <div className="bg-success/10 border border-success/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <CheckCircle2 className="size-4 text-success" />
          <p className="text-sm text-foreground">{submitted}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Template</label>
              <select
                value={templateId}
                onChange={(e) => { setTemplateId(e.target.value); setAnswers({}); }}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.selfServeAllowed ? "· self-serve" : "· legal-led"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Counterparty</label>
              <input
                value={counterpartyName}
                onChange={(e) => setCounterpartyName(e.target.value)}
                placeholder="e.g. Sumitomo Mitsui Banking Corporation"
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Purpose / context</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What is this contract for? What is the deal?"
                className="mt-1 w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none min-h-20"
              />
            </div>
          </div>

          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border">
              <p className="text-[11px] font-semibold text-foreground">Template variables ({template.variables.length})</p>
            </header>
            <div className="p-3 space-y-3">
              {template.variables.map((v) => (
                <div key={v.key}>
                  <label className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1">
                    {v.label}
                    {v.required && <span className="text-destructive">*</span>}
                  </label>
                  {v.kind === "select" ? (
                    <select
                      value={answers[v.key] ?? v.defaultValue ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [v.key]: e.target.value }))}
                      className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground"
                    >
                      <option value="">— select —</option>
                      {v.options?.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={v.kind === "date" ? "date" : v.kind === "number" || v.kind === "currency" ? "number" : "text"}
                      value={answers[v.key] ?? v.defaultValue ?? ""}
                      onChange={(e) => setAnswers((a) => ({ ...a, [v.key]: e.target.value }))}
                      placeholder={v.help}
                      className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-2">
            <button
              disabled={!ready}
              onClick={submit}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-40 transition-colors"
            >
              <Send className="size-3.5" />
              {template.selfServeAllowed ? "Assemble draft" : "Send to legal"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <Sparkles className="size-3.5 text-brand-purple" />
              <p className="text-[11px] font-semibold text-foreground">What the agent will do</p>
            </header>
            <ol className="p-3 space-y-2 text-[12px] text-foreground">
              <li className="flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-12 shrink-0">1.</span>
                <span>Validate that the counterparty isn&apos;t on the conflicts list (Conflict Checker agent).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-12 shrink-0">2.</span>
                <span>Apply jurisdiction-specific clause variants based on Counterparty country and our entity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-12 shrink-0">3.</span>
                <span>Assemble the {template.clauseIds.length} default clauses; keep {template.fallbackClauseIds.length} fallback clauses ready.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold w-12 shrink-0">4.</span>
                <span>{template.selfServeAllowed ? "Drop the draft in your inbox in seconds." : "Hand off to a lawyer for review before sending."}</span>
              </li>
            </ol>
          </section>

          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <FileText className="size-3.5 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-foreground">Recent intakes ({intakes.length})</p>
            </header>
            <ul className="p-2 space-y-1">
              {intakes.slice(0, 8).map((i) => (
                <li key={i.id} className="px-2 py-1.5 rounded hover:bg-surface-overlay/40 transition-colors flex items-center gap-2 text-[12px]">
                  <Bot className="size-3 text-brand-purple shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate">{i.counterpartyName} · {i.purpose}</p>
                    <p className="text-[10px] text-muted-foreground/70">{i.whenISO.slice(0, 10)} · {i.status}</p>
                  </div>
                  {i.status !== "sent_to_legal" && (
                    <button
                      onClick={() => advanceIntake(i.id, i.status === "queued" ? "drafted" : "sent_to_legal")}
                      className="text-[10px] text-brand hover:underline inline-flex items-center gap-1"
                    >
                      Advance <ChevronRight className="size-2.5" />
                    </button>
                  )}
                </li>
              ))}
              {intakes.length === 0 && (
                <li className="text-center text-[11px] text-muted-foreground italic py-6">No intakes yet.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
