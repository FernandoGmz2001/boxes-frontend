import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import CashDifference from "@/features/pos/components/Shift/CashDifference.tsx";
import CashMovementList from "@/features/pos/components/Shift/CashMovementList.tsx";
import CorteSummary from "@/features/pos/components/Shift/CorteSummary.tsx";
import type { ITurnoDetalle } from "@/features/pos/interfaces/shifts/get.interface.ts";
import { toCents } from "@/features/pos/pos-money.ts";
import { useGetShiftCorte } from "@/features/pos/services/shifts/queries.ts";
import { formatMoney } from "@/features/products/format-money.ts";

interface ShiftSummaryProps {
  shift: ITurnoDetalle;
}

export default function ShiftSummary({ shift }: ShiftSummaryProps) {
  const corteQuery = useGetShiftCorte(shift.id);
  const isClosed = shift.estado === "Cerrado";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <Card className="flex flex-col gap-4 p-4">
        <span className="font-medium">Corte</span>
        {corteQuery.isLoading ? <Skeleton className="h-80 w-full" /> : null}
        {corteQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{corteQuery.error.message}</AlertDescription>
          </Alert>
        ) : null}
        {corteQuery.data ? <CorteSummary corte={corteQuery.data} /> : null}
      </Card>
      <div className="flex flex-col gap-4">
        <Card className="flex flex-col gap-4 p-4">
          <span className="font-medium">Cierre</span>
          {isClosed ? (
            <>
              <dl className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Efectivo esperado</dt>
                  <dd className="tabular-nums">
                    {shift.efectivo_esperado ? formatMoney(shift.efectivo_esperado) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Efectivo contado</dt>
                  <dd className="tabular-nums">
                    {shift.efectivo_contado ? formatMoney(shift.efectivo_contado) : "—"}
                  </dd>
                </div>
              </dl>
              <CashDifference cents={shift.diferencia === null ? null : toCents(shift.diferencia)} />
              {shift.notas ? <p className="rounded-xl bg-muted p-3 text-sm">{shift.notas}</p> : null}
            </>
          ) : (
            <Alert>
              <AlertDescription>
                El turno sigue abierto: el corte es una vista previa y puede cambiar con nuevas ventas.
              </AlertDescription>
            </Alert>
          )}
        </Card>
        <Card className="flex flex-col gap-2 p-4">
          {shift.movimientos.length > 0 ? (
            <CashMovementList movements={shift.movimientos} />
          ) : (
            <>
              <span className="text-sm font-medium">Movimientos de caja</span>
              <p className="text-sm text-muted-foreground">No hubo entradas ni retiros en este turno.</p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
