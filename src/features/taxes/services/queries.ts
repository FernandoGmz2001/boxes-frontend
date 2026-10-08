import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllTaxesParams } from '../interfaces/get-all.interface.ts'
import { getTax, getTaxes } from './endpoints.ts'

export function useGetTaxes(params: IGetAllTaxesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.TAXES.LIST(params),
    queryFn: () => getTaxes(params),
  })
}

export function useGetTax(taxId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.TAXES.DETAIL(taxId),
    queryFn: () => getTax(taxId),
    enabled: taxId > 0,
  })
}
