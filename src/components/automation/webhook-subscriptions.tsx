"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Globe,
  Zap,
  Link2,
  Shield,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type WebhookSubscription,
  type WebhookDelivery,
  type SystemEvent,
  webhookStatusColor,
  webhookStatusBgColor,
  deliveryStatusColor,
  deliveryStatusBgColor,
  deliveryStatusLabel,
  getEventById,
  EVENTS,
  WEBHOOK_DELIVERIES,
} from "./data";

/* ── Webhook Card ── */

function WebhookCard({
  webhook,
  onToggle,
  onEdit,
  onDelete,
  onViewLogs,
}: {
  webhook: WebhookSubscription;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewLogs: () => void;
}) {
  const [showSecret, setShowSecret] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const statusIcon = webhook.status === "active" ? CheckCircle2 : webhook.status === "error" ? AlertTriangle : Clock;
  const StatusIcon = statusIcon;

  return (
    <div className={`rounded-xl border bg-card p-5 transition-all duration-200 ${
      webhook.status === "error" ? "border-destructive/30" : webhook.status === "paused" ? "border-border/50 opacity-70" : "border-border"
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Globe className="size-5 text-brand" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{webhook.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StatusIcon className={`size-3 ${webhookStatusColor(webhook.status)}`} />
              <span className={`text-[10px] font-medium ${webhookStatusColor(webhook.status)}`}>
                {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 cursor-pointer shrink-0 ${
            webhook.status === "active" ? "bg-success" : "bg-secondary"
          }`}
        >
          <span className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            webhook.status === "active" ? "translate-x-4.5" : "translate-x-1"
          }`} />
        </button>
      </div>

      {/* URL */}
      <div className="mb-3">
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1">
          Endpoint
        </span>
        <div className="flex items-center gap-2">
          <Link2 className="size-3 text-muted-foreground/30 shrink-0" />
          <code className="text-[11px] text-muted-foreground font-mono truncate flex-1">
            {showUrl ? webhook.url : webhook.url.replace(/\/\/(.+?)\//, "//••••••/")}
          </code>
          <button
            onClick={() => setShowUrl(!showUrl)}
            className="text-muted-foreground/30 hover:text-muted-foreground cursor-pointer shrink-0"
          >
            {showUrl ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
          </button>
        </div>
      </div>

      {/* Subscribed events */}
      <div className="mb-3">
        <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
          Subscribed Events ({webhook.subscribedEvents.length})
        </span>
        <div className="flex flex-wrap gap-1.5">
          {webhook.subscribedEvents.map((evtId) => {
            const evt = getEventById(evtId);
            return (
              <span
                key={evtId}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand/8 text-[9px] font-medium text-brand font-mono"
              >
                <Zap className="size-2.5" />
                {evt?.name || evtId}
              </span>
            );
          })}
        </div>
      </div>

      {/* Config row */}
      <div className="flex items-center gap-4 text-[10px] text-muted-foreground/50 mb-3">
        <span className="flex items-center gap-1">
          <RefreshCw className="size-3" />
          {webhook.retryPolicy === "none" ? "No retries" : `${webhook.retryPolicy} (${webhook.maxRetries}x)`}
        </span>
        <span className="flex items-center gap-1">
          <Shield className="size-3" />
          Signed
        </span>
      </div>

      {/* Stats + Actions */}
      <div className="flex items-center justify-between border-t border-border/50 pt-3">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground/50">
          <span>{webhook.totalDeliveries.toLocaleString()} deliveries</span>
          <span className={webhook.successRate >= 99 ? "text-success" : webhook.successRate >= 95 ? "text-warning" : "text-destructive"}>
            {webhook.successRate}% success
          </span>
          {webhook.lastDelivery && <span>Last: {webhook.lastDelivery}</span>}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onViewLogs}
            className="size-7 flex items-center justify-center rounded-md hover:bg-brand/10 text-muted-foreground/40 hover:text-brand transition-colors cursor-pointer"
            title="View logs"
          >
            <ExternalLink className="size-3" />
          </button>
          <button
            onClick={onEdit}
            className="size-7 flex items-center justify-center rounded-md hover:bg-secondary text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil className="size-3" />
          </button>
          <button
            onClick={onDelete}
            className="size-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delivery Log Panel ── */

function DeliveryLogs({ webhookId, webhookName, onClose }: { webhookId: string; webhookName: string; onClose: () => void }) {
  const deliveries = WEBHOOK_DELIVERIES.filter((d) => d.webhookId === webhookId);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Delivery Logs</h3>
          <p className="text-[11px] text-muted-foreground">{webhookName}</p>
        </div>
        <button onClick={onClose} className="size-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground cursor-pointer">
          <X className="size-4" />
        </button>
      </div>

      {deliveries.length > 0 ? (
        <div className="space-y-2">
          {deliveries.map((del) => (
            <div key={del.id} className="rounded-lg border border-border/50 overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === del.id ? null : del.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-secondary/20 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${deliveryStatusBgColor(del.status)} ${deliveryStatusColor(del.status)}`}>
                    {deliveryStatusLabel(del.status)}
                  </span>
                  <span className="text-xs font-mono text-foreground">{del.event}</span>
                  {del.statusCode && (
                    <span className={`text-[10px] font-mono ${del.statusCode < 300 ? "text-success" : "text-destructive"}`}>
                      {del.statusCode}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40">
                  <span>{del.duration}</span>
                  <span>{del.timestamp}</span>
                </div>
              </button>

              <AnimatePresence>
                {expandedId === del.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3 border-t border-border/50 space-y-2">
                      <div>
                        <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider block mb-1">Payload</span>
                        <pre className="text-[10px] font-mono text-brand bg-brand/[0.04] rounded p-2 overflow-x-auto">
                          {JSON.stringify(JSON.parse(del.payload), null, 2)}
                        </pre>
                      </div>
                      <div>
                        <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wider block mb-1">Response</span>
                        <pre className={`text-[10px] font-mono rounded p-2 overflow-x-auto ${del.statusCode && del.statusCode < 300 ? "text-success bg-success/[0.04]" : "text-destructive bg-destructive/[0.04]"}`}>
                          {JSON.stringify(JSON.parse(del.response), null, 2)}
                        </pre>
                      </div>
                      <div className="text-[10px] text-muted-foreground/40">
                        Attempt {del.attempt} · {del.duration} · {del.timestamp}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/40 py-8 text-center">No deliveries recorded</p>
      )}
    </div>
  );
}

