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
import type { IGetUser } from "../interfaces/get.interface.ts";
import { useUpdateUser } from "../services/queries.ts";

interface UserDeactivateDialogProps {
  user: IGetUser | null;
  onClose: () => void;
}

export default function UserDeactivateDialog({
  user,
  onClose,
}: UserDeactivateDialogProps) {
  const updateUser = useUpdateUser();

  const confirmDeactivate = () => {
    if (!user) return;

    updateUser.mutate(
      { userId: user.id, payload: { activo: false } },
      { onSuccess: onClose },
    );
  };

  return (
    <AlertDialog
      open={user !== null}
      onOpenChange={(open) => {
        if (!open && !updateUser.isPending) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar usuario</AlertDialogTitle>
          <AlertDialogDescription>
            {user?.nombre} ya no podrá iniciar sesión. Puedes reactivarlo
            después.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={updateUser.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={updateUser.isPending}
            onClick={confirmDeactivate}
          >
            {updateUser.isPending ? <Spinner data-icon="inline-start" /> : null}
            Desactivar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
