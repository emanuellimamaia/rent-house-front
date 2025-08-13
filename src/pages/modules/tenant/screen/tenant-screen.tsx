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
import { useAuthStore } from '@/stores/auth-store'
import { ModalAddTenant } from '../components/modal-add-tenant'
import { useTenants } from '../service/tenant'

export default function TenantScreen() {
  const [modalOpen, setModalOpen] = useState<{
    ownerId?: string
    open: boolean
  }>({ open: false })
  const { data: tenants, isLoading, error } = useTenants()
  const { user } = useAuthStore()
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="font-bold text-2xl">Tela de Inquilinos</h1>
          <p className="text-muted-foreground">Gerencie os inquilinos aqui</p>
        </div>
        <Button
          className=""
          onClick={() => setModalOpen({ open: true, ownerId: user?.id })}
        >
          Adicionar Inquilino
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants?.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="mr-4 cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Deletar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {modalOpen.ownerId && (
        <ModalAddTenant
          onOpenChange={(open) => setModalOpen({ open })}
          open={modalOpen.open}
          ownerId={modalOpen.ownerId}
        />
      )}
    </main>
  )
}
