"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  APPROVAL_CHAIN,
  BILL_RATES,
  BUDGET_LINES,
  COST_RATES,
  INVOICES,
  PURCHASE_ORDERS,
  REVENUE_LINES,
  type ApprovalLayer,
  type BillRate,
  type BudgetLine,
  type CostRate,
  type ForecastScenario,
  type Invoice,
  type InvoiceStatus,
  type PurchaseOrder,
  type RevenueLine,
  type TimesheetApproval,
} from "@/components/delivery/financial/data";

interface FinanceOverlay {
  /** Patches per budget line. */
  budgetPatches: Record<string, Partial<BudgetLine>>;
  /** New cost rates added. */
  newCostRates: CostRate[];
  /** New bill rates added. */
  newBillRates: BillRate[];
  /** Invoice patches by id (status changes, approvals, ERP push). */
  invoicePatches: Record<string, Partial<Invoice>>;
  /** New invoices created. */
  newInvoices: Invoice[];
  /** Revenue line status overrides. */
  revenueStatusOverrides: Record<string, RevenueLine["status"]>;
  /** PO patches. */
  poPatches: Record<string, Partial<PurchaseOrder>>;
  /** New POs. */
  newPos: PurchaseOrder[];
  /** Approval state overrides. */
  approvalOverrides: Record<string, Partial<TimesheetApproval>>;
  /** Selected forecast scenario. */
  scenario: ForecastScenario;
}

const DEFAULT_OVERLAY: FinanceOverlay = {
  budgetPatches: {},
  newCostRates: [],
  newBillRates: [],
  invoicePatches: {},
  newInvoices: [],
  revenueStatusOverrides: {},
  poPatches: {},
  newPos: [],
  approvalOverrides: {},
  scenario: "base",
};

function normalize(raw: Partial<FinanceOverlay> | undefined | null): FinanceOverlay {
  const r = raw ?? {};
  return {
    budgetPatches: r.budgetPatches ?? {},
    newCostRates: r.newCostRates ?? [],
    newBillRates: r.newBillRates ?? [],
    invoicePatches: r.invoicePatches ?? {},
    newInvoices: r.newInvoices ?? [],
    revenueStatusOverrides: r.revenueStatusOverrides ?? {},
    poPatches: r.poPatches ?? {},
    newPos: r.newPos ?? [],
    approvalOverrides: r.approvalOverrides ?? {},
    scenario: r.scenario ?? "base",
  };
}

const TENANT_ADMIN_NAME = "Grace Liu";

