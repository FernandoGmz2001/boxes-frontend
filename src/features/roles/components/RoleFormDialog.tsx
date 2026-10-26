import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGetRole } from "../services/queries.ts";
import RoleForm from "./RoleForm.tsx";

interface RoleFormDialogProps {
  roleId: number | null;
  onClose: () => void;
}

export default function RoleFormDialog({ roleId, onClose }: RoleFormDialogProps) {
  const isEditing = roleId !== null;
  const roleQuery = useGetRole(roleId ?? 0);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[min(90svh,820px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar rol" : "Nuevo rol"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Actualiza el nombre y los módulos del rol."
              : "Ponle nombre al rol y elige los módulos a los que entra."}
          </DialogDescription>
        </DialogHeader>
        {!isEditing ? <RoleForm role={null} onClose={onClose} /> : null}
        {isEditing && roleQuery.isLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : null}
        {isEditing && roleQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>No se pudo cargar el rol.</AlertDescription>
          </Alert>
        ) : null}
        {isEditing && roleQuery.data ? (
          <RoleForm role={roleQuery.data} onClose={onClose} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
