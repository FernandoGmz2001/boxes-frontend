import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

interface MovementPagerProps {
  page: number
  totalPages: number
  label?: string
  onPageChange: (page: number) => void
}

export default function MovementPager({ page, totalPages, label, onPageChange }: MovementPagerProps) {
  if (!label && totalPages <= 1) return null

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 px-1 pt-2 text-xs text-muted-foreground">
      <span>{label}</span>
      {totalPages > 1 ? (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Página anterior"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeftIcon />
          </Button>
          <span className="min-w-10 text-center tabular-nums">
            {page} / {totalPages}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Página siguiente"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
