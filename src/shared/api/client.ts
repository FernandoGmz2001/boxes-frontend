import axios from 'axios'
import { readSession } from '@/shared/auth/session.ts'

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
