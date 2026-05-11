"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Filter, Search } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  buildDirectory,
  EMPLOYEE_ROLES,
  SUB_TEAMS,
  type DirectoryEntry,
  type EmployeeRole,
  type SubTeam,
} from "@/components/leave/data";
import { EmployeeDirectoryTable } from "@/components/leave/employee-directory-table";

export default function EmployeesDirectoryPage() {
  const { setScreen } = useScreen();
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState<SubTeam | "all">("all");
  const [role, setRole] = useState<EmployeeRole | "all">("all");

  useEffect(() => {
    setScreen({ module: "Leave", page: "Employee Directory" });
    return () => setScreen(null);
  }, [setScreen]);

  const directory = useMemo<DirectoryEntry[]>(() => buildDirectory(), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return directory.filter((e) => {
      if (team !== "all" && e.member.subTeam !== team) return false;
      if (role !== "all" && e.member.role !== role) return false;
      if (q && !e.member.name.toLowerCase().includes(q) && !e.member.initials.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [directory, query, team, role]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/leave/hr"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, see balances at a glance. Click any row to open the leave profile.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-44 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name or initials…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <Filter className="size-3.5 text-muted-foreground" />
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value as SubTeam | "all")}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="all">All teams</option>
              {SUB_TEAMS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as EmployeeRole | "all")}
              className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="all">All roles</option>
              {EMPLOYEE_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground tabular-nums">
        {rows.length} of {directory.length} employees.
      </p>

      <EmployeeDirectoryTable rows={rows} />

      <p className="text-[11px] text-muted-foreground/60 text-center pt-2">
        Synthetic data — production wires per-country and per-tenure metadata.
      </p>
    </div>
  );
}
