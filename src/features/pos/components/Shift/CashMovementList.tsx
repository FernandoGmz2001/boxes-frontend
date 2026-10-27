import { Badge } from "@/components/ui/badge.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { IMovimientoCaja } from "../../interfaces/shifts/get.interface.ts";
import { formatTime } from "../../pos-dates.ts";

interface CashMovementListProps {
  movements: IMovimientoCaja[];
}

export default function CashMovementList({ movements }: CashMovementListProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Movimientos de caja</span>
      <ul className="flex flex-col divide-y rounded-xl border text-sm">
        {movements.map((movement) => (
          <li key={movement.id} className="flex items-center gap-3 px-3 py-2">
            <Badge variant={movement.tipo === "Entrada" ? "secondary" : "destructive"}>{movement.tipo}</Badge>
            <span className="min-w-0 flex-1 truncate">{movement.motivo}</span>
            <span className="text-xs text-muted-foreground">{formatTime(movement.created_at)}</span>
            <span className="tabular-nums">{formatMoney(movement.monto)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
