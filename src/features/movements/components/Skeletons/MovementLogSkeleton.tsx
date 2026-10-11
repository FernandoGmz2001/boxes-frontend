import { Skeleton } from '@/components/ui/skeleton.tsx'

export default function MovementLogSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="grid grid-cols-[4.5rem_3.25rem_1rem_minmax(0,1fr)] items-center gap-3 border-b py-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-10" />
          <Skeleton className="size-3.5" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  )
}
