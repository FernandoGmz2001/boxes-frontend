import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import { login } from './endpoints.ts'

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
