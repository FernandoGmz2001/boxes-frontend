import { z } from 'zod'
import { idField, numberField } from '@/shared/helpers/zod-helpers.ts'

export const openShiftSchema = z.object({
  caja_id: idField('Selecciona una caja'),
  fondo_inicial: numberField('Ingresa el fondo inicial').min(0, 'El fondo no puede ser negativo'),
})

export type OpenShiftSchema = z.infer<typeof openShiftSchema>