export function useFinanceStore() {
  const [raw, setRaw] = useLocalStorage<FinanceOverlay>("o2s.financeOverlay", DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(raw), [raw]);
  const [nowMs] = useState(() => Date.now());

  const setOverlay = useCallback(
    (v: FinanceOverlay | ((prev: FinanceOverlay) => FinanceOverlay)) => {
      if (typeof v === "function") {
        setRaw((prev) => (v as (p: FinanceOverlay) => FinanceOverlay)(normalize(prev)));
      } else {
        setRaw(v);
      }
    },
    [setRaw],
  );

  /* ── Budgets ── */

  const budgetLines = useMemo<BudgetLine[]>(() => {
    return BUDGET_LINES.map((b) => {
      const patch = overlay.budgetPatches[b.id];
      return patch ? { ...b, ...patch } : b;
    });
  }, [overlay.budgetPatches]);

  const updateBudgetLine = useCallback(
    (id: string, patch: Partial<BudgetLine>) => {
      setOverlay((prev) => ({
        ...prev,
        budgetPatches: { ...prev.budgetPatches, [id]: { ...(prev.budgetPatches[id] ?? {}), ...patch } },
      }));
    },
    [setOverlay],
  );

  /** Move budget from one line to another (intra-project reallocation). */
  const reallocateBudget = useCallback(
    (fromId: string, toId: string, amountINR: number) => {
      const from = budgetLines.find((b) => b.id === fromId);
      const to = budgetLines.find((b) => b.id === toId);
      if (!from || !to || amountINR <= 0 || from.plannedINR < amountINR) return false;
      updateBudgetLine(fromId, { plannedINR: from.plannedINR - amountINR });
      updateBudgetLine(toId, { plannedINR: to.plannedINR + amountINR });
      return true;
    },
    [budgetLines, updateBudgetLine],
  );

  /* ── Rates ── */

  const costRates = useMemo<CostRate[]>(() => [...COST_RATES, ...overlay.newCostRates], [overlay.newCostRates]);
  const billRates = useMemo<BillRate[]>(() => [...BILL_RATES, ...overlay.newBillRates], [overlay.newBillRates]);

  const addCostRate = useCallback(
    (r: Omit<CostRate, "id">) => {
      const id = `cr-new-${Date.now()}`;
      setOverlay((prev) => ({ ...prev, newCostRates: [...prev.newCostRates, { ...r, id }] }));
    },
    [setOverlay],
  );

  const addBillRate = useCallback(
    (r: Omit<BillRate, "id">) => {
      const id = `br-new-${Date.now()}`;
      setOverlay((prev) => ({ ...prev, newBillRates: [...prev.newBillRates, { ...r, id }] }));
    },
    [setOverlay],
  );

  /* ── Invoices ── */

  const invoices = useMemo<Invoice[]>(() => {
    const base = INVOICES.map((inv) => {
      const patch = overlay.invoicePatches[inv.id];
      return patch ? { ...inv, ...patch, pmApproval: { ...inv.pmApproval, ...(patch.pmApproval ?? {}) }, financeApproval: { ...inv.financeApproval, ...(patch.financeApproval ?? {}) } } : inv;
    });
    return [...base, ...overlay.newInvoices];
  }, [overlay.invoicePatches, overlay.newInvoices]);

  const findInvoice = useCallback((id: string) => invoices.find((i) => i.id === id), [invoices]);

  const setInvoiceStatus = useCallback(
    (id: string, status: InvoiceStatus) => {
      setOverlay((prev) => ({
        ...prev,
        invoicePatches: { ...prev.invoicePatches, [id]: { ...(prev.invoicePatches[id] ?? {}), status } },
      }));
    },
    [setOverlay],
  );

  const approveInvoice = useCallback(
    (id: string, layer: "pm" | "finance", note?: string) => {
      const now = new Date(nowMs);
      const stamp = {
        approved: true,
        byName: TENANT_ADMIN_NAME,
        whenISO: now.toISOString(),
        note,
      };
      setOverlay((prev) => {
        const inv = INVOICES.find((i) => i.id === id) ?? prev.newInvoices.find((i) => i.id === id);
        if (!inv) return prev;
        const patch = prev.invoicePatches[id] ?? {};
        const next: Partial<Invoice> = { ...patch };
        if (layer === "pm") next.pmApproval = stamp;
        else next.financeApproval = stamp;

        // Advance status if both layers signed off.
        const both =
          (layer === "pm" ? true : (patch.pmApproval?.approved ?? inv.pmApproval.approved)) &&
          (layer === "finance" ? true : (patch.financeApproval?.approved ?? inv.financeApproval.approved));
        if (both && (patch.status ?? inv.status) !== "sent" && (patch.status ?? inv.status) !== "paid") {
          next.status = "finance_review";
        }
        if (layer === "finance") next.status = "sent";
        if (layer === "pm" && !inv.pmApproval.approved) next.status = "finance_review";
        return { ...prev, invoicePatches: { ...prev.invoicePatches, [id]: next } };
      });
    },
    [setOverlay, nowMs],
  );

  const pushToErp = useCallback(
    (id: string, destination: Invoice["erp"] extends infer T ? (T extends { destination: infer D } ? D : never) : never) => {
      const now = new Date(nowMs);
      setOverlay((prev) => ({
        ...prev,
        invoicePatches: {
          ...prev.invoicePatches,
          [id]: {
            ...(prev.invoicePatches[id] ?? {}),
            erp: { destination: destination as never, pushed: true, pushedISO: now.toISOString(), externalRef: `EXT-${Date.now().toString().slice(-6)}` },
          },
        },
      }));
    },
    [setOverlay, nowMs],
  );

  /* ── Revenue lines ── */

  const revenueLines = useMemo<RevenueLine[]>(() => {
    return REVENUE_LINES.map((r) => {
      const status = overlay.revenueStatusOverrides[r.id];
      return status ? { ...r, status } : r;
    });
  }, [overlay.revenueStatusOverrides]);

  const setRevenueStatus = useCallback(
    (id: string, status: RevenueLine["status"]) => {
      setOverlay((prev) => ({
        ...prev,
        revenueStatusOverrides: { ...prev.revenueStatusOverrides, [id]: status },
      }));
    },
    [setOverlay],
  );

  /* ── POs ── */

  const purchaseOrders = useMemo<PurchaseOrder[]>(() => {
    const base = PURCHASE_ORDERS.map((p) => {
      const patch = overlay.poPatches[p.id];
      return patch ? { ...p, ...patch } : p;
    });
    return [...base, ...overlay.newPos];
  }, [overlay.poPatches, overlay.newPos]);

  const updatePO = useCallback(
    (id: string, patch: Partial<PurchaseOrder>) => {
      setOverlay((prev) => ({
        ...prev,
        poPatches: { ...prev.poPatches, [id]: { ...(prev.poPatches[id] ?? {}), ...patch } },
      }));
    },
    [setOverlay],
  );

  /* ── Approvals ── */

  const approvals = useMemo<TimesheetApproval[]>(() => {
    return APPROVAL_CHAIN.map((a) => {
      const ov = overlay.approvalOverrides[a.id];
      return ov ? { ...a, ...ov } : a;
    });
  }, [overlay.approvalOverrides]);

  const setApprovalState = useCallback(
    (id: string, status: "approved" | "rejected", reason?: string) => {
      const now = new Date(nowMs);
      setOverlay((prev) => ({
        ...prev,
        approvalOverrides: {
          ...prev.approvalOverrides,
          [id]: {
            ...(prev.approvalOverrides[id] ?? {}),
            status,
            whenISO: now.toISOString(),
            rejectionReason: status === "rejected" ? reason : undefined,
          },
        },
      }));
    },
    [setOverlay, nowMs],
  );

  function approvalsForLayer(layer: ApprovalLayer): TimesheetApproval[] {
    return approvals.filter((a) => a.layer === layer);
  }

  /* ── Scenario ── */

  const scenario = overlay.scenario;
  const setScenario = useCallback(
    (s: ForecastScenario) => {
      setOverlay((prev) => ({ ...prev, scenario: s }));
    },
    [setOverlay],
  );

  return {
    /* budgets */
    budgetLines,
    updateBudgetLine,
    reallocateBudget,
    /* rates */
    costRates,
    billRates,
    addCostRate,
    addBillRate,
    /* invoices */
    invoices,
    findInvoice,
    setInvoiceStatus,
    approveInvoice,
    pushToErp,
    /* revenue */
    revenueLines,
    setRevenueStatus,
    /* POs */
    purchaseOrders,
    updatePO,
    /* approvals */
    approvals,
    setApprovalState,
    approvalsForLayer,
    /* scenarios */
    scenario,
    setScenario,
  };
}
