import { z } from 'zod'

export function stringField(message = 'Este campo es obligatorio') {
  return z.string().trim().min(1, message)
}

export function emailField(message = 'Ingresa un correo válido') {
  return z.string().trim().pipe(z.email(message))
}

export function numberField(message = 'Ingresa un número válido') {
  return z.number(message)
}

export function booleanField() {
  return z.boolean()
}

export function idField(message = 'Selecciona una opción') {
  return z.number(message).int().positive(message)
}
