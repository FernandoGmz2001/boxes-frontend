import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '@/shared/auth/useAuth.ts'

interface SessionGateProps {
  mode: 'authenticated' | 'guest'
  children: ReactNode
}

export default function SessionGate({ mode, children }: SessionGateProps) {
  const { isAuthenticated } = useAuth()
  const canAccess = mode === 'authenticated' ? isAuthenticated : !isAuthenticated

  if (!canAccess) {
    return <Navigate to={mode === 'authenticated' ? '/login' : '/'} replace />
  }

  return children
}
