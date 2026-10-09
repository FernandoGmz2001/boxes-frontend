import type { ComponentProps, ReactNode } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Input } from "@/components/ui/input.tsx";
import FormField from "./FormField.tsx";
import { useFormField } from "./useFormField.ts";

interface FormNumberFieldProps extends Omit<
  ComponentProps<"input">,
  "name" | "id" | "type" | "prefix"
> {
  name: string;
  label: string;
  required?: boolean;
  description?: ReactNode;
  prefix?: ReactNode;
  id?: string;
}

export default function FormNumberField({
  name,
  label,
  required = false,
  description,
  prefix,
  id,
  disabled,
  ...inputProps
}: FormNumberFieldProps) {
  const fieldId = id ?? name;
  const { register, error, invalid } = useFormField(name);
  const registration = register(name, { valueAsNumber: true });
  const controlProps = {
    ...inputProps,
    id: fieldId,
    type: "number" as const,
    disabled,
    "aria-invalid": invalid || undefined,
    "aria-required": required || undefined,
    ...registration,
  };

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
      {prefix != null ? (
        <InputGroup>
          <InputGroupAddon align="inline-start">{prefix}</InputGroupAddon>
          <InputGroupInput {...controlProps} />
        </InputGroup>
      ) : (
        <Input {...controlProps} />
      )}
    </FormField>
  );
}
