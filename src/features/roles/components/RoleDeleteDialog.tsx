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
import type { IGetRole } from "../interfaces/get.interface.ts";
import { useDeleteRole } from "../services/queries.ts";

interface RoleDeleteDialogProps {
  role: IGetRole | null;
  onClose: () => void;
}

export default function RoleDeleteDialog({ role, onClose }: RoleDeleteDialogProps) {
  const deleteRole = useDeleteRole();

  const confirmDelete = () => {
    if (!role) return;

    deleteRole.mutate(role.id, { onSuccess: onClose });
  };

  return (
    <AlertDialog
      open={role !== null}
      onOpenChange={(open) => {
        if (!open && !deleteRole.isPending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar rol</AlertDialogTitle>
          <AlertDialogDescription>
            El rol «{role?.nombre}» se borrará y no podrá asignarse a nuevos
            usuarios.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteRole.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteRole.isPending}
            onClick={confirmDelete}
          >
            {deleteRole.isPending ? <Spinner data-icon="inline-start" /> : null}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
