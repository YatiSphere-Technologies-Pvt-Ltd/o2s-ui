"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Plus,
  Search,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import { ALL_PERMISSIONS, type UserGroup } from "@/components/admin/data";

export default function GroupsPage() {
  const { setScreen } = useScreen();
  const { groups, createGroup, users } = useAdminStore();
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Groups" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
  }, [groups, query]);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Groups</h1>
            <p className="text-sm text-muted-foreground">
              Permission collections you can attach to many users at once (e.g. APAC Engineering, On-call rota).
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="size-3.5" />
          New group
        </button>
      </motion.div>

      <div className="relative flex-1 min-w-44 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groups…"
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filtered.map((g) => (
          <li key={g.id}>
            <Link
              href={`/admin/groups/${g.id}`}
              className="block bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <UsersRound className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{g.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2 mt-0.5">{g.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <Users className="size-3" />
                      {g.memberIds.length} member{g.memberIds.length === 1 ? "" : "s"}
                    </span>
                    <span>·</span>
                    <span>{g.permissions.length} permission{g.permissions.length === 1 ? "" : "s"}</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
              </div>
            </Link>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-full text-sm text-muted-foreground italic text-center py-12">No groups match these filters.</li>
        )}
      </ul>

      <AnimatePresence>
        {showCreate && (
          <CreateGroupModal
            users={users}
            onClose={() => setShowCreate(false)}
            onCreate={(input) => {
              createGroup(input);
              setShowCreate(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateGroupModal({
  users,
  onClose,
  onCreate,
}: {
  users: ReturnType<typeof useAdminStore>["users"];
  onClose: () => void;
  onCreate: (input: Omit<UserGroup, "id">) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pickedMembers, setPickedMembers] = useState<Set<string>>(new Set());
  const [pickedPerms, setPickedPerms] = useState<Set<string>>(new Set());

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
          <h3 className="text-base font-semibold text-foreground">New group</h3>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. APAC Engineering"
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full px-2.5 py-2 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
            />
          </label>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Members ({pickedMembers.size})</p>
            <div className="border border-border rounded-lg max-h-44 overflow-y-auto scrollbar-thin">
              {users.map((u) => {
                const on = pickedMembers.has(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() =>
                      setPickedMembers((prev) => {
                        const n = new Set(prev);
                        if (n.has(u.id)) n.delete(u.id);
                        else n.add(u.id);
                        return n;
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
                  >
                    <span className={`size-4 rounded border flex items-center justify-center shrink-0 ${on ? "bg-brand border-brand" : "border-border"}`}>
                      {on && <Check className="size-2.5 text-brand-foreground" />}
                    </span>
                    <span className={`size-6 rounded-full ${u.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                      {u.initials}
                    </span>
                    <span className="text-[12px] text-foreground">{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Permissions ({pickedPerms.size})</p>
            <div className="border border-border rounded-lg max-h-60 overflow-y-auto scrollbar-thin">
              {ALL_PERMISSIONS.map((p) => {
                const on = pickedPerms.has(p.key);
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() =>
                      setPickedPerms((prev) => {
                        const n = new Set(prev);
                        if (n.has(p.key)) n.delete(p.key);
                        else n.add(p.key);
                        return n;
                      })
                    }
                    className="w-full flex items-center gap-2 px-3 py-1.5 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
                  >
                    <span className={`size-4 rounded border flex items-center justify-center shrink-0 ${on ? "bg-brand border-brand" : "border-border"}`}>
                      {on && <Check className="size-2.5 text-brand-foreground" />}
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
            disabled={!name.trim()}
            onClick={() =>
              onCreate({
                name: name.trim(),
                description: description.trim() || "Custom group.",
                iconName: "Users",
                memberIds: Array.from(pickedMembers),
                permissions: Array.from(pickedPerms),
              })
            }
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          >
            <Plus className="size-3.5" />
            Create
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
