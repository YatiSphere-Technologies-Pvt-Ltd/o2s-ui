"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Lock,
  Plus,
  Search,
  Shield,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import {
  ALL_PERMISSIONS,
  MODULE_MAP,
  type AdminRole,
} from "@/components/admin/data";

const TONE_DOT: Record<AdminRole["tone"], string> = {
  purple: "bg-brand-purple",
  teal:   "bg-brand-teal",
  blue:   "bg-brand",
  amber:  "bg-warning",
  gray:   "bg-muted-foreground/40",
  red:    "bg-destructive",
  green:  "bg-success",
};

export default function RolesPage() {
  const { setScreen } = useScreen();
  const { roles, createRole } = useAdminStore();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<"all" | "tenant" | "module" | "team">("all");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Roles" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((r) => {
      if (scope !== "all" && r.scope !== scope) return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    });
  }, [roles, query, scope]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Roles</h1>
            <p className="text-sm text-muted-foreground">
              Built-in + custom roles, scoped tenant-wide, module-wide, or to specific teams.
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {(["all", "tenant", "module", "team"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
                scope === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? "All scopes" : `${s.charAt(0).toUpperCase()}${s.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map((r) => (
          <li key={r.id}>
            <Link
              href={`/admin/roles/${r.id}`}
              className="block bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Shield className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`size-1.5 rounded-full ${TONE_DOT[r.tone]}`} />
                    <p className="text-sm font-semibold text-foreground">{r.name}</p>
                    {r.builtIn ? (
                      <span className="text-[9px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">
                        Built-in
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase tracking-wider bg-brand-purple/10 text-brand-purple px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                        <Sparkles className="size-2.5" />
                        Custom
                      </span>
                    )}
                    {r.id === "super_admin" && (
                      <span className="text-[9px] uppercase tracking-wider text-destructive inline-flex items-center gap-1">
                        <Lock className="size-2.5" />
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">{r.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground/70">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3" />
                      {r.userCount.toLocaleString("en-IN")}
                    </span>
                    <span>·</span>
                    <span>{r.permissions.length} permissions</span>
                    <span>·</span>
                    <span>
                      {r.scope === "module" && r.module
                        ? `Module: ${MODULE_MAP[r.module]?.label ?? r.module}`
                        : r.scope === "team"
                        ? "Team-scoped"
                        : "Tenant-wide"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full text-sm text-muted-foreground italic text-center py-12">
            No roles match these filters.
          </li>
        )}
      </ul>

      <AnimatePresence>
        {showCreate && (
          <CreateRoleModal
            onClose={() => setShowCreate(false)}
            onCreate={(input) => {
              createRole(input);
              setShowCreate(false);
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
  onCreate: (input: Omit<AdminRole, "id" | "builtIn" | "userCount">) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState<AdminRole["tone"]>("blue");
  const [scope, setScope] = useState<AdminRole["scope"]>("tenant");
  const [perms, setPerms] = useState<Set<string>>(new Set());

  const canSave = name.trim().length > 1 && perms.size > 0;

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
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl min-w-80 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">New custom role</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. APAC Local Admin"
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Scope</span>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as AdminRole["scope"])}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="tenant">Tenant-wide</option>
                <option value="module">Module-scoped</option>
                <option value="team">Team-scoped</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Tone</span>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as AdminRole["tone"])}
              className="mt-1 w-full sm:max-w-40 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="One line on what this role can do."
              className="mt-1 w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
            />
          </label>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
              Permissions ({perms.size} selected)
            </p>
            <div className="border border-border rounded-lg max-h-72 overflow-y-auto scrollbar-thin">
              {ALL_PERMISSIONS.map((p) => {
                const on = perms.has(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() =>
                      setPerms((prev) => {
                        const next = new Set(prev);
                        if (next.has(p.key)) next.delete(p.key);
                        else next.add(p.key);
                        return next;
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
                  >
                    <span className={`size-4 rounded border flex items-center justify-center shrink-0 ${on ? "bg-brand border-brand" : "border-border"}`}>
                      {on && <span className="size-1.5 rounded-sm bg-brand-foreground" />}
                    </span>
                    <span className="text-[12px] text-foreground">{p.label}</span>
                    <code className="text-[10px] font-mono text-muted-foreground/60 ml-auto">{p.key}</code>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => onCreate({ name: name.trim(), description: description.trim() || "Custom role.", tone, scope, permissions: Array.from(perms) })}
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
