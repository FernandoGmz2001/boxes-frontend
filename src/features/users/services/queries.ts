import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllUsersParams } from '../interfaces/get-all.interface.ts'
import type { IUpdateUser } from '../interfaces/update.interface.ts'
import { createUser, getUser, getUsers, updateUser } from './endpoints.ts'

export function useGetUsers(params: IGetAllUsersParams) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.LIST(params),
    queryFn: () => getUsers(params),
  })
}

export function useGetUser(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.USERS.DETAIL(userId),
    queryFn: () => getUser(userId),
    enabled: userId > 0,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createUser,
    onError: (error) => handleMutationError(error, 'No se pudo crear el usuario'),
    onSuccess: async (user) => {
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(user.id), user)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LISTS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.LISTS }),
      ])
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: number; payload: IUpdateUser }) => updateUser(userId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo actualizar el usuario'),
    onSuccess: async (user) => {
      queryClient.setQueryData(QUERY_KEYS.USERS.DETAIL(user.id), user)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LISTS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ROLES.LISTS }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH.PROFILE(user.id) }),
      ])
    },
  })
}
