import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllProductServiceKeysParams } from '../interfaces/get-all.interface.ts'
import { getProductServiceKey, getProductServiceKeys } from './endpoints.ts'

export function useGetProductServiceKeys(params: IGetAllProductServiceKeysParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_SERVICE_KEYS.LIST(params),
    queryFn: () => getProductServiceKeys(params),
  })
}

export function useGetProductServiceKey(key: string) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_SERVICE_KEYS.DETAIL(key),
    queryFn: () => getProductServiceKey(key),
    enabled: key.length > 0,
  })
}
