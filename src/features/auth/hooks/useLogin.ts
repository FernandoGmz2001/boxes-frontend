import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAuth } from '@/shared/auth/useAuth.ts'
import { loginSchema } from '../schemas/login.schema.ts'
import type { LoginSchema } from '../schemas/login.schema.ts'
import { useLoginMutation } from '../services/queries.ts'

export function useLogin() {
  const navigate = useNavigate()
  const { startSession } = useAuth()
  const { mutateAsync, isPending } = useLoginMutation()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const response = await mutateAsync(values)
    startSession({
      accessToken: response.access_token,
      userId: response.usuario.id,
    })
    navigate('/')
  })

  return { form, onSubmit, isSubmitting: isPending }
}
