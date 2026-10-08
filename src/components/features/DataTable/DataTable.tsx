import { useTable, type ColumnDef, type OnChangeFn, type PaginationState, type RowData } from '@tanstack/react-table'
import { Separator } from '@/components/ui/separator.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx'
import DataTablePagination from './DataTablePagination.tsx'
import { features, type DataTableFeatures } from './data-table-features.ts'

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
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
    state: { pagination },
    onPaginationChange: handlePaginationChange,
  })

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay resultados.
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
