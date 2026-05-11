"use client";

import Link from "next/link";
import { Info } from "lucide-react";
import type { BradfordEntry } from "@/components/leave/data";

const BAND_META: Record<BradfordEntry["band"], { label: string; tint: string; color: string }> = {
  green: { label: "Green",  tint: "bg-success/10",     color: "text-success" },
  amber: { label: "Amber",  tint: "bg-warning/10",     color: "text-warning" },
  red:   { label: "Red",    tint: "bg-destructive/10", color: "text-destructive" },
};

export function BradfordFactorTable({ entries }: { entries: BradfordEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground">Bradford Factor</h3>
          <span className="text-[11px] text-muted-foreground">last 12 months</span>
        </div>
        <p className="text-[11px] text-muted-foreground flex items-start gap-1.5">
          <Info className="size-3 mt-0.5 shrink-0" />
          <span>
            Score = spells² × total days of unplanned absence. Frequency hurts more than duration.
            Bands: Green ≤ 50 · Amber 51–199 · Red ≥ 200.
          </span>
        </p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-overlay/30">
              <Th>Employee</Th>
              <Th align="right">Spells</Th>
              <Th align="right">Days</Th>
              <Th align="right">Score</Th>
              <Th align="right">Band</Th>
              <Th>Notes</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => {
              const band = BAND_META[e.band];
              return (
                <tr key={e.employeeId} className="border-b border-border last:border-0 hover:bg-surface-overlay/30">
                  <td className="py-2.5 px-4">
                    <Link
                      href={`/leave/manager/report/${e.employeeId}`}
                      className="inline-flex items-center gap-2"
                    >
                      <span className={`size-7 rounded-full ${e.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                        {e.initials}
                      </span>
                      <span className="text-xs text-foreground hover:text-brand transition-colors">{e.employeeName}</span>
                    </Link>
                  </td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{e.spells}</td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{e.totalDays}</td>
                  <td className={`py-2.5 px-4 text-right text-xs font-medium tabular-nums ${band.color}`}>
                    {e.score}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${band.tint} ${band.color}`}>
                      {band.label}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[11px] text-muted-foreground leading-snug">{e.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th className={`text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold py-2 px-4 ${align === "right" ? "text-right" : "text-left"}`}>
      {children}
    </th>
  );
}
