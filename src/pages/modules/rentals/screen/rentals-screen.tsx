import { Calendar, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ModalFinishRental from '../components/modal-finish-rental'
import { type Rental, useRentals } from '../service/rentals'

export default function RentalsScreen() {
  const { data: rentals, isLoading, error } = useRentals()
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<Rental | undefined>(
    undefined
  )

  const handleEditRental = (rental: Rental) => {
    setSelectedRental(rental)
    setEditModalOpen(true)
  }

  const handleDeleteRental = (rental: Rental) => {
    setSelectedRental(rental)
    setDeleteModalOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Locações</h1>
          <p className="text-muted-foreground">Gerencie suas locações</p>
        </div>
        <div className="text-center">Carregando locações...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Locações</h1>
          <p className="text-muted-foreground">Gerencie suas locações</p>
        </div>
        <div className="text-center text-red-500">
          Erro ao carregar locações: {error.message}
        </div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-bold text-2xl">Locações</h1>
          <p className="text-muted-foreground">Gerencie suas locações ativas</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID da Propriedade</TableHead>
              <TableHead>Data de Início</TableHead>
              <TableHead>Dia de Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals && rentals.length > 0 ? (
              rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{rental.propertyId}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(rental.startDate)}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-800 text-xs">
                      Dia {rental.dueDay}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span
                        className={`inline-flex w-fit items-center rounded-full px-2 py-1 font-medium text-xs ${
                          rental.endDate
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {rental.endDate ? 'Finalizada' : 'Ativa'}
                      </span>
                      {rental.endDate && (
                        <span className="mt-1 text-muted-foreground text-xs">
                          Fim: {formatDate(rental.endDate)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(rental.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="mr-4 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          disabled={true}
                          onClick={() => handleEditRental(rental)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Ver Inquilino
                        </DropdownMenuItem> */}
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Histórico de Pagamentos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          disabled={!!rental.endDate}
                          onClick={() => handleDeleteRental(rental)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          {rental.endDate
                            ? 'Locação Finalizada'
                            : 'Encerrar Locação'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="text-center text-muted-foreground"
                  colSpan={6}
                >
                  Nenhuma locação encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editModalOpen && selectedRental && (
        <div>Modal de edição para rental {selectedRental.id}</div>
      )}
      {selectedRental && !selectedRental.endDate && (
        <ModalFinishRental
          onOpenChange={setDeleteModalOpen}
          open={deleteModalOpen}
          rentalId={selectedRental.id}
          startDate={selectedRental.startDate}
        />
      )}
    </main>
  )
}
