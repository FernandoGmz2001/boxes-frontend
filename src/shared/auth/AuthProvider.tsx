import { useEffect, useEffectEvent, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth-context.ts'
import { clearSession, readSession, SESSION_EXPIRED_EVENT, writeSession } from './session.ts'
import type { IAuthSession } from './session.ts'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<IAuthSession | null>(readSession)

  const startSession = (nextSession: IAuthSession) => {
    writeSession(nextSession)
    setSession(nextSession)
  }

  const endSession = () => {
    clearSession()
    setSession(null)
  }

  const expireSession = useEffectEvent(() => {
    setSession(null)
  })

  useEffect(() => {
    const handleSessionExpired = () => expireSession()

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
  }, [])

  return <AuthContext value={{ session, startSession, endSession }}>{children}</AuthContext>
}
