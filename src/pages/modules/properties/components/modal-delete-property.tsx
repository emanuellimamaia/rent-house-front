import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  type DialogProps,
} from '@/components/ui/dialog'
import { useDeleteProperty } from '../services/properties'

interface Property {
  id: string
  name: string
  address: string
  price: number
}

interface ModalDeletePropertyProps extends DialogProps {
  property?: Property
}

export function ModalDeleteProperty({
  onOpenChange,
  open,
  property,
}: ModalDeletePropertyProps) {
  const deletePropertyMutation = useDeleteProperty()

  const handleDelete = async () => {
    if (!property) {
      return
    }

    try {
      await deletePropertyMutation.mutateAsync(property.id)
      toast.success('Propriedade deletada com sucesso!')
      onOpenChange?.(false)
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Erro ao deletar propriedade'
      toast.error(errorMessage)
    }
  }

  const handleClose = () => {
    onOpenChange?.(false)
  }

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <h2 className="font-semibold text-lg">Deletar Propriedade</h2>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            Tem certeza que deseja deletar a propriedade{' '}
            <span className="font-medium text-foreground">
              "{property?.name}"
            </span>
            ?
          </p>
          <p className="text-muted-foreground text-sm">
            Esta ação não pode ser desfeita.
          </p>

          <div className="flex gap-3 pt-4">
            <Button
              className="flex-1"
              disabled={deletePropertyMutation.isPending}
              onClick={handleClose}
              type="button"
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              disabled={deletePropertyMutation.isPending}
              onClick={handleDelete}
              type="button"
              variant="destructive"
            >
              {deletePropertyMutation.isPending ? 'Deletando...' : 'Deletar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
