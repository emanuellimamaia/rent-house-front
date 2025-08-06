import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  type DialogProps,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useCreateProperty } from '../services/properties'

const addPropertySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
})

type AddPropertyForm = z.infer<typeof addPropertySchema>

export function ModalAddProperty({ onOpenChange, open }: DialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<AddPropertyForm>({
    resolver: zodResolver(addPropertySchema),
    defaultValues: {
      name: '',
      address: '',
      price: 0,
    },
  })

  const createPropertyMutation = useCreateProperty()

  const onSubmit = async (data: AddPropertyForm) => {
    try {
      await createPropertyMutation.mutateAsync(data)
      toast.success('Propriedade adicionada com sucesso!')
      reset()
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao adicionar propriedade'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange?.(false)
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <h2 className="font-semibold text-lg">Adicionar Propriedade</h2>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              error={errors.name?.message}
              label="Nome da Propriedade"
              placeholder="Ex: Casa A"
              {...register('name')}
            />
          </div>

          <div>
            <Input
              error={errors.address?.message}
              label="Endereço"
              placeholder="Ex: 123 Main St"
              {...register('address')}
            />
          </div>

          <div>
            <Input
              currency
              error={errors.price?.message}
              label="Preço (R$)"
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^\d,]/g, '')
                  .replace(',', '.')
                setValue('price', Number.parseFloat(value) || 0)
              }}
              placeholder="Ex: 1000.00"
              value={watch('price')}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              disabled={isSubmitting}
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button className="flex-1" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
