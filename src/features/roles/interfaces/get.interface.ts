import type { Permission } from '@/shared/auth/permissions.ts'

export interface IGetRole {
  id: number
  nombre: string
  descripcion: string | null
  permisos: Permission[]
  es_sistema: boolean
  total_usuarios: number
}
