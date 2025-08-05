import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { apiClient } from '@/lib/api-client'

// Exemplo simples de componente usando useQuery
interface User {
  id: string
  name: string
  email: string
}

export function ExampleQueryComponent() {
  // Exemplo básico do useQuery
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
    staleTime: 5 * 60 * 1000, // 5 minutos
    // retry: 3, // número de tentativas em caso de erro
    // enabled: true, // se a query deve executar automaticamente
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-xl">Usuários</h2>
        <div className="space-y-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-xl">Usuários</h2>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Erro ao carregar usuários</p>
          <Button
            className="mt-2"
            onClick={() => refetch()}
            size="sm"
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Usuários</h2>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          Atualizar
        </Button>
      </div>

      {users && users.length > 0 ? (
        <div className="space-y-2">
          {users.map((user) => (
            <div className="rounded-lg border p-4" key={user.id}>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Nenhum usuário encontrado</p>
      )}
    </div>
  )
}

// Exemplo de useQuery com parâmetros dinâmicos
interface UserDetailsProps {
  userId: string
}

export function UserDetailsComponent({ userId }: UserDetailsProps) {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', userId], // query key dependente do userId
    queryFn: () => apiClient.get<User>(`/users/${userId}`),
    enabled: !!userId, // só executa se userId existir
    staleTime: 2 * 60 * 1000, // 2 minutos
  })

  if (!userId) {
    return <p>Selecione um usuário</p>
  }

  if (isLoading) {
    return <Skeleton className="h-32" />
  }

  if (error) {
    return <p className="text-red-600">Erro ao carregar detalhes do usuário</p>
  }

  if (!user) {
    return <p>Usuário não encontrado</p>
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="mb-4 font-bold text-xl">Detalhes do Usuário</h2>
      <div className="space-y-2">
        <p>
          <strong>ID:</strong> {user.id}
        </p>
        <p>
          <strong>Nome:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>
    </div>
  )
}
