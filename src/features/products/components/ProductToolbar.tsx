import { PlusIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'

type ProductStatus = 'all' | 'active' | 'inactive'

interface ProductToolbarProps {
  status: ProductStatus
  totalLabel: string
  onStatusChange: (status: ProductStatus) => void
}

const STATUSES = ['all', 'active', 'inactive'] as const

const STATUS_LABELS: Record<ProductStatus, string> = {
  all: 'Todos',
  active: 'Activos',
  inactive: 'Inactivos',
}

export default function ProductToolbar({ status, totalLabel, onStatusChange }: ProductToolbarProps) {
  return (
    <>
      <ToggleGroup
        variant="outline"
        spacing={0}
        value={[status]}
        onValueChange={(values) => {
          const nextStatus = values.find((value): value is ProductStatus => STATUSES.some((item) => item === value))
          if (nextStatus) onStatusChange(nextStatus)
        }}
      >
        {STATUSES.map((item) => (
          <ToggleGroupItem key={item} value={item}>
            {STATUS_LABELS[item]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Badge variant="secondary">{totalLabel}</Badge>
      <Button nativeButton={false} render={<Link to="/productos/nuevo" />}>
        <PlusIcon data-icon="inline-start" />
        Nuevo producto
      </Button>
    </>
  )
}
