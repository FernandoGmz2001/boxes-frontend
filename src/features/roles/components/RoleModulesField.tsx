import { Controller } from "react-hook-form";
import RequiredMark from "@/components/features/Form/RequiredMark.tsx";
import { useFormField } from "@/components/features/Form/useFormField.ts";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field.tsx";
import {
  APP_MODULES,
  PERMISSIONS,
  isPermission,
} from "@/shared/auth/permissions.ts";

const FIELD_NAME = "permisos";

export default function RoleModulesField() {
  const { control, error, invalid } = useFormField(FIELD_NAME);

  return (
    <FieldSet data-invalid={invalid ? true : undefined}>
      <FieldLegend variant="label">
        Módulos
        <RequiredMark />
      </FieldLegend>
      <FieldDescription>
        El rol solo podrá entrar a los módulos marcados.
      </FieldDescription>
      <Controller
        name={FIELD_NAME}
        control={control}
        render={({ field }) => {
          const selectedPermissions: unknown[] = Array.isArray(field.value)
            ? field.value
            : [];
          const grantedPermissions = selectedPermissions.filter(isPermission);

          return (
            <FieldGroup className="gap-2">
              {PERMISSIONS.map((permission) => {
                const appModule = APP_MODULES[permission];
                const optionId = `${FIELD_NAME}-${permission}`;

                return (
                  <FieldLabel key={permission} htmlFor={optionId}>
                    <Field orientation="horizontal">
                      <Checkbox
                        id={optionId}
                        checked={grantedPermissions.includes(permission)}
                        onCheckedChange={(nextChecked) => {
                          field.onChange(
                            nextChecked
                              ? [...grantedPermissions, permission]
                              : grantedPermissions.filter(
                                  (item) => item !== permission,
                                ),
                          );
                        }}
                      />
                      <FieldContent>
                        <FieldTitle>
                          <appModule.icon className="size-4 text-muted-foreground" />
                          {appModule.label}
                        </FieldTitle>
                        <FieldDescription>
                          {appModule.description}
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                );
              })}
            </FieldGroup>
          );
        }}
      />
      <FieldError errors={[error]} />
    </FieldSet>
  );
}
