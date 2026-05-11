"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileLock2, Lock, Search, ShieldOff } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import {
  ALL_PERMISSIONS,
  MODULES,
  MODULE_MAP,
  TIER_LABEL,
  type PermissionDef,
} from "@/components/admin/data";

export default function PermissionMatrixPage() {
  const { setScreen } = useScreen();
  const { roles, entitlements } = useAdminStore();
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  useEffect(() => {
    setScreen({ module: "Admin", page: "Permissions" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PERMISSIONS.filter((p) => {
      if (moduleFilter !== "all" && p.module !== moduleFilter) return false;
      if (!q) return true;
      return (
        p.key.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [query, moduleFilter]);

  const grouped = useMemo(() => {
    const map: Record<string, PermissionDef[]> = {};
    for (const p of filtered) {
      const k = p.module;
      if (!map[k]) map[k] = [];
      map[k].push(p);
    }
    return map;
  }, [filtered]);

  const moduleEntitlement = (moduleKey: string) => entitlements.find((e) => e.module === moduleKey);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/admin"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight inline-flex items-center gap-2">
              <FileLock2 className="size-5 text-warning" />
              Permission matrix
            </h1>
            <p className="text-sm text-muted-foreground">
              Every fine-grained permission. {ALL_PERMISSIONS.length} total across {MODULES.length + 1} modules.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search permission key, label, description…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setModuleFilter("all")}
            className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
              moduleFilter === "all" ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setModuleFilter("platform")}
            className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
              moduleFilter === "platform" ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Platform
          </button>
          {MODULES.map((m) => (
            <button
              key={m.key}
              onClick={() => setModuleFilter(m.key)}
              className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
                moduleFilter === m.key ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([modKey, perms]) => {
          const mod = modKey === "platform" ? null : MODULE_MAP[modKey as keyof typeof MODULE_MAP];
          const ent = modKey === "platform" ? null : moduleEntitlement(modKey);
          const notOwned = modKey !== "platform" && !ent;
          return (
            <section key={modKey} className={`bg-card border rounded-xl overflow-hidden ${notOwned ? "border-border opacity-70" : "border-border"}`}>
              <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">{mod?.label ?? "Platform"}</h2>
                  <p className="text-[10px] text-muted-foreground/70">{perms.length} permissions</p>
                </div>
                {notOwned ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                    <ShieldOff className="size-2.5" />
                    Not owned
                  </span>
                ) : ent ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand">
                    {TIER_LABEL[ent.tier]}
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/10 text-brand-purple">
                    Platform
                  </span>
                )}
              </div>
              <table className="w-full text-sm">
                <thead className="bg-surface-overlay/40 border-b border-border">
                  <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    <th className="text-left px-4 py-2 font-semibold">Permission</th>
                    <th className="text-left px-3 py-2 font-semibold">Group</th>
                    <th className="text-right px-3 py-2 font-semibold">Min tier</th>
                    <th className="text-right px-4 py-2 font-semibold">Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {perms.map((p) => {
                    const grantedToRoles = roles.filter((r) => r.permissions.includes(p.key));
                    const tierLocked = p.minTier && ent && p.minTier && (
                      (p.minTier === "enterprise" && ent.tier !== "enterprise") ||
                      (p.minTier === "pro" && ent.tier === "free")
                    );
                    return (
                      <tr key={p.key} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <p className="text-sm font-medium text-foreground">{p.label}</p>
                          <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                          <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{p.description}</p>
                        </td>
                        <td className="px-3 py-2.5 text-[11px] text-muted-foreground">{p.group}</td>
                        <td className="px-3 py-2.5 text-right">
                          {p.minTier ? (
                            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${tierLocked ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"} inline-flex items-center gap-1`}>
                              {tierLocked && <Lock className="size-2.5" />}
                              {TIER_LABEL[p.minTier]}
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground/60">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <div className="flex items-center justify-end gap-1 flex-wrap">
                            {grantedToRoles.slice(0, 3).map((r) => (
                              <Link
                                key={r.id}
                                href={`/admin/roles/${r.id}`}
                                className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-foreground hover:bg-surface-overlay transition-colors"
                              >
                                {r.name}
                              </Link>
                            ))}
                            {grantedToRoles.length > 3 && (
                              <span className="text-[10px] text-muted-foreground/70">+{grantedToRoles.length - 3}</span>
                            )}
                            {grantedToRoles.length === 0 && (
                              <span className="text-[10px] text-muted-foreground/60 italic">unassigned</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
        {Object.keys(grouped).length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-12">No permissions match these filters.</p>
        )}
      </div>
    </div>
  );
}
