import { FormProvider } from "react-hook-form";
import FormCheckboxField from "@/components/features/Form/FormCheckboxField.tsx";
import FormSelectField from "@/components/features/Form/FormSelectField.tsx";
import FormTextField from "@/components/features/Form/FormTextField.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetRoles } from "@/features/roles/services/queries.ts";
import { useAuth } from "@/shared/auth/useAuth.ts";
import { useUserForm } from "../hooks/useUserForm.ts";
import type { IGetUser } from "../interfaces/get.interface.ts";

const ROLE_CATALOG_LIMIT = 100;

interface UserFormProps {
  user: IGetUser | null;
  onClose: () => void;
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const { session } = useAuth();
  const { form, onSubmit, isEditing, isSubmitting } = useUserForm(
    user,
    onClose,
  );
  const rolesQuery = useGetRoles({ pagina: 1, limite: ROLE_CATALOG_LIMIT });
  const roleOptions = (rolesQuery.data?.data ?? []).map((role) => ({
    label: role.nombre,
    value: String(role.id),
  }));
  const isCurrentUser = user !== null && user.id === session?.userId;

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <FormTextField
          name="nombre"
          label="Nombre"
          required
          autoFocus
          placeholder="p. ej. Ana López"
        />
        <FormTextField
          name="email"
          label="Correo"
          type="email"
          required
          autoComplete="off"
          placeholder="p. ej. ana@empresa.com"
        />
        <FormTextField
          name="password"
          label={isEditing ? "Nueva contraseña" : "Contraseña"}
          type="password"
          required={!isEditing}
          autoComplete="new-password"
          description={
            isEditing
              ? "Déjala vacía para conservar la actual."
              : "Mínimo 8 caracteres."
          }
        />
        <FormSelectField
          name="rol_id"
          label="Rol"
          required
          options={roleOptions}
          emptyValue={0}
          valueAsNumber
          disabled={isCurrentUser}
          description={
            isCurrentUser
              ? "No puedes cambiar tu propio rol ni desactivarte."
              : undefined
          }
          footer={
            rolesQuery.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  No se pudieron cargar los roles.
                </AlertDescription>
              </Alert>
            ) : null
          }
        />
        {isEditing ? (
          <FormCheckboxField
            name="activo"
            label="Usuario activo"
            disabled={isCurrentUser}
            className="rounded-lg border p-3"
          />
        ) : null}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            Guardar
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  );
}
