import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type DefaultValues } from 'react-hook-form'
import type { ICierreTurno, ICloseShift } from '../interfaces/shifts/close.interface.ts'
import { roundToCents, toCents } from '../pos-money.ts'
import { closeShiftSchema, type CloseShiftSchema } from '../schemas/shifts/close.schema.ts'
import { useCloseShift } from '../services/shifts/queries.ts'

const emptyValues: DefaultValues<CloseShiftSchema> = {
  notas: '',
}

function buildPayload(values: CloseShiftSchema): ICloseShift {
  return {
    efectivo_contado: roundToCents(values.efectivo_contado),
    ...(values.notas ? { notas: values.notas } : {}),
  }
}

export function useCloseShiftForm(
  shiftId: number,
  expectedCash: string | undefined,
  onClosed: (closing: ICierreTurno) => void,
) {
  const { mutateAsync: closeShift, isPending } = useCloseShift()
  const form = useForm<CloseShiftSchema>({
    resolver: zodResolver(closeShiftSchema),
    defaultValues: emptyValues,
  })
  const countedCash = useWatch({ control: form.control, name: 'efectivo_contado' })
  const differenceCents =
    expectedCash !== undefined && typeof countedCash === 'number' && Number.isFinite(countedCash)
      ? toCents(countedCash) - toCents(expectedCash)
      : null

  const onSubmit = form.handleSubmit(async (values) => {
    const closing = await closeShift({ shiftId, payload: buildPayload(values) })
    onClosed(closing)
  })

  return { form, onSubmit, differenceCents, isSubmitting: isPending }
}
