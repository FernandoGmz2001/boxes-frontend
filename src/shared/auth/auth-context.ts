import { createContext } from 'react'
import type { IAuthSession } from './session.ts'

export interface IAuthContextValue {
  session: IAuthSession | null
  startSession: (session: IAuthSession) => void
  endSession: () => void
}

export const AuthContext = createContext<IAuthContextValue | null>(null)
