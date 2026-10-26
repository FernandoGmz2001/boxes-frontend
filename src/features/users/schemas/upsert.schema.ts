import { z } from 'zod'
import { booleanField, emailField, idField, stringField } from '@/shared/helpers/zod-helpers.ts'

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_LENGTH_MESSAGE = `Usa al menos ${PASSWORD_MIN_LENGTH} caracteres`

export function createUserSchema(isEditing: boolean) {
  return z.object({
    nombre: stringField('El nombre es obligatorio'),
    email: emailField(),
    password: isEditing
      ? z.string().refine((value) => value === '' || value.length >= PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_MESSAGE)
      : z.string().min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_MESSAGE),
    rol_id: idField('Selecciona un rol'),
    activo: booleanField(),
  })
}

export type UserSchema = z.infer<ReturnType<typeof createUserSchema>>
