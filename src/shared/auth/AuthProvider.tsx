import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth-context.ts'
import { clearSession, readSession, writeSession } from './session.ts'
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

  return <AuthContext value={{ session, startSession, endSession }}>{children}</AuthContext>
}
