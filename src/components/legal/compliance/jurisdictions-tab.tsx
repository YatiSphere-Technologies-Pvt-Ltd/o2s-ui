"use client";

import { motion } from "framer-motion";
import {
  JURISDICTION_PROFILES,
  FILINGS,
  FILING_STATUS_CONFIG,
  type JurisdictionProfile,
} from "@/components/legal/compliance/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function scoreColor(score: number): string {
  if (score >= 90) return "bg-success/10 text-success";
  if (score >= 70) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
}

function regStatusColor(
  status: "active" | "expired" | "pending"
): string {
  if (status === "active") return "bg-success/10 text-success";
  if (status === "expired") return "bg-destructive/10 text-destructive";
  return "bg-warning/10 text-warning";
}

function EntityCard({ profile }: { profile: JurisdictionProfile }) {
  const entityFilings = FILINGS.filter(
    (f) => f.entityId === profile.entityId
  );

  return (
    <motion.div
      {...fadeIn}
      className={`bg-card border-l-[4px] ${profile.colorClass} border border-border rounded-xl p-5 space-y-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold text-foreground">
            {profile.entityName}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {profile.jurisdiction}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Compliance Officer: {profile.complianceOfficer}
          </div>
        </div>
        <div
          className={`inline-flex items-center justify-center rounded-xl px-3 py-1.5 text-lg font-bold ${scoreColor(profile.score)}`}
        >
          {profile.score}%
        </div>
      </div>

      {/* Filing summary */}
      {entityFilings.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Filings
          </div>
          <div className="bg-secondary/30 rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">
                    Filing Name
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">
                    Due Date
                  </th>
                  <th className="px-3 py-2 text-left text-[10px] font-medium text-muted-foreground">
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody>
                {entityFilings.map((f) => {
                  const cfg = FILING_STATUS_CONFIG[f.status];
                  return (
                    <tr
                      key={f.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-3 py-2">
                        <span className="font-medium">{f.filingName}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`size-1.5 rounded-full ${cfg.dotClass}`}
                          />
                          <span className={cfg.textClass}>{cfg.label}</span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {f.dueDate}
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {f.assignedTo}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Registrations */}
      {profile.registrations.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Registrations
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.registrations.map((reg, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2 text-xs"
              >
                <div>
                  <div className="font-medium text-foreground">{reg.type}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {reg.number}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${regStatusColor(reg.status)}`}
                >
                  {reg.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function JurisdictionsTab() {
  return (
    <motion.div {...fadeIn} className="space-y-6">
      {JURISDICTION_PROFILES.map((p) => (
        <EntityCard key={p.entityId} profile={p} />
      ))}
    </motion.div>
  );
}
