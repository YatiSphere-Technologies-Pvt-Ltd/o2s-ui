"use client";

import { motion } from "framer-motion";

const mockAgentActivity = [
  {
    agent: "Recruiter Agent",
    color: "purple" as const,
    action:
      "Screened 47 applications for Senior Backend Engineer. 8 advanced to phone screen, 39 archived with feedback.",
    status: "completed" as const,
    time: "5 min ago",
  },
  {
    agent: "Recruiter Agent",
    color: "purple" as const,
    action:
      "Generating interview questions for Product Designer role based on job requirements and team composition.",
    status: "in_progress" as const,
    progress: 65,
    time: "Active",
  },
  {
    agent: "Compliance Agent",
    color: "teal" as const,
    action:
      "Bias audit completed for Q1 hiring data. No adverse impact detected across protected categories.",
    status: "completed" as const,
    time: "22 min ago",
  },
  {
    agent: "Analytics Agent",
    color: "blue" as const,
    action:
      "Weekly pipeline health report generated. 3 bottlenecks identified in technical interview stage.",
    status: "needs_review" as const,
    time: "1 hr ago",
  },
  {
    agent: "Onboarding Agent",
    color: "teal" as const,
    action:
      "Preparing Day 1 checklist for Maya Chen (starting Monday). IT provisioning request sent.",
    status: "completed" as const,
    time: "2 hrs ago",
  },
  {
    agent: "Recruiter Agent",
    color: "purple" as const,
    action:
      "Sourced 23 passive candidates for VP Engineering from LinkedIn and GitHub signals.",
    status: "completed" as const,
    time: "3 hrs ago",
  },
];

const avatarGradients: Record<string, string> = {
  purple: "from-brand-purple to-brand-purple/70",
  teal: "from-brand-teal to-brand-teal/70",
  blue: "from-brand to-brand/70",
};

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-brand/10 text-brand",
  },
  needs_review: {
    label: "Needs Review",
    className: "bg-warning/10 text-warning",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function AgentActivityFeed() {
  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Agent Activity
          </h2>
          <span className="inline-flex items-center gap-1.5 bg-success/10 text-success text-[10px] px-2 py-0.5 rounded-full font-medium">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
        </div>
      </div>

      {/* Activity Cards */}
      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {mockAgentActivity.map((item, index) => {
          const status = statusConfig[item.status];
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group bg-card border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-full bg-linear-to-br ${avatarGradients[item.color]} flex items-center justify-center`}
                >
                  <span className="text-[10px] font-bold text-white">
                    {item.agent.charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.agent}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.action}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                    <span className="text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      View Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar for in_progress items */}
              {item.status === "in_progress" && item.progress != null && (
                <div className="mt-3 h-0.75 w-full rounded-full bg-secondary overflow-hidden">
                  <div
                    className="relative h-full rounded-full bg-linear-to-r from-brand to-brand-teal"
                    style={{ width: `${item.progress}%` }}
                  >
                    <div className="absolute inset-0 shimmer-bar" />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Link */}
      <div className="pt-1">
        <button className="text-brand text-sm font-medium hover:underline cursor-pointer">
          View all agent activity &rarr;
        </button>
      </div>

      {/* Shimmer keyframe */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
        .shimmer-bar {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.25) 50%,
            transparent 100%
          );
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
