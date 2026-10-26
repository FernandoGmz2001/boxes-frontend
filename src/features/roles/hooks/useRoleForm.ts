import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import type { ICreateRole } from '../interfaces/create.interface.ts'
import type { IGetRole } from '../interfaces/get.interface.ts'
import type { IUpdateRole } from '../interfaces/update.interface.ts'
import { roleSchema, type RoleSchema } from '../schemas/upsert.schema.ts'
import { useCreateRole, useUpdateRole } from '../services/queries.ts'

const emptyValues: RoleSchema = {
  nombre: '',
  descripcion: '',
  permisos: [],
}

function toFormValues(role: IGetRole): RoleSchema {
  return {
    nombre: role.nombre,
    descripcion: role.descripcion ?? '',
    permisos: role.permisos,
  }
}

function buildPayload(values: RoleSchema): ICreateRole & IUpdateRole {
  const description = values.descripcion.trim()

  return {
    nombre: values.nombre,
    descripcion: description.length > 0 ? description : null,
    permisos: values.permisos,
  }
}

export function useRoleForm(role: IGetRole | null, onSaved: () => void) {
  const { mutateAsync: createRole, isPending: isCreating } = useCreateRole()
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole()

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues: role ? toFormValues(role) : emptyValues,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildPayload(values)

    if (role) {
      await updateRole({ roleId: role.id, payload })
    } else {
      await createRole(payload)
    }

    onSaved()
  })

  return {
    form,
    onSubmit,
    isEditing: role !== null,
    isSubmitting: isCreating || isUpdating,
  }
}
