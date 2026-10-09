import type { ReactNode } from "react";
import type { FieldError as HookFormFieldError } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
} from "@/components/ui/field.tsx";
import FormFieldLabel from "./FormFieldLabel.tsx";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  description?: ReactNode;
  error?: HookFormFieldError;
  orientation?: "vertical" | "horizontal";
  className?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  required = false,
  invalid = false,
  disabled = false,
  description,
  error,
  orientation = "vertical",
  className,
  footer,
  children,
}: FormFieldProps) {
  const labelNode = (
    <FormFieldLabel htmlFor={htmlFor} required={required}>
      {label}
    </FormFieldLabel>
  );

  return (
    <Field
      orientation={orientation}
      className={className}
      data-invalid={invalid ? true : undefined}
      data-disabled={disabled ? true : undefined}
    >
      {orientation === "horizontal" ? children : labelNode}
      {orientation === "horizontal" ? labelNode : children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={[error]} />
      {footer}
    </Field>
  );
}
