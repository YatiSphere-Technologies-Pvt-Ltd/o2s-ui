"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Lock,
  Plus,
  RotateCcw,
  Search,
  Shield,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  PERMISSIONS,
  PERMISSION_GROUPS,
  type PermissionGroup,
  type PermissionKey,
  type RbacRole,
} from "@/components/leave/data";

const TONE_BADGE: Record<RbacRole["tone"], string> = {
  purple: "bg-brand-purple/10 text-brand-purple",
  teal:   "bg-brand-teal/10 text-brand-teal",
  blue:   "bg-brand/10 text-brand",
  amber:  "bg-warning/10 text-warning",
  gray:   "bg-secondary text-muted-foreground",
  red:    "bg-destructive/10 text-destructive",
  green:  "bg-success/10 text-success",
};

const TONE_DOT: Record<RbacRole["tone"], string> = {
  purple: "bg-brand-purple",
  teal:   "bg-brand-teal",
  blue:   "bg-brand",
  amber:  "bg-warning",
  gray:   "bg-muted-foreground/40",
  red:    "bg-destructive",
  green:  "bg-success",
};

export default function RolesAndPermissionsPage() {
  const { setScreen } = useScreen();
  const {
    roles,
    togglePermission,
    resetRolePermissions,
    createCustomRole,
    deleteRole,
  } = useLeaveStore();

  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<PermissionGroup | "all">("all");
  const [activeRoleId, setActiveRoleId] = useState<string>("hr_ops");
  const [showCreate, setShowCreate] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Roles & Permissions" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const filteredPerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PERMISSIONS.filter((p) => {
      if (activeGroup !== "all" && p.group !== activeGroup) return false;
      if (!q) return true;
      return (
        p.label.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.key.toLowerCase().includes(q)
      );
    });
  }, [query, activeGroup]);

  const activeRole = roles.find((r) => r.id === activeRoleId) ?? roles[0];
  const isSuperAdmin = activeRole.id === "super_admin";

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
            href="/leave/hr"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Roles &amp; Permissions</h1>
            <p className="text-sm text-muted-foreground">
              RBAC matrix for the Leave module. Built-ins ship locked; custom roles let you scope finance vendors, auditors, or regional admins.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          New custom role
        </button>
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

      {/* Layout: roles list on the left, matrix on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Roles list */}
        <div className="lg:col-span-3 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold px-1">
            Roles ({roles.length})
          </p>
          <ul className="space-y-1">
            {roles.map((r) => {
              const active = r.id === activeRole.id;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => setActiveRoleId(r.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      active ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`size-1.5 rounded-full ${TONE_DOT[r.tone]}`} />
                      <span className="text-sm font-medium text-foreground">{r.name}</span>
                      {r.builtIn && (
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70">built-in</span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{r.description}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground/70">
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-2.5" />
                        {r.userCount.toLocaleString("en-IN")}
                      </span>
                      <span>·</span>
                      <span>{r.permissions.length} perms</span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Matrix */}
        <div className="lg:col-span-9 space-y-3">
          {/* Role header card */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-start gap-3 min-w-0">
                <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${TONE_BADGE[activeRole.tone]}`}>
                  <Shield className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-foreground">{activeRole.name}</h2>
                    {activeRole.builtIn ? (
                      <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                        Built-in
                      </span>
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
                  <p className="text-sm text-muted-foreground mt-0.5">{activeRole.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!isSuperAdmin && (
                  <button
                    onClick={() => {
                      resetRolePermissions(activeRole.id);
                      flashOnce(`Reset ${activeRole.name} to defaults.`);
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors"
                  >
                    <RotateCcw className="size-3" />
                    Reset
                  </button>
                )}
                {!activeRole.builtIn && (
                  <button
                    onClick={() => {
                      const next = roles.find((r) => r.id !== activeRole.id);
                      deleteRole(activeRole.id);
                      if (next) setActiveRoleId(next.id);
                      flashOnce(`Deleted role ${activeRole.name}.`);
                    }}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-destructive/40 bg-destructive/10 text-xs text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash2 className="size-3" />
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground border-t border-border pt-3">
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-3" />
                {activeRole.userCount.toLocaleString("en-IN")} {activeRole.userCount === 1 ? "user" : "users"}
              </span>
              <span>·</span>
              <span>{activeRole.permissions.length} of {PERMISSIONS.length} permissions granted</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-44 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search permissions…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveGroup("all")}
                className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
                  activeGroup === "all" ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                All groups
              </button>
              {PERMISSION_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
                    activeGroup === g ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Permission rows */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {PERMISSION_GROUPS.map((group) => {
              const items = filteredPerms.filter((p) => p.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="border-b border-border last:border-b-0">
                  <div className="px-4 py-2 bg-surface-overlay/40 border-b border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{group}</p>
                  </div>
                  <ul>
                    {items.map((p) => {
                      const granted = activeRole.permissions.includes(p.key);
                      return (
                        <li
                          key={p.key}
                          className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm text-foreground">{p.label}</p>
                              <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">{p.description}</p>
                          </div>
                          <button
                            disabled={isSuperAdmin}
                            onClick={() => {
                              togglePermission(activeRole.id, p.key);
                              flashOnce(
                                `${granted ? "Revoked" : "Granted"} ${p.label} on ${activeRole.name}.`,
                              );
                            }}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                              granted ? "bg-brand" : "bg-secondary"
                            } ${isSuperAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                            aria-pressed={granted}
                            aria-label={`Toggle ${p.label}`}
                          >
                            <span
                              className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${
                                granted ? "left-5" : "left-0.5"
                              }`}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {filteredPerms.length === 0 && (
              <p className="px-4 py-10 text-sm text-muted-foreground italic text-center">
                No permissions match these filters.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Create custom role modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateRoleModal
            onClose={() => setShowCreate(false)}
            onCreate={(input) => {
              const created = createCustomRole(input);
              setShowCreate(false);
              setActiveRoleId(created.id);
              flashOnce(`Created custom role ${created.name}.`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateRoleModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (input: Omit<RbacRole, "id" | "builtIn" | "userCount">) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<RbacRole["tone"]>("blue");
  const [picked, setPicked] = useState<Set<PermissionKey>>(new Set());
  const [cloneFrom, setCloneFrom] = useState<string>("none");
  const { roles } = useLeaveStore();

  function applyClone(roleId: string) {
    if (roleId === "none") {
      setPicked(new Set());
      return;
    }
    const r = roles.find((x) => x.id === roleId);
    if (!r) return;
    setPicked(new Set(r.permissions));
  }

  const canSave = name.trim().length > 1 && picked.size > 0;

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
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl min-w-80 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">New custom role</h3>
            <p className="text-[11px] text-muted-foreground">Scope a permission mask for vendors, auditors, or regional admins.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. APAC Local HR"
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Tone</span>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as RbacRole["tone"])}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="blue">Blue</option>
                <option value="teal">Teal</option>
                <option value="purple">Purple</option>
                <option value="amber">Amber</option>
                <option value="green">Green</option>
                <option value="gray">Gray</option>
                <option value="red">Red</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="One sentence on what this role can do."
              className="mt-1 w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Clone permissions from</span>
            <select
              value={cloneFrom}
              onChange={(e) => {
                setCloneFrom(e.target.value);
                applyClone(e.target.value);
              }}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="none">Start from scratch</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.permissions.length} perms)
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
              Permissions ({picked.size} selected)
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              {PERMISSION_GROUPS.map((group) => {
                const items = PERMISSIONS.filter((p) => p.group === group);
                return (
                  <details key={group} className="border-b border-border last:border-b-0" open>
                    <summary className="px-3 py-2 bg-surface-overlay/40 cursor-pointer text-[11px] font-medium text-foreground">
                      {group}
                    </summary>
                    <ul>
                      {items.map((p) => {
                        const isOn = picked.has(p.key);
                        return (
                          <li key={p.key} className="px-3 py-1.5 border-t border-border first:border-t-0 flex items-center gap-2">
                            <button
                              onClick={() =>
                                setPicked((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(p.key)) next.delete(p.key);
                                  else next.add(p.key);
                                  return next;
                                })
                              }
                              className={`size-4 rounded border flex items-center justify-center transition-colors ${
                                isOn ? "bg-brand border-brand" : "border-border bg-card"
                              }`}
                              aria-label={`Toggle ${p.label}`}
                            >
                              {isOn && <Check className="size-2.5 text-brand-foreground" />}
                            </button>
                            <span className="text-[12px] text-foreground">{p.label}</span>
                            <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() =>
              onCreate({
                name: name.trim(),
                description: description.trim() || "Custom role.",
                tone,
                permissions: Array.from(picked),
              })
            }
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus className="size-3.5" />
            Create role
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
