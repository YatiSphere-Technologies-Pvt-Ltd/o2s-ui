"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Search,
  Trash2,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import { ALL_PERMISSIONS } from "@/components/admin/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GroupDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { setScreen } = useScreen();
  const { findGroup, users, toggleGroupMember, updateGroup, deleteGroup } = useAdminStore();
  const [memberQuery, setMemberQuery] = useState("");
  const [permQuery, setPermQuery] = useState("");
  const [nameDraft, setNameDraft] = useState<string | null>(null);

  const group = findGroup(id);
  const groupName = group?.name;

  useEffect(() => {
    if (!groupName) return;
    setScreen({ module: "Admin", page: "Group detail", recordId: id, recordLabel: groupName });
    return () => setScreen(null);
  }, [id, groupName, setScreen]);

  const members = useMemo(
    () => (group ? users.filter((u) => group.memberIds.includes(u.id)) : []),
    [users, group],
  );

  const nonMembers = useMemo(() => {
    const q = memberQuery.trim().toLowerCase();
    if (!group) return [];
    return users
      .filter((u) => !group.memberIds.includes(u.id))
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, group, memberQuery]);

  const filteredPerms = useMemo(() => {
    const q = permQuery.trim().toLowerCase();
    return ALL_PERMISSIONS.filter((p) => !q || p.key.toLowerCase().includes(q) || p.label.toLowerCase().includes(q));
  }, [permQuery]);

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Group not found</h1>
        <Link href="/admin/groups" className="text-brand underline mt-3 inline-block">Back to groups</Link>
      </div>
    );
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
            href="/admin/groups"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <UsersRound className="size-5 text-muted-foreground" />
            </div>
            <div>
              {nameDraft === null ? (
                <button
                  onClick={() => setNameDraft(group.name)}
                  className="text-left"
                >
                  <h1 className="text-2xl font-bold text-foreground tracking-tight hover:underline">{group.name}</h1>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="h-9 px-2.5 rounded-lg border border-input bg-card text-base font-semibold text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                  <button
                    onClick={() => {
                      if (nameDraft && nameDraft.trim()) updateGroup(group.id, { name: nameDraft.trim() });
                      setNameDraft(null);
                    }}
                    className="p-1.5 rounded text-success hover:bg-success/10 transition-colors"
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    onClick={() => setNameDraft(null)}
                    className="p-1.5 rounded text-muted-foreground hover:bg-surface-overlay transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              <p className="text-sm text-muted-foreground">{group.description}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mt-1.5">
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3" />
                  {members.length} member{members.length === 1 ? "" : "s"}
                </span>
                <span>·</span>
                <span>{group.permissions.length} permission{group.permissions.length === 1 ? "" : "s"}</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            deleteGroup(group.id);
            router.push("/admin/groups");
          }}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-destructive/40 bg-destructive/10 text-sm text-destructive hover:bg-destructive/20 transition-colors"
        >
          <Trash2 className="size-3.5" />
          Delete group
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Members ({members.length})</h2>
          <ul className="bg-card border border-border rounded-xl overflow-hidden">
            {members.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-3 py-2 border-b border-border last:border-b-0">
                <span className={`size-7 rounded-full ${u.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                  {u.initials}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/users/${u.id}`} className="text-sm text-foreground hover:underline">{u.name}</Link>
                  <p className="text-[11px] text-muted-foreground">{u.jobTitle}</p>
                </div>
                <button
                  onClick={() => toggleGroupMember(group.id, u.id)}
                  className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-surface-overlay transition-colors"
                  aria-label="Remove member"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
            {members.length === 0 && (
              <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No members.</li>
            )}
          </ul>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Add members</p>
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                placeholder="Search users…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
            <ul className="bg-card border border-border rounded-xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin">
              {nonMembers.map((u) => (
                <li key={u.id}>
                  <button
                    onClick={() => toggleGroupMember(group.id, u.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors text-left"
                  >
                    <span className={`size-6 rounded-full ${u.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                      {u.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{u.name}</p>
                      <p className="text-[10px] text-muted-foreground">{u.jobTitle}</p>
                    </div>
                    <span className="text-[10px] text-brand">Add</span>
                  </button>
                </li>
              ))}
              {nonMembers.length === 0 && (
                <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No matching users.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Permissions */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">Permissions ({group.permissions.length})</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              value={permQuery}
              onChange={(e) => setPermQuery(e.target.value)}
              placeholder="Search permissions…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <ul className="bg-card border border-border rounded-xl overflow-hidden max-h-screen overflow-y-auto scrollbar-thin">
            {filteredPerms.map((p) => {
              const on = group.permissions.includes(p.key);
              return (
                <li key={p.key} className="flex items-center gap-2 px-3 py-2 border-b border-border last:border-b-0">
                  <button
                    onClick={() =>
                      updateGroup(group.id, {
                        permissions: on
                          ? group.permissions.filter((x) => x !== p.key)
                          : [...group.permissions, p.key],
                      })
                    }
                    className={`size-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      on ? "bg-brand border-brand" : "border-border"
                    }`}
                  >
                    {on && <Check className="size-2.5 text-brand-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm text-foreground">{p.label}</p>
                      <code className="text-[10px] font-mono text-muted-foreground/60">{p.key}</code>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
