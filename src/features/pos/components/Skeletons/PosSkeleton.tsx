import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function PosSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4" aria-hidden="true">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-4xl" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(18rem,0.9fr)]">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-11 w-full rounded-xl" />
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-2 rounded-xl border p-4">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
        <div className="flex flex-col gap-4 rounded-xl border p-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
