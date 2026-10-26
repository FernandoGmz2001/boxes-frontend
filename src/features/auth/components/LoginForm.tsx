import { useState, type FormEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { BoxesIcon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.tsx'
import { Input } from '@/components/ui/input.tsx'
import { Spinner } from '@/components/ui/spinner.tsx'
import type { LoginSchema } from '../schemas/login.schema.ts'

interface LoginFormProps {
  form: UseFormReturn<LoginSchema>
  isSubmitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldClassName = 'h-11 rounded-xl bg-background px-3.5 shadow-xs placeholder:text-muted-foreground/70'

export default function LoginForm({ form, isSubmitting, onSubmit }: LoginFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <section className="w-full max-w-[380px] text-card-foreground">
      <span className="mb-6 flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-neutral-600 to-neutral-950 text-white shadow-lg shadow-neutral-950/25 md:hidden">
        <BoxesIcon className="size-5" />
      </span>

      <h1 className="font-heading text-3xl font-semibold tracking-tight">Inicia sesión</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Entra al punto de venta para cobrar y llevar el inventario del turno.
      </p>

      <form className="mt-8" onSubmit={onSubmit} noValidate>
        <FieldGroup className="gap-4">
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="email">Correo</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="p. ej. ana@negocio.com"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={fieldClassName}
              {...register('email')}
            />
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="password">Contraseña</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`${fieldClassName} pr-10`}
                {...register('password')}
              />
              <button
                type="button"
                aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={passwordVisible}
                onClick={() => setPasswordVisible((visible) => !visible)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {passwordVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
              </button>
            </div>
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-11 w-full rounded-xl shadow-lg shadow-foreground/20"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-linear-to-r from-transparent to-border" />
        o continúa con
        <span className="h-px flex-1 bg-linear-to-l from-transparent to-border" />
      </div>

      <Button type="button" variant="outline" className="mt-4 h-11 w-full rounded-xl bg-muted/60">
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z" />
          <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.4 14.4A7.2 7.2 0 0 1 5 12c0-.8.1-1.6.4-2.4V6.5H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.5l4-3.1Z" />
          <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8Z" />
        </svg>
        Google
      </Button>
    </section>
  )
}
