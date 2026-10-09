import { BoxesIcon } from 'lucide-react'
import LoginForm from '../components/LoginForm.tsx'
import { useLogin } from '../hooks/useLogin.ts'

export default function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLogin()

  return (
    <main className="relative min-h-svh overflow-hidden bg-muted text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15" />
        <div className="absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute top-1/2 left-1/2 size-[54rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10" />
        <div className="absolute -top-24 -left-16 size-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-8%] bottom-[-4rem] h-64 w-[28rem] rounded-full bg-background/80 blur-3xl" />
        <div className="absolute bottom-[-2rem] left-[18%] h-40 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <header className="absolute top-5 left-5 z-10 flex items-center gap-2.5 sm:top-6 sm:left-6">
        <span className="flex size-8 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <BoxesIcon className="size-4" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Boxes</span>
      </header>

      <div className="relative grid min-h-svh place-items-center px-4 py-20">
        <LoginForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </div>
    </main>
  )
}
