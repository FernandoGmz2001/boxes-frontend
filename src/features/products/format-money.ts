const moneyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
})

export function formatMoney(value: string) {
  const amount = Number(value)
  if (Number.isNaN(amount)) return value
  return moneyFormatter.format(amount)
}
