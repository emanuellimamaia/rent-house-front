import { MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
import { ModalAddProperty } from '../components/modal-add-property'
import { ModalDeleteProperty } from '../components/modal-delete-property'
import { ModalEditProperty } from '../components/modal-edit-property'
import { usePropertiesOwner } from '../services/properties'

interface Property {
  id: string
  name: string
  address: string
  price: number
}

export default function PropertiesScreen() {
  const { data: properties, isLoading, error } = usePropertiesOwner()
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<
    Property | undefined
  >(undefined)

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property)
    setEditModalOpen(true)
  }

  const handleDeleteProperty = (property: Property) => {
    setSelectedProperty(property)
    setDeleteModalOpen(true)
  }

  if (isLoading) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Propriedades</h1>
          <p className="text-muted-foreground">Gerencie suas propriedades</p>
        </div>
        <div className="text-center">Carregando propriedades...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="mb-6">
          <h1 className="font-bold text-2xl">Propriedades</h1>
          <p className="text-muted-foreground">Gerencie suas propriedades</p>
        </div>
        <div className="text-center text-red-500">
          Erro ao carregar propriedades: {error.message}
        </div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between ">
        <div className="">
          <h1 className="font-bold text-2xl">Propriedades</h1>
          <p className="text-muted-foreground">Gerencie suas propriedades</p>
        </div>
        <Button className="" onClick={() => setModalOpen(true)}>
          Adicionar Propriedade
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell>
                    R${' '}
                    {property.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 font-medium text-xs ${
                        property.rented
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {property.rented ? 'Ocupado' : 'Disponível'}
                    </span>
                  </TableCell>
                  <TableCell className=" text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="mr-4 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProperty(property)}
                        >
                          Deletar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditProperty(property)}
                        >
                          Editar
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
                  colSpan={4}
                >
                  Nenhuma propriedade encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ModalAddProperty onOpenChange={setModalOpen} open={modalOpen} />
      <ModalEditProperty
        onOpenChange={setEditModalOpen}
        open={editModalOpen}
        property={selectedProperty}
      />
      <ModalDeleteProperty
        onOpenChange={setDeleteModalOpen}
        open={deleteModalOpen}
        property={selectedProperty}
      />
    </main>
  )
}
