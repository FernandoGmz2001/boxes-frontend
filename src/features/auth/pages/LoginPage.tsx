import LoginForm from '../components/LoginForm.tsx'
import LoginShowcase from '../components/LoginShowcase.tsx'
import { useLogin } from '../hooks/useLogin.ts'

export default function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLogin()

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-muted px-4 py-10 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-foreground/[0.07] blur-3xl" />
        <div className="absolute -right-32 -bottom-48 size-[36rem] rounded-full bg-foreground/[0.06] blur-3xl" />
        <div className="absolute top-1/4 right-1/4 size-72 rounded-full bg-background blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-border bg-card p-3 shadow-2xl shadow-foreground/10 md:grid-cols-[1.05fr_1fr]">
        <LoginShowcase />
        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <LoginForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  )
}
