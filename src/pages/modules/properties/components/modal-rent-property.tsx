import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTenants } from '../../tenant/service/tenant'
import { useCreateRental } from '../services/rentals'

const createRentalSchema = z.object({
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  dueDay: z
    .number()
    .min(1, 'Dia de vencimento deve ser entre 1 e 31')
    .max(31, 'Dia de vencimento deve ser entre 1 e 31'),
  tenantId: z.string().min(1, 'Inquilino é obrigatório'),
})

type CreateRentalForm = z.infer<typeof createRentalSchema>

interface ModalRentalPropertyProps extends DialogProps {
  propertyId?: string
}

export function ModalRentalProperty({
  onOpenChange,
  open,
  propertyId,
}: ModalRentalPropertyProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
    control,
  } = useForm<CreateRentalForm>({
    resolver: zodResolver(createRentalSchema),
    defaultValues: {
      startDate: '',
      dueDay: 5,
      tenantId: '',
    },
  })

  const { data: tenants } = useTenants()

  const createRentalMutation = useCreateRental()
  const onSubmit = async (data: CreateRentalForm) => {
    if (!propertyId) {
      toast.error('ID da propriedade é obrigatório')
      return
    }

    try {
      const startDateISO = new Date(data.startDate).toISOString()

      await createRentalMutation.mutateAsync({
        propertyId,
        startDate: startDateISO,
        dueDay: data.dueDay,
        tenantId: data.tenantId,
      })

      toast.success('Locação criada com sucesso!')
      reset()
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao criar locação'
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
          <h2 className="font-semibold text-lg">Criar Locação</h2>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              error={errors.startDate?.message}
              label="Data de Início"
              placeholder="YYYY-MM-DD"
              type="date"
              {...register('startDate')}
            />
          </div>

          <div>
            <Input
              error={errors.dueDay?.message}
              label="Dia de Vencimento"
              max={31}
              min={1}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value, 10) || 0
                setValue('dueDay', value)
              }}
              placeholder="Ex: 5"
              type="number"
              value={watch('dueDay')}
            />
          </div>
          <div>
            <label className="block font-medium text-sm" htmlFor="tenant">
              Selecionar o inquilino
            </label>
            <Controller
              control={control}
              name="tenantId"
              render={({ field }) => (
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="inquilino" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {tenants?.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.tenantId && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.tenantId.message}
              </p>
            )}
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
              {isSubmitting ? 'Criando...' : 'Criar Locação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
