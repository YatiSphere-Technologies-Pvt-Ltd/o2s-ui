"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  AtSign,
  Ban,
  Check,
  FilePlus,
  KeyRound,
  Lock,
  MapPin,
  Pause,
  Play,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
  UsersRound,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import {
  ALL_PERMISSIONS,
  MODULES,
  MODULE_MAP,
  type UserStatus,
} from "@/components/admin/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STATUS_META: Record<UserStatus, { tint: string; label: string }> = {
  active:     { tint: "bg-success/10 text-success",         label: "Active" },
  invited:    { tint: "bg-warning/10 text-warning",         label: "Invited" },
  suspended:  { tint: "bg-destructive/10 text-destructive", label: "Suspended" },
  offboarded: { tint: "bg-secondary text-muted-foreground", label: "Offboarded" },
};

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const {
    findUser,
    roles,
    groups,
    effectiveFor,
    toggleUserRole,
    toggleUserDirectGrant,
    setUserStatus,
  } = useAdminStore();
  const [showGrant, setShowGrant] = useState(false);

  const user = findUser(id);
  const userName = user?.name;

  useEffect(() => {
    if (!userName) return;
    setScreen({ module: "Admin", page: "User detail", recordId: id, recordLabel: userName });
    return () => setScreen(null);
  }, [id, userName, setScreen]);

  const eff = useMemo(() => effectiveFor(id), [effectiveFor, id]);

  const userGroups = useMemo(() => groups.filter((g) => g.memberIds.includes(id)), [groups, id]);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">User not found</h1>
        <Link href="/admin/users" className="text-brand underline mt-3 inline-block">Back to users</Link>
      </div>
    );
  }

  const permsByModule: Record<string, string[]> = {};
  for (const p of eff.permissions) {
    const def = ALL_PERMISSIONS.find((x) => x.key === p);
    const mod = def?.module ?? "platform";
    if (!permsByModule[mod]) permsByModule[mod] = [];
    permsByModule[mod].push(p);
  }

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
            href="/admin/users"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <span className={`size-14 rounded-full ${user.avatarColor} text-white text-lg font-bold flex items-center justify-center shrink-0`}>
              {user.initials}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">{user.name}</h1>
                <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_META[user.status].tint}`}>
                  {STATUS_META[user.status].label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{user.jobTitle} · {user.department}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <AtSign className="size-3" />
                  {user.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {user.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  {user.mfaEnabled ? <ShieldCheck className="size-3 text-success" /> : <ShieldOff className="size-3 text-muted-foreground/40" />}
                  MFA
                </span>
                <span className="inline-flex items-center gap-1">
                  {user.ssoLinked ? <Lock className="size-3 text-brand" /> : <X className="size-3 text-muted-foreground/40" />}
                  SSO
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user.status === "active" ? (
            <button
              onClick={() => setUserStatus(user.id, "suspended")}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/40 bg-destructive/10 text-sm text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Pause className="size-3.5" />
              Suspend
            </button>
          ) : user.status === "suspended" ? (
            <button
              onClick={() => setUserStatus(user.id, "active")}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-success/40 bg-success/10 text-sm text-success hover:bg-success/20 transition-colors"
            >
              <Play className="size-3.5" />
              Reactivate
            </button>
          ) : null}
          {user.status !== "offboarded" && (
            <button
              onClick={() => setUserStatus(user.id, "offboarded")}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
            >
              <Ban className="size-3.5" />
              Offboard
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles & groups */}
        <section className="space-y-4">
          {/* Roles */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">Roles ({user.roleIds.length})</h2>
            <ul className="bg-card border border-border rounded-xl overflow-hidden">
              {roles.map((r) => {
                const granted = user.roleIds.includes(r.id);
                return (
                  <li key={r.id} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                    <button
                      onClick={() => toggleUserRole(user.id, r.id)}
                      className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        granted ? "bg-brand border-brand" : "border-border bg-card"
                      }`}
                      aria-pressed={granted}
                      aria-label={`Toggle role ${r.name}`}
                    >
                      {granted && <Check className="size-2.5 text-brand-foreground" />}
                    </button>
                    <Link href={`/admin/roles/${r.id}`} className="flex-1 min-w-0 group">
                      <p className="text-sm text-foreground group-hover:underline">{r.name}</p>
                      <p className="text-[10px] text-muted-foreground/70 line-clamp-1">{r.description}</p>
                    </Link>
                    <span className="text-[10px] text-muted-foreground/70 shrink-0">{r.permissions.length}p</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Groups */}
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2 inline-flex items-center gap-2">
              <UsersRound className="size-4 text-muted-foreground" />
              Groups ({userGroups.length})
            </h2>
            <ul className="bg-card border border-border rounded-xl overflow-hidden">
              {userGroups.map((g) => (
                <li key={g.id}>
                  <Link
                    href={`/admin/groups/${g.id}`}
                    className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors"
                  >
                    <UsersRound className="size-3.5 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{g.name}</p>
                      <p className="text-[10px] text-muted-foreground/70 truncate">{g.permissions.length} permissions</p>
                    </div>
                  </Link>
                </li>
              ))}
              {userGroups.length === 0 && (
                <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No groups.</li>
              )}
            </ul>
          </div>

          {/* Direct grants */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-foreground inline-flex items-center gap-2">
                <KeyRound className="size-4 text-warning" />
                Direct grants ({user.directGrants.length})
              </h2>
              <button
                onClick={() => setShowGrant(true)}
                className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-brand hover:bg-brand/10 transition-colors"
              >
                <FilePlus className="size-3" />
                Add
              </button>
            </div>
            <ul className="bg-card border border-border rounded-xl overflow-hidden">
              {user.directGrants.map((p) => {
                const def = ALL_PERMISSIONS.find((x) => x.key === p);
                return (
                  <li key={p} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{def?.label ?? p}</p>
                      <code className="text-[10px] font-mono text-muted-foreground/60">{p}</code>
                    </div>
                    <button
                      onClick={() => toggleUserDirectGrant(user.id, p)}
                      className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-surface-overlay transition-colors"
                      aria-label="Revoke grant"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                );
              })}
              {user.directGrants.length === 0 && (
                <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No direct grants.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Effective permissions */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground inline-flex items-center gap-2">
              <Shield className="size-4 text-brand-purple" />
              Effective permissions ({eff.permissions.length})
            </h2>
            <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
              <RefreshCw className="size-3" />
              Recomputed on every change
            </p>
          </div>
          <p className="text-[12px] text-muted-foreground">
            Resolved as <strong>(roles + groups + direct grants)</strong>, then filtered by tenant entitlements.
          </p>

          {/* Grouped by module */}
          <div className="space-y-3">
            {["platform", ...MODULES.map((m) => m.key)].map((modKey) => {
              const perms = permsByModule[modKey];
              if (!perms || perms.length === 0) return null;
              const moduleLabel = modKey === "platform" ? "Platform" : MODULE_MAP[modKey as keyof typeof MODULE_MAP]?.label;
              return (
                <section key={modKey} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-surface-overlay/40 border-b border-border flex items-center justify-between">
                    <p className="text-[11px] font-semibold text-foreground">{moduleLabel}</p>
                    <span className="text-[10px] text-muted-foreground/70">{perms.length} permission{perms.length === 1 ? "" : "s"}</span>
                  </div>
                  <ul>
                    {perms.map((p) => {
                      const def = ALL_PERMISSIONS.find((x) => x.key === p);
                      const sources = eff.sources[p] ?? [];
                      return (
                        <li key={p} className="px-3 py-2 border-b border-border last:border-b-0">
                          <div className="flex items-start gap-2">
                            <Check className="size-3.5 text-success shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm text-foreground">{def?.label ?? p}</p>
                                <code className="text-[10px] font-mono text-muted-foreground/60">{p}</code>
                              </div>
                              <div className="flex items-center gap-1 flex-wrap mt-1">
                                {sources.map((s, i) => (
                                  <span
                                    key={i}
                                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${
                                      s.kind === "role"
                                        ? "bg-brand-teal/10 text-brand-teal"
                                        : s.kind === "group"
                                        ? "bg-brand/10 text-brand"
                                        : "bg-warning/10 text-warning"
                                    }`}
                                  >
                                    {s.kind === "role" && <Shield className="size-2.5" />}
                                    {s.kind === "group" && <UsersRound className="size-2.5" />}
                                    {s.kind === "direct" && <KeyRound className="size-2.5" />}
                                    {s.sourceLabel}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
            {eff.permissions.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-12">No effective permissions.</p>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showGrant && (
          <GrantPermissionModal
            existing={user.directGrants}
            onClose={() => setShowGrant(false)}
            onGrant={(perm) => {
              toggleUserDirectGrant(user.id, perm);
              setShowGrant(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GrantPermissionModal({
  existing,
  onClose,
  onGrant,
}: {
  existing: string[];
  onClose: () => void;
  onGrant: (perm: string) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = ALL_PERMISSIONS.filter((p) =>
    !existing.includes(p.key) &&
    (query === "" ||
      p.key.toLowerCase().includes(query.toLowerCase()) ||
      p.label.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg min-w-80 max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Add direct grant</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-border">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search permission key or label…"
            className="w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <ul className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map((p) => (
            <li key={p.key}>
              <button
                onClick={() => onGrant(p.key)}
                className="w-full flex items-start gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
              >
                <KeyRound className="size-3.5 text-warning mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-foreground">{p.label}</p>
                    <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{p.description}</p>
                </div>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-12 text-center text-[12px] text-muted-foreground italic">No matching permissions.</li>
          )}
        </ul>
      </motion.div>
    </motion.div>
  );
}
