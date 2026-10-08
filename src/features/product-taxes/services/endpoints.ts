import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateProductTax } from '../interfaces/create.interface.ts'
import type { IGetAllProductTaxes, IGetAllProductTaxesParams } from '../interfaces/get-all.interface.ts'
import type { IGetProductTax } from '../interfaces/get.interface.ts'
import type { IUpdateProductTax } from '../interfaces/update.interface.ts'

export async function getProductTaxes(productId: number, params: IGetAllProductTaxesParams) {
  try {
    const response = await api.get<IGetAllProductTaxes>(`/productos/${productId}/impuestos`, { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los impuestos del producto')
  }
}

export async function getProductTax(productId: number, productTaxId: number) {
  try {
    const response = await api.get<IGetProductTax>(`/productos/${productId}/impuestos/${productTaxId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el impuesto del producto')
  }
}

export async function createProductTax(productId: number, payload: ICreateProductTax) {
  const response = await api.post<IGetProductTax>(`/productos/${productId}/impuestos`, payload)
  return response.data
}

export async function updateProductTax(productId: number, productTaxId: number, payload: IUpdateProductTax) {
  const response = await api.patch<IGetProductTax>(`/productos/${productId}/impuestos/${productTaxId}`, payload)
  return response.data
}

export async function deleteProductTax(productId: number, productTaxId: number) {
  await api.delete(`/productos/${productId}/impuestos/${productTaxId}`)
}
