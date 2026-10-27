import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function ShiftDetailSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4" aria-hidden="true">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-4xl" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 rounded-xl border p-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border p-4">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="flex flex-col gap-2 rounded-xl border p-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
