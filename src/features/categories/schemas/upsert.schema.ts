import { z } from 'zod'
import { stringField } from '@/shared/helpers/zod-helpers.ts'
import { HEX_COLOR } from '../category-color.ts'

export const categorySchema = z.object({
  nombre: stringField('El nombre es obligatorio'),
  color_ui: z.string().trim().superRefine((value, ctx) => {
    if (value.length === 0 || HEX_COLOR.test(value)) return

    ctx.addIssue({
      code: 'custom',
      message: 'Usa un color hexadecimal, por ejemplo #1A73E8',
    })
  }),
})

export type CategorySchema = z.infer<typeof categorySchema>
