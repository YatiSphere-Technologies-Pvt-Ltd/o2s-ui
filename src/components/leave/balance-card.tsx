"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CalendarPlus } from "lucide-react";
import { LEAVE_TYPE_MAP, type LeaveBalance } from "@/components/leave/data";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function BalanceCard({ b }: { b: LeaveBalance }) {
  const type = LEAVE_TYPE_MAP[b.type];
  const used = b.used;
  const pending = b.pending;
  const total = b.annualAllotment;
  const usedPct = total === 0 ? 0 : Math.min(100, (used / total) * 100);
  const pendingPct = total === 0 ? 0 : Math.min(100, (pending / total) * 100);

  // Stroke math for SVG circular progress
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const usedStroke = (usedPct / 100) * circumference;
  const pendingStroke = (pendingPct / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${type.color}`}>
            {type.shortLabel}
          </p>
          <p className="text-sm font-medium text-foreground mt-0.5 truncate">{type.label}</p>
        </div>

        {/* Circular progress */}
        <div className="relative size-16 shrink-0">
          <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={radius} className="stroke-secondary" strokeWidth="6" fill="none" />
            {pendingPct > 0 && (
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-warning"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${pendingStroke} ${circumference}`}
                strokeDashoffset={-usedStroke}
              />
            )}
            <circle
              cx="32"
              cy="32"
              r={radius}
              className={type.color}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${usedStroke} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-base font-bold text-foreground leading-none">{b.balance}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">left</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          <span className="text-foreground font-medium">{used}</span> used
        </span>
        {pending > 0 ? (
          <span className="text-warning">
            <span className="font-medium">{pending}</span> pending
          </span>
        ) : (
          <span>of {total}</span>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground/70 leading-snug border-t border-border pt-2.5">
        {type.accrualRule}
      </p>

      <div className="flex flex-col gap-1 text-[10px]">
        {b.nextAccrualOn && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <CalendarPlus className="size-3 shrink-0" />
            Next accrual on {formatDate(b.nextAccrualOn)}
          </span>
        )}
        {b.expiringDays && b.expiringDays > 0 ? (
          <span className="flex items-center gap-1 text-destructive">
            <AlertTriangle className="size-3 shrink-0" />
            {b.expiringDays} day{b.expiringDays > 1 ? "s" : ""} expiring Dec 31
          </span>
        ) : null}
      </div>
    </motion.div>
  );
}
