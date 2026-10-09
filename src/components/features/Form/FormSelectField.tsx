import type { ReactNode } from "react";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import FormField from "./FormField.tsx";
import { useFormField } from "./useFormField.ts";

interface FormSelectOption {
  label: string;
  value: string | null;
}

interface FormSelectFieldProps {
  name: string;
  label: string;
  options: FormSelectOption[];
  required?: boolean;
  description?: ReactNode;
  emptyValue?: unknown;
  valueAsNumber?: boolean;
  disabled?: boolean;
  id?: string;
  footer?: ReactNode;
}

function toSelectValue(value: unknown, emptyValue: unknown) {
  if (value == null || value === "") return null;
  if (emptyValue !== undefined && Object.is(value, emptyValue)) return null;
  return String(value);
}

function toFieldValue(
  value: string | null,
  emptyValue: unknown,
  valueAsNumber: boolean,
) {
  if (value == null) return emptyValue !== undefined ? emptyValue : null;
  return valueAsNumber ? Number(value) : value;
}

export default function FormSelectField({
  name,
  label,
  options,
  required = false,
  description,
  emptyValue,
  valueAsNumber = false,
  disabled = false,
  id,
  footer,
}: FormSelectFieldProps) {
  const fieldId = id ?? name;
  const { control, error, invalid } = useFormField(name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormField
          label={label}
          htmlFor={fieldId}
          required={required}
          invalid={invalid}
          disabled={disabled}
          description={description}
          error={error}
          footer={footer}
        >
          <Select
            items={options}
            value={toSelectValue(field.value, emptyValue)}
            disabled={disabled}
            onValueChange={(value) =>
              field.onChange(toFieldValue(value, emptyValue, valueAsNumber))
            }
          >
            <SelectTrigger
              id={fieldId}
              className="w-full"
              aria-invalid={invalid || undefined}
              aria-required={required || undefined}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem
                    key={option.value ?? "empty"}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>
      )}
    />
  );
}
