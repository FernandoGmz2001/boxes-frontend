import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllTaxObjectsParams } from '../interfaces/get-all.interface.ts'
import { getTaxObject, getTaxObjects } from './endpoints.ts'

export function useGetTaxObjects(params: IGetAllTaxObjectsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_OBJECTS.LIST(params),
    queryFn: () => getTaxObjects(params),
  })
}

export function useGetTaxObject(key: string) {
  return useQuery({
    queryKey: QUERY_KEYS.TAX_OBJECTS.DETAIL(key),
    queryFn: () => getTaxObject(key),
    enabled: key.length > 0,
  })
}
