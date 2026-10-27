import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { ICierreTurno } from "../../interfaces/shifts/close.interface.ts";
import { formatDateTime } from "../../pos-dates.ts";
import { toCents } from "../../pos-money.ts";
import CashDifference from "./CashDifference.tsx";
import CorteSummary from "./CorteSummary.tsx";

interface ShiftClosedDialogProps {
  closing: ICierreTurno;
  onClose: () => void;
}

export default function ShiftClosedDialog({ closing, onClose }: ShiftClosedDialogProps) {
  const { turno, corte } = closing;
  const differenceCents = turno.diferencia === null ? null : toCents(turno.diferencia);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[min(92svh,900px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Turno cerrado</DialogTitle>
          <DialogDescription>
            {turno.cerrado_at ? `Cerrado el ${formatDateTime(turno.cerrado_at)}.` : "El turno quedó cerrado."}
          </DialogDescription>
        </DialogHeader>
        <CorteSummary corte={corte} />
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Efectivo esperado</dt>
            <dd className="tabular-nums">{formatMoney(turno.efectivo_esperado ?? corte.efectivo_esperado)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Efectivo contado</dt>
            <dd className="tabular-nums">{turno.efectivo_contado ? formatMoney(turno.efectivo_contado) : "—"}</dd>
          </div>
        </dl>
        <CashDifference cents={differenceCents} />
        {turno.notas ? <p className="rounded-xl bg-muted p-3 text-sm">{turno.notas}</p> : null}
        <DialogFooter>
          <Button type="button" autoFocus onClick={onClose}>
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
