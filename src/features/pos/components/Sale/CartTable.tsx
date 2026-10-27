import type { FocusEvent, KeyboardEvent } from "react";
import { MinusIcon, PlusIcon, ShoppingCartIcon, Trash2Icon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import ProductImage from "@/features/products/components/ProductImage.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import { clampQuantity, maxQuantityFor, type CartLine } from "../../hooks/useCart.ts";
import { formatCents, toCents } from "../../pos-money.ts";

interface CartTableProps {
  lines: CartLine[];
  lineErrors: Map<number, string[]>;
  generalErrors: string[];
  disabled?: boolean;
  onQuantityChange: (productId: number, cantidad: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
}

export default function CartTable({
  lines,
  lineErrors,
  generalErrors,
  disabled = false,
  onQuantityChange,
  onRemove,
  onClear,
}: CartTableProps) {
  const commitQuantity = (
    line: CartLine,
    event: FocusEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>,
  ) => {
    const nextQuantity = clampQuantity(line.product, Number(event.currentTarget.value));
    event.currentTarget.value = String(nextQuantity);
    if (nextQuantity !== line.cantidad) onQuantityChange(line.product.id, nextQuantity);
  };

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="border-b p-4">
        <CardTitle>Carrito</CardTitle>
        {lines.length > 0 ? (
          <CardAction>
            <Button type="button" variant="ghost" size="sm" disabled={disabled} onClick={onClear}>
              <Trash2Icon data-icon="inline-start" />
              Vaciar
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      {generalErrors.length > 0 ? (
        <Alert variant="destructive" className="m-4 mb-0 w-auto">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {generalErrors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ) : null}
      {lines.length === 0 ? (
        <Empty className="py-10">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShoppingCartIcon />
            </EmptyMedia>
            <EmptyTitle>El carrito está vacío</EmptyTitle>
            <EmptyDescription>Escanea un código o elige un producto para empezar.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Producto</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-center">Cantidad</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="w-10 pr-4">
                <span className="sr-only">Quitar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line) => {
              const { product } = line;
              const maxQuantity = maxQuantityFor(product);
              const errors = lineErrors.get(product.id) ?? [];

              return (
                <TableRow key={product.id} data-state={errors.length > 0 ? "selected" : undefined}>
                  <TableCell className="pl-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <ProductImage src={product.imagen_url} name={product.nombre_producto} className="size-9" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{product.nombre_producto}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.es_servicio ? "Servicio" : `${product.cantidad_en_existencia} en existencia`}
                        </span>
                        {errors.map((message) => (
                          <span key={message} role="alert" className="text-xs text-destructive">
                            {message}
                          </span>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(product.precio_venta)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        aria-label="Quitar uno"
                        disabled={disabled || line.cantidad <= 1}
                        onClick={() => onQuantityChange(product.id, line.cantidad - 1)}
                      >
                        <MinusIcon />
                      </Button>
                      <Input
                        key={line.cantidad}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={Number.isFinite(maxQuantity) ? maxQuantity : undefined}
                        defaultValue={line.cantidad}
                        disabled={disabled}
                        aria-label={`Cantidad de ${product.nombre_producto}`}
                        className="h-7 w-16 text-center tabular-nums"
                        onBlur={(event) => commitQuantity(line, event)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") commitQuantity(line, event);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-xs"
                        aria-label="Agregar uno"
                        disabled={disabled || line.cantidad >= maxQuantity}
                        onClick={() => onQuantityChange(product.id, line.cantidad + 1)}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {formatCents(toCents(product.precio_venta) * line.cantidad)}
                  </TableCell>
                  <TableCell className="pr-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Quitar ${product.nombre_producto}`}
                      disabled={disabled}
                      onClick={() => onRemove(product.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
