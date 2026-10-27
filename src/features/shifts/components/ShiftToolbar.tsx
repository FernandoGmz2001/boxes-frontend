import { Input } from "@/components/ui/input.tsx";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useGetCashRegisters } from "@/features/pos/services/cash-registers/queries.ts";
import { SHIFT_STATUS_FILTERS, SHIFT_STATUS_FILTER_LABELS, type ShiftStatusFilter } from "../shift-status.ts";

const CASH_REGISTER_LIMIT = 100;

interface ShiftToolbarProps {
  status: ShiftStatusFilter;
  onStatusChange: (status: ShiftStatusFilter) => void;
  cashRegisterId: number;
  onCashRegisterChange: (cashRegisterId: number) => void;
  day: string;
  onDayChange: (day: string) => void;
}

export default function ShiftToolbar({
  status,
  onStatusChange,
  cashRegisterId,
  onCashRegisterChange,
  day,
  onDayChange,
}: ShiftToolbarProps) {
  const cashRegistersQuery = useGetCashRegisters({ limite: CASH_REGISTER_LIMIT });
  const cashRegisters = cashRegistersQuery.data?.data ?? [];

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[status]}
        onValueChange={(values) => {
          const nextStatus = values.find((value): value is ShiftStatusFilter =>
            SHIFT_STATUS_FILTERS.some((item) => item === value),
          );
          if (nextStatus) onStatusChange(nextStatus);
        }}
      >
        {SHIFT_STATUS_FILTERS.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {SHIFT_STATUS_FILTER_LABELS[item]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <NativeSelect
        aria-label="Filtrar por caja"
        className="w-48"
        value={String(cashRegisterId)}
        disabled={cashRegistersQuery.isLoading}
        onChange={(event) => onCashRegisterChange(Number(event.target.value))}
      >
        <NativeSelectOption value="0">Todas las cajas</NativeSelectOption>
        {cashRegisters.map((cashRegister) => (
          <NativeSelectOption key={cashRegister.id} value={String(cashRegister.id)}>
            {cashRegister.nombre}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <Input
        type="date"
        aria-label="Filtrar por día de apertura"
        className="h-11 w-auto rounded-xl"
        value={day}
        onChange={(event) => onDayChange(event.target.value)}
      />
    </div>
  );
}
