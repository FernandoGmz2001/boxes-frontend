import { z } from 'zod'
import { PERMISSIONS } from '@/shared/auth/permissions.ts'
import { stringField } from '@/shared/helpers/zod-helpers.ts'

const DESCRIPTION_MAX_LENGTH = 200

export const roleSchema = z.object({
  nombre: stringField('El nombre es obligatorio'),
  descripcion: z.string().trim().max(DESCRIPTION_MAX_LENGTH, `Usa máximo ${DESCRIPTION_MAX_LENGTH} caracteres`),
  permisos: z.array(z.enum(PERMISSIONS)).min(1, 'Selecciona al menos un módulo'),
})

export type RoleSchema = z.infer<typeof roleSchema>
