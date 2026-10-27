import { createColumnHelper } from "@tanstack/react-table";
import { EyeIcon } from "lucide-react";
import { cn } from "cn";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDateTime } from "@/features/pos/pos-dates.ts";
import { formatCents, toCents } from "@/features/pos/pos-money.ts";
import { formatMoney } from "@/features/products/format-money.ts";
import type { ITurnoResumen } from "../interfaces/get-all.interface.ts";

export interface ShiftColumnHandlers {
  onOpen: (shiftId: number) => void;
}

const columnHelper = createColumnHelper<DataTableFeatures, ITurnoResumen>();

function formatDifference(cents: number) {
  const sign = cents > 0 ? "+" : cents < 0 ? "−" : "";
  return `${sign}${formatCents(Math.abs(cents))}`;
}

export function createShiftColumns(handlers: ShiftColumnHandlers) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "Turno",
      cell: ({ row }) => (
        <button
          type="button"
          className="font-mono font-medium underline-offset-4 hover:underline"
          onClick={() => handlers.onOpen(row.original.id)}
        >
          #{row.original.id}
        </button>
      ),
    }),
    columnHelper.display({
      id: "usuario",
      header: "Cajero",
      cell: ({ row }) => row.original.usuario.nombre,
    }),
    columnHelper.display({
      id: "caja",
      header: "Caja",
      cell: ({ row }) => row.original.caja.nombre,
    }),
    columnHelper.accessor("abierto_at", {
      header: "Apertura",
      cell: ({ row }) => formatDateTime(row.original.abierto_at),
    }),
    columnHelper.accessor("cerrado_at", {
      header: "Cierre",
      cell: ({ row }) => (row.original.cerrado_at ? formatDateTime(row.original.cerrado_at) : "—"),
    }),
    columnHelper.accessor("estado", {
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.estado === "Abierto" ? "default" : "secondary"}>{row.original.estado}</Badge>
      ),
    }),
    columnHelper.accessor("efectivo_esperado", {
      header: () => <span className="block text-right">Esperado</span>,
      cell: ({ row }) => (
        <span className="block text-right tabular-nums">
          {row.original.efectivo_esperado ? formatMoney(row.original.efectivo_esperado) : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("efectivo_contado", {
      header: () => <span className="block text-right">Contado</span>,
      cell: ({ row }) => (
        <span className="block text-right tabular-nums">
          {row.original.efectivo_contado ? formatMoney(row.original.efectivo_contado) : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("diferencia", {
      header: () => <span className="block text-right">Diferencia</span>,
      cell: ({ row }) => {
        if (row.original.diferencia === null) return <span className="block text-right">—</span>;
        const cents = toCents(row.original.diferencia);
        return (
          <span
            className={cn(
              "block text-right font-medium tabular-nums",
              cents > 0 && "text-emerald-700 dark:text-emerald-400",
              cents < 0 && "text-destructive",
            )}
          >
            {formatDifference(cents)}
          </span>
        );
      },
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
            aria-label={`Ver turno ${row.original.id}`}
            onClick={() => handlers.onOpen(row.original.id)}
          >
            <EyeIcon />
          </Button>
        </div>
      ),
    }),
  ]);
}
