import { useCallback, useMemo, useState } from "react";
import { WalletIcon } from "lucide-react";
import { generatePath, useNavigate } from "react-router";
import { cn } from "cn";
import { ROUTES } from "@/app/routes/routes.constants.ts";
import DataTable from "@/components/features/DataTable/DataTable.tsx";
import { useTablePagination } from "@/components/features/DataTable/hooks/useTablePagination.ts";
import ListHeader from "@/components/features/ListHeader/ListHeader.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty.tsx";
import { localDayRange } from "@/features/pos/pos-dates.ts";
import ShiftToolbar from "../components/ShiftToolbar.tsx";
import { createShiftColumns } from "../components/shift-columns.tsx";
import ShiftListSkeleton from "../components/Skeletons/ShiftListSkeleton.tsx";
import { useGetShifts } from "../services/queries.ts";
import { toShiftStatusParam, type ShiftStatusFilter } from "../shift-status.ts";

export default function ShiftsPage() {
  const navigate = useNavigate();
  const { page, pageSize, setPage, setPageSize, resetPage } = useTablePagination();
  const [status, setStatus] = useState<ShiftStatusFilter>("all");
  const [cashRegisterId, setCashRegisterId] = useState(0);
  const [day, setDay] = useState("");
  const shiftsQuery = useGetShifts({
    pagina: page,
    limite: pageSize,
    estado: toShiftStatusParam(status),
    caja_id: cashRegisterId || undefined,
    ...(day ? localDayRange(day) : {}),
  });
  const shifts = shiftsQuery.data?.data ?? [];
  const total = shiftsQuery.data?.total ?? 0;
  const totalPages = shiftsQuery.data?.total_paginas ?? (pageSize > 0 ? Math.ceil(total / pageSize) : 0);
  const hasFilters = status !== "all" || cashRegisterId > 0 || day !== "";

  const openShift = useCallback(
    (shiftId: number) => {
      navigate(generatePath(ROUTES.SHIFT_DETAIL, { shiftId: String(shiftId) }));
    },
    [navigate],
  );

  const columns = useMemo(() => createShiftColumns({ onOpen: openShift }), [openShift]);

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto p-4">
      <ListHeader title="Turnos y cortes" subtitle="Revisa los turnos de todas las cajas y lo que pasó en cada corte." />
      <ShiftToolbar
        status={status}
        onStatusChange={(nextStatus) => {
          resetPage();
          setStatus(nextStatus);
        }}
        cashRegisterId={cashRegisterId}
        onCashRegisterChange={(nextCashRegisterId) => {
          resetPage();
          setCashRegisterId(nextCashRegisterId);
        }}
        day={day}
        onDayChange={(nextDay) => {
          resetPage();
          setDay(nextDay);
        }}
      />
      {shiftsQuery.isLoading ? <ShiftListSkeleton /> : null}
      {shiftsQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>{shiftsQuery.error.message}</AlertDescription>
        </Alert>
      ) : null}
      {shiftsQuery.isSuccess && total === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WalletIcon />
            </EmptyMedia>
            <EmptyTitle>Sin turnos</EmptyTitle>
            <EmptyDescription>
              {hasFilters ? "No hay turnos para este filtro." : "Todavía no se ha abierto ningún turno."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {shiftsQuery.isSuccess && total > 0 ? (
        <Card className={cn("p-4", shiftsQuery.isFetching && "opacity-60")}>
          <DataTable
            columns={columns}
            data={shifts}
            getRowId={(shift) => String(shift.id)}
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              resetPage();
            }}
            onRowDoubleClick={(shift) => openShift(shift.id)}
          />
        </Card>
      ) : null}
    </main>
  );
}
