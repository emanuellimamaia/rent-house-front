import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, type DialogProps } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateTenant } from '../service/tenant'

interface ModalAddTenantProps extends DialogProps {
  ownerId: string
}

const addTenantSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phoneNumber: z.string().min(1, 'O campo telefone é obrigatório'),
})

type AddTenantForm = z.infer<typeof addTenantSchema>

export function ModalAddTenant({
  ownerId,
  onOpenChange,
  open,
}: ModalAddTenantProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddTenantForm>({
    resolver: zodResolver(addTenantSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  })

  const createTenantMutation = useCreateTenant()

  const onSubmit = async (data: AddTenantForm) => {
    try {
      await createTenantMutation.mutateAsync({
        email: data.email,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        ownerId,
      })
      toast.success('Inquilino adicionado com sucesso!')
      reset()
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao adicionar inquilino'
      toast.error(errorMessage)
    }
  }
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <div className="p-6">
          <h2 className="mb-6 font-bold text-xl">Adicionar Inquilino</h2>

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
                htmlFor="password"
              >
                Senha
              </label>
              <Input
                id="password"
                placeholder="Digite a senha (mín. 6 caracteres)"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.password.message}
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
                disabled={createTenantMutation.isPending}
                type="submit"
              >
                {createTenantMutation.isPending
                  ? 'Adicionando...'
                  : 'Adicionar'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
