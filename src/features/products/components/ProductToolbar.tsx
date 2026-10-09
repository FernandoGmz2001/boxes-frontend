import SearchInput from "@/components/features/SearchInput/SearchInput.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";

type ProductStatus = "all" | "active" | "inactive";

interface ProductToolbarProps {
  status: ProductStatus;
  totalLabel: string;
  onStatusChange: (status: ProductStatus) => void;
  onSearchChange: (search: string) => void;
}

const STATUSES = ["all", "active", "inactive"] as const;

const STATUS_LABELS: Record<ProductStatus, string> = {
  all: "Todos",
  active: "Activos",
  inactive: "Inactivos",
};

export default function ProductToolbar({
  status,
  onStatusChange,
  onSearchChange,
}: ProductToolbarProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[status]}
        onValueChange={(values) => {
          const nextStatus = values.find((value): value is ProductStatus =>
            STATUSES.some((item) => item === value),
          );
          if (nextStatus) onStatusChange(nextStatus);
        }}
      >
        {STATUSES.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {STATUS_LABELS[item]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <SearchInput label="Buscar productos" onDebouncedChange={onSearchChange} />
    </div>
  );
}
