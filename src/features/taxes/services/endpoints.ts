import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { IGetAllTaxes, IGetAllTaxesParams } from '../interfaces/get-all.interface.ts'
import type { IGetTax } from '../interfaces/get.interface.ts'

export async function getTaxes(params: IGetAllTaxesParams) {
  try {
    const response = await api.get<IGetAllTaxes>('/impuestos', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los impuestos')
  }
}

export async function getTax(taxId: number) {
  try {
    const response = await api.get<IGetTax>(`/impuestos/${taxId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el impuesto')
  }
}
