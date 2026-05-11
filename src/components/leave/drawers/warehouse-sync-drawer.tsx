"use client";

import { useState } from "react";
import { Check, Database, Loader2, Plug } from "lucide-react";
import { Drawer } from "@/components/leave/drawer";
import type { WarehouseConnector, WarehouseInterval, WarehouseSyncSettings } from "@/lib/leave-store";

const CONNECTORS: { value: WarehouseConnector; label: string; example: string }[] = [
  { value: "off",        label: "Disabled",   example: "" },
  { value: "snowflake",  label: "Snowflake",  example: "abc12345.us-east-1.snowflakecomputing.com" },
  { value: "bigquery",   label: "BigQuery",   example: "project-id:dataset.leave_facts" },
  { value: "databricks", label: "Databricks", example: "https://dbc-xxx.cloud.databricks.com" },
];

const INTERVALS: { value: WarehouseInterval; label: string }[] = [
  { value: "hourly",  label: "Every hour" },
  { value: "daily",   label: "Daily (02:00 IST)" },
  { value: "weekly",  label: "Weekly (Mondays)" },
  { value: "manual",  label: "Manual only" },
];

interface Props {
  open: boolean;
  current: WarehouseSyncSettings;
  onClose: () => void;
  onSave: (next: Partial<WarehouseSyncSettings>) => void;
}

export function WarehouseSyncDrawer({ open, current, onClose, onSave }: Props) {
  const [connector, setConnector] = useState<WarehouseConnector>(current.connector);
  const [connection, setConnection] = useState<string>(current.connectionLabel);
  const [interval, setInterval] = useState<WarehouseInterval>(current.interval);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | "ok" | "fail">(null);

  function maskedConnection(input: string): string {
    if (!input) return "";
    if (input.length <= 14) return input;
    return `${input.slice(0, 10)}…${input.slice(-4)}`;
  }

  function testConnection() {
    setTestResult(null);
    setTesting(true);
    window.setTimeout(() => {
      setTesting(false);
      setTestResult(connector === "off" || !connection ? "fail" : "ok");
    }, 700);
  }

  function save() {
    onSave({
      connector,
      connectionLabel: maskedConnection(connection),
      interval,
      lastSyncedISO: connector === "off" ? undefined : new Date().toISOString(),
    });
    onClose();
  }

  const conn = CONNECTORS.find((c) => c.value === connector)!;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Warehouse sync"
      subtitle="Push leave facts to your analytics warehouse on a schedule."
      width="md"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={save}
            className="h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Save settings
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Connector picker */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
            Connector
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CONNECTORS.map((c) => {
              const selected = connector === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setConnector(c.value)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    selected
                      ? "border-brand bg-brand/5"
                      : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Database className={`size-3.5 ${selected ? "text-brand" : "text-muted-foreground"}`} />
                    <span className="text-xs font-medium text-foreground">{c.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {connector !== "off" && (
          <>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                Connection string
              </label>
              <input
                type="text"
                value={connection}
                onChange={(e) => {
                  setConnection(e.target.value);
                  setTestResult(null);
                }}
                placeholder={conn.example}
                className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 font-mono"
              />
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Stored masked. Existing: <span className="font-mono text-foreground">{current.connectionLabel || "—"}</span>
              </p>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                Sync interval
              </label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value as WarehouseInterval)}
                className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
              >
                {INTERVALS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border bg-surface-overlay/40">
              <div className="flex items-center gap-2 text-xs text-foreground">
                <Plug className="size-3.5 text-muted-foreground" />
                Test connection
              </div>
              <div className="flex items-center gap-2">
                {testResult === "ok" && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-success">
                    <Check className="size-3" /> Connected
                  </span>
                )}
                {testResult === "fail" && (
                  <span className="text-[11px] text-destructive">Connection failed</span>
                )}
                <button
                  onClick={testConnection}
                  disabled={testing || !connection.trim()}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md border border-border bg-card text-[11px] text-foreground hover:bg-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {testing ? <Loader2 className="size-3 animate-spin" /> : "Test"}
                </button>
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground/60">
              Tables pushed: <span className="text-foreground">leave_facts</span>,{" "}
              <span className="text-foreground">leave_balances</span>,{" "}
              <span className="text-foreground">policy_versions</span>,{" "}
              <span className="text-foreground">agent_decisions</span>.
            </p>
          </>
        )}

        {connector === "off" && (
          <p className="text-[11px] text-muted-foreground italic">
            Warehouse sync is disabled. Pick a connector above to start pushing data.
          </p>
        )}
      </div>
    </Drawer>
  );
}
