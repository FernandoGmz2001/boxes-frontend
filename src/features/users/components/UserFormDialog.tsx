import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGetUser } from "../services/queries.ts";
import UserForm from "./UserForm.tsx";

interface UserFormDialogProps {
  userId: number | null;
  onClose: () => void;
}

export default function UserFormDialog({ userId, onClose }: UserFormDialogProps) {
  const isEditing = userId !== null;
  const userQuery = useGetUser(userId ?? 0);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[min(90svh,820px)] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza los datos y el rol del usuario."
              : "Crea el acceso y asígnale un rol."}
          </DialogDescription>
        </DialogHeader>
        {!isEditing ? <UserForm user={null} onClose={onClose} /> : null}
        {isEditing && userQuery.isLoading ? (
          <Skeleton className="h-80 w-full" />
        ) : null}
        {isEditing && userQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>No se pudo cargar el usuario.</AlertDescription>
          </Alert>
        ) : null}
        {isEditing && userQuery.data ? (
          <UserForm user={userQuery.data} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
