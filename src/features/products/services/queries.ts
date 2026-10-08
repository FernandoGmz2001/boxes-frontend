import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllProducts, IGetAllProductsParams } from '../interfaces/get-all.interface.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import type { IUpdateProduct } from '../interfaces/update.interface.ts'
import { createProduct, deactivateProduct, getProduct, getProducts, updateProduct } from './endpoints.ts'

function cachedProduct(queryClient: QueryClient, productId: number) {
  let product: IGetProduct | undefined
  let updatedAt = 0

  for (const query of queryClient.getQueryCache().findAll({ queryKey: QUERY_KEYS.PRODUCTS.LISTS })) {
    const page = query.state.data as IGetAllProducts | undefined
    const match = page?.data.find((item) => item.id === productId)
    if (!match || query.state.dataUpdatedAt < updatedAt) continue

    product = match
    updatedAt = query.state.dataUpdatedAt
  }

  return product ? { product, updatedAt } : undefined
}

export function useGetProducts(params: IGetAllProductsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params),
    queryFn: () => getProducts(params),
  })
}

export function useGetProduct(productId: number) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId),
    queryFn: () => getProduct(productId),
    enabled: productId > 0,
    initialData: () => cachedProduct(queryClient, productId)?.product,
    initialDataUpdatedAt: () => cachedProduct(queryClient, productId)?.updatedAt,
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
