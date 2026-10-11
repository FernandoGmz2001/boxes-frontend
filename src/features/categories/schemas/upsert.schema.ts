import { z } from 'zod'
import { stringField } from '@/shared/helpers/zod-helpers.ts'

export const categorySchema = z.object({
  nombre: stringField('El nombre es obligatorio'),
})

export type CategorySchema = z.infer<typeof categorySchema>
