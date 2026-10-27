import { z } from 'zod'
import { numberField, stringField } from '@/shared/helpers/zod-helpers.ts'
import { CASH_MOVEMENT_TYPES } from '../../interfaces/shifts/get.interface.ts'

const REASON_MAX_LENGTH = 200

export const createCashMovementSchema = z.object({
  tipo: z.enum(CASH_MOVEMENT_TYPES),
  monto: numberField('Ingresa el monto').positive('El monto debe ser mayor a cero'),
  motivo: stringField('Escribe el motivo').max(REASON_MAX_LENGTH, `Usa máximo ${REASON_MAX_LENGTH} caracteres`),
})

export type CreateCashMovementSchema = z.infer<typeof createCashMovementSchema>
