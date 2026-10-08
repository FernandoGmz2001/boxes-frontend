import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { ICreateProductTax } from '../interfaces/create.interface.ts'
import type { IGetAllProductTaxesParams } from '../interfaces/get-all.interface.ts'
import type { IUpdateProductTax } from '../interfaces/update.interface.ts'
import {
  createProductTax,
  deleteProductTax,
  getProductTax,
  getProductTaxes,
  updateProductTax,
} from './endpoints.ts'

export function useGetProductTaxes(productId: number, params: IGetAllProductTaxesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_TAXES.LIST(productId, params),
    queryFn: () => getProductTaxes(productId, params),
    enabled: productId > 0,
  })
}

export function useGetProductTax(productId: number, productTaxId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCT_TAXES.DETAIL(productId, productTaxId),
    queryFn: () => getProductTax(productId, productTaxId),
    enabled: productId > 0 && productTaxId > 0,
  })
}

export function useCreateProductTax(productId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ICreateProductTax) => createProductTax(productId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo asignar el impuesto'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_TAXES.ALL })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId) })
    },
  })
}

export function useUpdateProductTax(productId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productTaxId, payload }: { productTaxId: number; payload: IUpdateProductTax }) =>
      updateProductTax(productId, productTaxId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo actualizar el impuesto'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_TAXES.ALL })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId) })
    },
  })
}

export function useDeleteProductTax(productId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productTaxId: number) => deleteProductTax(productId, productTaxId),
    onError: (error) => handleMutationError(error, 'No se pudo borrar el impuesto'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCT_TAXES.ALL })
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAIL(productId) })
    },
  })
}
