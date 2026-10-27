import { cn } from "cn";
import { formatCents } from "../../pos-money.ts";

interface CashDifferenceProps {
  cents: number | null;
  className?: string;
}

function differenceLabel(cents: number) {
  if (cents > 0) return "Sobrante";
  if (cents < 0) return "Faltante";
  return "Cuadra exacto";
}

export default function CashDifference({ cents, className }: CashDifferenceProps) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex items-center justify-between rounded-xl border p-4",
        cents !== null && cents > 0 && "border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400",
        cents !== null && cents < 0 && "border-destructive/30 bg-destructive/10 text-destructive",
        className,
      )}
    >
      <div className="flex flex-col">
        <span className="font-medium">Diferencia</span>
        <span className="text-xs opacity-80">
          {cents === null ? "Contado − esperado" : differenceLabel(cents)}
        </span>
      </div>
      <span className="font-heading text-2xl font-semibold tabular-nums">
        {cents === null ? "—" : `${cents > 0 ? "+" : cents < 0 ? "−" : ""}${formatCents(Math.abs(cents))}`}
      </span>
    </div>
  );
}
