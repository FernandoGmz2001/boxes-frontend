import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import { formatMoney } from "@/features/products/format-money.ts";
import type { ICorteTurno } from "../../interfaces/shifts/corte.interface.ts";

interface CorteSummaryProps {
  corte: ICorteTurno;
}

export default function CorteSummary({ corte }: CorteSummaryProps) {
  const cashFlow = [
    { label: "Fondo inicial", amount: formatMoney(corte.fondo_inicial) },
    { label: "Entradas", amount: `+ ${formatMoney(corte.entradas)}` },
    { label: "Retiros", amount: `− ${formatMoney(corte.retiros)}` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Método de pago</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="pr-4 text-right">Importe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corte.ventas.map((sales) => (
              <TableRow key={sales.metodo_pago}>
                <TableCell className="pl-4">{sales.metodo_pago}</TableCell>
                <TableCell className="text-right tabular-nums">{sales.cantidad}</TableCell>
                <TableCell className="pr-4 text-right tabular-nums">{formatMoney(sales.importe)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="pl-4 font-medium">Total vendido</TableCell>
              <TableCell />
              <TableCell className="pr-4 text-right font-semibold tabular-nums">
                {formatMoney(corte.total_ventas)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <dl className="flex flex-col gap-1.5 text-sm">
        {cashFlow.map((item) => (
          <div key={item.label} className="flex justify-between">
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="tabular-nums">{item.amount}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between rounded-xl bg-primary/5 p-4 ring-1 ring-primary/15">
        <div className="flex flex-col">
          <span className="font-medium">Efectivo esperado en caja</span>
          <span className="text-xs text-muted-foreground">Fondo + ventas en efectivo + entradas − retiros</span>
        </div>
        <span className="font-heading text-2xl font-semibold tabular-nums">
          {formatMoney(corte.efectivo_esperado)}
        </span>
      </div>
    </div>
  );
}
