"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TALENT_POOLS } from "@/components/talent-pool/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function PoolsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {TALENT_POOLS.map((pool, i) => (
        <motion.div
          key={pool.id}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all flex flex-col gap-3"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{pool.name}</span>
              <span
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  pool.type === "smart"
                    ? "bg-brand-purple/10 text-brand-purple"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {pool.type === "smart" ? "Smart Pool" : "Manual"}
              </span>
            </div>
            {pool.isPublic && (
              <span className="inline-flex items-center gap-1 text-[10px] text-success">
                <Globe className="size-3" />
                Public
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <span>Owner: {pool.owner}</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="size-3" />
                {pool.candidateCount} candidates
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="size-3" />
                {pool.activeRoles} active roles
              </span>
            </div>
            <span>Updated {pool.lastUpdated}</span>
          </div>

          {/* Smart Rules */}
          {pool.type === "smart" && pool.smartRules && (
            <p className="text-xs italic text-muted-foreground/60">
              Rules: {pool.smartRules}
            </p>
          )}

          {/* Engagement Metrics */}
          <div className="flex items-center gap-4 rounded-lg bg-secondary/50 px-3 py-2">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-foreground">{pool.contacted}</span>
              <span className="text-[10px] text-muted-foreground">Contacted</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-foreground">{pool.responseRate}%</span>
              <span className="text-[10px] text-muted-foreground">Response</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-foreground">{pool.converted}</span>
              <span className="text-[10px] text-muted-foreground">Converted</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1">
              View Pool
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground">
              Edit
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
