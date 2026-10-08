import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { IGetAllUnitKeys, IGetAllUnitKeysParams } from '../interfaces/get-all.interface.ts'
import type { IGetUnitKey } from '../interfaces/get.interface.ts'

export async function getUnitKeys(params: IGetAllUnitKeysParams) {
  try {
    const response = await api.get<IGetAllUnitKeys>('/claves-unidad', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las claves de unidad')
  }
}

export async function getUnitKey(key: string) {
  try {
    const response = await api.get<IGetUnitKey>(`/claves-unidad/${key}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener la clave de unidad')
  }
}
