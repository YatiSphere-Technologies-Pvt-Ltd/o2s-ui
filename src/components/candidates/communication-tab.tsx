"use client";

import { Sparkles, Send, Save } from "lucide-react";
import { MESSAGES, CANDIDATE } from "@/components/candidates/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CommunicationTab() {
  const totalMessages = MESSAGES.length;
  const incomingCount = MESSAGES.filter((m) => m.isIncoming).length;
  const outgoingCount = MESSAGES.filter((m) => !m.isIncoming).length;

  return (
    <div className="space-y-6">
      {/* Compose Section */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Compose Message</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">To:</span>
            <span className="text-sm">{CANDIDATE.name} ({CANDIDATE.email})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-8">Subj:</span>
            <Input placeholder="Subject..." className="flex-1 h-7 text-sm" />
          </div>
          <Textarea
            placeholder="Write your message..."
            className="min-h-24 text-sm"
          />
          <div className="flex items-center gap-2">
            <Button className="bg-brand text-white">
              <Send className="size-3.5" />
              Send
            </Button>
            <Button variant="outline">
              <Save className="size-3.5" />
              Save Draft
            </Button>
            <Button variant="outline" className="text-brand-purple">
              <Sparkles className="size-3.5" />
              AI Draft
            </Button>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div className="space-y-3">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`bg-card border border-border rounded-xl p-4 ${
              msg.isIncoming
                ? "border-l-[3px] border-l-success"
                : "border-l-[3px] border-l-brand"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {msg.isIncoming ? "From" : "To"}:{" "}
                </span>
                <span className="text-sm font-medium">
                  {msg.isIncoming ? msg.sender : msg.recipient}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {msg.date} · {msg.time}
              </span>
            </div>
            <p className="text-sm font-semibold mb-1">{msg.subject}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {msg.body}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">
                {msg.status}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {msg.engagement}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Communication Metrics */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-semibold mb-3">Communication Metrics</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Messages</p>
            <p className="text-lg font-bold">{totalMessages}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Response Rate</p>
            <p className="text-lg font-bold">100%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Avg Response Time</p>
            <p className="text-lg font-bold">2.5 hrs</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Engagement Level</p>
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success mt-1">
              High
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
