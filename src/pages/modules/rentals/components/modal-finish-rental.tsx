import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  type DialogProps,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useFinishRental } from '../service/rentals'

const closeRentalSchema = z.object({
  endDate: z.date({
    message: 'Data de encerramento é obrigatória',
  }),
})

type CloseRentalForm = z.infer<typeof closeRentalSchema>

interface ModalFinishRentalProps extends DialogProps {
  rentalId: string
  startDate: string
}

export default function ModalFinishRental({
  rentalId,
  startDate,
  open,
  onOpenChange,
}: ModalFinishRentalProps) {
  const [showCalendar, setShowCalendar] = useState(false)

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<CloseRentalForm>({
    resolver: zodResolver(closeRentalSchema),
  })

  const finishRentalMutation = useFinishRental()
  const selectedDate = watch('endDate')
  const onSubmit = async (data: CloseRentalForm) => {
    if (!rentalId) {
      toast.error('ID da locação não encontrado')
      return
    }

    try {
      await finishRentalMutation.mutateAsync({
        rentalId,
        endDate: data.endDate,
      })
      toast.success('Locação encerrada com sucesso!')
      reset()
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao encerrar locação'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    setShowCalendar(false)
    onOpenChange?.(false)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <h2 className="font-semibold text-lg">Encerrar Locação</h2>
          <p className="text-muted-foreground text-sm">
            Selecione a data de encerramento da locação
          </p>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="font-medium text-sm" htmlFor="date-picker">
              Data de Encerramento
            </label>
            <div className="mt-2">
              <Button
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground'
                )}
                id="date-picker"
                onClick={() => setShowCalendar(!showCalendar)}
                type="button"
                variant="outline"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  formatDate(selectedDate)
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>

              {showCalendar && (
                <div className="mt-2 rounded-md border bg-background p-3">
                  <Calendar
                    disabled={(date) => {
                      const startDateTime = new Date(startDate)
                      return date < startDateTime
                    }}
                    initialFocus
                    mode="single"
                    onSelect={(date) => {
                      if (date) {
                        setValue('endDate', date)
                        setShowCalendar(false)
                      }
                    }}
                    selected={selectedDate}
                  />
                </div>
              )}
            </div>

            {errors.endDate && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.endDate.message}
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
            <Button
              className="flex-1"
              disabled={isSubmitting || !selectedDate}
              type="submit"
              variant="destructive"
            >
              {isSubmitting ? 'Encerrando...' : 'Encerrar Locação'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
