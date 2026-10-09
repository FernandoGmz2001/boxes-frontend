import type { ReactTable, RowData } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import type { DataTableFeatures } from "./data-table-features.ts";

const PAGE_SIZES = ["5", "10", "20", "50"];

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export default function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="page-size">Filas</FieldLabel>
        <Combobox
          items={PAGE_SIZES}
          value={String(pageSize)}
          onValueChange={(value) => {
            if (value == null) return;
            table.setPageSize(Number(value));
          }}
        >
          <ComboboxInput id="page-size" aria-label="Filas por página" />
          <ComboboxContent side="top">
            <ComboboxEmpty>Sin coincidencias.</ComboboxEmpty>
            <ComboboxList>
              {(size) => (
                <ComboboxItem key={size} value={size}>
                  {size}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </Field>
      <p className="text-muted-foreground text-sm">
        Página {pageCount === 0 ? 0 : pageIndex + 1} de {pageCount} ({rowCount})
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Primera página</span>
          <ChevronsLeftIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Página anterior</span>
          <ChevronLeftIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Página siguiente</span>
          <ChevronRightIcon />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Última página</span>
          <ChevronsRightIcon />
        </Button>
      </div>
    </div>
  );
}
