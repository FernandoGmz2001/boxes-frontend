import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { IVentaResumen } from "../../interfaces/sales/get-all.interface.ts";
import { formatDateTime } from "../../pos-dates.ts";

export interface SaleColumnHandlers {
  onOpen: (saleId: number) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, IVentaResumen>();

export function createSaleColumns(handlers: SaleColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor("folio", {
      header: "Folio",
      cell: ({ row }) => (
        <button
          type="button"
          className="font-mono font-medium underline-offset-4 hover:underline"
          onClick={() => handlers.onOpen(row.original.id)}
        >
          {row.original.folio}
        </button>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Fecha",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    }),
    columnHelper.accessor("articulos", {
      header: "Artículos",
      cell: ({ row }) => <span className="tabular-nums">{row.original.articulos}</span>,
    }),
    columnHelper.accessor("metodo_pago", {
      header: "Método",
      cell: ({ row }) => <Badge variant="secondary">{row.original.metodo_pago}</Badge>,
    }),
    columnHelper.accessor("total", {
      header: () => <span className="block text-right">Total</span>,
      cell: ({ row }) => (
        <span className="block text-right font-medium tabular-nums">{formatMoney(row.original.total)}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Ver venta ${row.original.folio}`}
            onClick={() => handlers.onOpen(row.original.id)}
          >
            <EyeIcon />
          </Button>
        </div>
      ),
    }),
  ]);
}
