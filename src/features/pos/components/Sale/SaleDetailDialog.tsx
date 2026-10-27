import { PrinterIcon } from "lucide-react";
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
import { printTicket, ticketFromSaleDetail } from "../../sale-ticket.ts";
import { useGetSale } from "../../services/sales/queries.ts";
import SaleTicket from "./SaleTicket.tsx";

interface SaleDetailDialogProps {
  saleId: number;
  onClose: () => void;
}

export default function SaleDetailDialog({ saleId, onClose }: SaleDetailDialogProps) {
  const saleQuery = useGetSale(saleId);
  const ticket = saleQuery.data ? ticketFromSaleDetail(saleQuery.data) : null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[min(90svh,820px)] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Detalle de venta</DialogTitle>
          <DialogDescription>Consulta el ticket o vuelve a imprimirlo.</DialogDescription>
        </DialogHeader>
        {saleQuery.isLoading ? <Skeleton className="h-72 w-full" /> : null}
        {saleQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{saleQuery.error.message}</AlertDescription>
          </Alert>
        ) : null}
        {ticket ? <SaleTicket ticket={ticket} /> : null}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            type="button"
            disabled={!ticket}
            onClick={() => {
              if (ticket) printTicket(ticket);
            }}
          >
            <PrinterIcon data-icon="inline-start" />
            Reimprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
