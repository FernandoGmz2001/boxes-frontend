import { cn } from 'cn'

interface MovementProductOptionProps {
  label: string
  stock?: string
  selected: boolean
  onSelect: () => void
}

export default function MovementProductOption({ label, stock, selected, onSelect }: MovementProductOptionProps) {
  return (
    <button
      type="button"
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent/70',
        selected && 'bg-accent text-foreground hover:bg-accent',
      )}
      onClick={onSelect}
    >
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {stock ? <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{stock}</span> : null}
      <span className="flex w-4 shrink-0 justify-center" aria-hidden="true">
        {selected ? (
          <span className="size-0 border-y-[5px] border-l-[6px] border-y-transparent border-l-muted-foreground" />
        ) : null}
      </span>
    </button>
  )
}
