import { useState, type FormEvent } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { EyeIcon, EyeOffIcon, LockIcon, LogInIcon, MailIcon } from 'lucide-react'
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

const fieldClassName =
  'h-11 rounded-xl border-transparent bg-muted pr-3 pl-10 shadow-none placeholder:text-muted-foreground'

export default function LoginForm({ form, isSubmitting, onSubmit }: LoginFormProps) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    register,
    formState: { errors },
  } = form

  return (
    <section className="w-full max-w-[400px] rounded-[28px] border border-border bg-card px-6 pt-8 pb-6 text-card-foreground shadow-xl sm:px-7">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <LogInIcon className="size-5" />
      </div>

      <div className="mt-5 text-center">
        <h1 className="text-lg font-semibold tracking-tight">Inicia sesión con tu correo</h1>
        <p className="mx-auto mt-1.5 max-w-[18rem] text-sm leading-relaxed text-muted-foreground">
          Entra al punto de venta para cobrar y llevar el inventario del turno.
        </p>
      </div>

      <form className="mt-6" onSubmit={onSubmit} noValidate>
        <FieldGroup className="gap-3">
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="email" className="sr-only">
              Correo
            </FieldLabel>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Correo"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={fieldClassName}
                {...register('email')}
              />
            </div>
            <FieldError id="email-error" errors={[errors.email]} />
          </Field>

          <Field data-invalid={errors.password ? true : undefined}>
            <FieldLabel htmlFor="password" className="sr-only">
              Contraseña
            </FieldLabel>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Contraseña"
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
            <p className="text-right text-xs text-muted-foreground">¿Olvidaste tu contraseña?</p>
            <FieldError id="password-error" errors={[errors.password]} />
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-11 w-full rounded-xl"
          >
            {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </FieldGroup>
      </form>

      <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        O entra con
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-4 h-11 w-full rounded-xl bg-background"
      >
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
