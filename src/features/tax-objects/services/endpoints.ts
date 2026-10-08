import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { IGetAllTaxObjects, IGetAllTaxObjectsParams } from '../interfaces/get-all.interface.ts'
import type { IGetTaxObject } from '../interfaces/get.interface.ts'

export async function getTaxObjects(params: IGetAllTaxObjectsParams) {
  try {
    const response = await api.get<IGetAllTaxObjects>('/objetos-impuesto', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los objetos de impuesto')
  }
}

export async function getTaxObject(key: string) {
  try {
    const response = await api.get<IGetTaxObject>(`/objetos-impuesto/${key}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el objeto de impuesto')
  }
}
