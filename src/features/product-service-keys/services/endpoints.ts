import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { IGetAllProductServiceKeys, IGetAllProductServiceKeysParams } from '../interfaces/get-all.interface.ts'
import type { IGetProductServiceKey } from '../interfaces/get.interface.ts'

export async function getProductServiceKeys(params: IGetAllProductServiceKeysParams) {
  try {
    const response = await api.get<IGetAllProductServiceKeys>('/claves-producto-servicio', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las claves de producto o servicio')
  }
}

export async function getProductServiceKey(key: string) {
  try {
    const response = await api.get<IGetProductServiceKey>(`/claves-producto-servicio/${key}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener la clave de producto o servicio')
  }
}
