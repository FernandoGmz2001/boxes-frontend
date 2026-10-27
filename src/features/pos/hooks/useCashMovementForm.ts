import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type DefaultValues } from 'react-hook-form'
import type { ICreateCashMovement } from '../interfaces/shifts/create-movement.interface.ts'
import { roundToCents } from '../pos-money.ts'
import {
  createCashMovementSchema,
  type CreateCashMovementSchema,
} from '../schemas/shifts/create-movement.schema.ts'
import { useCreateCashMovement } from '../services/shifts/queries.ts'

const emptyValues: DefaultValues<CreateCashMovementSchema> = {
  tipo: 'Entrada',
  motivo: '',
}

function buildPayload(values: CreateCashMovementSchema): ICreateCashMovement {
  return {
    tipo: values.tipo,
    monto: roundToCents(values.monto),
    motivo: values.motivo,
  }
}

export function useCashMovementForm(shiftId: number, onSaved: () => void) {
  const { mutateAsync: createCashMovement, isPending } = useCreateCashMovement()
  const form = useForm<CreateCashMovementSchema>({
    resolver: zodResolver(createCashMovementSchema),
    defaultValues: emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    await createCashMovement({ shiftId, payload: buildPayload(values) })
    onSaved()
  })

  return { form, onSubmit, isSubmitting: isPending }
}
