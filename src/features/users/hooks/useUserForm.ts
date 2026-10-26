import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ICreateUser } from '../interfaces/create.interface.ts'
import type { IGetUser } from '../interfaces/get.interface.ts'
import type { IUpdateUser } from '../interfaces/update.interface.ts'
import { createUserSchema, type UserSchema } from '../schemas/upsert.schema.ts'
import { useCreateUser, useUpdateUser } from '../services/queries.ts'

const emptyValues: UserSchema = {
  nombre: '',
  email: '',
  password: '',
  rol_id: 0,
  activo: true,
}

function toFormValues(user: IGetUser): UserSchema {
  return {
    nombre: user.nombre,
    email: user.email,
    password: '',
    rol_id: user.rol.id,
    activo: user.activo,
  }
}

function buildCreatePayload(values: UserSchema): ICreateUser {
  return {
    nombre: values.nombre,
    email: values.email,
    password: values.password,
    rol_id: values.rol_id,
  }
}

function buildUpdatePayload(values: UserSchema): IUpdateUser {
  return {
    nombre: values.nombre,
    email: values.email,
    rol_id: values.rol_id,
    activo: values.activo,
    ...(values.password ? { password: values.password } : {}),
  }
}

export function useUserForm(user: IGetUser | null, onSaved: () => void) {
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser()
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser()
  const isEditing = user !== null

  const form = useForm<UserSchema>({
    resolver: zodResolver(createUserSchema(isEditing)),
    defaultValues: user ? toFormValues(user) : emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (user) {
      await updateUser({ userId: user.id, payload: buildUpdatePayload(values) })
    } else {
      await createUser(buildCreatePayload(values))
    }

    onSaved()
  })

  return {
    form,
    onSubmit,
    isEditing,
    isSubmitting: isCreating || isUpdating,
  }
}
