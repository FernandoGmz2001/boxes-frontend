import { Skeleton } from "@/components/ui/skeleton.tsx";
import ShiftListSkeleton from "./ShiftListSkeleton.tsx";

export default function ShiftsSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-4" aria-hidden="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>
      <ShiftListSkeleton />
    </div>
  );
}
