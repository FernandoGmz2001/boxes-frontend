import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useDeactivateProducts } from "../services/queries.ts";

interface ProductBulkDeactivateDialogProps {
  productIds: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeactivated: () => void;
}

export default function ProductBulkDeactivateDialog({
  productIds,
  open,
  onOpenChange,
  onDeactivated,
}: ProductBulkDeactivateDialogProps) {
  const deactivateProducts = useDeactivateProducts();
  const productCount = productIds.length;

  const confirmDeactivate = () => {
    deactivateProducts.mutate(
      { ids: productIds },
      {
        onSuccess: () => {
          onOpenChange(false);
          onDeactivated();
        },
      },
    );
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!deactivateProducts.isPending) onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {productCount === 1
              ? "Dar de baja 1 producto"
              : `Dar de baja ${productCount} productos`}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Los productos seleccionados quedarán inactivos y se conservarán en
            el inventario.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deactivateProducts.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deactivateProducts.isPending}
            onClick={confirmDeactivate}
          >
            {deactivateProducts.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : null}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
