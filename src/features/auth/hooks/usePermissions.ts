import { useAuth } from '@/shared/auth/useAuth.ts'
import type { Permission } from '@/shared/auth/permissions.ts'
import { useGetProfile } from '../services/queries.ts'

export function usePermissions() {
  const { session } = useAuth()
  const profileQuery = useGetProfile(session?.userId ?? 0)
  const grantedPermissions = profileQuery.data?.permisos ?? []

  const can = (permission: Permission) => grantedPermissions.includes(permission)

  return {
    can,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  }
}
