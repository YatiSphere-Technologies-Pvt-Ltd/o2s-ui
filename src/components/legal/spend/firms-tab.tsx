"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Table2, MapPin, Star, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FIRMS,
  TIER_CONFIG,
  FIRM_STATUS_CONFIG,
  ratingStars,
  type LawFirm,
} from "@/components/legal/spend/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function FirmCard({ firm }: { firm: LawFirm }) {
  const tier = TIER_CONFIG[firm.tier];
  const status = FIRM_STATUS_CONFIG[firm.status];

  return (
    <div
      className={`bg-card border-l-[4px] ${tier.borderClass} border border-border rounded-xl p-5 space-y-3`}
    >
      {/* Name + Tier + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {firm.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${tier.colorClass} ${tier.bgClass}`}
            >
              {tier.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span className={`size-1.5 rounded-full ${status.dotClass}`} />
              {status.label}
            </span>
          </div>
        </div>
      </div>

      {/* Practice Areas */}
      <div className="flex flex-wrap gap-1">
        {firm.practiceAreas.map((area) => (
          <span
            key={area}
            className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md"
          >
            {area}
          </span>
        ))}
      </div>

      {/* HQ + Offices */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="size-3" />
        <span>{firm.headquarters}</span>
        <span className="text-border">|</span>
        <span>{firm.offices.length} offices</span>
      </div>

      {/* Primary Contact */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="size-3" />
        <span>
          {firm.primaryContact.name} — {firm.primaryContact.title}
        </span>
      </div>

      {/* Performance */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs">
          <Star className="size-3 text-warning" />
          <span className="text-warning font-mono text-[11px]">
            {ratingStars(firm.performanceRating)}
          </span>
          <span className="text-muted-foreground">
            ({firm.performanceRating})
          </span>
        </div>
      </div>

      {/* Spend + Engagements */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div>
          <div className="text-[10px] text-muted-foreground">YTD Spend</div>
          <div className="font-mono font-semibold text-sm text-foreground">
            {firm.ytdSpend}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground">Active</div>
          <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
            <Briefcase className="size-3 text-muted-foreground" />
            {firm.activeEngagements}
          </div>
        </div>
      </div>

      {/* Discount */}
      {firm.negotiatedDiscount > 0 && (
        <span className="inline-block text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-md">
          {firm.negotiatedDiscount}% off
        </span>
      )}

      {/* Rate Card */}
      <div className="space-y-1">
        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          Rate Card
        </div>
        {firm.rateCardSummary.slice(0, 3).map((rc) => (
          <div
            key={rc.role}
            className="flex items-center justify-between text-xs text-muted-foreground"
          >
            <span>{rc.role}</span>
            <span className="font-mono text-foreground">
              {rc.negotiatedRate}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-border">
        <Button variant="outline" size="xs">
          View Details
        </Button>
        <Button variant="ghost" size="xs">
          New Engagement
        </Button>
      </div>
    </div>
  );
}

function FirmTableRow({ firm }: { firm: LawFirm }) {
  const tier = TIER_CONFIG[firm.tier];
  const status = FIRM_STATUS_CONFIG[firm.status];

  return (
    <tr className="border-b border-border hover:bg-secondary/40 transition-colors">
      <td className="px-3 py-3 text-sm font-semibold text-foreground whitespace-nowrap">
        {firm.name}
      </td>
      <td className="px-3 py-3">
        <span
          className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${tier.colorClass} ${tier.bgClass}`}
        >
          {tier.label}
        </span>
      </td>
      <td className="px-3 py-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className={`size-1.5 rounded-full ${status.dotClass}`} />
          {status.label}
        </span>
      </td>
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1 max-w-48">
          {firm.practiceAreas.map((a) => (
            <span
              key={a}
              className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-md"
            >
              {a}
            </span>
          ))}
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {firm.headquarters}
      </td>
      <td className="px-3 py-3 text-xs">
        <span className="text-warning font-mono">
          {ratingStars(firm.performanceRating)}
        </span>
      </td>
      <td className="px-3 py-3 font-mono text-sm text-foreground whitespace-nowrap">
        {firm.ytdSpend}
      </td>
      <td className="px-3 py-3 text-center text-sm text-foreground">
        {firm.activeEngagements}
      </td>
      <td className="px-3 py-3">
        {firm.negotiatedDiscount > 0 && (
          <span className="text-[10px] font-medium text-success bg-success/10 px-1.5 py-0.5 rounded-md">
            {firm.negotiatedDiscount}%
          </span>
        )}
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="xs">
            View
          </Button>
          <Button variant="ghost" size="xs">
            Engage
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function FirmsTab() {
  const [view, setView] = useState<"cards" | "table">("cards");

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant={view === "cards" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="size-3.5" />
        </Button>
        <Button
          variant={view === "table" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setView("table")}
        >
          <Table2 className="size-3.5" />
        </Button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {FIRMS.map((firm) => (
            <FirmCard key={firm.id} firm={firm} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto bg-card border border-border rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-2.5 font-medium">Name</th>
                <th className="px-3 py-2.5 font-medium">Tier</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Practice Areas</th>
                <th className="px-3 py-2.5 font-medium">HQ</th>
                <th className="px-3 py-2.5 font-medium">Rating</th>
                <th className="px-3 py-2.5 font-medium">YTD Spend</th>
                <th className="px-3 py-2.5 font-medium text-center">Engagements</th>
                <th className="px-3 py-2.5 font-medium">Discount</th>
                <th className="px-3 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {FIRMS.map((firm) => (
                <FirmTableRow key={firm.id} firm={firm} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
