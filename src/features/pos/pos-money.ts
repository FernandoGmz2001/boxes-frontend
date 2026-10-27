import { formatMoney } from '@/features/products/format-money.ts'

export function toCents(value: string | number) {
  return Math.round(Number(value) * 100)
}

export function centsToAmount(cents: number) {
  return cents / 100
}

export function formatCents(cents: number) {
  return formatMoney(centsToAmount(cents).toFixed(2))
}

export function parseAmountInput(value: string) {
  if (!value.trim()) return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

export function roundToCents(amount: number) {
  return centsToAmount(toCents(amount))
}
