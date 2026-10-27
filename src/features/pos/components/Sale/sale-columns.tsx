import { createColumnHelper } from "@tanstack/react-table";
import {
  CalendarIcon,
  CircleDollarSignIcon,
  EyeIcon,
  HashIcon,
  ReceiptIcon,
  ShoppingBasketIcon,
  WalletCardsIcon,
} from "lucide-react";
import DataTableColumnHeader from "@/components/features/DataTable/DataTableColumnHeader.tsx";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { IVentaResumen } from "../../interfaces/sales/get-all.interface.ts";
import {
  PAYMENT_METHOD_BADGE_VARIANTS,
  PAYMENT_METHOD_ICONS,
} from "../../payment-method-icons.ts";
import { formatDateTime } from "../../pos-dates.ts";

export interface SaleColumnHandlers {
  onOpen: (saleId: number) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, IVentaResumen>();

export function createSaleColumns(handlers: SaleColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor("folio", {
      header: () => <DataTableColumnHeader icon={HashIcon} title="Folio" />,
      cell: ({ row }) => (
        <button
          type="button"
          className="inline-flex items-center gap-2 font-mono font-medium underline-offset-4 hover:underline"
          onClick={() => handlers.onOpen(row.original.id)}
        >
          <span
            className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground"
            aria-hidden="true"
          >
            <ReceiptIcon className="size-3.5" />
          </span>
          {row.original.folio}
        </button>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: () => <DataTableColumnHeader icon={CalendarIcon} title="Fecha" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDateTime(row.original.created_at)}
        </span>
      ),
    }),
    columnHelper.accessor("articulos", {
      header: () => (
        <DataTableColumnHeader icon={ShoppingBasketIcon} title="Artículos" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="tabular-nums">
          <ShoppingBasketIcon data-icon="inline-start" />
          {row.original.articulos}
        </Badge>
      ),
    }),
    columnHelper.accessor("metodo_pago", {
      header: () => (
        <DataTableColumnHeader icon={WalletCardsIcon} title="Método" />
      ),
      cell: ({ row }) => {
        const paymentMethod = row.original.metodo_pago;
        const PaymentIcon = PAYMENT_METHOD_ICONS[paymentMethod];

        return (
          <Badge variant={PAYMENT_METHOD_BADGE_VARIANTS[paymentMethod]}>
            <PaymentIcon data-icon="inline-start" />
            {paymentMethod}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("total", {
      header: () => (
        <DataTableColumnHeader
          icon={CircleDollarSignIcon}
          title="Total"
          className="w-full justify-end"
        />
      ),
      cell: ({ row }) => (
        <span className="block text-right font-semibold tabular-nums">
          {formatMoney(row.original.total)}
        </span>
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
