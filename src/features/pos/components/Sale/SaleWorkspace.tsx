import { useRef, useState } from "react";
import { CheckCircle2Icon, PrinterIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { CART_MAX_LINES, useCart, type CartAddResult, type CartProduct } from "../../hooks/useCart.ts";
import { getStockErrorMessages, groupMessagesByLine } from "../../sale-errors.ts";
import { printTicket, ticketFromCreatedSale, type SaleTicketData } from "../../sale-ticket.ts";
import { useCreateSale } from "../../services/sales/queries.ts";
import CartTable from "./CartTable.tsx";
import PaymentPanel, { type PaymentSelection } from "./PaymentPanel.tsx";
import ProductSearch from "./ProductSearch.tsx";
import SaleTicket from "./SaleTicket.tsx";

export default function SaleWorkspace() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const cart = useCart();
  const createSale = useCreateSale();
  const [completedTicket, setCompletedTicket] = useState<SaleTicketData | null>(null);
  const [completedSales, setCompletedSales] = useState(0);
  const stockMessages = getStockErrorMessages(createSale.error);
  const stockErrors = groupMessagesByLine(
    cart.lines.map((line) => ({
      productId: line.product.id,
      names: [line.product.nombre_producto, line.product.sku ?? "", line.product.codigo_barras ?? ""],
    })),
    stockMessages,
  );

  const clearSaleError = () => {
    if (createSale.isError) createSale.reset();
  };

  const addProduct = (product: CartProduct): CartAddResult => {
    const result = cart.addProduct(product);
    if (result === "added") clearSaleError();
    if (result === "out-of-stock") toast.error(`${product.nombre_producto} no tiene existencia`);
    if (result === "max-quantity") {
      toast.warning(`Solo hay ${product.cantidad_en_existencia} de ${product.nombre_producto} en existencia`);
    }
    if (result === "line-limit") toast.error(`El carrito admite hasta ${CART_MAX_LINES} productos distintos`);
    return result;
  };

  const confirmSale = ({ metodo_pago, cashReceivedCents }: PaymentSelection) => {
    const productNames = new Map(cart.lines.map((line) => [line.product.id, line.product.nombre_producto]));

    createSale.mutate(
      {
        metodo_pago,
        carrito: cart.lines.map((line) => ({ producto_id: line.product.id, cantidad: line.cantidad })),
      },
      {
        onSuccess: (sale) => {
          setCompletedTicket(ticketFromCreatedSale(sale, productNames, cashReceivedCents));
          setCompletedSales((count) => count + 1);
          cart.clear();
        },
      },
    );
  };

  return (
    <div className="grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(18rem,0.9fr)]">
      <ProductSearch inputRef={searchInputRef} onAdd={addProduct} />
      <CartTable
        lines={cart.lines}
        lineErrors={stockErrors.byProductId}
        generalErrors={stockErrors.unmatched}
        disabled={createSale.isPending}
        onQuantityChange={(productId, cantidad) => {
          clearSaleError();
          cart.setQuantity(productId, cantidad);
        }}
        onRemove={(productId) => {
          clearSaleError();
          cart.removeProduct(productId);
        }}
        onClear={() => {
          clearSaleError();
          cart.clear();
        }}
      />
      <PaymentPanel
        key={completedSales}
        totalCents={cart.totalCents}
        itemCount={cart.itemCount}
        isPending={createSale.isPending}
        onConfirm={confirmSale}
      />
      <Dialog
        open={completedTicket !== null}
        onOpenChange={(open) => {
          if (!open) setCompletedTicket(null);
        }}
      >
        <DialogContent className="sm:max-w-sm" finalFocus={searchInputRef}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2Icon className="size-5 text-emerald-600" />
              Venta registrada
            </DialogTitle>
            <DialogDescription>Este es el ticket con el total confirmado por el servidor.</DialogDescription>
          </DialogHeader>
          {completedTicket ? <SaleTicket ticket={completedTicket} /> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (completedTicket) printTicket(completedTicket);
              }}
            >
              <PrinterIcon data-icon="inline-start" />
              Imprimir
            </Button>
            <Button type="button" autoFocus onClick={() => setCompletedTicket(null)}>
              Nueva venta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
