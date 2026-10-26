import { TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";

interface ProductSelectionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDeleteSelected: () => void;
}

export default function ProductSelectionBar({
  selectedCount,
  onClearSelection,
  onDeleteSelected,
}: ProductSelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="relative z-10 h-0">
      <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4">
        <div
          role="toolbar"
          aria-label="Acciones de selección"
          className="pointer-events-auto flex items-center gap-2 rounded-lg border bg-popover py-1.5 pr-1.5 pl-1 text-popover-foreground shadow-lg animate-in fade-in slide-in-from-bottom-2"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Limpiar selección"
            onClick={onClearSelection}
          >
            <XIcon />
          </Button>
          <span className="text-sm font-medium">
            {selectedCount === 1
              ? "1 producto seleccionado"
              : `${selectedCount} productos seleccionados`}
          </span>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
          >
            <TrashIcon data-icon="inline-start" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
