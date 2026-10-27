import { FormProvider } from "react-hook-form";
import FormNumberField from "@/components/features/Form/FormNumberField.tsx";
import FormSelectField from "@/components/features/Form/FormSelectField.tsx";
import FormTextField from "@/components/features/Form/FormTextField.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useCashMovementForm } from "../../hooks/useCashMovementForm.ts";
import { CASH_MOVEMENT_TYPES } from "../../interfaces/shifts/get.interface.ts";

const MOVEMENT_TYPE_OPTIONS = CASH_MOVEMENT_TYPES.map((type) => ({ label: type, value: type }));

interface CashMovementDialogProps {
  shiftId: number;
  onClose: () => void;
}

export default function CashMovementDialog({ shiftId, onClose }: CashMovementDialogProps) {
  const { form, onSubmit, isSubmitting } = useCashMovementForm(shiftId, onClose);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entrada o retiro de efectivo</DialogTitle>
          <DialogDescription>
            Registra el efectivo que entra o sale de la caja fuera de una venta.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <FormSelectField name="tipo" label="Tipo" required options={MOVEMENT_TYPE_OPTIONS} />
            <FormNumberField
              name="monto"
              label="Monto"
              required
              autoFocus
              prefix="$"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
            />
            <FormTextField
              name="motivo"
              label="Motivo"
              required
              maxLength={200}
              placeholder="p. ej. Cambio para la caja, pago a proveedor"
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
