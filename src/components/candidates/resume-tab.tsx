"use client";

import { SKILLS_MATCH, skillStatusColor, skillStatusIcon } from "@/components/candidates/data";

const WORK_EXPERIENCE = [
  {
    company: "Google",
    title: "Senior Frontend Engineer",
    dates: "2022 – Present",
    location: "San Francisco, CA",
    bullets: [
      "Led design system migration to React 18 + TypeScript, reducing bundle size by 35%",
      "Architected micro-frontend strategy serving 50M+ daily users",
      "Mentored 4 junior engineers; 2 promoted within 18 months",
    ],
  },
  {
    company: "Stripe",
    title: "Frontend Engineer",
    dates: "2019 – 2022",
    location: "San Francisco, CA",
    bullets: [
      "Built real-time dashboard components processing 10K+ events/sec",
      "Implemented E2E testing strategy reducing production bugs by 60%",
      "Contributed to Stripe's open-source React component library",
    ],
  },
  {
    company: "Startup (YC W18)",
    title: "Full-Stack Engineer",
    dates: "2017 – 2019",
    location: "Palo Alto, CA",
    bullets: [
      "Employee #5; built core product UI from scratch using React + Redux",
      "Integrated real-time collaboration features with WebSocket",
    ],
  },
];

const EDUCATION = [
  {
    school: "Stanford University",
    degree: "B.S. Computer Science",
    dates: "2013 – 2017",
    notes: "Focus: HCI & Systems. Dean's List.",
  },
];

const CERTIFICATIONS = [
  "AWS Certified Developer – Associate (2024)",
  "Google Cloud Professional (2023)",
];

const PARSED_SKILLS = [
  "React",
  "TypeScript",
  "Next.js",
  "CSS/Tailwind",
  "Performance Optimization",
  "Testing (Playwright, Jest)",
  "Webpack/Vite",
  "CI/CD",
  "Figma",
  "Leadership/Mentoring",
];

export function ResumeTab() {
  return (
    <div className="flex gap-5">
      {/* Left Column – Parsed Resume */}
      <div className="w-[60%] bg-card border border-border rounded-xl p-5 space-y-6">
        {/* Work Experience */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Work Experience</h3>
          <div className="space-y-4">
            {WORK_EXPERIENCE.map((role) => (
              <div key={`${role.company}-${role.title}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">
                    {role.company} — {role.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">
                  {role.dates} · {role.location}
                </p>
                <ul className="space-y-1 ml-3">
                  {role.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="text-xs text-muted-foreground flex gap-1.5"
                    >
                      <span className="text-muted-foreground/50 mt-0.5">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Education</h3>
          {EDUCATION.map((ed) => (
            <div key={ed.school}>
              <span className="text-sm font-semibold">{ed.school}</span>
              <p className="text-xs text-muted-foreground">
                {ed.degree} · {ed.dates}
              </p>
              <p className="text-xs text-muted-foreground">{ed.notes}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {PARSED_SKILLS.map((s) => (
              <span
                key={s}
                className="text-xs bg-secondary px-2 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Certifications</h3>
          <ul className="space-y-1">
            {CERTIFICATIONS.map((c) => (
              <li key={c} className="text-xs text-muted-foreground">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Column – Skills Match */}
      <div className="w-[40%] bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Skills Match Analysis</h3>

        {/* Required */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Required Skills
          </h4>
          <div className="space-y-2">
            {SKILLS_MATCH.required.map((s) => (
              <div
                key={s.skill}
                className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${skillStatusColor(s.status)}`}>
                    {skillStatusIcon(s.status)}
                  </span>
                  <span className="text-sm">{s.skill}</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Preferred Skills
          </h4>
          <div className="space-y-2">
            {SKILLS_MATCH.preferred.map((s) => (
              <div
                key={s.skill}
                className="flex items-center gap-2 py-1.5 border-b border-border last:border-0"
              >
                <span className={`text-sm font-bold ${skillStatusColor(s.status)}`}>
                  {skillStatusIcon(s.status)}
                </span>
                <span className="text-sm">{s.skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
