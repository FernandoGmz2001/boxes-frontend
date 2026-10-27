import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { IGetAllShifts, IGetAllShiftsParams } from '../interfaces/get-all.interface.ts'

export async function getShifts(params: IGetAllShiftsParams) {
  try {
    const response = await api.get<IGetAllShifts>('/turnos', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los turnos')
  }
}
