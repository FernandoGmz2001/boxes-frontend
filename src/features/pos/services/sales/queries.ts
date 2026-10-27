import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllSalesParams } from '../../interfaces/sales/get-all.interface.ts'
import { isNoOpenShiftError } from '../../sale-errors.ts'
import { createSale, getSale, getSales } from './endpoints.ts'

export function useGetSales(params: IGetAllSalesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.POS.SALE_LIST(params),
    queryFn: () => getSales(params),
    enabled: (params.turno_id ?? 0) > 0,
    placeholderData: keepPreviousData,
  })
}

export function useGetSale(saleId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.POS.SALE_DETAIL(saleId),
    queryFn: () => getSale(saleId),
    enabled: saleId > 0,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createSale,
    onError: async (error) => {
      handleMutationError(error, 'No se pudo registrar la venta')
      if (isNoOpenShiftError(error)) {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.CURRENT_SHIFT })
      }
    },
    onSuccess: (sale) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.SALES })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.POS.SHIFT_CORTE(sale.turno_id) })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })
    },
  })
}
