import { z } from 'zod'
import { numberField } from '@/shared/helpers/zod-helpers.ts'

const NOTES_MAX_LENGTH = 500

export const closeShiftSchema = z.object({
  efectivo_contado: numberField('Ingresa el efectivo contado').min(0, 'El efectivo no puede ser negativo'),
  notas: z.string().trim().max(NOTES_MAX_LENGTH, `Usa máximo ${NOTES_MAX_LENGTH} caracteres`),
})

export type CloseShiftSchema = z.infer<typeof closeShiftSchema>
