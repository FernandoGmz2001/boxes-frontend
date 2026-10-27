import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge.tsx";
import { formatMoney } from "../format-money.ts";

interface ProductProfitCellProps {
  salePrice: string;
  purchaseCost: string;
}

export default function ProductProfitCell({
  salePrice,
  purchaseCost,
}: ProductProfitCellProps) {
  const sale = Number(salePrice);
  const cost = Number(purchaseCost);
  const profit = sale - cost;

  if (!Number.isFinite(profit)) {
    return <span className="text-muted-foreground">—</span>;
  }

  const marginPercent = sale > 0 ? (profit / sale) * 100 : null;
  const MarginIcon =
    profit > 0 ? TrendingUpIcon : profit < 0 ? TrendingDownIcon : MinusIcon;

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "font-medium tabular-nums",
          profit > 0 && "text-success",
          profit < 0 && "text-destructive",
          profit === 0 && "text-muted-foreground",
        )}
      >
        {formatMoney(String(profit))}
      </span>
      {marginPercent !== null ? (
        <Badge
          variant={
            profit > 0 ? "success" : profit < 0 ? "destructive" : "secondary"
          }
          className="tabular-nums"
        >
          <MarginIcon data-icon="inline-start" />
          {marginPercent.toFixed(1)}%
        </Badge>
      ) : null}
    </div>
  );
}
