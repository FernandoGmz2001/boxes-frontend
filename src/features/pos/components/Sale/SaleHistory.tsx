import { useCallback, useMemo, useState } from "react";
import { ReceiptTextIcon } from "lucide-react";
import { cn } from "cn";
import DataTable from "@/components/features/DataTable/DataTable.tsx";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import SearchInput from "@/components/features/SearchInput/SearchInput.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { localDayRange } from "../../pos-dates.ts";
import { useGetSales } from "../../services/sales/queries.ts";
import SaleDetailDialog from "./SaleDetailDialog.tsx";
import { createSaleColumns } from "./sale-columns.tsx";

interface SaleHistoryProps {
  shiftId: number;
}

export default function SaleHistory({ shiftId }: SaleHistoryProps) {
  const { page, pageSize, search, setPage, setPageSize, setSearch, resetPage } = useTablePagination();
  const [day, setDay] = useState("");
  const [openSaleId, setOpenSaleId] = useState<number | null>(null);
  const salesQuery = useGetSales({
    turno_id: shiftId,
    pagina: page,
    limite: pageSize,
    folio: search || undefined,
    ...(day ? localDayRange(day) : {}),
  });
  const sales = salesQuery.data?.data ?? [];
  const total = salesQuery.data?.total ?? 0;
  const totalPages = salesQuery.data?.total_paginas ?? (pageSize > 0 ? Math.ceil(total / pageSize) : 0);

  const openSale = useCallback((saleId: number) => {
    setOpenSaleId(saleId);
  }, []);

  const columns = useMemo(() => createSaleColumns({ onOpen: openSale }), [openSale]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          label="Buscar por folio"
          placeholder="Folio, p. ej. V-00000001"
          onDebouncedChange={(value) => {
            resetPage();
            setSearch(value);
          }}
        />
        <Input
          type="date"
          aria-label="Filtrar por día"
          className="h-11 w-auto rounded-xl"
          value={day}
          onChange={(event) => {
            resetPage();
            setDay(event.target.value);
          }}
        />
      </div>
      {salesQuery.isLoading ? (
        <div className="flex flex-col gap-3" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : null}
      {salesQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>{salesQuery.error.message}</AlertDescription>
        </Alert>
      ) : null}
      {salesQuery.isSuccess && total === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptTextIcon />
            </EmptyMedia>
            <EmptyTitle>Sin ventas</EmptyTitle>
            <EmptyDescription>
              {search || day ? "No hay ventas para este filtro." : "Aún no hay ventas en este turno."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {salesQuery.isSuccess && total > 0 ? (
        <Card className={cn("p-4", salesQuery.isFetching && "opacity-60")}>
          <DataTable
            columns={columns}
            data={sales}
            getRowId={(sale) => String(sale.id)}
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              resetPage();
            }}
            onRowDoubleClick={(sale) => openSale(sale.id)}
          />
        </Card>
      ) : null}
      {openSaleId !== null ? <SaleDetailDialog saleId={openSaleId} onClose={() => setOpenSaleId(null)} /> : null}
    </div>
  );
}
