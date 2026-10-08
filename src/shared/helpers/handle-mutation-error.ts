import { toast } from 'sonner'
import { getApiErrorMessage } from './api-error.ts'

export function handleMutationError(error: unknown, fallbackMessage = 'No se pudo completar la operación') {
  toast.error(getApiErrorMessage(error, fallbackMessage))
}
