"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronUp,
  Search,
} from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type Table,
} from "@tanstack/react-table";

/**
 * O2S shared data-table primitive — Azure-portal style.
 *
 * Backed by @tanstack/react-table. Wraps the common case (sortable,
 * searchable, paginated rows with optional row actions and toolbar
 * slot) so module pages stay short.
 *
 * Pass `columns` and `data`. Cells use the tanstack `cell` renderer
 * which receives `row.original` so consumers can compose JSX freely.
 *
 * Visual language matches the rest of the app: bg-card surface,
 * surface-overlay/40 header strip, dense rows (h-9), zebra-free.
 */
export interface DataTableProps<T> {
  columns: ColumnDef<T, unknown>[];
  data: T[];
  /** Optional global search across all columns. */
  searchPlaceholder?: string;
  /** Show pagination footer. Default true. */
  pageable?: boolean;
  /** Page-size options. */
  pageSizes?: number[];
  /** Initial page size. */
  initialPageSize?: number;
  /** Initial sort state. */
  initialSort?: SortingState;
  /** Optional content rendered to the right of the search input (filters, action buttons). */
  toolbar?: React.ReactNode;
  /** Click handler on a row. */
  onRowClick?: (row: T) => void;
  /** Empty-state label. */
  emptyLabel?: string;
  /** Dense rows (h-8 instead of h-9). */
  dense?: boolean;
  /** Optional id for keyed local-storage of column visibility / sort. */
  storageKey?: string;
  /** Optional initial column visibility. */
  initialColumnVisibility?: VisibilityState;
  /** Hide the toolbar entirely (no search, no column picker). Default false. */
  hideToolbar?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  searchPlaceholder = "Search…",
  pageable = true,
  pageSizes = [10, 25, 50, 100],
  initialPageSize = 25,
  initialSort = [],
  toolbar,
  onRowClick,
  emptyLabel = "No rows match.",
  dense = false,
  initialColumnVisibility,
  hideToolbar = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(initialSort);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialColumnVisibility ?? {});

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(pageable ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    initialState: pageable ? { pagination: { pageSize: initialPageSize } } : undefined,
  });

  const rows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const rowHeightClass = dense ? "h-8" : "h-9";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      {/* Toolbar */}
      {!hideToolbar && (
      <div className="px-3 py-2 border-b border-border flex items-center gap-2 flex-wrap bg-surface-overlay/30">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-8 pl-9 pr-3 rounded-lg border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        {toolbar}
        <ColumnVisibilityMenu table={table} />
      </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sort = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={`text-left px-3 py-2 font-semibold whitespace-nowrap ${canSort ? "cursor-pointer select-none hover:text-foreground" : ""}`}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: header.getSize() === 150 ? undefined : header.getSize() }}
                    >
                      <span className="inline-flex items-center gap-1">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          sort === "asc" ? <ChevronUp className="size-3" />
                            : sort === "desc" ? <ChevronDown className="size-3" />
                            : <ChevronsUpDown className="size-3 text-muted-foreground/40" />
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted-foreground italic">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`${rowHeightClass} border-b border-border last:border-b-0 ${onRowClick ? "cursor-pointer" : ""} hover:bg-surface-overlay/30 transition-colors`}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageable && (
        <div className="px-3 py-2 border-t border-border flex items-center justify-between gap-2 flex-wrap text-[11px] text-muted-foreground bg-surface-overlay/20">
          <p className="tabular-nums">
            {totalRows === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              totalRows,
            )} of {totalRows}
          </p>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5">
              <span>Rows</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-7 px-1.5 rounded border border-input bg-card text-[11px] text-foreground"
              >
                {pageSizes.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-0.5">
              <PageBtn label="First" disabled={!table.getCanPreviousPage()} onClick={() => table.setPageIndex(0)}>
                <ChevronsLeft className="size-3" />
              </PageBtn>
              <PageBtn label="Prev" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                <ChevronLeft className="size-3" />
              </PageBtn>
              <span className="px-2 tabular-nums">
                {table.getState().pagination.pageIndex + 1} / {Math.max(table.getPageCount(), 1)}
              </span>
              <PageBtn label="Next" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                <ChevronRight className="size-3" />
              </PageBtn>
              <PageBtn label="Last" disabled={!table.getCanNextPage()} onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                <ChevronsRight className="size-3" />
              </PageBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageBtn({
  children,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="size-6 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function ColumnVisibilityMenu<T>({ table }: { table: Table<T> }) {
  const [open, setOpen] = useState(false);
  const cols = table.getAllLeafColumns().filter((c) => c.getCanHide());
  if (cols.length === 0) return null;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-8 px-2.5 rounded-lg border border-input bg-card text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
      >
        Columns
        <ChevronDown className="size-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-lg shadow-md p-1 z-50">
            {cols.map((c) => (
              <label key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-overlay text-[12px] cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.getIsVisible()}
                  onChange={(e) => c.toggleVisibility(e.target.checked)}
                  className="accent-brand-purple"
                />
                <span className="text-foreground capitalize">
                  {String(c.columnDef.header) || c.id}
                </span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ───────────────────────── Re-exports ─────────────────────────
   So consumers can build column defs without importing from tanstack
   directly. Keep the import surface small.
   ──────────────────────────────────────────────────────────── */

export type { ColumnDef, Row } from "@tanstack/react-table";
