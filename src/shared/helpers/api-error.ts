import axios from 'axios'

function readServerMessage(error: unknown): string | null {
  if (!axios.isAxiosError(error)) return null

  const responseBody: unknown = error.response?.data

  if (typeof responseBody === 'string' && responseBody.trim()) {
    return responseBody
  }

  if (typeof responseBody !== 'object' || responseBody === null || !('message' in responseBody)) {
    return null
  }

  const message = responseBody.message

  if (typeof message === 'string' && message.trim()) {
    return message
  }

  if (!Array.isArray(message)) return null

  const messages = message.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  return messages.length > 0 ? messages.join('. ') : null
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError(error) && !error.response) {
    return 'No se pudo conectar con el servidor'
  }

  if (error instanceof Error && !axios.isAxiosError(error) && error.message) {
    return error.message
  }

  return readServerMessage(error) ?? fallbackMessage
}

export function handleApiError(error: unknown, fallbackMessage: string): never {
  throw new Error(getApiErrorMessage(error, fallbackMessage))
}
