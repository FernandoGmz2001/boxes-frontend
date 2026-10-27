import axios from 'axios'

const NO_OPEN_SHIFT_MESSAGE = 'Abre un turno antes de vender.'

function readMessage(error: unknown): unknown {
  if (!axios.isAxiosError(error)) return undefined
  const responseBody: unknown = error.response?.data
  if (typeof responseBody !== 'object' || responseBody === null || !('message' in responseBody)) return undefined
  return responseBody.message
}

export function isNoOpenShiftError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 409 && readMessage(error) === NO_OPEN_SHIFT_MESSAGE
}

export function getStockErrorMessages(error: unknown) {
  if (!axios.isAxiosError(error) || error.response?.status !== 400) return []

  const message = readMessage(error)
  if (!Array.isArray(message)) return []

  return message.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

interface MatchableLine {
  productId: number
  names: string[]
}

const PRODUCT_ID_PATTERN = /\bproducto\s+#?(\d+)\b/i

function findLineForMessage(lines: MatchableLine[], message: string) {
  const productId = Number(PRODUCT_ID_PATTERN.exec(message)?.[1])
  const lineById = lines.find((candidate) => candidate.productId === productId)
  if (lineById) return lineById

  const normalizedMessage = message.toLowerCase()
  return lines.find((candidate) =>
    candidate.names.some((name) => name && normalizedMessage.includes(name.toLowerCase())),
  )
}

export function groupMessagesByLine(lines: MatchableLine[], messages: string[]) {
  const byProductId = new Map<number, string[]>()
  const unmatched: string[] = []

  for (const message of messages) {
    const line = findLineForMessage(lines, message)

    if (!line) {
      unmatched.push(message)
      continue
    }

    byProductId.set(line.productId, [...(byProductId.get(line.productId) ?? []), message])
  }

  return { byProductId, unmatched }
}
