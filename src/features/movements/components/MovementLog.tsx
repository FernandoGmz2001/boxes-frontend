import {
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  ScrollTextIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { cn } from "cn";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import {
  MOVEMENT_TYPES,
  type IGetMovement,
  type MovementType,
} from "../interfaces/get.interface.ts";
import {
  formatMovementTime,
  groupMovementsByDay,
  movementLogMessage,
} from "../format-movement-log.ts";
import MovementPager from "./MovementPager.tsx";
import MovementLogSkeleton from "./Skeletons/MovementLogSkeleton.tsx";

const movementIcons = {
  Entrada: ArrowDownToLineIcon,
  Salida: ArrowUpFromLineIcon,
  Ajuste: SlidersHorizontalIcon,
} as const;

interface MovementLogProps {
  movements: IGetMovement[];
  pageMovementCount: number;
  productNames: Map<number, string>;
  showProductName: boolean;
  headerLabel: string;
  enabledTypes: Record<MovementType, boolean>;
  page: number;
  totalPages: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onTypeChange: (type: MovementType, enabled: boolean) => void;
  onPageChange: (page: number) => void;
}

export default function MovementLog({
  movements,
  pageMovementCount,
  productNames,
  showProductName,
  headerLabel,
  enabledTypes,
  page,
  totalPages,
  isLoading,
  isFetching,
  isError,
  onTypeChange,
  onPageChange,
}: MovementLogProps) {
  const groups = groupMovementsByDay(movements);
  const filteredEmpty =
    !isLoading && !isError && movements.length === 0 && pageMovementCount > 0;
  const empty =
    !isLoading && !isError && movements.length === 0 && pageMovementCount === 0;

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card shadow-sm col-span-2">
      <div className="flex shrink-0 items-end justify-between gap-3 border-b px-5">
        <h1 className="inline-flex items-center gap-2 border-b-2 border-primary py-3 text-sm font-medium">
          <ScrollTextIcon className="size-4" />
          Historial
        </h1>
        <p className="mb-3 truncate text-sm text-muted-foreground">
          {headerLabel}
        </p>
      </div>
      <div
        className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b px-5 py-3"
        role="group"
        aria-label="Tipos de movimiento"
      >
        <p className="mr-auto text-sm text-muted-foreground">
          Horarios en hora local
        </p>
        {MOVEMENT_TYPES.map((type) => (
          <label key={type} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={enabledTypes[type]}
              onCheckedChange={(checked) =>
                onTypeChange(type, checked === true)
              }
            />
            {type}
          </label>
        ))}
      </div>
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto px-5",
          isFetching && !isLoading && "opacity-60",
        )}
      >
        {isLoading ? <MovementLogSkeleton /> : null}
        {isError ? (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              No se pudieron cargar los movimientos.
            </AlertDescription>
          </Alert>
        ) : null}
        {empty ? (
          <Empty className="h-full border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ScrollTextIcon />
              </EmptyMedia>
              <EmptyTitle>No hay movimientos</EmptyTitle>
              <EmptyDescription>
                Las entradas, salidas y ajustes de existencia aparecerán aquí.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {filteredEmpty ? (
          <Empty className="h-full border-0">
            <EmptyHeader>
              <EmptyTitle>Nada con estos filtros</EmptyTitle>
              <EmptyDescription>
                No hay movimientos de los tipos seleccionados en esta página.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {groups.length > 0 ? (
          <ul>
            {groups.flatMap((group) =>
              group.movements.map((movement, index) => {
                const Icon = movementIcons[movement.tipo_movimiento];
                const name = showProductName
                  ? (productNames.get(movement.producto_id) ??
                    `el producto ${movement.producto_id}`)
                  : undefined;

                return (
                  <li
                    key={movement.id}
                    className="grid grid-cols-[4.5rem_3.25rem_1rem_minmax(0,1fr)] items-start gap-x-3 border-b py-3 text-sm last:border-b-0"
                  >
                    <span className="text-muted-foreground tabular-nums">
                      {index === 0 ? group.dayLabel : ""}
                    </span>
                    <time
                      className="text-muted-foreground tabular-nums"
                      dateTime={movement.created_at}
                    >
                      {formatMovementTime(movement.created_at)}
                    </time>
                    <Icon
                      className="mt-0.5 size-3.5 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <p className="min-w-0 leading-5">
                      {movementLogMessage(movement, name)}
                    </p>
                  </li>
                );
              }),
            )}
          </ul>
        ) : null}
      </div>
      {totalPages > 1 ? (
        <div className="shrink-0 border-t px-5 pb-2">
          <MovementPager
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      ) : null}
    </section>
  );
}
