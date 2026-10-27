import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllCashRegistersParams } from '../../interfaces/cash-registers/get-all.interface.ts'
import { getCashRegisters } from './endpoints.ts'

export function useGetCashRegisters(params: IGetAllCashRegistersParams, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.POS.CASH_REGISTERS(params),
    queryFn: () => getCashRegisters(params),
    enabled,
  })
}
