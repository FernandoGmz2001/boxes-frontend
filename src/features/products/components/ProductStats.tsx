import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx'

interface ProductStatsProps {
  activeCount: number
  inactiveCount: number
}

export default function ProductStats({ activeCount, inactiveCount }: ProductStatsProps) {
  const total = activeCount + inactiveCount

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card size="sm">
        <CardHeader>
          <CardDescription>Productos activos</CardDescription>
          <CardTitle>{activeCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Productos inactivos</CardDescription>
          <CardTitle>{inactiveCount}</CardTitle>
        </CardHeader>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardDescription>Total</CardDescription>
          <CardTitle>{total}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
