import { createColumnHelper } from '@tanstack/react-table'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import type { DataTableFeatures } from '@/components/features/DataTable/data-table-features.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import type { CategoryRowEditHandlers } from '../hooks/useCategoryRowEdit.ts'
import type { IGetCategory } from '../interfaces/get.interface.ts'
import CategoryEditableCell from './CategoryEditableCell.tsx'

export interface CategoryColumnHandlers extends CategoryRowEditHandlers {
  onEdit: (category: IGetCategory) => void
  onDelete: (categoryId: number) => void
}

const columnHelper = createColumnHelper<DataTableFeatures, IGetCategory>()

export function createCategoryColumns(handlers: CategoryColumnHandlers) {
  const editableCell = (category: IGetCategory, field: 'nombre' | 'color_ui') => (
    <CategoryEditableCell
      category={category}
      field={field}
      valuesFor={handlers.valuesFor}
      errorFor={handlers.errorFor}
      setField={handlers.setField}
      isSaving={handlers.isSaving}
    />
  )

  return columnHelper.columns([
    columnHelper.accessor('nombre', {
      header: 'Nombre',
      cell: ({ row }) => editableCell(row.original, 'nombre'),
    }),
    columnHelper.accessor('color_ui', {
      header: 'Color',
      cell: ({ row }) => editableCell(row.original, 'color_ui'),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className="sr-only">Acciones</span>,
      cell: ({ row }) => {
        const category = row.original

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Más" />}>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handlers.onEdit(category)}>
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onClick={() => handlers.onDelete(category.id)}>
                    <TrashIcon />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ])
}
