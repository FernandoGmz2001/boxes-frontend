import { FormProvider } from "react-hook-form";
import FormNumberField from "@/components/features/Form/FormNumberField.tsx";
import FormSelectField from "@/components/features/Form/FormSelectField.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
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
import { useOpenShiftForm } from "../../hooks/useOpenShiftForm.ts";
import { useGetCashRegisters } from "../../services/cash-registers/queries.ts";

const CASH_REGISTER_LIMIT = 100;

interface OpenShiftDialogProps {
  onClose: () => void;
}

export default function OpenShiftDialog({ onClose }: OpenShiftDialogProps) {
  const cashRegistersQuery = useGetCashRegisters({ activa: true, limite: CASH_REGISTER_LIMIT });
  const cashRegisters = cashRegistersQuery.data?.data ?? [];
  const { form, onSubmit, isSubmitting } = useOpenShiftForm(cashRegisters, onClose);
  const cashRegisterOptions = cashRegisters.map((cashRegister) => ({
    label: cashRegister.nombre,
    value: String(cashRegister.id),
  }));

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Abrir turno</DialogTitle>
          <DialogDescription>Elige la caja y cuenta el efectivo con el que empiezas.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <FormSelectField
              name="caja_id"
              label="Caja"
              required
              options={cashRegisterOptions}
              emptyValue={0}
              valueAsNumber
              disabled={cashRegistersQuery.isLoading}
              footer={
                cashRegistersQuery.isError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{cashRegistersQuery.error.message}</AlertDescription>
                  </Alert>
                ) : cashRegistersQuery.isSuccess && cashRegisters.length === 0 ? (
                  <Alert>
                    <AlertDescription>No hay cajas activas. Pide a un supervisor que active una.</AlertDescription>
                  </Alert>
                ) : null
              }
            />
            <FormNumberField
              name="fondo_inicial"
              label="Fondo inicial"
              required
              autoFocus
              prefix="$"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
            />
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || cashRegisters.length === 0}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Abrir turno
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
