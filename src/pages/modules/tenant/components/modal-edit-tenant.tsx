import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, type DialogProps } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { type Tenant, useUpdateTenant } from '../service/tenant'

interface ModalEditTenantProps extends DialogProps {
  tenant: Tenant
}

const editTenantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phoneNumber: z.string().min(1, 'O campo telefone é obrigatório'),
})

type EditTenantForm = z.infer<typeof editTenantSchema>

export function ModalEditTenant({
  tenant,
  onOpenChange,
  open,
}: ModalEditTenantProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTenantForm>({
    resolver: zodResolver(editTenantSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
    },
  })

  const updateTenantMutation = useUpdateTenant()

  useEffect(() => {
    if (tenant && open) {
      reset({
        name: tenant.name,
        email: tenant.email,
        phoneNumber: tenant.phoneNumber,
      })
    }
  }, [tenant, open, reset])

  const onSubmit = async (data: EditTenantForm) => {
    if (!tenant) {
      return
    }

    try {
      await updateTenantMutation.mutateAsync({
        id: tenant.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      })
      toast.success('Inquilino atualizado com sucesso!')
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao atualizar inquilino'
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <div className="p-6">
          <h2 className="mb-6 font-bold text-xl">Editar Inquilino</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block font-medium text-sm" htmlFor="name">
                Nome
              </label>
              <Input
                id="name"
                placeholder="Digite o nome completo"
                type="text"
                {...register('name')}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium text-sm" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                placeholder="Digite o email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="mb-2 block font-medium text-sm"
                htmlFor="phoneNumber"
              >
                Telefone
              </label>
              <Input
                id="phoneNumber"
                placeholder="Digite o telefone"
                type="tel"
                {...register('phoneNumber')}
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                className="flex-1"
                onClick={() => onOpenChange?.(false)}
                type="button"
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                disabled={updateTenantMutation.isPending}
                type="submit"
              >
                {updateTenantMutation.isPending
                  ? 'Atualizando...'
                  : 'Atualizar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
