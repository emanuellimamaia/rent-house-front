import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { Dialog, DialogContent, type DialogProps } from '@/components/ui/dialog'
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
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao adicionar propriedade'
      toast.error(errorMessage)
    }
  }
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <div className="p-6">
          <h2 className="mb-4 font-bold text-xl">Adicionar Inquilino</h2>
        </div>
      </DialogContent>
    </Dialog>
  )
}
