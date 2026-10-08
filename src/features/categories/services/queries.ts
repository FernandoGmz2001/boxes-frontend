import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleMutationError } from '@/shared/helpers/handle-mutation-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'
import type { IGetAllCategoriesParams } from '../interfaces/get-all.interface.ts'
import { createCategory, deleteCategory, getCategories, getCategory, updateCategory } from './endpoints.ts'
import type { IUpdateCategory } from '../interfaces/update.interface.ts'

export function useGetCategories(params: IGetAllCategoriesParams) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.LIST(params),
    queryFn: () => getCategories(params),
  })
}

export function useGetCategory(categoryId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.DETAIL(categoryId),
    queryFn: () => getCategory(categoryId),
    enabled: categoryId > 0,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onError: (error) => handleMutationError(error, 'No se pudo crear la categoría'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ categoryId, payload }: { categoryId: number; payload: IUpdateCategory }) =>
      updateCategory(categoryId, payload),
    onError: (error) => handleMutationError(error, 'No se pudo actualizar la categoría'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onError: (error) => handleMutationError(error, 'No se pudo borrar la categoría'),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CATEGORIES.ALL })
    },
  })
}
