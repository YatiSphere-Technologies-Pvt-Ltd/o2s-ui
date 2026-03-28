"use client";

import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function AiAgentTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground max-w-xl">
        Configure the AI Performance Agent&apos;s capabilities, bias detection, transparency, and
        compliance settings.
      </p>

      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-card border border-border rounded-xl p-6 space-y-6"
      >
        {/* ── Agent Header ── */}
        <div className="flex items-center gap-3">
          <div className="size-2.5 rounded-full bg-warning animate-pulse" />
          <span className="text-sm font-semibold text-foreground">Performance Agent</span>
          <span className="bg-success/10 text-success text-[10px] font-medium rounded px-1.5 py-0.5">
            Active
          </span>
        </div>

        {/* ── Review Draft Generation ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Review Draft Generation</h3>
          <label className="flex items-center gap-2 text-sm text-foreground mb-2">
            <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
            Enable AI review draft generation
          </label>
          <div className="ml-1 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Input sources:</p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  Self-review responses
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  Peer feedback
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  Goal completion data
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  Previous review history
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  1:1 meeting notes
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                  Project deliverables &amp; metrics
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="size-3.5 accent-brand" />
                  Slack/Teams activity signals
                </label>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Output quality:</p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="quality" className="size-3.5 accent-brand" />
                  Bullet points
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="quality"
                    defaultChecked
                    className="size-3.5 accent-brand"
                  />
                  Structured paragraphs
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="quality" className="size-3.5 accent-brand" />
                  Full narrative
                </label>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Tone:</p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="tone" className="size-3.5 accent-brand" />
                  Direct
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="tone"
                    defaultChecked
                    className="size-3.5 accent-brand"
                  />
                  Balanced
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="tone" className="size-3.5 accent-brand" />
                  Supportive
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bias Detection ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Bias Detection</h3>
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1.5">Sensitivity:</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="sensitivity" className="size-3.5 accent-brand" />
                Low — Flag only clear violations
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="sensitivity"
                  defaultChecked
                  className="size-3.5 accent-brand"
                />
                Medium — Flag likely bias patterns
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="sensitivity" className="size-3.5 accent-brand" />
                High — Flag all potential concerns
              </label>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Detect &amp; flag:</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Gendered language
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Recency bias indicators
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Halo/horn effect patterns
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Central tendency clustering
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Leniency/strictness patterns
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Similarity bias (rating similar people higher)
              </label>
            </div>
          </div>
        </div>

        {/* ── Feedback Synthesis ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Feedback Synthesis</h3>
          <label className="flex items-center gap-2 text-sm text-foreground mb-2">
            <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
            Enable AI feedback synthesis
          </label>
          <div className="ml-1 space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Summary shows:</p>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="synthesisSummary" className="size-3.5 accent-brand" />
                  Themes only
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="synthesisSummary"
                    defaultChecked
                    className="size-3.5 accent-brand"
                  />
                  Themes with supporting quotes
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="radio" name="synthesisSummary" className="size-3.5 accent-brand" />
                  Full verbatim with highlights
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum responses to synthesize:{" "}
              <span className="text-foreground font-medium">3</span>
            </p>
          </div>
        </div>

        {/* ── Predictive Features ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Predictive Features</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Flight risk prediction based on review trends
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Promotion readiness scoring
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Development trajectory forecasting
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Compensation equity analysis
            </label>
          </div>
        </div>

        {/* ── Benchmark Integration ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Benchmark Integration</h3>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Compare ratings against role-level benchmarks
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Show industry percentile context
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Highlight significant deviations from benchmark
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
              Include benchmark data in calibration view
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" className="size-3.5 accent-brand" />
              Auto-adjust benchmarks based on org data
            </label>
          </div>
        </div>

        {/* ── Transparency ── */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Transparency</h3>
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1.5">Employee visibility into AI usage:</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="employeeAiVis" className="size-3.5 accent-brand" />
                Hidden
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name="employeeAiVis"
                  defaultChecked
                  className="size-3.5 accent-brand"
                />
                Disclosed — Badge on AI-assisted content
              </label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="radio" name="employeeAiVis" className="size-3.5 accent-brand" />
                Full transparency — Show AI reasoning
              </label>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1.5">Manager controls:</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Can edit AI-generated drafts before submission
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                Can opt out of AI suggestions per review
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" defaultChecked className="size-3.5 accent-brand" />
                See confidence scores for AI recommendations
              </label>
            </div>
          </div>
        </div>

        {/* ── EU AI Act Warning ── */}
        <div className="bg-destructive/5 border-l-[3px] border-destructive p-3">
          <p className="text-xs text-destructive font-medium mb-1">EU AI Act Compliance Notice</p>
          <p className="text-xs text-destructive">
            Performance evaluation AI systems are classified as high-risk under the EU AI Act
            (Article 6). This system maintains audit logs, bias monitoring, and human oversight
            requirements. Employees must be informed when AI is used in their evaluation. Ensure your
            transparency settings above comply with local regulations.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
