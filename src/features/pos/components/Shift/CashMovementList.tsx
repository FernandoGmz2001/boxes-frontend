import {
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  ClockIcon,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { IMovimientoCaja } from "../../interfaces/shifts/get.interface.ts";
import { formatTime } from "../../pos-dates.ts";
import { formatCents, toCents } from "../../pos-money.ts";

interface CashMovementListProps {
  movements: IMovimientoCaja[];
}

export default function CashMovementList({ movements }: CashMovementListProps) {
  const entriesCents = movements
    .filter((movement) => movement.tipo === "Entrada")
    .reduce((sum, movement) => sum + toCents(movement.monto), 0);
  const withdrawalsCents = movements
    .filter((movement) => movement.tipo === "Retiro")
    .reduce((sum, movement) => sum + toCents(movement.monto), 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <ArrowLeftRightIcon className="size-4 text-muted-foreground" aria-hidden="true" />
          Movimientos de caja
          <Badge variant="secondary" className="tabular-nums">
            {movements.length}
          </Badge>
        </span>
        <div className="flex items-center gap-1.5">
          <Badge variant="success" className="tabular-nums">
            <ArrowDownLeftIcon data-icon="inline-start" />
            {formatCents(entriesCents)}
          </Badge>
          <Badge variant="destructive" className="tabular-nums">
            <ArrowUpRightIcon data-icon="inline-start" />
            {formatCents(withdrawalsCents)}
          </Badge>
        </div>
      </div>
      <ul className="flex flex-col divide-y rounded-xl border text-sm">
        {movements.map((movement) => {
          const isEntry = movement.tipo === "Entrada";

          return (
            <li key={movement.id} className="flex items-center gap-3 px-3 py-2.5">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  isEntry
                    ? "bg-success/10 text-success dark:bg-success/20"
                    : "bg-destructive/10 text-destructive dark:bg-destructive/20",
                )}
                aria-hidden="true"
              >
                {isEntry ? (
                  <ArrowDownLeftIcon className="size-4" />
                ) : (
                  <ArrowUpRightIcon className="size-4" />
                )}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-medium">{movement.motivo}</span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ClockIcon className="size-3" aria-hidden="true" />
                  {formatTime(movement.created_at)}
                </span>
              </div>
              <Badge variant={isEntry ? "success" : "destructive"}>{movement.tipo}</Badge>
              <span
                className={cn(
                  "w-24 text-right font-medium tabular-nums",
                  isEntry ? "text-success" : "text-destructive",
                )}
              >
                {isEntry ? "+" : "−"}
                {formatMoney(movement.monto)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
