import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateCategory } from '../interfaces/create.interface.ts'
import type { IGetAllCategories, IGetAllCategoriesParams } from '../interfaces/get-all.interface.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import type { IUpdateCategory } from '../interfaces/update.interface.ts'

export async function getCategories(params: IGetAllCategoriesParams) {
  try {
    const response = await api.get<IGetAllCategories>('/categorias', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudieron obtener las categorías')
  }
}

export async function getCategory(categoryId: number) {
  try {
    const response = await api.get<IGetCategory>(`/categorias/${categoryId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'No se pudo obtener la categoría')
  }
}

export async function createCategory(payload: ICreateCategory) {
  const response = await api.post<IGetCategory>('/categorias', payload)
  return response.data
}

export async function updateCategory(categoryId: number, payload: IUpdateCategory) {
  const response = await api.patch<IGetCategory>(`/categorias/${categoryId}`, payload)
  return response.data
}

export async function deleteCategory(categoryId: number) {
  await api.delete(`/categorias/${categoryId}`)
}
