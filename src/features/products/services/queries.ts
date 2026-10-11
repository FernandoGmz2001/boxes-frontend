import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllProductsParams } from '../interfaces/get-all.interface.ts'
import type { IUpdateProduct } from '../interfaces/update.interface.ts'
import {
  createProduct,
  deactivateProduct,
  getProduct,
  getProductTemplate,
  getProducts,
  importProducts,
  updateProduct,
} from './endpoints.ts'

export function useGetProducts(params: IGetAllProductsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params),
    queryFn: () => getProducts(params),
  })
}

export function useGetProduct(productId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId),
    queryFn: () => getProduct(productId),
    enabled: productId > 0,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onError: (error) => handleMutationError(error, 'No se pudo crear el producto'),
    onSuccess: async (product) => {
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.DETAIL(product.id), product)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: number; payload: IUpdateProduct }) =>
      updateProduct(productId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo actualizar el producto'),
    onSuccess: async (product) => {
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.DETAIL(product.id), product)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })
    },
  })
}

export function useDownloadProductTemplate() {
  return useMutation({
    mutationFn: getProductTemplate,
    onError: (error) => handleMutationError(error, 'No se pudo descargar la plantilla de productos'),
  })
}

export function useImportProducts() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importProducts,
    onError: (error) => handleMutationError(error, 'No se pudieron importar los productos'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })
    },
  })
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivateProduct,
    onError: (error) => handleMutationError(error, 'No se pudo dar de baja el producto'),
    onSuccess: async (product) => {
      queryClient.setQueryData(QUERY_KEYS.PRODUCTS.DETAIL(product.id), product)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })
    },
  })
}
