import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateSale } from '../../interfaces/sales/create.interface.ts'
import type { IGetAllSales, IGetAllSalesParams } from '../../interfaces/sales/get-all.interface.ts'
import type { IVenta, IVentaCompleta } from '../../interfaces/sales/get.interface.ts'

export async function getSales(params: IGetAllSalesParams) {
  try {
    const response = await api.get<IGetAllSales>('/ventas', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las ventas')
  }
}

export async function getSale(saleId: number) {
  try {
    const response = await api.get<IVentaCompleta>(`/ventas/${saleId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener la venta')
  }
}

export async function createSale(payload: ICreateSale) {
  const response = await api.post<IVenta>('/ventas', payload)
  return response.data
}
