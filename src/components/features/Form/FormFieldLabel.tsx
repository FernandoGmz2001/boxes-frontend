import type { ComponentProps } from "react";
import { FieldLabel } from "@/components/ui/field.tsx";
import RequiredMark from "./RequiredMark.tsx";

interface FormFieldLabelProps extends ComponentProps<typeof FieldLabel> {
  required?: boolean;
}

export default function FormFieldLabel({
  required = false,
  children,
  ...props
}: FormFieldLabelProps) {
  return (
    <FieldLabel {...props}>
      <span>
        {children}
        {required ? <RequiredMark /> : null}
      </span>
    </FieldLabel>
  );
}
