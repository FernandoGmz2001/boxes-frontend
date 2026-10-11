import { Skeleton } from '@/components/ui/skeleton.tsx'

export default function MovementProductListSkeleton() {
  return (
    <div className="flex flex-col gap-1 px-1" aria-hidden="true">
      {Array.from({ length: 8 }, (_, index) => (
        <Skeleton key={index} className="h-9 w-full" />
      ))}
    </div>
  )
}
