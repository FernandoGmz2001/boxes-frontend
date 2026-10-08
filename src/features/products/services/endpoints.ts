import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateProduct } from '../interfaces/create.interface.ts'
import type { IGetAllProducts, IGetAllProductsParams } from '../interfaces/get-all.interface.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import type { IUpdateProduct } from '../interfaces/update.interface.ts'

export async function getProducts(params: IGetAllProductsParams) {
  try {
    const response = await api.get<IGetAllProducts>('/productos', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener los productos')
  }
}

export async function getProduct(productId: number) {
  try {
    const response = await api.get<IGetProduct>(`/productos/${productId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener el producto')
  }
}

export async function createProduct(payload: ICreateProduct) {
  const response = await api.post<IGetProduct>('/productos', payload)
  return response.data
}

export async function updateProduct(productId: number, payload: IUpdateProduct) {
  const response = await api.patch<IGetProduct>(`/productos/${productId}`, payload)
  return response.data
}

export async function deactivateProduct(productId: number) {
  const response = await api.delete<IGetProduct>(`/productos/${productId}`)
  return response.data
}
