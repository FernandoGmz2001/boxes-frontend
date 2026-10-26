import axios from 'axios'
import { clearSession, readSession, SESSION_EXPIRED_EVENT } from '@/shared/auth/session.ts'

const apiUrl = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const session = readSession()

  if (session) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

api.interceptors.response.use(undefined, (error: unknown) => {
  const isExpiredSession =
    axios.isAxiosError(error) && error.response?.status === 401 && error.config?.url !== '/auth/login'

  if (isExpiredSession && readSession()) {
    clearSession()
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT))
  }

  return Promise.reject(error)
})
