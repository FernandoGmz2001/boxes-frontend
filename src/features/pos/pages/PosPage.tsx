import { useState } from "react";
import { HistoryIcon, ShoppingCartIcon, StoreIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { useTabSearchParam } from "@/shared/hooks/useTabSearchParam.ts";
import SaleHistory from "../components/Sale/SaleHistory.tsx";
import SaleWorkspace from "../components/Sale/SaleWorkspace.tsx";
import OpenShiftDialog from "../components/Shift/OpenShiftDialog.tsx";
import ShiftClosedDialog from "../components/Shift/ShiftClosedDialog.tsx";
import ShiftHeader from "../components/Shift/ShiftHeader.tsx";
import PosSkeleton from "../components/Skeletons/PosSkeleton.tsx";
import type { ICierreTurno } from "../interfaces/shifts/close.interface.ts";
import { useGetCurrentShift } from "../services/shifts/queries.ts";

const POS_TABS = ["venta", "historial"] as const;

export default function PosPage() {
  const currentShiftQuery = useGetCurrentShift();
  const { activeTab, setActiveTab } = useTabSearchParam(POS_TABS, "venta");
  const [isOpeningShift, setIsOpeningShift] = useState(false);
  const [closing, setClosing] = useState<ICierreTurno | null>(null);
  const shift = currentShiftQuery.data;

  if (currentShiftQuery.isLoading) return <PosSkeleton />;

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
      {currentShiftQuery.isError ? (
        <Alert variant="destructive">
          <AlertDescription>{currentShiftQuery.error.message}</AlertDescription>
          <AlertAction>
            <Button type="button" size="sm" variant="outline" onClick={() => currentShiftQuery.refetch()}>
              Reintentar
            </Button>
          </AlertAction>
        </Alert>
      ) : null}
      {shift === null ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <StoreIcon />
            </EmptyMedia>
            <EmptyTitle>No tienes un turno abierto</EmptyTitle>
            <EmptyDescription>Abre un turno en una caja para empezar a vender.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type="button" size="lg" autoFocus onClick={() => setIsOpeningShift(true)}>
              Abrir turno
            </Button>
          </EmptyContent>
        </Empty>
      ) : null}
      {shift ? (
        <>
          <ShiftHeader shift={shift} onShiftClosed={setClosing} />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="venta">
                <ShoppingCartIcon data-icon="inline-start" />
                Venta
              </TabsTrigger>
              <TabsTrigger value="historial">
                <HistoryIcon data-icon="inline-start" />
                Historial
              </TabsTrigger>
            </TabsList>
            <TabsContent value="venta" keepMounted>
              <SaleWorkspace />
            </TabsContent>
            <TabsContent value="historial">
              <SaleHistory shiftId={shift.id} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
      {isOpeningShift && shift === null ? <OpenShiftDialog onClose={() => setIsOpeningShift(false)} /> : null}
      {closing ? <ShiftClosedDialog closing={closing} onClose={() => setClosing(null)} /> : null}
    </main>
  );
}
