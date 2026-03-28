"use client";

import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { VENDOR_RANKINGS, perfBarColor, perfScoreColor } from "@/components/vendors/data";

function trendIcon(score: number) {
  if (score >= 70) return <TrendingUp className="size-3.5 text-success" />;
  if (score >= 50) return <Minus className="size-3.5 text-muted-foreground" />;
  return <TrendingDown className="size-3.5 text-destructive" />;
}

const AI_INSIGHTS = [
  "HireRight Global consistently delivers the highest submit-to-hire ratio (25%), justifying their premium fee structure.",
  "TalentForce India has the most active assignments (5) but their submit-to-hire rate (8.3%) suggests volume over quality. Consider quality coaching.",
  "SkillBridge Tech's performance score dropped from 72 to 58 over the last quarter. Schedule a performance review.",
  "Ravi K. (Freelance) shows strong niche performance in Data/ML roles with 12.5% submit-to-hire — consider expanding scope.",
];

export function PerformanceTab() {
  return (
    <div className="space-y-6">
      {/* Rankings table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-12">#</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Vendor</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Score</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submit&rarr;Interview %</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submit&rarr;Hire %</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Avg Time to Submit</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cost per Hire</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trend</th>
              </tr>
            </thead>
            <tbody>
              {VENDOR_RANKINGS.map((v, idx) => {
                const rank = idx + 1;
                const avgTimeToSubmit = rank === 1 ? "3.2 days" : rank === 2 ? "2.1 days" : rank === 3 ? "1.8 days" : rank === 4 ? "4.5 days" : "5.0 days";
                const costPerHire = rank === 1 ? "₹5.4L" : rank === 2 ? "₹12.0L" : rank === 3 ? "₹0.5L" : rank === 4 ? "₹1.5L" : "₹3.6L";

                return (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center justify-center size-6 rounded-full text-xs font-bold ${
                        rank === 1 ? "bg-warning/15 text-warning" :
                        rank === 2 ? "bg-secondary text-foreground" :
                        rank === 3 ? "bg-secondary text-muted-foreground" :
                        "bg-transparent text-muted-foreground"
                      }`}>
                        {rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{v.companyName}</p>
                      <p className="text-xs text-muted-foreground">{v.type}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${perfBarColor(v.performanceScore)}`}
                            style={{ width: `${v.performanceScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${perfScoreColor(v.performanceScore)}`}>
                          {v.performanceScore}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{v.submitToInterviewRate}%</td>
                    <td className="px-4 py-3">{v.submitToHireRate}%</td>
                    <td className="px-4 py-3 text-muted-foreground">{avgTimeToSubmit}</td>
                    <td className="px-4 py-3 font-mono">{costPerHire}</td>
                    <td className="px-4 py-3">{trendIcon(v.performanceScore)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-4 rounded-r-xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-foreground">AI Insights</h3>
        </div>
        <ul className="space-y-2">
          {AI_INSIGHTS.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 size-1 rounded-full bg-brand-purple shrink-0" />
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
