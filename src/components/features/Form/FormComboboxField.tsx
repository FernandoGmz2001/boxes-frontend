import { useState, type ReactNode } from "react";
import { Controller } from "react-hook-form";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.tsx";
import FormField from "./FormField.tsx";
import { useFormField } from "./useFormField.ts";

interface FormComboboxOption {
  label: string;
  value: string;
}

interface FormComboboxFieldProps {
  name: string;
  label: string;
  options: FormComboboxOption[];
  required?: boolean;
  description?: ReactNode;
  placeholder?: string;
  emptyMessage?: string;
  emptyValue?: unknown;
  valueAsNumber?: boolean;
  disabled?: boolean;
  id?: string;
  footer?: ReactNode;
  onCreate?: (label: string) => void | Promise<string | number | void>;
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

function withPendingOption(
  options: FormComboboxOption[],
  pendingOption: FormComboboxOption | null,
) {
  if (pendingOption == null) return options;
  if (options.some((option) => option.value === pendingOption.value)) {
    return options;
  }
  return [pendingOption, ...options];
}

export default function FormComboboxField({
  name,
  label,
  options,
  required = false,
  description,
  placeholder,
  emptyMessage = "Sin coincidencias.",
  emptyValue,
  valueAsNumber = false,
  disabled = false,
  id,
  footer,
  onCreate,
}: FormComboboxFieldProps) {
  const fieldId = id ?? name;
  const [pendingOption, setPendingOption] =
    useState<FormComboboxOption | null>(null);
  const { control, error, invalid } = useFormField(name);
  const items = withPendingOption(options, pendingOption);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValue = toSelectValue(field.value, emptyValue);
        const selected =
          items.find((item) => item.value === selectedValue) ?? null;

        const handleCreate = async (nextLabel: string) => {
          if (!onCreate) return;

          const created = await onCreate(nextLabel);
          if (typeof created === "string" || typeof created === "number") {
            setPendingOption({ label: nextLabel, value: String(created) });
            field.onChange(valueAsNumber ? Number(created) : created);
          }
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
            footer={footer}
          >
            <Combobox
              items={items}
              value={selected}
              disabled={disabled}
              isItemEqualToValue={(item, current) =>
                item.value === current.value
              }
              onCreate={onCreate ? handleCreate : undefined}
              onValueChange={(option) => {
                field.onChange(
                  toFieldValue(
                    option == null ? null : option.value,
                    emptyValue,
                    valueAsNumber,
                  ),
                );
              }}
            >
              <ComboboxInput
                id={fieldId}
                className="w-full"
                placeholder={placeholder}
                disabled={disabled}
                showClear={emptyValue !== undefined}
                aria-invalid={invalid || undefined}
                aria-required={required || undefined}
                onBlur={field.onBlur}
              />
              <ComboboxContent>
                <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FormField>
        );
      }}
    />
  );
}
