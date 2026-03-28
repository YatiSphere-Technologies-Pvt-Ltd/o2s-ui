"use client";

import { motion } from "framer-motion";
import { Sparkles, Download, Share2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";

const RECOMMENDATIONS = [
  {
    num: 1,
    title: "Address Engineering Comp Gap",
    action:
      "5 high-risk engineers are below market P50 after competitor Q1 adjustments. Run a targeted equity review for IC3+ in Engineering to retain key talent. Estimated cost: ₹18L, potential savings from avoided attrition: ₹92L.",
  },
  {
    num: 2,
    title: "Streamline Technical Interviews",
    action:
      "Interview-to-offer conversion dropped to 22%. Reduce technical rounds from 3.2 to 2.0 average by combining system design and coding rounds. Pilot with Engineering and Product teams in April.",
  },
  {
    num: 3,
    title: "Expand Referral Program",
    action:
      "Referral hires are 2.8x more likely to exceed expectations. Increase referral bonus by 20% and launch a \"Refer a Friend\" campaign targeting Engineering and Sales teams where pipeline is weakest.",
  },
];

export function AINarrativeReport() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Gradient top border */}
      <div className="h-[3px] bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="h-4.5 w-4.5 text-brand-purple" />
          <h2 className="text-sm font-semibold text-foreground">
            AI Executive Summary — Q1 2026
          </h2>
          <span className="bg-success/10 text-success text-[10px] font-medium rounded-full px-2 py-0.5 ml-2">
            High Confidence
          </span>
        </div>

        {/* Prose body */}
        <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            Headcount grew to <strong className="text-foreground">142 employees</strong> in Q1 2026,
            representing a <strong className="text-foreground">9.2% increase</strong> year-to-date
            with <strong className="text-foreground">31 new hires</strong> against a target of 160 by
            H1 end. Engineering remains the largest department at 48 headcount (33.8%), and the hiring
            pipeline is robust with 312 active candidates across 24 open requisitions. Average time-to-fill
            improved significantly to <strong className="text-foreground">34 days</strong>, down from 42
            days in Q3 — a 19% improvement driven by AI-assisted screening.
          </p>

          <p>
            Despite overall positive trends, <strong className="text-foreground">attrition in Engineering
            warrants immediate attention</strong>. Five employees have been flagged as high-risk, primarily
            due to below-market compensation following competitor Q1 adjustments. While the overall attrition
            rate of <strong className="text-foreground">8.2%</strong> remains below the industry benchmark of
            9.3%, the Engineering-specific rate has climbed 12% month-over-month. The pay equity gap has
            narrowed to <strong className="text-foreground">3.2%</strong>, but the average compa-ratio of 0.97
            suggests a systemic lag that could escalate flight risk.
          </p>

          <p>
            On a positive note, the <strong className="text-foreground">employee referral program</strong> is
            delivering exceptional results. Referral hires are{" "}
            <strong className="text-foreground">2.8x more likely to exceed expectations</strong> at their
            6-month review, and referral volume has increased 45% since the bonus increase. AI screening
            accuracy has reached an all-time high of <strong className="text-foreground">91%</strong>,
            outperforming human screeners by 13 percentage points and saving approximately{" "}
            <strong className="text-foreground">360 hours</strong> of recruiter time this quarter, yielding a
            4.3x ROI on AI tooling investment.
          </p>
        </div>

        {/* Recommendations */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
            Recommendations
          </h3>
          <div className="space-y-3">
            {RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.num}
                className="flex gap-3 p-3 rounded-lg bg-secondary/50"
              >
                <span className="h-6 w-6 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center shrink-0">
                  {rec.num}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {rec.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-border">
          <Button variant="ghost" size="sm">
            <Download className="h-3.5 w-3.5" />
            Download Full Report (PDF)
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-3.5 w-3.5" />
            Share with Leadership
          </Button>
          <Button variant="ghost" size="sm">
            <CalendarClock className="h-3.5 w-3.5" />
            Schedule Weekly
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
