import LoginForm from '../components/LoginForm.tsx'
import LoginShowcase from '../components/LoginShowcase.tsx'
import { useLogin } from '../hooks/useLogin.ts'

export default function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLogin()

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden bg-neutral-900 px-4 py-10 text-foreground">
      <img
        src="https://images.unsplash.com/photo-1762081512133-30202f928bb9?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-neutral-950/20" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-border bg-card p-3 shadow-2xl shadow-foreground/10 md:grid-cols-[1.05fr_1fr]">
        <LoginShowcase />
        <div className="flex items-center justify-center px-5 py-10 sm:px-10">
          <LoginForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
        </div>
      </div>
    </main>
  )
}
