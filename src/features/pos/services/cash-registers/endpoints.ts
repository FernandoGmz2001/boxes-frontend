import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type {
  IGetAllCashRegisters,
  IGetAllCashRegistersParams,
} from '../../interfaces/cash-registers/get-all.interface.ts'

export async function getCashRegisters(params: IGetAllCashRegistersParams) {
  try {
    const response = await api.get<IGetAllCashRegisters>('/cajas', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las cajas')
  }
}
