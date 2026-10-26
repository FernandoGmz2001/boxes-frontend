import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import { getProfile, login } from './endpoints.ts'

const PROFILE_STALE_TIME = 5 * 60 * 1000

export function useLoginMutation() {
  return useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGIN,
    mutationFn: login,
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleMutationError(new Error('Correo o contraseña incorrectos'))
        return
      }

      handleMutationError(error, 'No se pudo iniciar sesión')
    },
  })
}

export function useGetProfile(userId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH.PROFILE(userId),
    queryFn: getProfile,
    enabled: userId > 0,
    staleTime: PROFILE_STALE_TIME,
  })
}
