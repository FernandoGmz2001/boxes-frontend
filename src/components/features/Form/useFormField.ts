import { get, useFormContext, type FieldError } from "react-hook-form";

export function useFormField(name: string) {
  const { control, register, formState } = useFormContext();
  const error = get(formState.errors, name) as FieldError | undefined;
  const fieldError =
    error && typeof error.message === "string" ? error : undefined;

  return {
    control,
    register,
    error: fieldError,
    invalid: fieldError != null,
  };
}
