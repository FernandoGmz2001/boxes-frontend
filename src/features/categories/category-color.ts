const FULL_HEX_COLOR = /^#[0-9A-Fa-f]{6}$/
const SHORT_HEX_COLOR = /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/

export const HEX_COLOR = /^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/

export function colorPickerValue(value: string) {
  const trimmed = value.trim()
  if (FULL_HEX_COLOR.test(trimmed)) return trimmed

  const short = SHORT_HEX_COLOR.exec(trimmed)
  if (!short) return '#808080'

  return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`
}
