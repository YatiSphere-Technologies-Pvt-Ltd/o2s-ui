"use client";

import { CalendarClock, FileBadge, Phone, Users } from "lucide-react";
import type { BusinessImpact } from "@/components/leave/data";

interface Props {
  impact: BusinessImpact;
}

export function BusinessImpactCard({ impact }: Props) {
  const { meetings, deliverables, onCall } = impact;
  const empty = meetings.length === 0 && deliverables.length === 0 && !onCall;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Business impact</h3>

      {empty ? (
        <p className="text-xs text-muted-foreground italic">No conflicts surfaced for these dates.</p>
      ) : (
        <div className="space-y-4">
          {meetings.length > 0 && (
            <Section icon={Users} title="Meetings affected" count={meetings.length}>
              <ul className="space-y-1.5">
                {meetings.map((m) => (
                  <li key={m.id} className="flex items-start gap-2.5 text-xs">
                    <CalendarClock className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">{m.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {m.whenLabel} · {m.attendees} attendees
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {deliverables.length > 0 && (
            <Section icon={FileBadge} title="Deliverables" count={deliverables.length}>
              <ul className="space-y-1.5">
                {deliverables.map((d) => (
                  <li key={d.id} className="flex items-start gap-2.5 text-xs">
                    <FileBadge className="size-3.5 text-muted-foreground/60 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">{d.title}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {d.dueLabel} · {d.ownership}% ownership
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {onCall && (
            <Section icon={Phone} title="On-call">
              <p className="text-xs text-foreground">
                {onCall.isOnCall ? (
                  <>
                    Currently on the <span className="font-medium">{onCall.rotation}</span> rotation.
                    {onCall.backup ? (
                      <>
                        {" "}Suggested backup: <span className="font-medium">{onCall.backup}</span>.
                      </>
                    ) : null}
                  </>
                ) : (
                  <>
                    Not on the <span className="font-medium">{onCall.rotation}</span> rotation during these dates.
                  </>
                )}
              </p>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  count,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
        <Icon className="size-3" />
        {title}
        {count !== undefined && (
          <span className="text-muted-foreground/50 tabular-nums">· {count}</span>
        )}
      </div>
      {children}
    </div>
  );
}
