import { useMemo } from 'react'
import DataTable from '@/components/features/DataTable/DataTable.tsx'
import { Card } from '@/components/ui/card.tsx'
import type { CategoryRowEditHandlers } from '../hooks/useCategoryRowEdit.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import { createCategoryColumns } from './category-columns.tsx'

interface CategoryListProps extends CategoryRowEditHandlers {
  categories: IGetCategory[]
  page: number
  pageSize: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onEdit: (category: IGetCategory) => void
  onDelete: (categoryId: number) => void
}

export default function CategoryList({
  categories,
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  valuesFor,
  errorFor,
  setField,
  isSaving,
}: CategoryListProps) {
  const columns = useMemo(
    () =>
      createCategoryColumns({
        valuesFor,
        errorFor,
        setField,
        isSaving,
        onEdit,
        onDelete,
      }),
    [valuesFor, errorFor, setField, isSaving, onEdit, onDelete],
  )

  return (
    <Card className="p-4">
      <DataTable
        columns={columns}
        data={categories}
        page={page}
        pageSize={pageSize}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onRowDoubleClick={onEdit}
      />
    </Card>
  )
}