/* ── Main Component ── */

interface WebhookSubscriptionsProps {
  webhooks: WebhookSubscription[];
  onToggleWebhook: (id: string) => void;
  onDeleteWebhook: (id: string) => void;
}

export function WebhookSubscriptions({
  webhooks,
  onToggleWebhook,
  onDeleteWebhook,
}: WebhookSubscriptionsProps) {
  const [viewingLogsId, setViewingLogsId] = useState<string | null>(null);
  const viewingWebhook = webhooks.find((w) => w.id === viewingLogsId);

  const activeCount = webhooks.filter((w) => w.status === "active").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{activeCount} active</span>
          <span className="text-muted-foreground/30">·</span>
          <span>{webhooks.length} total webhooks</span>
        </div>
        <Button className="h-8 bg-brand hover:bg-brand/90 text-white text-xs font-semibold rounded-lg gap-1.5 cursor-pointer">
          <Plus className="size-3.5" />
          Add Webhook
        </Button>
      </div>

      {/* Delivery log panel (if viewing) */}
      <AnimatePresence>
        {viewingLogsId && viewingWebhook && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <DeliveryLogs
              webhookId={viewingLogsId}
              webhookName={viewingWebhook.name}
              onClose={() => setViewingLogsId(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Webhook grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {webhooks.map((wh, i) => (
          <motion.div
            key={wh.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05 }}
          >
            <WebhookCard
              webhook={wh}
              onToggle={() => onToggleWebhook(wh.id)}
              onEdit={() => {}}
              onDelete={() => onDeleteWebhook(wh.id)}
              onViewLogs={() => setViewingLogsId(viewingLogsId === wh.id ? null : wh.id)}
            />
          </motion.div>
        ))}
      </div>

      {webhooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/40">
          <Globe className="size-8 mb-3" />
          <p className="text-sm">No webhook subscriptions configured</p>
          <Button variant="outline" className="mt-4 text-xs cursor-pointer">
            <Plus className="size-3.5 mr-1.5" />
            Create your first webhook
          </Button>
        </div>
      )}
    </div>
  );
}
