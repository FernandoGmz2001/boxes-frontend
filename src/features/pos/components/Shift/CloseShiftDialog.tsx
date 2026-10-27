import { FormProvider } from "react-hook-form";
import FormField from "@/components/features/Form/FormField.tsx";
import FormNumberField from "@/components/features/Form/FormNumberField.tsx";
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
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useCloseShiftForm } from "../../hooks/useCloseShiftForm.ts";
import type { ICierreTurno } from "../../interfaces/shifts/close.interface.ts";
import { useGetShiftCorte } from "../../services/shifts/queries.ts";
import CashDifference from "./CashDifference.tsx";
import CorteSummary from "./CorteSummary.tsx";

interface CloseShiftDialogProps {
  shiftId: number;
  onClose: () => void;
  onClosed: (closing: ICierreTurno) => void;
}

export default function CloseShiftDialog({ shiftId, onClose, onClosed }: CloseShiftDialogProps) {
  const corteQuery = useGetShiftCorte(shiftId);
  const { form, onSubmit, differenceCents, isSubmitting } = useCloseShiftForm(
    shiftId,
    corteQuery.data?.efectivo_esperado,
    onClosed,
  );
  const notesError = form.formState.errors.notas;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-h-[min(92svh,900px)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cerrar turno</DialogTitle>
          <DialogDescription>
            Cuenta el efectivo de la caja. Al cerrar ya no podrás vender en este turno.
          </DialogDescription>
        </DialogHeader>
        {corteQuery.isLoading ? <Skeleton className="h-80 w-full" /> : null}
        {corteQuery.isError ? (
          <Alert variant="destructive">
            <AlertDescription>{corteQuery.error.message}</AlertDescription>
          </Alert>
        ) : null}
        {corteQuery.data ? <CorteSummary corte={corteQuery.data} /> : null}
        <FormProvider {...form}>
          <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
            <FormNumberField
              name="efectivo_contado"
              label="Efectivo contado"
              required
              autoFocus
              prefix="$"
              min={0}
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
            />
            <CashDifference cents={differenceCents} />
            <FormField label="Notas" htmlFor="close-shift-notes" invalid={notesError != null} error={notesError}>
              <Textarea
                id="close-shift-notes"
                maxLength={500}
                placeholder="Opcional. Explica faltantes o sobrantes."
                aria-invalid={notesError != null || undefined}
                {...form.register("notas")}
              />
            </FormField>
            <DialogFooter>
              <Button type="button" variant="outline" disabled={isSubmitting} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="destructive" disabled={isSubmitting || !corteQuery.data}>
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Cerrar turno
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
