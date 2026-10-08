import { use } from 'react'
import { AuthContext } from './auth-context.ts'

export function useAuth() {
  const authContext = use(AuthContext)

  if (!authContext) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return {
    session: authContext.session,
    isAuthenticated: authContext.session !== null,
    startSession: authContext.startSession,
    endSession: authContext.endSession,
  }
}
