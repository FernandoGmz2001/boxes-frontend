import { ClipboardListIcon, ReceiptTextIcon } from "lucide-react";
import { useParams } from "react-router";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import SaleHistory from "@/features/pos/components/Sale/SaleHistory.tsx";
import { useGetShift } from "@/features/pos/services/shifts/queries.ts";
import { useTabSearchParam } from "@/shared/hooks/useTabSearchParam.ts";
import ShiftDetailHeader from "../components/ShiftDetailHeader.tsx";
import ShiftSummary from "../components/ShiftSummary.tsx";
import ShiftDetailSkeleton from "../components/Skeletons/ShiftDetailSkeleton.tsx";

const SHIFT_DETAIL_TABS = ["resumen", "ventas"] as const;

export default function ShiftDetailPage() {
  const { shiftId: shiftIdParam } = useParams();
  const shiftId = Number(shiftIdParam);
  const isValidId = Number.isInteger(shiftId) && shiftId > 0;
  const shiftQuery = useGetShift(isValidId ? shiftId : 0);
  const { activeTab, setActiveTab } = useTabSearchParam(SHIFT_DETAIL_TABS, "resumen");
  const shift = shiftQuery.data;

  if (isValidId && shiftQuery.isLoading) return <ShiftDetailSkeleton />;

  if (!shift) {
    return (
      <main className="flex min-h-0 flex-1 flex-col p-4">
        <Alert variant="destructive">
          <AlertDescription>{shiftQuery.error?.message ?? "No se pudo cargar el turno."}</AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-4">
      <ShiftDetailHeader shift={shift} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumen">
            <ClipboardListIcon data-icon="inline-start" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="ventas">
            <ReceiptTextIcon data-icon="inline-start" />
            Ventas
          </TabsTrigger>
        </TabsList>
        <TabsContent value="resumen">
          <ShiftSummary shift={shift} />
        </TabsContent>
        <TabsContent value="ventas">
          <SaleHistory shiftId={shift.id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
