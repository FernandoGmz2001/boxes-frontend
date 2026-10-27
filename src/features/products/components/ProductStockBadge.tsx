import {
  PackageCheckIcon,
  PackageXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";

interface ProductStockBadgeProps {
  stock: string;
  minimumStock: string;
}

export default function ProductStockBadge({
  stock,
  minimumStock,
}: ProductStockBadgeProps) {
  const stockAmount = Number(stock);
  const minimumAmount = Number(minimumStock);

  if (stock.trim() === "" || !Number.isFinite(stockAmount)) return null;

  if (stockAmount <= 0) {
    return (
      <Badge variant="destructive">
        <PackageXIcon data-icon="inline-start" />
        Agotado
      </Badge>
    );
  }

  if (Number.isFinite(minimumAmount) && stockAmount <= minimumAmount) {
    return (
      <Badge variant="warning">
        <TriangleAlertIcon data-icon="inline-start" />
        Stock bajo
      </Badge>
    );
  }

  return (
    <Badge variant="success">
      <PackageCheckIcon data-icon="inline-start" />
      Disponible
    </Badge>
  );
}
