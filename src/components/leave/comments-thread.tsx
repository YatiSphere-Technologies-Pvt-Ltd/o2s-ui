"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { type CommentAuthorRole, type LeaveComment } from "@/components/leave/data";

const ROLE_BADGE: Record<CommentAuthorRole, { label: string; tint: string; color: string }> = {
  employee: { label: "You",     tint: "bg-brand/10",        color: "text-brand" },
  manager:  { label: "Manager", tint: "bg-brand-purple/10", color: "text-brand-purple" },
  hr:       { label: "HR",      tint: "bg-brand-teal/10",   color: "text-brand-teal" },
  system:   { label: "System",  tint: "bg-secondary",       color: "text-muted-foreground" },
};

function renderBody(body: string) {
  // Render @mentions as small chips; everything else as plain text.
  const parts = body.split(/(@[A-Za-z][A-Za-z0-9_-]*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("@")) {
      return (
        <span key={i} className="inline-flex items-center px-1.5 rounded bg-brand/10 text-brand text-[11px] font-medium">
          {p}
        </span>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

export function CommentsThread({
  comments,
  onPost,
  disabled,
}: {
  comments: LeaveComment[];
  onPost: (body: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Comments</h3>
        <span className="text-[11px] text-muted-foreground">
          {comments.length} {comments.length === 1 ? "message" : "messages"}
        </span>
      </div>

      <div className="flex-1 p-4 space-y-3 max-h-96 overflow-y-auto scrollbar-thin">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-8">
            No comments yet. Approvers can ask follow-up questions here.
          </p>
        ) : (
          comments.map((c) => {
            const meta = ROLE_BADGE[c.authorRole];
            const isEmployee = c.authorRole === "employee";
            return (
              <div key={c.id} className={`flex gap-3 ${isEmployee ? "flex-row-reverse" : ""}`}>
                <div className={`size-7 shrink-0 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${
                  isEmployee ? "bg-brand" : c.authorRole === "manager" ? "bg-brand-purple" : c.authorRole === "hr" ? "bg-brand-teal" : "bg-secondary"
                }`}>
                  {c.authorInitials}
                </div>
                <div className={`max-w-[78%] ${isEmployee ? "items-end text-right" : ""} flex flex-col gap-1`}>
                  <div className={`flex items-baseline gap-2 ${isEmployee ? "justify-end" : ""}`}>
                    <span className="text-[11px] font-medium text-foreground">{c.author}</span>
                    <span className={`text-[9px] uppercase tracking-wider rounded-full px-1.5 py-0.5 ${meta.tint} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">{c.whenLabel}</span>
                  </div>
                  <p
                    className={`text-xs leading-relaxed rounded-2xl px-3 py-2 ${
                      isEmployee
                        ? "bg-brand text-brand-foreground rounded-tr-md"
                        : "bg-surface-overlay text-foreground rounded-tl-md"
                    }`}
                  >
                    {renderBody(c.body)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {!disabled && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = value.trim();
            if (!trimmed) return;
            onPost(trimmed);
            setValue("");
          }}
          className="border-t border-border p-3 flex items-center gap-2"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Reply… (use @name to ping someone)"
            className="flex-1 h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40"
          />
          <button
            type="submit"
            disabled={!value.trim()}
            className="size-10 rounded-lg bg-brand text-brand-foreground flex items-center justify-center hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            aria-label="Post"
          >
            <Send className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
