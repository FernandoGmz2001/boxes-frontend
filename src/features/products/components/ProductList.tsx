import { useMemo } from 'react'
import { useNavigate } from 'react-router'
import DataTable from '@/components/features/DataTable/DataTable.tsx'
import type { IGetCategory } from '@/features/categories/interfaces/get.interface.ts'
import type { ProductRowEditHandlers } from '../hooks/useProductRowEdit.ts'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import { createProductColumns } from './product-columns.tsx'

interface ProductListProps extends ProductRowEditHandlers {
  products: IGetProduct[]
  categories: IGetCategory[]
  page: number
  pageSize: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onDeactivate: (productId: number) => void
}

export default function ProductList({
  products,
  categories,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  onDeactivate,
  valuesFor,
  errorFor,
  setField,
  isSaving,
}: ProductListProps) {
  const navigate = useNavigate()
  const columns = useMemo(
    () =>
      createProductColumns({
        categories,
        valuesFor,
        errorFor,
        setField,
        isSaving,
        onDeactivate,
      }),
    [categories, valuesFor, errorFor, setField, isSaving, onDeactivate],
  )

  return (
    <DataTable
      columns={columns}
      data={products}
      page={page}
      pageSize={pageSize}
      total={total}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowDoubleClick={(product) => navigate(`/productos/${product.id}`)}
    />
  )
}
