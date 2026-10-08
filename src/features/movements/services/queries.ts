import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllMovementsParams } from '../interfaces/get-all.interface.ts'
import { createMovement, getMovement, getMovements } from './endpoints.ts'

export function useGetMovements(params: IGetAllMovementsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.MOVEMENTS.LIST(params),
    queryFn: () => getMovements(params),
  })
}

export function useGetMovement(movementId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.MOVEMENTS.DETAIL(movementId),
    queryFn: () => getMovement(movementId),
    enabled: movementId > 0,
  })
}

export function useCreateMovement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMovement,
    onError: (error) => handleMutationError(error, 'No se pudo crear el movimiento'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVEMENTS.ALL })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL })
    },
  })
}
