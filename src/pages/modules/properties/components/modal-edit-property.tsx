import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
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
import { useUpdateProperty } from '../services/properties'

const editPropertySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  price: z.number().min(0.01, 'Preço deve ser maior que zero'),
})

type EditPropertyForm = z.infer<typeof editPropertySchema>

interface Property {
  id: string
  name: string
  address: string
  price: number
}

interface ModalEditPropertyProps extends DialogProps {
  property?: Property
}

export function ModalEditProperty({
  onOpenChange,
  open,
  property,
}: ModalEditPropertyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<EditPropertyForm>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      name: '',
      address: '',
      price: 0,
    },
  })

  const updatePropertyMutation = useUpdateProperty()

  // Popula o formulário quando a propriedade é fornecida
  useEffect(() => {
    if (property) {
      setValue('name', property.name)
      setValue('address', property.address)
      setValue('price', property.price)
    }
  }, [property, setValue])

  const onSubmit = async (data: EditPropertyForm) => {
    if (!property) {
      return
    }

    try {
      await updatePropertyMutation.mutateAsync({
        id: property.id,
        data,
      })
      toast.success('Propriedade atualizada com sucesso!')
      reset()
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao atualizar propriedade'
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
          <h2 className="font-semibold text-lg">Editar Propriedade</h2>
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
              {isSubmitting ? 'Atualizando...' : 'Atualizar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
