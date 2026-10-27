import {
  useTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
} from '@tanstack/react-table'
import { cn } from 'cn'
import { SearchXIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import DataTablePagination from './DataTablePagination.tsx'
import { features, type DataTableFeatures } from './data-table-features.ts'

const ROW_CONTROL_SELECTOR =
  'input, textarea, select, button, a, [role="combobox"], [role="listbox"], [role="menu"], [role="checkbox"]'

function isRowControlTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest(ROW_CONTROL_SELECTOR) !== null
}

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  onRowDoubleClick?: (row: TData) => void
  getRowId?: (row: TData, index: number) => string
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
}

export default function DataTable<TData extends RowData>({
  columns,
  data,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onRowDoubleClick,
  getRowId,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const pagination: PaginationState = {
    pageIndex: Math.max(page - 1, 0),
    pageSize,
  }

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater

    if (next.pageSize !== pagination.pageSize) {
      onPageSizeChange(next.pageSize)
      return
    }

    if (next.pageIndex !== pagination.pageIndex) {
      onPageChange(next.pageIndex + 1)
    }
  }

  const table = useTable({
    features,
    data,
    columns,
    manualPagination: true,
    autoResetPageIndex: false,
    pageCount: totalPages,
    rowCount: total,
    getRowId,
    state: rowSelection ? { pagination, rowSelection } : { pagination },
    onPaginationChange: handlePaginationChange,
    onRowSelectionChange,
  })

  return (
    <div>
      <Table>
        <TableHeader className="[&_tr]:border-b-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/60 hover:bg-muted/60">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 text-xs font-medium tracking-wide text-muted-foreground uppercase first:rounded-l-lg last:rounded-r-lg"
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
                className={cn(onRowDoubleClick && 'cursor-pointer')}
                onDoubleClick={
                  onRowDoubleClick
                    ? (event) => {
                        if (isRowControlTarget(event.target)) return
                        onRowDoubleClick(row.original)
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <SearchXIcon className="size-4" aria-hidden="true" />
                  No hay resultados.
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Separator />
      <DataTablePagination table={table} />
    </div>
  )
}
