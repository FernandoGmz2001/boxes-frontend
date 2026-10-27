import { createColumnHelper } from "@tanstack/react-table";
import {
  ActivityIcon,
  CalculatorIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  CheckIcon,
  CircleDotIcon,
  EyeIcon,
  HandCoinsIcon,
  HashIcon,
  LockIcon,
  MonitorIcon,
  ScaleIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserIcon,
} from "lucide-react";
import DataTableColumnHeader from "@/components/features/DataTable/DataTableColumnHeader.tsx";
import type { DataTableFeatures } from "@/components/features/DataTable/data-table-features.ts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDateTime } from "@/features/pos/pos-dates.ts";
import { formatCents, toCents } from "@/features/pos/pos-money.ts";
import { formatMoney } from "@/features/products/format-money.ts";
import { userInitials } from "@/features/users/user-initials.ts";
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
      header: () => <DataTableColumnHeader icon={HashIcon} title="Turno" />,
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
      header: () => <DataTableColumnHeader icon={UserIcon} title="Cajero" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar size="sm">
            <AvatarFallback className="font-medium">
              {userInitials(row.original.usuario.nombre)}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.usuario.nombre}</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "caja",
      header: () => <DataTableColumnHeader icon={MonitorIcon} title="Caja" />,
      cell: ({ row }) => (
        <Badge variant="outline">
          <MonitorIcon data-icon="inline-start" />
          {row.original.caja.nombre}
        </Badge>
      ),
    }),
    columnHelper.accessor("abierto_at", {
      header: () => (
        <DataTableColumnHeader icon={CalendarClockIcon} title="Apertura" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDateTime(row.original.abierto_at)}
        </span>
      ),
    }),
    columnHelper.accessor("cerrado_at", {
      header: () => (
        <DataTableColumnHeader icon={CalendarCheckIcon} title="Cierre" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.cerrado_at
            ? formatDateTime(row.original.cerrado_at)
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("estado", {
      header: () => <DataTableColumnHeader icon={ActivityIcon} title="Estado" />,
      cell: ({ row }) =>
        row.original.estado === "Abierto" ? (
          <Badge variant="success">
            <CircleDotIcon data-icon="inline-start" className="animate-pulse" />
            Abierto
          </Badge>
        ) : (
          <Badge variant="secondary">
            <LockIcon data-icon="inline-start" />
            Cerrado
          </Badge>
        ),
    }),
    columnHelper.accessor("efectivo_esperado", {
      header: () => (
        <DataTableColumnHeader
          icon={CalculatorIcon}
          title="Esperado"
          className="w-full justify-end"
        />
      ),
      cell: ({ row }) => (
        <span className="block text-right tabular-nums">
          {row.original.efectivo_esperado
            ? formatMoney(row.original.efectivo_esperado)
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("efectivo_contado", {
      header: () => (
        <DataTableColumnHeader
          icon={HandCoinsIcon}
          title="Contado"
          className="w-full justify-end"
        />
      ),
      cell: ({ row }) => (
        <span className="block text-right tabular-nums">
          {row.original.efectivo_contado
            ? formatMoney(row.original.efectivo_contado)
            : "—"}
        </span>
      ),
    }),
    columnHelper.accessor("diferencia", {
      header: () => (
        <DataTableColumnHeader
          icon={ScaleIcon}
          title="Diferencia"
          className="w-full justify-end"
        />
      ),
      cell: ({ row }) => {
        if (row.original.diferencia === null) {
          return <span className="block text-right text-muted-foreground">—</span>;
        }

        const cents = toCents(row.original.diferencia);
        const DifferenceIcon =
          cents > 0 ? TrendingUpIcon : cents < 0 ? TrendingDownIcon : CheckIcon;

        return (
          <div className="flex justify-end">
            <Badge
              variant={cents > 0 ? "success" : cents < 0 ? "destructive" : "secondary"}
              className="tabular-nums"
            >
              <DifferenceIcon data-icon="inline-start" />
              {cents === 0 ? "Cuadra" : formatDifference(cents)}
            </Badge>
          </div>
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
