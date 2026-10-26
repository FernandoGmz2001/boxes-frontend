import { FormProvider } from "react-hook-form";
import FormTextField from "@/components/features/Form/FormTextField.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useRoleForm } from "../hooks/useRoleForm.ts";
import type { IGetRole } from "../interfaces/get.interface.ts";
import RoleModulesField from "./RoleModulesField.tsx";

interface RoleFormProps {
  role: IGetRole | null;
  onClose: () => void;
}

export default function RoleForm({ role, onClose }: RoleFormProps) {
  const { form, onSubmit, isSubmitting } = useRoleForm(role, onClose);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <FormTextField
          name="nombre"
          label="Nombre"
          required
          autoFocus
          placeholder="p. ej. Almacenista"
        />
        <FormTextField
          name="descripcion"
          label="Descripción"
          placeholder="p. ej. Registra entradas y salidas del almacén"
        />
        <RoleModulesField />
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
