"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, Lock, Shield, Sparkles } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRbacStore } from "@/lib/rbac-store";
import { ALL_PERMISSIONS, MODULES, type ModuleKey } from "@/components/admin/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RoleDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const decoded = decodeURIComponent(id);
  const { setScreen } = useScreen();
  const { resolveRole, updateRolePermissions, assignmentRows } = useRbacStore();

  const role = resolveRole(decoded);
  const roleName = role?.name;

  useEffect(() => {
    if (!roleName) return;
    setScreen({ module: "Admin", page: "Role", recordId: decoded, recordLabel: roleName });
    return () => setScreen(null);
  }, [roleName, decoded, setScreen]);

  const [selected, setSelected] = useState<Set<string>>(new Set(role?.permissions ?? []));
  const [dirty, setDirty] = useState(false);

  // Reset selection when the role id changes (decoded id is stable per render).
  useEffect(() => {
    if (role) setSelected(new Set(role.permissions));
    setDirty(false);
  }, [role]);

  const grouped = useMemo(() => {
    const out = new Map<string, typeof ALL_PERMISSIONS>();
    for (const p of ALL_PERMISSIONS) {
      const key = p.module;
      const arr = out.get(key) ?? [];
      arr.push(p);
      out.set(key, arr);
    }
    return out;
  }, []);

  if (!role) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Role not found</h1>
        <Link href="/admin/rbac/roles" className="text-brand underline mt-3 inline-block">
          Back to roles
        </Link>
      </div>
    );
  }

  const moduleLabel =
    role.owner === "platform"
      ? "Platform"
      : MODULES.find((m) => m.key === role.owner)?.label ?? role.owner;

  const myAssignments = assignmentRows.filter((a) => a.roleId === role.id);
  const canEdit = !role.builtIn; // Built-in roles are read-only by default

  function toggle(key: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setDirty(true);
  }

  function save() {
    updateRolePermissions(role!.id, Array.from(selected));
    setDirty(false);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/admin/rbac/roles"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Shield className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground tracking-tight">{role.name}</h1>
              <code className="text-[10px] font-mono text-muted-foreground/60">{role.id}</code>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${role.builtIn ? "bg-secondary text-muted-foreground" : "bg-brand-purple/10 text-brand-purple"}`}>
                {role.builtIn ? "Built-in" : "Custom"}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-secondary text-muted-foreground">
                {moduleLabel}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{role.description}</p>
          </div>
        </div>
        {dirty && canEdit && (
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setSelected(new Set(role.permissions));
                setDirty(false);
              }}
              className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-purple text-white text-sm font-medium hover:bg-brand-purple/90 transition-colors"
            >
              <Sparkles className="size-3.5" />
              Save {selected.size} permissions
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <Sparkles className="size-3.5 text-muted-foreground" />
              <p className="text-[11px] font-semibold text-foreground">Permissions</p>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {selected.size} of {ALL_PERMISSIONS.length} granted
              </span>
              {!canEdit && (
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground inline-flex items-center gap-1">
                  <Lock className="size-2.5" />
                  Read-only
                </span>
              )}
            </header>
            <div className="p-3 space-y-3">
              {Array.from(grouped.entries()).map(([moduleKey, perms]) => {
                const moduleName =
                  moduleKey === "platform"
                    ? "Platform"
                    : MODULES.find((m) => m.key === moduleKey)?.label ?? moduleKey;
                const granted = perms.filter((p) => selected.has(p.key)).length;
                return (
                  <div key={moduleKey} className="border border-border rounded-lg overflow-hidden">
                    <header className="px-3 py-1.5 bg-surface-overlay/30 border-b border-border flex items-center gap-2">
                      <p className="text-[11px] font-semibold text-foreground">{moduleName}</p>
                      <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">
                        {granted} / {perms.length}
                      </span>
                    </header>
                    <ul>
                      {perms.map((p) => (
                        <li key={p.key} className="px-3 py-1.5 border-b border-border last:border-b-0 flex items-start gap-2 text-[12px]">
                          <input
                            type="checkbox"
                            checked={selected.has(p.key)}
                            disabled={!canEdit}
                            onChange={() => toggle(p.key)}
                            className="mt-0.5 accent-brand-purple"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                              <span className="text-foreground">{p.label}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground/70">{p.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <p className="text-[11px] font-semibold text-foreground">Role attributes</p>
            </header>
            <dl className="p-3 text-[12px] space-y-1.5">
              <Detail label="Owner" value={moduleLabel} />
              <Detail label="Recommended scope" value={role.recommendedScopeKind} />
              <Detail label="Assignable at record?" value={role.assignableAtRecord ? "Yes" : "No"} />
              <Detail label="Permissions" value={role.permissions.length.toString()} />
            </dl>
          </section>

          <section className="bg-card border border-border rounded-xl overflow-hidden">
            <header className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center gap-2">
              <p className="text-[11px] font-semibold text-foreground">Active assignments ({myAssignments.length})</p>
            </header>
            <ul className="text-[12px]">
              {myAssignments.slice(0, 12).map((a) => (
                <li key={a.id} className="px-3 py-2 border-b border-border last:border-b-0 flex items-center gap-2">
                  <span className="text-foreground truncate">{a.principalLabel}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {a.scope.kind === "tenant" ? "Tenant" : a.scope.kind === "module" ? a.scope.module : `${a.scope.module}/${a.scope.recordId}`}
                  </span>
                </li>
              ))}
              {myAssignments.length === 0 && (
                <li className="px-3 py-4 text-center text-[11px] text-muted-foreground italic">No assignments.</li>
              )}
            </ul>
            {myAssignments.length > 0 && (
              <Link href={`/admin/rbac/assignments?role=${encodeURIComponent(role.id)}`} className="block px-3 py-2 text-[11px] text-brand hover:underline border-t border-border">
                See all assignments <ChevronRight className="size-3 inline" />
              </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</dt>
      <dd className="text-foreground capitalize">{value}</dd>
    </div>
  );
}

// Silence unused-typing.
void {} as unknown as ModuleKey;
