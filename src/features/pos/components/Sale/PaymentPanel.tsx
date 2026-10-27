import { useState } from "react";
import { BanknoteIcon, CreditCardIcon, LandmarkIcon, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { PAYMENT_METHODS, type PaymentMethod } from "../../interfaces/sales/get.interface.ts";
import { formatCents, parseAmountInput, toCents } from "../../pos-money.ts";

const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  Efectivo: BanknoteIcon,
  Tarjeta: CreditCardIcon,
  Transferencia: LandmarkIcon,
};

export interface PaymentSelection {
  metodo_pago: PaymentMethod;
  cashReceivedCents: number | null;
}

interface PaymentPanelProps {
  totalCents: number;
  itemCount: number;
  isPending: boolean;
  onConfirm: (selection: PaymentSelection) => void;
}

export default function PaymentPanel({ totalCents, itemCount, isPending, onConfirm }: PaymentPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Efectivo");
  const [cashReceived, setCashReceived] = useState("");
  const isCash = paymentMethod === "Efectivo";
  const receivedAmount = isCash ? parseAmountInput(cashReceived) : null;
  const receivedCents = receivedAmount === null ? null : toCents(receivedAmount);
  const changeCents = receivedCents === null ? null : receivedCents - totalCents;
  const isShortOfCash = changeCents !== null && changeCents < 0;
  const canConfirm = itemCount > 0 && !isPending && !isShortOfCash;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cobro</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Total estimado · {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
          </span>
          <span className="font-heading text-3xl font-semibold tabular-nums">{formatCents(totalCents)}</span>
          <span className="text-xs text-muted-foreground">El total final lo confirma el servidor al cobrar.</span>
        </div>
        <Separator />
        <Field>
          <FieldLabel>Método de pago</FieldLabel>
          <ToggleGroup
            variant="outline"
            spacing={0}
            className="w-full"
            value={[paymentMethod]}
            onValueChange={(values) => {
              const nextMethod = values.find((value): value is PaymentMethod =>
                PAYMENT_METHODS.some((method) => method === value),
              );
              if (nextMethod) setPaymentMethod(nextMethod);
            }}
          >
            {PAYMENT_METHODS.map((method) => {
              const Icon = PAYMENT_METHOD_ICONS[method];
              return (
                <ToggleGroupItem key={method} value={method} className="flex-1">
                  <Icon data-icon="inline-start" />
                  {method}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </Field>
        {isCash ? (
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel htmlFor="cash-received">Recibido</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">$</InputGroupAddon>
                <InputGroupInput
                  id="cash-received"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="Opcional"
                  value={cashReceived}
                  aria-invalid={isShortOfCash || undefined}
                  onChange={(event) => setCashReceived(event.target.value)}
                />
              </InputGroup>
            </Field>
            <div className="flex flex-col justify-end gap-1">
              <span className="text-sm text-muted-foreground">{isShortOfCash ? "Falta" : "Cambio"}</span>
              <span
                className={cn(
                  "text-xl font-semibold tabular-nums",
                  isShortOfCash && "text-destructive",
                )}
              >
                {changeCents === null ? "—" : formatCents(Math.abs(changeCents))}
              </span>
            </div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!canConfirm}
          onClick={() =>
            onConfirm({ metodo_pago: paymentMethod, cashReceivedCents: receivedCents })
          }
        >
          {isPending ? <Spinner data-icon="inline-start" /> : null}
          Cobrar {itemCount > 0 ? formatCents(totalCents) : ""}
        </Button>
      </CardFooter>
    </Card>
  );
}
