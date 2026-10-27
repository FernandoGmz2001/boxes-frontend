import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import { formatDateTime } from "../../pos-dates.ts";
import { formatCents } from "../../pos-money.ts";
import { ticketChangeCents, type SaleTicketData } from "../../sale-ticket.ts";

interface SaleTicketProps {
  ticket: SaleTicketData;
}

export default function SaleTicket({ ticket }: SaleTicketProps) {
  const changeCents = ticketChangeCents(ticket);

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 font-mono text-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-lg font-semibold">{ticket.folio}</span>
        <span className="text-xs text-muted-foreground">{formatDateTime(ticket.created_at)}</span>
        {ticket.cajero ? (
          <span className="text-xs text-muted-foreground">Atendió: {ticket.cajero}</span>
        ) : null}
      </div>
      <Separator />
      <ul className="flex flex-col gap-2">
        {ticket.lines.map((line) => (
          <li key={line.id} className="flex flex-col">
            <span className="truncate">{line.nombre}</span>
            <span className="flex justify-between text-muted-foreground">
              <span>
                {line.cantidad} × {formatMoney(line.precio_unitario)}
              </span>
              <span className="text-foreground tabular-nums">{formatMoney(line.subtotal)}</span>
            </span>
          </li>
        ))}
      </ul>
      <Separator />
      <div className="flex items-center justify-between text-base font-semibold">
        <span>Total</span>
        <span className="tabular-nums">{formatMoney(ticket.total)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Pago</span>
        <Badge variant="secondary">{ticket.metodo_pago}</Badge>
      </div>
      {ticket.cashReceivedCents !== null && changeCents !== null ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Recibido</span>
            <span className="tabular-nums">{formatCents(ticket.cashReceivedCents)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Cambio</span>
            <span className="tabular-nums">{formatCents(Math.max(changeCents, 0))}</span>
          </div>
        </>
      ) : null}
    </div>
  );
}
