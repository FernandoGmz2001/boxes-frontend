import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input.tsx";
import FormField from "./FormField.tsx";
import { useFormField } from "./useFormField.ts";

interface FormTextFieldProps extends Omit<
  ComponentProps<typeof Input>,
  "name" | "id"
> {
  name: string;
  label: string;
  required?: boolean;
  description?: ReactNode;
  id?: string;
}

export default function FormTextField({
  name,
  label,
  required = false,
  description,
  id,
  disabled,
  ...inputProps
}: FormTextFieldProps) {
  const fieldId = id ?? name;
  const { register, error, invalid } = useFormField(name);

  return (
    <FormField
      label={label}
      htmlFor={fieldId}
      required={required}
      invalid={invalid}
      disabled={disabled}
      description={description}
      error={error}
    >
      <Input
        {...inputProps}
        id={fieldId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        aria-required={required || undefined}
        {...register(name)}
      />
    </FormField>
  );
}
