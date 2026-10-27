import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllShiftsParams } from '../interfaces/get-all.interface.ts'
import { getShifts } from './endpoints.ts'

export function useGetShifts(params: IGetAllShiftsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.SHIFTS.LIST(params),
    queryFn: () => getShifts(params),
    placeholderData: keepPreviousData,
  })
}
