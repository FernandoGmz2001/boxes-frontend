import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field.tsx";
import RequiredMark from "./RequiredMark.tsx";
import { useFormField } from "./useFormField.ts";

interface FormCheckboxGroupOption {
  label: string;
  value: string | number;
}

interface FormCheckboxGroupFieldProps {
  name: string;
  legend: string;
  options: FormCheckboxGroupOption[];
  required?: boolean;
  listClassName?: string;
}

function selectedValues(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (item): item is string | number =>
      typeof item === "string" || typeof item === "number",
  );
}

export default function FormCheckboxGroupField({
  name,
  legend,
  options,
  required = false,
  listClassName,
}: FormCheckboxGroupFieldProps) {
  const { control, error, invalid } = useFormField(name);

  return (
    <FieldSet data-invalid={invalid ? true : undefined}>
      <FieldLegend variant="label">
        {legend}
        {required ? <RequiredMark /> : null}
      </FieldLegend>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = selectedValues(field.value);

          return (
            <div className={listClassName}>
              <FieldGroup>
                {options.map((option) => {
                  const optionId = `${name}-${option.value}`;

                  return (
                    <Field key={option.value} orientation="horizontal">
                      <Checkbox
                        id={optionId}
                        checked={selected.includes(option.value)}
                        aria-required={required || undefined}
                        onCheckedChange={(nextChecked) => {
                          field.onChange(
                            nextChecked
                              ? [...selected, option.value]
                              : selected.filter(
                                  (item) => item !== option.value,
                                ),
                          );
                        }}
                      />
                      <FieldLabel htmlFor={optionId}>{option.label}</FieldLabel>
                    </Field>
                  );
                })}
              </FieldGroup>
            </div>
          );
        }}
      />
      <FieldError errors={[error]} />
    </FieldSet>
  );
}
