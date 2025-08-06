import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { usePropertiesOwner } from '../services/properties'

export default function PropertiesScreen() {
  const { data: properties, isLoading, error } = usePropertiesOwner()

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
        <Button>Adicionar Propriedade</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="text-right">Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties && properties.length > 0 ? (
              properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell>{property.address}</TableCell>
                  <TableCell className="text-right">
                    R${' '}
                    {property.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="text-center text-muted-foreground"
                  colSpan={3}
                >
                  Nenhuma propriedade encontrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  )
}
