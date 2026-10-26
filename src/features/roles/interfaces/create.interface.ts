import type { Permission } from '@/shared/auth/permissions.ts'

export interface ICreateRole {
  nombre: string
  descripcion: string | null
  permisos: Permission[]
}
