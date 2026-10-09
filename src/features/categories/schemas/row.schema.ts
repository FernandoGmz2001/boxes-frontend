import { z } from 'zod'
import { categorySchema } from './upsert.schema.ts'

export const categoryRowSchema = categorySchema.pick({
  nombre: true,
  color_ui: true,
})

export type CategoryRowSchema = z.infer<typeof categoryRowSchema>
