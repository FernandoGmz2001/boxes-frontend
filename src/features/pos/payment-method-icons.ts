import { BanknoteIcon, CreditCardIcon, LandmarkIcon, type LucideIcon } from 'lucide-react'
import type { PaymentMethod } from './interfaces/sales/get.interface.ts'

export const PAYMENT_METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  Efectivo: BanknoteIcon,
  Tarjeta: CreditCardIcon,
  Transferencia: LandmarkIcon,
}

export const PAYMENT_METHOD_BADGE_VARIANTS: Record<PaymentMethod, 'success' | 'info' | 'warning'> = {
  Efectivo: 'success',
  Tarjeta: 'info',
  Transferencia: 'warning',
}
