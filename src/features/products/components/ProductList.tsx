import { useMemo } from 'react'
import DataTable from '@/components/features/DataTable/DataTable.tsx'
import { Card } from '@/components/ui/card.tsx'
import type { IGetProduct } from '../interfaces/get.interface.ts'
import { createProductColumns } from './product-columns.tsx'

interface ProductListProps {
  products: IGetProduct[]
  categoryNames: Map<number, string>
  page: number
  pageSize: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEdit: (productId: number) => void
  onView: (productId: number) => void
  onToggleActive: (product: IGetProduct) => void
  onDeactivate: (productId: number) => void
  togglingProductId: number | null
}

export default function ProductList({
  products,
  categoryNames,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onView,
  onToggleActive,
  onDeactivate,
  togglingProductId,
}: ProductListProps) {
  const columns = useMemo(
    () =>
      createProductColumns({
        categoryNames,
        onEdit,
        onView,
        onToggleActive,
        onDeactivate,
        togglingProductId,
      }),
    [categoryNames, onDeactivate, onEdit, onToggleActive, onView, togglingProductId],
  )

  return (
    <Card>
      <DataTable
        columns={columns}
        data={products}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </Card>
  )
}
