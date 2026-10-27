import { useEffect, useEffectEvent, useState } from 'react'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getProducts } from '@/features/products/services/endpoints.ts'
import type { IGetAllProductsParams } from '@/features/products/interfaces/get-all.interface.ts'
import { getApiErrorMessage } from '@/shared/helpers/api-error.ts'
import { QUERY_KEYS } from '@/shared/react-query/query-keys.ts'

const SEARCH_DELAY = 300
const SEARCH_LIMIT = 20

function searchParams(search: string): IGetAllProductsParams {
  return { busqueda: search || undefined, activo: true, pagina: 1, limite: SEARCH_LIMIT }
}

export function useProductSearch() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const params = searchParams(debouncedSearch)
  const productsQuery = useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(params),
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData,
  })

  const updateDebouncedSearch = useEffectEvent((value: string) => {
    setDebouncedSearch(value)
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => updateDebouncedSearch(search.trim()), SEARCH_DELAY)
    return () => window.clearTimeout(timeoutId)
  }, [search])

  const findExactMatch = async (code: string) => {
    const exactParams = searchParams(code)

    try {
      const page = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.PRODUCTS.LIST(exactParams),
        queryFn: () => getProducts(exactParams),
      })
      const matches = page.data.filter((product) => product.codigo_barras === code || product.sku === code)
      return matches.length === 1 ? matches[0] : null
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'No se pudo buscar el producto'))
      return null
    }
  }

  const clearSearch = () => {
    setSearch('')
    setDebouncedSearch('')
  }

  return {
    search,
    setSearch,
    clearSearch,
    findExactMatch,
    products: productsQuery.data?.data ?? [],
    isLoading: productsQuery.isLoading,
    isFetching: productsQuery.isFetching,
    isError: productsQuery.isError,
  }
}
