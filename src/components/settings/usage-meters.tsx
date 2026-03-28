"use client";

import { motion } from "framer-motion";
import {
  Users,
  Zap,
  HardDrive,
  Code,
  TrendingUp,
} from "lucide-react";
import {
  USAGE_METERS,
  usageColor,
  usageTextColor,
} from "@/components/settings/data";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const METER_ICONS: Record<string, LucideIcon> = {
  Users,
  Zap,
  HardDrive,
  Code,
};

const ICON_TINTS: Record<string, string> = {
  Users: "bg-brand/10 text-brand",
  Zap: "bg-warning/10 text-warning",
  HardDrive: "bg-brand-teal/10 text-brand-teal",
  Code: "bg-brand-purple/10 text-brand-purple",
};

export function UsageMetersRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {USAGE_METERS.map((meter) => {
        const Icon = METER_ICONS[meter.icon];
        const tint = ICON_TINTS[meter.icon] ?? "bg-brand/10 text-brand";

        return (
          <div
            key={meter.id}
            className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3"
          >
            {/* Icon + label */}
            <div className="flex items-center gap-2.5">
              <div
                className={`flex items-center justify-center size-8 rounded-md ${tint}`}
              >
                {Icon && <Icon className="size-4" />}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {meter.label}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">
                {typeof meter.current === "number" && meter.current >= 1000
                  ? meter.current.toLocaleString()
                  : meter.current}
              </span>
              <span className="text-sm text-muted-foreground">
                /{" "}
                {typeof meter.limit === "number" && meter.limit >= 1000
                  ? meter.limit.toLocaleString()
                  : meter.limit}
              </span>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${usageColor(meter.percentage)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${meter.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1] as const,
                  }}
                />
              </div>
              <span
                className={`text-xs font-medium ${usageTextColor(meter.percentage)}`}
              >
                {meter.percentage}%
              </span>
            </div>

            {/* Trend */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3" />
              <span>{meter.trend.label}</span>
            </div>

            {/* Subtext */}
            <p className="text-xs text-muted-foreground">{meter.subtext}</p>

            {/* Action */}
            <Button
              variant="ghost"
              className="text-xs text-brand h-auto p-0 justify-start"
            >
              {meter.actionLabel}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
