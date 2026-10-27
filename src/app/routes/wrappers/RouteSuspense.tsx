import { Suspense, type ReactNode } from 'react'
import { Spinner } from '@/components/ui/spinner.tsx'
import { SKELETON_ROUTES } from './skeleton.routes.tsx'

interface RouteSuspenseProps {
  path: string
  children: ReactNode
}

export default function RouteSuspense({ path, children }: RouteSuspenseProps) {
  const RouteSkeleton = SKELETON_ROUTES[path]

  return (
    <Suspense
      fallback={
        RouteSkeleton ? (
          <RouteSkeleton />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-6 text-muted-foreground" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  )
}
