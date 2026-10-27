import { useEffect, useEffectEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type DefaultValues } from 'react-hook-form'
import type { ICashRegister } from '../interfaces/cash-registers/get-all.interface.ts'
import type { IOpenShift } from '../interfaces/shifts/open.interface.ts'
import { roundToCents } from '../pos-money.ts'
import { openShiftSchema, type OpenShiftSchema } from '../schemas/shifts/open.schema.ts'
import { useOpenShift } from '../services/shifts/queries.ts'

const emptyValues: DefaultValues<OpenShiftSchema> = {
  caja_id: 0,
}

function buildPayload(values: OpenShiftSchema): IOpenShift {
  return {
    caja_id: values.caja_id,
    fondo_inicial: roundToCents(values.fondo_inicial),
  }
}

export function useOpenShiftForm(cashRegisters: ICashRegister[], onOpened: () => void) {
  const { mutateAsync: openShift, isPending } = useOpenShift()
  const form = useForm<OpenShiftSchema>({
    resolver: zodResolver(openShiftSchema),
    defaultValues: emptyValues,
  })
  const onlyCashRegisterId = cashRegisters.length === 1 ? cashRegisters[0].id : null

  const selectOnlyCashRegister = useEffectEvent((cashRegisterId: number) => {
    if (form.getValues('caja_id') === 0) form.setValue('caja_id', cashRegisterId)
  })

  useEffect(() => {
    if (onlyCashRegisterId !== null) selectOnlyCashRegister(onlyCashRegisterId)
  }, [onlyCashRegisterId])

  const onSubmit = form.handleSubmit(async (values) => {
    await openShift(buildPayload(values))
    onOpened()
  })

  return { form, onSubmit, isSubmitting: isPending }
}
