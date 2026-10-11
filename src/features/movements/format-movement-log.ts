import type { IGetMovement } from './interfaces/get.interface.ts'

const dayFormatter = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit',
  month: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

const quantityFormatter = new Intl.NumberFormat('es-MX', {
  maximumFractionDigits: 2,
})

export interface MovementLogGroup {
  dayKey: string
  dayLabel: string
  movements: IGetMovement[]
}

export function formatQuantity(value: number) {
  return quantityFormatter.format(value)
}

export function formatMovementTime(iso: string) {
  return movementDayParts(iso).timeLabel
}

export function groupMovementsByDay(movements: IGetMovement[]) {
  const sorted = [...movements].sort(
    (left, right) => Date.parse(right.created_at) - Date.parse(left.created_at),
  )
  const groups: MovementLogGroup[] = []

  for (const movement of sorted) {
    const parts = movementDayParts(movement.created_at)
    const current = groups.at(-1)

    if (current && current.dayKey === parts.dayKey) {
      current.movements.push(movement)
      continue
    }

    groups.push({
      dayKey: parts.dayKey,
      dayLabel: parts.dayLabel,
      movements: [movement],
    })
  }

  return groups
}

export function movementLogMessage(movement: IGetMovement, productName: string | undefined) {
  const amount = movement.tipo_movimiento === 'Ajuste' ? movement.cantidad : Math.abs(movement.cantidad)
  const quantity = formatQuantity(amount)
  const unit = Math.abs(amount) === 1 ? 'unidad' : 'unidades'
  const product = productName ? ` en ${productName}` : ''
  const from = formatQuantity(movement.stock_previo)
  const to = formatQuantity(movement.stock_nuevo)
  const reason = movement.motivo ? ` Motivo: ${movement.motivo}.` : ''

  return `${movement.tipo_movimiento} de ${quantity} ${unit}${product}. La existencia pasó de ${from} a ${to}.${reason}`
}

function movementDayParts(iso: string) {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return { dayKey: iso, dayLabel: iso, timeLabel: '' }
  }

  return {
    dayKey: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    dayLabel: dayFormatter.format(date).replaceAll('.', ''),
    timeLabel: timeFormatter.format(date),
  }
}
