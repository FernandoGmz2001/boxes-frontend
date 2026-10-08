import LoginForm from '../components/LoginForm.tsx'
import { useLogin } from '../hooks/useLogin.ts'

export default function LoginPage() {
  const { form, onSubmit, isSubmitting } = useLogin()

  return (
    <main className="grid min-h-svh place-items-center bg-muted p-6">
      <LoginForm form={form} isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </main>
  )
}
