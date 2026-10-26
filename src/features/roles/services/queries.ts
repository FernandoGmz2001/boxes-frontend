import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllRolesParams } from '../interfaces/get-all.interface.ts'
import type { IUpdateRole } from '../interfaces/update.interface.ts'
import { createRole, deleteRole, getRole, getRoles, updateRole } from './endpoints.ts'

export function useGetRoles(params: IGetAllRolesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES.LIST(params),
    queryFn: () => getRoles(params),
  })
}

export function useGetRole(roleId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES.DETAIL(roleId),
    queryFn: () => getRole(roleId),
    enabled: roleId > 0,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRole,
    onError: (error) => handleMutationError(error, 'No se pudo crear el rol'),
    onSuccess: async (role) => {
      queryClient.setQueryData(QUERY_KEYS.ROLES.DETAIL(role.id), role)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.LISTS })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ roleId, payload }: { roleId: number; payload: IUpdateRole }) => updateRole(roleId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo actualizar el rol'),
    onSuccess: async (role) => {
      queryClient.setQueryData(QUERY_KEYS.ROLES.DETAIL(role.id), role)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.LISTS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILES }),
      ])
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRole,
    onError: (error) => handleMutationError(error, 'No se pudo eliminar el rol'),
    onSuccess: async (_, roleId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.ROLES.DETAIL(roleId) })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.LISTS })
    },
  })
}
