"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronRight,
  Globe2,
  Layers,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAccess } from "@/lib/use-access";
import { ADMIN_USERS, ALL_PERMISSIONS, MODULES } from "@/components/admin/data";
import { RECORD_TYPE_LABEL, type AssignmentScope } from "@/components/admin/rbac";

export default function MyAccessPage() {
  const { setScreen } = useScreen();
  const { principalId, myAssignments, rbac } = useAccess();

  useEffect(() => {
    setScreen({ module: "Admin", page: "My access" });
    return () => setScreen(null);
  }, [setScreen]);

  const me = ADMIN_USERS.find((u) => u.id === principalId);

  // Effective perms per module
  const perModule = useMemo(() => {
    return MODULES.map((m) => {
      const eff = rbac.effectiveFor(principalId, { kind: "module", module: m.key });
      const total = ALL_PERMISSIONS.filter((p) => p.module === m.key).length;
      return {
        module: m,
        granted: eff.perms.size,
        total,
        via: eff.via,
      };
    });
  }, [principalId, rbac]);

  const tenantPerms = useMemo(
    () => rbac.effectiveFor(principalId, { kind: "tenant" }),
    [principalId, rbac],
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/admin"
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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">My access</h1>
            <p className="text-sm text-muted-foreground">
              Every role you hold, where it applies, and what it lets you do. {me ? `Signed in as ${me.name}.` : ""}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Assignments */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
          <Shield className="size-3.5 text-muted-foreground" />
          <p className="text-[11px] font-semibold text-foreground">Your role assignments ({myAssignments.length})</p>
        </header>
        <ul>
          {myAssignments.map((a) => (
            <li key={a.id} className="px-4 py-3 border-b border-border last:border-b-0 flex items-start gap-3 flex-wrap">
              <ScopeIcon scope={a.scope} />
              <div className="flex-1 min-w-0">
                <Link href={`/admin/rbac/roles/${encodeURIComponent(a.role.id)}`} className="text-sm font-medium text-foreground hover:underline">
                  {a.role.name}
                </Link>
                <p className="text-[11px] text-muted-foreground">{a.role.description}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  On <span className="text-foreground">{describeScope(a.scope)}</span>
                  {a.reason ? <> · <span className="italic">{a.reason}</span></> : null}
                  {a.expiresAtISO ? <> · expires {a.expiresAtISO.slice(0, 10)}</> : null}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground font-medium">
                {a.role.permissions.length} perms
              </span>
            </li>
          ))}
          {myAssignments.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No assignments yet.</li>
          )}
        </ul>
      </section>

      {/* Per-module breakdown */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
          <p className="text-[11px] font-semibold text-foreground">What you can do, by module</p>
          <span className="text-[10px] text-muted-foreground ml-auto">
            Tenant-scoped grants count toward every module.
          </span>
        </header>
        <ul>
          {perModule.map(({ module, granted, total, via }) => {
            const pct = total === 0 ? 0 : Math.round((granted / total) * 100);
            const has = granted > 0;
            return (
              <li key={module.key} className="px-4 py-3 border-b border-border last:border-b-0">
                <div className="flex items-center gap-3 flex-wrap">
                  {has ? <Check className="size-3.5 text-success" /> : <X className="size-3.5 text-muted-foreground/40" />}
                  <p className="text-sm font-medium text-foreground">{module.label}</p>
                  <code className="text-[10px] font-mono text-muted-foreground/60">{module.key}</code>
                  <div className="flex-1 max-w-md h-1.5 bg-secondary rounded overflow-hidden">
                    <div className="h-full bg-brand-purple" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{granted} / {total}</span>
                </div>
                {via.length > 0 && (
                  <div className="ml-7 mt-1.5 flex items-center gap-1.5 flex-wrap">
                    {via.slice(0, 6).map((v) => (
                      <span
                        key={v.assignmentId}
                        className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple font-medium"
                        title={describeScope(v.scope)}
                      >
                        {rbac.resolveRole(v.roleId)?.name ?? v.roleId} · {v.scope.kind}
                      </span>
                    ))}
                    {via.length > 6 && <span className="text-[10px] text-muted-foreground">+{via.length - 6} more</span>}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Tenant-effective perms */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
          <p className="text-[11px] font-semibold text-foreground">Tenant-effective permissions ({tenantPerms.perms.size})</p>
          <span className="text-[10px] text-muted-foreground ml-auto">Union of every tenant-scoped role.</span>
        </header>
        <div className="p-3 flex flex-wrap gap-1.5">
          {Array.from(tenantPerms.perms)
            .sort()
            .map((k) => {
              const def = ALL_PERMISSIONS.find((p) => p.key === k);
              return (
                <span
                  key={k}
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                  title={def?.label}
                >
                  {k}
                </span>
              );
            })}
          {tenantPerms.perms.size === 0 && (
            <p className="text-[11px] text-muted-foreground italic">No tenant-scoped permissions. Only module / record grants apply.</p>
          )}
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground inline-flex items-center gap-2">
        <ChevronRight className="size-3" />
        Need different access? Ask your tenant admin (Anita Verma) or open a request from <Link href="/admin/rbac/assignments" className="text-brand hover:underline ml-1">assignments</Link>.
      </p>
    </div>
  );
}

function ScopeIcon({ scope }: { scope: AssignmentScope }) {
  if (scope.kind === "tenant") return <Globe2 className="size-4 text-destructive mt-0.5" />;
  if (scope.kind === "module") return <Building2 className="size-4 text-brand-purple mt-0.5" />;
  return <Layers className="size-4 text-brand-teal mt-0.5" />;
}

function describeScope(scope: AssignmentScope): string {
  if (scope.kind === "tenant") return "the whole tenant";
  if (scope.kind === "module") {
    return `the ${MODULES.find((m) => m.key === scope.module)?.label ?? scope.module} module`;
  }
  return `${RECORD_TYPE_LABEL[scope.recordType]} ${scope.recordLabel}`;
}
