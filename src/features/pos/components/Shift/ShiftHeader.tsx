import { useState } from "react";
import { ArrowLeftRightIcon, ClipboardListIcon, LockIcon } from "lucide-react";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import type { ICierreTurno } from "../../interfaces/shifts/close.interface.ts";
import type { ITurno } from "../../interfaces/shifts/get.interface.ts";
import { formatDateTime } from "../../pos-dates.ts";
import { useGetShift } from "../../services/shifts/queries.ts";
import CashMovementDialog from "./CashMovementDialog.tsx";
import CloseShiftDialog from "./CloseShiftDialog.tsx";
import CorteDialog from "./CorteDialog.tsx";

type ShiftDialog = "movement" | "corte" | "close";

interface ShiftHeaderProps {
  shift: ITurno;
  onShiftClosed: (closing: ICierreTurno) => void;
}

export default function ShiftHeader({ shift, onShiftClosed }: ShiftHeaderProps) {
  const [openDialog, setOpenDialog] = useState<ShiftDialog | null>(null);
  const shiftQuery = useGetShift(shift.id);
  const closeDialog = () => setOpenDialog(null);

  return (
    <>
      <ListHeader
        title="Punto de venta"
        subtitle={`Turno abierto el ${formatDateTime(shift.abierto_at)}`}
      >
        {shiftQuery.data ? (
          <Badge variant="outline" className="h-8 px-3 text-sm">
            {shiftQuery.data.caja.nombre}
          </Badge>
        ) : (
          <Skeleton className="h-8 w-24 rounded-4xl" />
        )}
        <Button type="button" variant="outline" onClick={() => setOpenDialog("movement")}>
          <ArrowLeftRightIcon data-icon="inline-start" />
          Entrada/Retiro
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpenDialog("corte")}>
          <ClipboardListIcon data-icon="inline-start" />
          Corte
        </Button>
        <Button type="button" variant="destructive" onClick={() => setOpenDialog("close")}>
          <LockIcon data-icon="inline-start" />
          Cerrar turno
        </Button>
      </ListHeader>
      {openDialog === "movement" ? <CashMovementDialog shiftId={shift.id} onClose={closeDialog} /> : null}
      {openDialog === "corte" ? <CorteDialog shiftId={shift.id} onClose={closeDialog} /> : null}
      {openDialog === "close" ? (
        <CloseShiftDialog
          shiftId={shift.id}
          onClose={closeDialog}
          onClosed={(closing) => {
            closeDialog();
            onShiftClosed(closing);
          }}
        />
      ) : null}
    </>
  );
}
