"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Filter as FilterIcon,
  KeyRound,
  Lock,
  Plus,
  Search,
  ShieldCheck,
  ShieldOff,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import type { AdminUser, UserStatus } from "@/components/admin/data";

const STATUS_TINT: Record<UserStatus, { tint: string; label: string }> = {
  active:     { tint: "bg-success/10 text-success",         label: "Active" },
  invited:    { tint: "bg-warning/10 text-warning",         label: "Invited" },
  suspended:  { tint: "bg-destructive/10 text-destructive", label: "Suspended" },
  offboarded: { tint: "bg-secondary text-muted-foreground", label: "Offboarded" },
};

export default function UsersPage() {
  const { setScreen } = useScreen();
  const { users, roles, inviteUser } = useAdminStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<UserStatus | "all">("all");
  const [showInvite, setShowInvite] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Users" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (status !== "all" && u.status !== status) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.jobTitle.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    });
  }, [users, status, query]);

  const counts = useMemo(() => {
    return {
      all: users.length,
      active: users.filter((u) => u.status === "active").length,
      invited: users.filter((u) => u.status === "invited").length,
      suspended: users.filter((u) => u.status === "suspended").length,
      offboarded: users.filter((u) => u.status === "offboarded").length,
    };
  }, [users]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage tenant users. Click any user to see their effective permission resolver.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          Invite user
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

      {/* Status pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {(["all", "active", "invited", "suspended", "offboarded"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`text-left p-3 rounded-lg border transition-colors ${
              status === s ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              {s === "all" ? "All" : STATUS_TINT[s as UserStatus].label}
            </p>
            <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{counts[s]}</p>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, title, department…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <FilterIcon className="size-3.5 text-muted-foreground" />
        <span className="text-[11px] text-muted-foreground">{filtered.length} matching</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2.5 font-semibold">User</th>
              <th className="text-left px-3 py-2.5 font-semibold">Roles</th>
              <th className="text-center px-3 py-2.5 font-semibold">MFA</th>
              <th className="text-center px-3 py-2.5 font-semibold">SSO</th>
              <th className="text-left px-3 py-2.5 font-semibold">Status</th>
              <th className="text-right px-4 py-2.5 font-semibold">Last active</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => {
              const userRoles = roles.filter((r) => u.roleIds.includes(r.id));
              return (
                <tr key={u.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3 group">
                      <span className={`size-8 rounded-full ${u.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                        {u.initials}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:underline">{u.name}</p>
                        <p className="text-[11px] text-muted-foreground">{u.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1 flex-wrap max-w-50">
                      {userRoles.slice(0, 2).map((r) => (
                        <span key={r.id} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-foreground">
                          {r.name}
                        </span>
                      ))}
                      {userRoles.length > 2 && (
                        <span className="text-[10px] text-muted-foreground/70">+{userRoles.length - 2}</span>
                      )}
                      {u.directGrants.length > 0 && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-warning/10 text-warning inline-flex items-center gap-1">
                          <KeyRound className="size-2.5" />
                          +{u.directGrants.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    {u.mfaEnabled ? (
                      <ShieldCheck className="size-4 text-success inline" />
                    ) : (
                      <ShieldOff className="size-4 text-muted-foreground/40 inline" />
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {u.ssoLinked ? (
                      <Lock className="size-4 text-brand inline" />
                    ) : (
                      <X className="size-4 text-muted-foreground/40 inline" />
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${STATUS_TINT[u.status].tint}`}>
                      {STATUS_TINT[u.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] text-muted-foreground tabular-nums">
                    {relativeTime(u.lastActiveISO)}
                    <Link
                      href={`/admin/users/${u.id}`}
                      className="ml-2 inline-flex"
                      aria-label="Open"
                    >
                      <ChevronRight className="size-3.5 text-muted-foreground/40" />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground italic">
                  No users match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showInvite && (
          <InviteUserModal
            onClose={() => setShowInvite(false)}
            onInvite={(input) => {
              const u = inviteUser(input);
              setShowInvite(false);
              flashOnce(`Invited ${u.name}.`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function InviteUserModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (input: Omit<AdminUser, "id" | "status" | "lastActiveISO" | "joinedISO" | "mfaEnabled" | "ssoLinked">) => void;
}) {
  const { roles } = useAdminStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [country, setCountry] = useState("IN");
  const [pickedRoles, setPickedRoles] = useState<Set<string>>(new Set(["employee"]));

  const canSave = name.trim() && email.includes("@");

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
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg min-w-80 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Invite user</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Job title</span>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Department</span>
              <input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Country</span>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option>IN</option>
                <option>UK</option>
                <option>US</option>
                <option>DE</option>
                <option>SG</option>
              </select>
            </label>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Starting roles</p>
            <div className="border border-border rounded-lg max-h-60 overflow-y-auto scrollbar-thin">
              {roles.map((r) => {
                const on = pickedRoles.has(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      setPickedRoles((prev) => {
                        const next = new Set(prev);
                        if (next.has(r.id)) next.delete(r.id);
                        else next.add(r.id);
                        return next;
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
                  >
                    <span className={`size-4 rounded border flex items-center justify-center shrink-0 ${on ? "bg-brand border-brand" : "border-border"}`}>
                      {on && <Check className="size-2.5 text-brand-foreground" />}
                    </span>
                    <span className="text-[12px] text-foreground">{r.name}</span>
                    <span className="text-[10px] text-muted-foreground/70 ml-auto">{r.permissions.length} perms</span>
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
            onClick={() => {
              const initials = name.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
              onInvite({
                name: name.trim(),
                email: email.trim(),
                initials,
                avatarColor: "bg-brand",
                jobTitle: jobTitle.trim() || "—",
                department: department.trim() || "—",
                country,
                roleIds: Array.from(pickedRoles),
                directGrants: [],
              });
            }}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus className="size-3.5" />
            Send invite
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const min = Math.round((now - then) / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (min < 60 * 24) return `${Math.round(min / 60)}h ago`;
  return `${Math.round(min / (60 * 24))}d ago`;
}
