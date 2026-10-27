const dateTimeFormatter = new Intl.DateTimeFormat('es-MX', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const timeFormatter = new Intl.DateTimeFormat('es-MX', {
  timeStyle: 'short',
})

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}

export function formatTime(value: string) {
  return timeFormatter.format(new Date(value))
}

/** Convierte un día local `YYYY-MM-DD` en el rango ISO [inicio, fin] de ese día. */
export function localDayRange(day: string) {
  const [year, month, date] = day.split('-').map(Number)
  if (!year || !month || !date) return null

  const start = new Date(year, month - 1, date, 0, 0, 0, 0)
  const end = new Date(year, month - 1, date, 23, 59, 59, 999)

  return { fecha_desde: start.toISOString(), fecha_hasta: end.toISOString() }
}
