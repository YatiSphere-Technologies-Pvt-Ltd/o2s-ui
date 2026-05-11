"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  HR_COUNTRIES,
  LEAVE_TYPE_MAP,
  type DirectoryEntry,
  type LeaveTypeKey,
} from "@/components/leave/data";

const BALANCE_COLUMNS: LeaveTypeKey[] = ["privileged", "sick", "casual", "wfa"];

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

export function EmployeeDirectoryTable({ rows }: { rows: DirectoryEntry[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <Th>Employee</Th>
              <Th>Country</Th>
              <Th>Team / Role</Th>
              {BALANCE_COLUMNS.map((t) => (
                <Th key={t} align="right">{LEAVE_TYPE_MAP[t].shortLabel}</Th>
              ))}
              <Th align="right">YTD</Th>
              <Th>Recent activity</Th>
              <Th className="w-10 text-right">&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-16 text-sm text-muted-foreground">
                  No employees match.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const { member, balances, ytdUsed, lastActivityLabel, country } = row;
                return (
                  <tr key={member.id} className="border-b border-border last:border-0 hover:bg-surface-overlay/30 transition-colors">
                    <td className="py-2.5 px-4">
                      <Link href={`/leave/manager/report/${member.id}`} className="inline-flex items-center gap-2.5">
                        <div className={`size-7 rounded-full ${member.avatarColor} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                          {member.initials}
                        </div>
                        <span className="text-xs font-medium text-foreground hover:text-brand transition-colors">{member.name}</span>
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="text-base leading-none">{flagFor(country)}</span>
                        {country}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-xs text-foreground">
                      <p className="font-medium">{member.subTeam}</p>
                      <p className="text-[10px] text-muted-foreground">{member.role}</p>
                    </td>
                    {BALANCE_COLUMNS.map((t) => {
                      const b = balances.byType.find((x) => x.type === t);
                      const value = b?.balance ?? 0;
                      const annualAllotment = b?.annualAllotment ?? 0;
                      const low = annualAllotment > 0 && value <= annualAllotment * 0.2;
                      return (
                        <td key={t} className="py-2.5 px-4 text-right text-xs tabular-nums">
                          <span className={low ? "text-destructive" : "text-foreground"}>{value}</span>
                          <span className="text-[10px] text-muted-foreground ml-0.5">/{annualAllotment}</span>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{ytdUsed}</td>
                    <td className="py-2.5 px-4 text-[11px] text-muted-foreground">{lastActivityLabel}</td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/leave/manager/report/${member.id}`}
                        className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors inline-flex"
                        aria-label="Open profile"
                        title="Open profile"
                      >
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className, align }: { children: React.ReactNode; className?: string; align?: "right" }) {
  return (
    <th
      className={`text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold py-2 px-4 whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      } ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
