"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, FileText, History, Layers, MapPin, Settings2, Sparkles, Users } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  CLAUSE_LIBRARY,
  CONTRACT_TYPE_LABEL,
  PLAYBOOK,
  templateById,
} from "@/components/legal/clm/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TemplateDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const t = templateById(id);

  const tplName = t?.name;
  const tplId = t?.id;

  useEffect(() => {
    if (!tplName || !tplId) return;
    setScreen({ module: "Legal", page: "Template", recordId: tplId, recordLabel: tplName });
    return () => setScreen(null);
  }, [tplName, tplId, setScreen]);

  if (!t) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Template not found</h1>
        <Link href="/legal/contracts/templates" className="text-brand underline mt-3 inline-block">
          Back to templates
        </Link>
      </div>
    );
  }

  const playbookEntries = PLAYBOOK.filter((p) => t.playbookIds.includes(p.id));
  const clauseEntries = t.clauseIds.map((cid) => CLAUSE_LIBRARY.find((c) => c.id === cid)).filter(Boolean) as typeof CLAUSE_LIBRARY;
  const fallbackEntries = t.fallbackClauseIds.map((cid) => CLAUSE_LIBRARY.find((c) => c.id === cid)).filter(Boolean) as typeof CLAUSE_LIBRARY;
  const latestVersion = t.versions[t.versions.length - 1];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/legal/contracts/templates"
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
              <h1 className="text-xl font-bold text-foreground tracking-tight">{t.name}</h1>
              <code className="text-[10px] font-mono text-muted-foreground/60">{t.id}</code>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">v{latestVersion.version}</span>
              {t.selfServeAllowed && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand inline-flex items-center gap-1">
                  <Sparkles className="size-2.5" />
                  Self-serve
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-0.5 max-w-3xl">{t.description}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
              <span>{CONTRACT_TYPE_LABEL[t.type]}</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1"><Users className="size-3" /> {t.usageCount} contracts</span>
              <span>·</span>
              <span>Status: <span className="text-foreground capitalize">{t.status}</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Section icon={Layers} title={`Clauses (${clauseEntries.length})`}>
            <p className="text-[11px] text-muted-foreground mb-2">Default clauses assembled when a draft is generated.</p>
            <ul>
              {clauseEntries.map((c) => (
                <li key={c.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-start gap-3 text-[12px]">
                  <code className="font-mono text-muted-foreground/60 shrink-0">{c.id}</code>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground">{c.title}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{c.category} · used in {c.usedInContracts} contracts</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {fallbackEntries.length > 0 && (
            <Section icon={Settings2} title={`Fallback clauses (${fallbackEntries.length})`}>
              <p className="text-[11px] text-muted-foreground mb-2">Acceptable alternatives when counterparty pushes back.</p>
              <ul>
                {fallbackEntries.map((c) => (
                  <li key={c.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-start gap-3 text-[12px]">
                    <code className="font-mono text-muted-foreground/60 shrink-0">{c.id}</code>
                    <p className="text-foreground">{c.title}</p>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {playbookEntries.length > 0 && (
            <Section icon={Sparkles} title={`Playbook positions (${playbookEntries.length})`}>
              <ul className="space-y-2.5">
                {playbookEntries.map((p) => (
                  <li key={p.id} className="bg-surface-overlay/30 rounded-lg p-3">
                    <p className="text-[12px] font-semibold text-foreground">{p.clauseTopic}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      <span className="text-success font-medium">Ideal:</span> {p.ideal.summary}
                    </p>
                    {p.acceptable.length > 0 && (
                      <p className="text-[11px] text-muted-foreground mt-1">
                        <span className="text-warning font-medium">Acceptable:</span> {p.acceptable.map((a) => a.summary).join(" · ")}
                      </p>
                    )}
                    <p className="text-[11px] text-muted-foreground mt-1">
                      <span className="text-destructive font-medium">Unacceptable:</span> {p.unacceptable.summary}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1.5">Approver threshold: <span className="text-foreground">{p.approvalThreshold.replace(/_/g, " ")}</span></p>
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Section icon={Settings2} title={`Variables (${t.variables.length})`}>
            <ul>
              {t.variables.map((v) => (
                <li key={v.key} className="py-1.5 border-b border-border last:border-b-0 text-[12px]">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-muted-foreground/60">{v.key}</code>
                    {v.required && <span className="text-[9px] text-destructive">required</span>}
                  </div>
                  <p className="text-foreground">{v.label}</p>
                  {v.help && <p className="text-[10px] text-muted-foreground/70">{v.help}</p>}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={MapPin} title="Jurisdiction variants">
            <ul className="text-[12px]">
              {t.jurisdictionVariants.map((j) => (
                <li key={j.jurisdiction} className="py-1.5 border-b border-border last:border-b-0 flex items-center justify-between">
                  <span className="text-foreground">{j.jurisdiction}</span>
                  <span className="text-muted-foreground text-[11px]">{j.ownerTeam}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={History} title={`Version history (${t.versions.length})`}>
            <ol className="text-[12px]">
              {[...t.versions].reverse().map((v) => (
                <li key={v.version} className="py-1.5 border-b border-border last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">v{v.version}</span>
                    <span className="text-foreground">{v.notes}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{v.releasedOn} · {v.releasedBy}</p>
                </li>
              ))}
            </ol>
          </Section>

          {t.selfServeAllowed && (
            <Link
              href={`/legal/contracts/authoring?template=${t.id}`}
              className="block bg-card border border-dashed border-border rounded-xl p-3 hover:border-border/80 transition-colors"
            >
              <p className="text-[12px] font-semibold text-foreground">Self-serve assembly</p>
              <p className="text-[11px] text-muted-foreground mt-1">Business users answer questions; the agent builds a first draft.</p>
              <span className="text-[11px] text-brand mt-2 inline-flex items-center gap-1">
                Start <ChevronRight className="size-3" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
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
