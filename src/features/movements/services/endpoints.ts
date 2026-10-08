import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateMovement } from '../interfaces/create.interface.ts'
import type { IGetAllMovements, IGetAllMovementsParams } from '../interfaces/get-all.interface.ts'
import type { IGetMovement } from '../interfaces/get.interface.ts'

export async function getMovements(params: IGetAllMovementsParams) {
  try {
    const response = await api.get<IGetAllMovements>('/movimientos', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los movimientos')
  }
}

export async function getMovement(movementId: number) {
  try {
    const response = await api.get<IGetMovement>(`/movimientos/${movementId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el movimiento')
  }
}

export async function createMovement(payload: ICreateMovement) {
  const response = await api.post<IGetMovement>('/movimientos', payload)
  return response.data
}
