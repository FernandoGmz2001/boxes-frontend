import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGetShift, useGetShiftCorte } from "../../services/shifts/queries.ts";
import CashMovementList from "./CashMovementList.tsx";
import CorteSummary from "./CorteSummary.tsx";

interface CorteDialogProps {
  shiftId: number;
  onClose: () => void;
}

export default function CorteDialog({ shiftId, onClose }: CorteDialogProps) {
  const corteQuery = useGetShiftCorte(shiftId);
  const shiftQuery = useGetShift(shiftId);
  const movements = shiftQuery.data?.movimientos ?? [];

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[min(90svh,860px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Corte del turno</DialogTitle>
          <DialogDescription>Vista previa: el turno sigue abierto hasta que lo cierres.</DialogDescription>
        </DialogHeader>
        {corteQuery.isLoading ? <Skeleton className="h-80 w-full" /> : null}
        {corteQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{corteQuery.error.message}</AlertDescription>
          </Alert>
        ) : null}
        {corteQuery.data ? <CorteSummary corte={corteQuery.data} /> : null}
        {movements.length > 0 ? <CashMovementList movements={movements} /> : null}
        <DialogFooter>
          <Button type="button" onClick={onClose}>
            Listo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
