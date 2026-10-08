import { z } from 'zod'
import { emailField, stringField } from '@/shared/helpers/zod-helpers.ts'

export const loginSchema = z.object({
  email: emailField(),
  password: stringField('La contraseña es obligatoria'),
})

export type LoginSchema = z.infer<typeof loginSchema>
