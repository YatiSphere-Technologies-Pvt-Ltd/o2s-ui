"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Cloud,
  Eye,
  Lock,
  Mail,
  Receipt,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useFinanceStore } from "@/lib/finance-store";
import {
  CONTRACT_TYPE_LABEL,
  CURRENCY_SYMBOL,
  ERP_LABEL,
  formatMoney,
  INVOICE_STATUS_LABEL,
  INVOICE_STATUS_TINT,
  type ErpDestination,
} from "@/components/delivery/financial/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InvoiceDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { setScreen } = useScreen();
  const { findInvoice, approveInvoice, pushToErp, setInvoiceStatus } = useFinanceStore();
  const { findProject } = useDeliveryStore();
  const [showPreview, setShowPreview] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const invoice = findInvoice(id);
  const invNum = invoice?.number;

  useEffect(() => {
    if (!invNum) return;
    setScreen({ module: "Delivery", page: "Invoice", recordId: id, recordLabel: invNum });
    return () => setScreen(null);
  }, [id, invNum, setScreen]);

  if (!invoice) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h1 className="text-lg font-semibold text-foreground">Invoice not found</h1>
        <Link href="/delivery/financials/invoices" className="text-brand underline mt-3 inline-block">Back to invoices</Link>
      </div>
    );
  }

  const project = findProject(invoice.projectId);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  const stepsTotal = 4;
  let stepsDone = 0;
  if (invoice.pmApproval.approved) stepsDone++;
  if (invoice.financeApproval.approved) stepsDone++;
  if (invoice.erp?.pushed) stepsDone++;
  if (invoice.status === "sent" || invoice.status === "paid") stepsDone++;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery/financials/invoices" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground tracking-tight inline-flex items-center gap-2">
                <Receipt className="size-5 text-brand" />
                {invoice.number}
              </h1>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${INVOICE_STATUS_TINT[invoice.status]}`}>{INVOICE_STATUS_LABEL[invoice.status]}</span>
              <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{CONTRACT_TYPE_LABEL[invoice.contractType]}</span>
            </div>
            <p className="text-sm text-muted-foreground">{invoice.customer} · {project?.name ?? "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPreview(true)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            <Eye className="size-3.5" />
            Customer preview
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2">
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow tracker */}
      <section className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Workflow</p>
          <p className="text-[11px] text-muted-foreground tabular-nums">{stepsDone} / {stepsTotal} steps complete</p>
        </div>
        <ol className="space-y-2">
          <Step label="PM approval" done={invoice.pmApproval.approved} note={
            invoice.pmApproval.approved
              ? `Signed by ${invoice.pmApproval.byName} · ${invoice.pmApproval.whenISO?.slice(0, 10)}`
              : "PM signs off that the work was actually done."
          }>
            {!invoice.pmApproval.approved && invoice.status !== "void" && (
              <button onClick={() => { approveInvoice(invoice.id, "pm"); flashOnce("PM approval recorded."); }}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-success/10 text-success border border-success/30 text-[11px] hover:bg-success/20 transition-colors">
                <CheckCircle2 className="size-3" />
                Approve as PM
              </button>
            )}
          </Step>
          <Step label="Finance approval" done={invoice.financeApproval.approved} blocked={!invoice.pmApproval.approved} note={
            invoice.financeApproval.approved
              ? `Signed by ${invoice.financeApproval.byName} · ${invoice.financeApproval.whenISO?.slice(0, 10)}`
              : invoice.pmApproval.approved
              ? "Finance reviews tax, currency, terms, customer credit."
              : "Waiting for PM approval first."
          }>
            {!invoice.financeApproval.approved && invoice.pmApproval.approved && (
              <button onClick={() => { approveInvoice(invoice.id, "finance"); flashOnce("Finance approval recorded."); }}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-success/10 text-success border border-success/30 text-[11px] hover:bg-success/20 transition-colors">
                <CheckCircle2 className="size-3" />
                Approve as Finance
              </button>
            )}
          </Step>
          <Step label="ERP push" done={!!invoice.erp?.pushed} blocked={!invoice.financeApproval.approved}
            note={invoice.erp?.pushed ? `Pushed to ${ERP_LABEL[invoice.erp.destination]} · ref ${invoice.erp.externalRef}` : "Push to accounting system to assign GL accounts."}>
            {!invoice.erp?.pushed && invoice.financeApproval.approved && (
              <div className="flex items-center gap-1">
                {(["netsuite", "quickbooks", "xero", "tally", "sap"] as ErpDestination[]).map((d) => (
                  <button key={d} onClick={() => { pushToErp(invoice.id, d as never); flashOnce(`Pushed to ${ERP_LABEL[d]}.`); }}
                    className="inline-flex items-center gap-1 h-7 px-2 rounded text-[10px] uppercase tracking-wider bg-brand/10 text-brand hover:bg-brand/20 transition-colors">
                    <Cloud className="size-2.5" />
                    {ERP_LABEL[d]}
                  </button>
                ))}
              </div>
            )}
          </Step>
          <Step label="Send to customer" done={invoice.status === "sent" || invoice.status === "paid"} blocked={!invoice.erp?.pushed}
            note={invoice.status === "sent" ? "Sent. Waiting for payment." : invoice.status === "paid" ? `Paid on ${invoice.paidISO}.` : "Email or upload to customer portal."}>
            {invoice.status !== "sent" && invoice.status !== "paid" && invoice.erp?.pushed && (
              <button onClick={() => { setInvoiceStatus(invoice.id, "sent"); flashOnce("Invoice sent to customer."); }}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-brand text-brand-foreground text-[11px] hover:opacity-90 transition-opacity">
                <Send className="size-3" />
                Send
              </button>
            )}
            {invoice.status === "sent" && (
              <button onClick={() => { setInvoiceStatus(invoice.id, "paid"); flashOnce("Marked as paid."); }}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-success text-white text-[11px] hover:opacity-90 transition-opacity">
                <Check className="size-3" />
                Mark paid
              </button>
            )}
          </Step>
        </ol>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line items */}
        <section className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Line items</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/40 border-b border-border">
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                <th className="text-left px-4 py-2 font-semibold">Description</th>
                <th className="text-right px-3 py-2 font-semibold">Qty</th>
                <th className="text-right px-3 py-2 font-semibold">Rate</th>
                <th className="text-right px-4 py-2 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((li) => (
                <tr key={li.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2 text-[12px] text-foreground">{li.description}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{li.qty} {li.unit}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{CURRENCY_SYMBOL[invoice.currency]}{li.rate.toLocaleString("en-IN")}</td>
                  <td className={`px-4 py-2 text-right tabular-nums font-medium ${li.amount < 0 ? "text-destructive" : "text-foreground"}`}>{CURRENCY_SYMBOL[invoice.currency]}{li.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface-overlay/30">
              <tr>
                <td colSpan={3} className="px-4 py-1.5 text-right text-[12px] text-muted-foreground">Subtotal</td>
                <td className="px-4 py-1.5 text-right tabular-nums text-[12px] text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.subtotal.toLocaleString("en-IN")}</td>
              </tr>
              {invoice.taxPct > 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-1.5 text-right text-[12px] text-muted-foreground">Tax ({invoice.taxPct}%)</td>
                  <td className="px-4 py-1.5 text-right tabular-nums text-[12px] text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.tax.toLocaleString("en-IN")}</td>
                </tr>
              )}
              <tr className="text-[13px] font-semibold">
                <td colSpan={3} className="px-4 py-2 text-right text-muted-foreground">Total</td>
                <td className="px-4 py-2 text-right tabular-nums text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.total.toLocaleString("en-IN")}</td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Side panel */}
        <aside className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Customer</p>
            <p className="text-sm text-foreground inline-flex items-center gap-2">
              <Building2 className="size-3.5 text-muted-foreground" />
              {invoice.customer}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">Currency: {CURRENCY_SYMBOL[invoice.currency]} {invoice.currency}</p>
            <p className="text-[11px] text-muted-foreground">≈ {formatMoney(invoice.total * (invoice.currency === "USD" ? 84 : invoice.currency === "SGD" ? 62 : invoice.currency === "GBP" ? 108 : 1), "INR", true)} INR</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Dates</p>
            <ul className="space-y-1 text-[12px]">
              <li className="flex items-center justify-between"><span className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3" />Issued</span><span className="text-foreground tabular-nums">{invoice.issuedISO ?? "—"}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3" />Due</span><span className="text-foreground tabular-nums">{invoice.dueISO ?? "—"}</span></li>
              {invoice.paidISO && <li className="flex items-center justify-between"><span className="text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3" />Paid</span><span className="text-success tabular-nums">{invoice.paidISO}</span></li>}
            </ul>
          </div>

          {invoice.customerNote && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5 inline-flex items-center gap-1.5">
                <Mail className="size-3" />
                Customer note (on invoice)
              </p>
              <p className="text-[12px] text-foreground leading-relaxed">{invoice.customerNote}</p>
            </div>
          )}
          {invoice.internalNote && (
            <div className="bg-warning/5 border border-warning/30 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-warning/80 font-semibold mb-1.5 inline-flex items-center gap-1.5">
                <Lock className="size-3" />
                Internal note (not on invoice)
              </p>
              <p className="text-[12px] text-foreground leading-relaxed">{invoice.internalNote}</p>
            </div>
          )}
        </aside>
      </div>

      {/* Hint */}
      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2">
        <Sparkles className="size-3 mt-0.5" />
        The Compliance &amp; Quality Gate agent verifies acceptance evidence before allowing a milestone invoice to leave PM review.
      </p>

      <AnimatePresence>
        {showPreview && (
          <CustomerPreview invoice={invoice} project={project?.name ?? ""} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Step({
  label,
  done,
  blocked,
  note,
  children,
}: {
  label: string;
  done: boolean;
  blocked?: boolean;
  note: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className={`size-6 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-success/10 text-success" : blocked ? "bg-secondary text-muted-foreground/60" : "bg-warning/10 text-warning"}`}>
        {done ? <Check className="size-3" /> : blocked ? <Lock className="size-3" /> : <span className="size-1.5 rounded-full bg-current" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-medium ${done ? "text-foreground" : blocked ? "text-muted-foreground/70" : "text-foreground"}`}>{label}</p>
          {children}
        </div>
        <p className="text-[11px] text-muted-foreground">{note}</p>
      </div>
    </li>
  );
}

function CustomerPreview({ invoice, project, onClose }: { invoice: ReturnType<typeof useFinanceStore>["invoices"][number]; project: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()} className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Customer-facing preview</h3>
            <p className="text-[11px] text-muted-foreground">This is exactly what the client sees. Internal notes are hidden.</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-w-xl mx-auto">
            <div className="flex items-start justify-between border-b border-border pb-3">
              <div>
                <p className="text-xl font-bold text-foreground">Latent Bridge Pvt Ltd</p>
                <p className="text-[11px] text-muted-foreground">Bangalore, India</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Invoice</p>
                <p className="text-lg font-bold tabular-nums text-foreground">{invoice.number}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Bill to</p>
                <p className="text-foreground">{invoice.customer}</p>
                <p className="text-muted-foreground">Re: {project}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Issued</p>
                <p className="text-foreground tabular-nums">{invoice.issuedISO ?? "(draft)"}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Due</p>
                <p className="text-foreground tabular-nums">{invoice.dueISO ?? "—"}</p>
              </div>
            </div>
            <table className="w-full text-[12px] border-t border-border pt-3">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left py-1.5">Description</th>
                  <th className="text-right py-1.5">Qty</th>
                  <th className="text-right py-1.5">Rate</th>
                  <th className="text-right py-1.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-border">
                    <td className="py-2 text-foreground">{li.description}</td>
                    <td className="py-2 text-right tabular-nums">{li.qty}</td>
                    <td className="py-2 text-right tabular-nums">{CURRENCY_SYMBOL[invoice.currency]}{li.rate.toLocaleString("en-IN")}</td>
                    <td className="py-2 text-right tabular-nums">{CURRENCY_SYMBOL[invoice.currency]}{li.amount.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-1.5 text-right text-muted-foreground">Subtotal</td>
                  <td className="py-1.5 text-right tabular-nums text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.subtotal.toLocaleString("en-IN")}</td>
                </tr>
                {invoice.taxPct > 0 && (
                  <tr>
                    <td colSpan={3} className="py-1.5 text-right text-muted-foreground">Tax ({invoice.taxPct}%)</td>
                    <td className="py-1.5 text-right tabular-nums text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.tax.toLocaleString("en-IN")}</td>
                  </tr>
                )}
                <tr className="text-base font-bold">
                  <td colSpan={3} className="py-2 text-right text-muted-foreground">Total</td>
                  <td className="py-2 text-right tabular-nums text-foreground">{CURRENCY_SYMBOL[invoice.currency]}{invoice.total.toLocaleString("en-IN")}</td>
                </tr>
              </tfoot>
            </table>
            {invoice.customerNote && (
              <div className="border-t border-border pt-3 text-[11px] text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Note</p>
                <p>{invoice.customerNote}</p>
              </div>
            )}
            <p className="text-center text-[10px] text-muted-foreground/60 border-t border-border pt-3">
              Thank you for your business. Questions? finance@latentbridge.com
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
