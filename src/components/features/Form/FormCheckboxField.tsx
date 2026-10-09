import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import FormField from "./FormField.tsx";
import { useFormField } from "./useFormField.ts";

interface FormCheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function FormCheckboxField({
  name,
  label,
  required = false,
  disabled = false,
  className,
  id,
}: FormCheckboxFieldProps) {
  const fieldId = id ?? name;
  const { control, error, invalid } = useFormField(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          orientation="horizontal"
          label={label}
          htmlFor={fieldId}
          required={required}
          invalid={invalid}
          disabled={disabled}
          className={className}
          error={error}
        >
          <Checkbox
            id={fieldId}
            name={field.name}
            checked={field.value === true}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-required={required || undefined}
            onBlur={field.onBlur}
            onCheckedChange={field.onChange}
          />
        </FormField>
      )}
    />
  );
}
