"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ChevronRight,
  Filter as FilterIcon,
  Plus,
  Search,
  Star,
  TriangleAlert,
  Users,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  COST_CATEGORY_LABEL,
  COST_CATEGORY_TINT,
  formatMoney,
  PO_STATUS_TINT,
  VENDORS,
  type PoStatus,
} from "@/components/delivery/financial/data";

export default function ProcurementPage() {
  const { setScreen } = useScreen();
  const { projects } = useDeliveryStore();
  const { purchaseOrders } = useFinanceStore();
  const [tab, setTab] = useState<"pos" | "vendors">("pos");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PoStatus | "all">("all");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Procurement" });
    return () => setScreen(null);
  }, [setScreen]);

  const filteredPos = useMemo(() => {
    const q = query.trim().toLowerCase();
    return purchaseOrders.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      const vendor = VENDORS.find((v) => v.id === p.vendorId);
      const proj = projects.find((x) => x.id === p.projectId);
      return p.number.toLowerCase().includes(q) || (vendor?.name ?? "").toLowerCase().includes(q) || (proj?.name ?? "").toLowerCase().includes(q);
    });
  }, [purchaseOrders, query, statusFilter, projects]);

  const totals = useMemo(() => {
    const open = purchaseOrders.filter((p) => p.status === "open" || p.status === "partial");
    const committedINR = open.reduce((s, p) => s + (p.amount * (p.currency === "INR" ? 1 : p.currency === "USD" ? 84 : p.currency === "SGD" ? 62 : p.currency === "GBP" ? 108 : p.currency === "EUR" ? 91 : 1)), 0);
    const drawnINR = open.reduce((s, p) => s + (p.amountDrawn * (p.currency === "INR" ? 1 : p.currency === "USD" ? 84 : p.currency === "SGD" ? 62 : p.currency === "GBP" ? 108 : p.currency === "EUR" ? 91 : 1)), 0);
    return { open: open.length, committedINR, drawnINR, undrawnINR: committedINR - drawnINR };
  }, [purchaseOrders]);

  const underperformers = VENDORS.filter((v) => v.performance.onTimePct < 80 || v.performance.qualityScore < 4.0);
  const contractors = VENDORS.filter((v) => v.kind === "contractor");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/financials" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Procurement &amp; vendors</h1>
            <p className="text-sm text-muted-foreground">POs against projects, vendor performance, contractor onboarding (links to HR).</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="size-3.5" />
          Raise PO
        </button>
      </motion.div>

      {/* Top tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Open POs" value={totals.open.toString()} sub={`${VENDORS.length} vendors total`} tint="bg-warning/10 text-warning" />
        <Tile label="Committed (open)" value={formatMoney(totals.committedINR, "INR", true)} sub={`${formatMoney(totals.drawnINR, "INR", true)} drawn`} tint="bg-brand/10 text-brand" />
        <Tile label="Undrawn commitments" value={formatMoney(totals.undrawnINR, "INR", true)} sub="Watch for sprawl" tint="bg-destructive/10 text-destructive" />
        <Tile label="Underperforming vendors" value={underperformers.length.toString()} sub="On-time <80% or quality <4.0" tint="bg-secondary text-foreground" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(["pos", "vendors"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "pos" ? "Purchase orders" : "Vendor scorecards"}
          </button>
        ))}
      </div>

      {tab === "pos" && (
        <>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-44 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PO, vendor, project…"
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" />
            </div>
            <FilterIcon className="size-3.5 text-muted-foreground" />
            <div className="flex items-center gap-1">
              {(["all", "open", "partial", "received", "closed", "cancelled"] as const).map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
                    statusFilter === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}>
                  {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-overlay/40 border-b border-border">
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  <th className="text-left px-4 py-2 font-semibold">PO</th>
                  <th className="text-left px-3 py-2 font-semibold">Vendor</th>
                  <th className="text-left px-3 py-2 font-semibold">Project</th>
                  <th className="text-left px-3 py-2 font-semibold">Description</th>
                  <th className="text-right px-3 py-2 font-semibold">Amount</th>
                  <th className="text-right px-3 py-2 font-semibold">Drawn</th>
                  <th className="text-center px-3 py-2 font-semibold">Status</th>
                  <th className="text-left px-4 py-2 font-semibold">Close</th>
                </tr>
              </thead>
              <tbody>
                {filteredPos.map((po) => {
                  const vendor = VENDORS.find((v) => v.id === po.vendorId);
                  const proj = projects.find((p) => p.id === po.projectId);
                  const drawnPct = po.amount === 0 ? 0 : Math.round((po.amountDrawn / po.amount) * 100);
                  return (
                    <tr key={po.id} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                      <td className="px-4 py-2 text-[12px] text-foreground font-medium">{po.number}</td>
                      <td className="px-3 py-2 text-[12px] text-foreground inline-flex items-center gap-1.5">
                        <Building2 className="size-3 text-muted-foreground" />
                        {vendor?.name}
                        {vendor?.preferred && <Star className="size-3 text-warning fill-warning" />}
                      </td>
                      <td className="px-3 py-2 text-[12px] text-muted-foreground">{proj?.shortName}</td>
                      <td className="px-3 py-2 text-[11px] text-muted-foreground line-clamp-1 max-w-50">{po.description}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-foreground">{formatMoney(po.amount, po.currency, true)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[11px] tabular-nums text-foreground">{formatMoney(po.amountDrawn, po.currency, true)}</span>
                          <div className="h-1 w-16 bg-secondary rounded overflow-hidden">
                            <div className="h-full bg-warning" style={{ width: `${Math.min(100, drawnPct)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${PO_STATUS_TINT[po.status]}`}>{po.status}</span>
                      </td>
                      <td className="px-4 py-2 text-[11px] text-muted-foreground tabular-nums">{po.expectedCloseISO}</td>
                    </tr>
                  );
                })}
                {filteredPos.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground italic">No POs match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "vendors" && (
        <div className="space-y-4">
          {/* Underperformer flag */}
          {underperformers.length > 0 && (
            <section className="bg-destructive/5 border border-destructive/30 rounded-xl p-3 flex items-start gap-2.5">
              <TriangleAlert className="size-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">{underperformers.length} vendor(s) underperforming</p>
                <p className="text-[12px] text-muted-foreground">On-time delivery {"<"}80% or quality {"<"}4.0. Consider rebid or contract talk.</p>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VENDORS.map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-start gap-2 mb-2">
                  <div className="size-9 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
                    <Building2 className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{v.name}</p>
                      {v.preferred && <Star className="size-3 text-warning fill-warning" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground/70">{v.country} · {v.kind}</p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${COST_CATEGORY_TINT[v.category]}`}>{COST_CATEGORY_LABEL[v.category]}</span>
                </div>
                <ul className="space-y-1.5 text-[12px] border-t border-border pt-2">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">On-time</span>
                    <span className={`tabular-nums font-medium ${v.performance.onTimePct >= 90 ? "text-success" : v.performance.onTimePct >= 80 ? "text-warning" : "text-destructive"}`}>{v.performance.onTimePct}%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Quality</span>
                    <span className={`tabular-nums font-medium ${v.performance.qualityScore >= 4.5 ? "text-success" : v.performance.qualityScore >= 4 ? "text-warning" : "text-destructive"}`}>{v.performance.qualityScore.toFixed(1)} / 5</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Invoice accuracy</span>
                    <span className="tabular-nums text-foreground">{v.performance.invoiceAccuracyPct}%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">NPS</span>
                    <span className="tabular-nums text-foreground">{v.performance.nps > 0 ? "+" : ""}{v.performance.nps}</span>
                  </li>
                  <li className="flex items-center justify-between border-t border-border pt-1.5">
                    <span className="text-muted-foreground">Open contracts</span>
                    <span className="tabular-nums font-medium text-foreground">{v.performance.contractsOpen}</span>
                  </li>
                </ul>
                {v.hrUserId && (
                  <div className="mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground inline-flex items-center gap-1.5">
                    <Users className="size-3 text-brand-purple" />
                    Contractor onboarded via HR
                    <Link href={`/admin/users/${v.hrUserId}`} className="text-brand hover:underline inline-flex items-center gap-0.5">
                      view
                      <ChevronRight className="size-2.5" />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>

          {contractors.length > 0 && (
            <section className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2 inline-flex items-center gap-1.5">
                <Users className="size-3" />
                Contractor onboarding ({contractors.length})
              </p>
              <p className="text-[12px] text-muted-foreground">Contractor vendors create an HR record so their PII / pay terms / access live with the rest of the People module. Closes the loop on the &quot;contractor disappeared from the org chart&quot; problem.</p>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function Tile({ label, value, sub, tint }: { label: string; value: string; sub?: string; tint: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1 inline-flex items-center gap-1.5">
        <span className={`size-5 rounded-md flex items-center justify-center ${tint}`}><Star className="size-3" /></span>
        {label}
      </p>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </div>
  );
}
