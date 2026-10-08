import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllUnitKeysParams } from '../interfaces/get-all.interface.ts'
import { getUnitKey, getUnitKeys } from './endpoints.ts'

export function useGetUnitKeys(params: IGetAllUnitKeysParams) {
  return useQuery({
    queryKey: QUERY_KEYS.UNIT_KEYS.LIST(params),
    queryFn: () => getUnitKeys(params),
  })
}

export function useGetUnitKey(key: string) {
  return useQuery({
    queryKey: QUERY_KEYS.UNIT_KEYS.DETAIL(key),
    queryFn: () => getUnitKey(key),
    enabled: key.length > 0,
  })
}
