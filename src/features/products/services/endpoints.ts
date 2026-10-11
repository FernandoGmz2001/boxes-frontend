import axios from 'axios'
import { api } from '@/shared/api/client.ts'
import { handleApiError } from '@/shared/helpers/api-error.ts'
import type { ICreateProduct } from '../interfaces/create.interface.ts'
import type { IGetAllProducts, IGetAllProductsParams } from '../interfaces/get-all.interface.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import type { IImportProducts } from '../interfaces/import.interface.ts'
import type { IUpdateProduct } from '../interfaces/update.interface.ts'

const DEFAULT_TEMPLATE_FILE_NAME = 'plantilla-productos.xlsx'

function fileNameFromDisposition(disposition: unknown) {
  if (typeof disposition !== 'string') return DEFAULT_TEMPLATE_FILE_NAME

  const encodedName = /filename\*=UTF-8''([^;]+)/i.exec(disposition)?.[1]
  if (encodedName) return decodeURIComponent(encodedName)

  return /filename="?([^";]+)"?/i.exec(disposition)?.[1] ?? DEFAULT_TEMPLATE_FILE_NAME
}

async function readableError(error: unknown) {
  if (!axios.isAxiosError(error) || !(error.response?.data instanceof Blob)) return error

  const text = await error.response.data.text().catch(() => '')
  if (!text.trim()) return error

  try {
    error.response.data = JSON.parse(text) as unknown
  } catch {
    error.response.data = text
  }

  return error
}

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

export async function getProductTemplate() {
  try {
    const response = await api.get<Blob>('/productos/plantilla', { responseType: 'blob' })
    return {
      file: response.data,
      fileName: fileNameFromDisposition(response.headers['content-disposition']),
    }
  } catch (error) {
    throw handleApiError(await readableError(error), 'No se pudo descargar la plantilla de productos')
  }
}

export async function importProducts(file: File) {
  const formData = new FormData()
  formData.append('archivo', file)
  const response = await api.post<IImportProducts>('/productos/importacion', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
