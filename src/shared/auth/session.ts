const SESSION_STORAGE_KEY = 'boxes.auth.session.v1'

export interface IAuthSession {
  accessToken: string
  userId: number
}

function isAuthSession(value: unknown): value is IAuthSession {
  if (typeof value !== 'object' || value === null) return false

  const session = value as Record<string, unknown>
  return typeof session.accessToken === 'string' && session.accessToken.length > 0 && typeof session.userId === 'number'
}

export function readSession(): IAuthSession | null {
  const rawSession = localStorage.getItem(SESSION_STORAGE_KEY)
  if (!rawSession) return null

  try {
    const parsedSession: unknown = JSON.parse(rawSession)
    if (isAuthSession(parsedSession)) return parsedSession
  } catch {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    return null
  }

  localStorage.removeItem(SESSION_STORAGE_KEY)
  return null
}

export function writeSession(session: IAuthSession) {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}
