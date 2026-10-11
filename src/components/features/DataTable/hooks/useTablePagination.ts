import { useEffect, useEffectEvent, useState } from 'react'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export function useTablePagination(initialPageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const updateDebouncedSearch = useEffectEvent((value: string) => {
    setDebouncedSearch(value)
  })

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      updateDebouncedSearch(search)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [search])

  const resetPage = () => {
    setPage(1)
  }

  return {
    page,
    pageSize,
    search,
    debouncedSearch,
    setPage,
    setPageSize,
    setSearch,
    resetPage,
  }
}
