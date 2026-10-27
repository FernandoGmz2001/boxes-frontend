import { ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { ROUTES } from "@/app/routes/routes.constants.ts";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { ITurnoDetalle } from "@/features/pos/interfaces/shifts/get.interface.ts";
import { formatDateTime } from "@/features/pos/pos-dates.ts";

interface ShiftDetailHeaderProps {
  shift: ITurnoDetalle;
}

export default function ShiftDetailHeader({ shift }: ShiftDetailHeaderProps) {
  const navigate = useNavigate();
  const closedLabel = shift.cerrado_at ? formatDateTime(shift.cerrado_at) : "en curso";

  return (
    <ListHeader
      title={`Turno #${shift.id}`}
      subtitle={`${shift.usuario.nombre} en ${shift.caja.nombre} · ${formatDateTime(shift.abierto_at)} – ${closedLabel}`}
    >
      <Badge variant={shift.estado === "Abierto" ? "default" : "secondary"} className="h-8 px-3 text-sm">
        {shift.estado}
      </Badge>
      <Button type="button" variant="outline" onClick={() => navigate(ROUTES.SHIFTS)}>
        <ArrowLeftIcon data-icon="inline-start" />
        Volver
      </Button>
    </ListHeader>
  );
}
