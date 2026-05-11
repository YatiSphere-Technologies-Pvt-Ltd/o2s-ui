"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import { useRouter } from "next/navigation";
import {
  ALL_PERMISSIONS,
  MODULES,
  MODULE_MAP,
} from "@/components/admin/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RoleDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { setScreen } = useScreen();
  const { roles, users, togglePermissionOnRole, resetRole, deleteRole } = useAdminStore();
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [flash, setFlash] = useState<string | null>(null);

  const role = roles.find((r) => r.id === id);
  const roleName = role?.name;

  useEffect(() => {
    if (!roleName) return;
    setScreen({ module: "Admin", page: "Role detail", recordId: id, recordLabel: roleName });
    return () => setScreen(null);
  }, [id, roleName, setScreen]);

  const members = useMemo(
    () => users.filter((u) => u.roleIds.includes(id)),
    [users, id],
  );

  const filteredPerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PERMISSIONS.filter((p) => {
      if (moduleFilter !== "all" && p.module !== moduleFilter) return false;
      if (!q) return true;
      return p.key.toLowerCase().includes(q) || p.label.toLowerCase().includes(q);
    });
  }, [query, moduleFilter]);

  if (!role) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Role not found</h1>
        <Link href="/admin/roles" className="text-brand underline mt-3 inline-block">
          Back to roles
        </Link>
      </div>
    );
  }

  const isSuperAdmin = role.id === "super_admin";

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

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
            href="/admin/roles"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Shield className="size-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{role.name}</h1>
                {role.builtIn ? (
                  <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">Built-in</span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                    <Sparkles className="size-2.5" />
                    Custom
                  </span>
                )}
                {isSuperAdmin && (
                  <span className="text-[10px] uppercase tracking-wider text-destructive inline-flex items-center gap-1">
                    <Lock className="size-2.5" />
                    Locked
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{role.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3" />
                  {members.length} member{members.length === 1 ? "" : "s"}
                </span>
                <span>·</span>
                <span>{role.permissions.length} of {ALL_PERMISSIONS.length} permissions</span>
                <span>·</span>
                <span>
                  {role.scope === "module" && role.module
                    ? `Module: ${MODULE_MAP[role.module]?.label ?? role.module}`
                    : role.scope === "team"
                    ? "Team-scoped"
                    : "Tenant-wide"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isSuperAdmin && (
            <button
              onClick={() => {
                resetRole(role.id);
                flashOnce(`Reset ${role.name} to defaults.`);
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          )}
          {!role.builtIn && (
            <button
              onClick={() => {
                deleteRole(role.id);
                router.push("/admin/roles");
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/40 bg-destructive/10 text-sm text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="size-3.5" />
              Delete
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2"
          >
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members */}
        <section className="lg:col-span-1 space-y-2">
          <h2 className="text-base font-semibold text-foreground">Members ({members.length})</h2>
          <ul className="bg-card border border-border rounded-xl overflow-hidden max-h-90 overflow-y-auto scrollbar-thin">
            {members.map((u) => (
              <li key={u.id}>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors"
                >
                  <span className={`size-7 rounded-full ${u.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                    {u.initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{u.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{u.jobTitle}</p>
                  </div>
                </Link>
              </li>
            ))}
            {members.length === 0 && (
              <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No members.</li>
            )}
          </ul>
        </section>

        {/* Permissions toggles */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-base font-semibold text-foreground">Permissions</h2>
            <p className="text-[11px] text-muted-foreground">
              {role.permissions.length} granted · {ALL_PERMISSIONS.length - role.permissions.length} available
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-44">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search permissions…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="all">All modules</option>
              <option value="platform">Platform</option>
              {MODULES.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <ul>
              {filteredPerms.map((p) => {
                const granted = role.permissions.includes(p.key);
                return (
                  <li key={p.key} className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-foreground">{p.label}</p>
                        <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                      </div>
                      <p className="text-[11px] text-muted-foreground/80 leading-snug">{p.description}</p>
                    </div>
                    <button
                      disabled={isSuperAdmin}
                      onClick={() => togglePermissionOnRole(role.id, p.key)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                        granted ? "bg-brand" : "bg-secondary"
                      } ${isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                      aria-pressed={granted}
                    >
                      <span className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${granted ? "left-5" : "left-0.5"}`} />
                    </button>
                  </li>
                );
              })}
              {filteredPerms.length === 0 && (
                <li className="px-3 py-12 text-center text-sm text-muted-foreground italic">No permissions match these filters.</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
