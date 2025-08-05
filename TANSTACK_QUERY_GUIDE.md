# Guia de Uso do TanStack Query (useQuery)

Este projeto agora está configurado com o TanStack Query para gerenciamento de estado do servidor e cache de dados.

## 📋 O que foi configurado

### 1. Dependências instaladas
- `@tanstack/react-query` - Biblioteca principal
- `@tanstack/react-query-devtools` - Ferramentas de desenvolvimento

### 2. Arquivos criados/modificados
- `/src/lib/query-client.ts` - Configuração do QueryClient
- `/src/app.tsx` - Configuração do QueryClientProvider
- `/src/hooks/use-queries.ts` - Hooks customizados com useQuery
- `/src/components/example-query.tsx` - Exemplos de uso

## 🚀 Como usar o useQuery

### Exemplo básico

```tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'], // chave única para o cache
    queryFn: () => apiClient.get('/users'), // função que busca os dados
    staleTime: 5 * 60 * 1000, // dados ficam "frescos" por 5 minutos
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar dados</div>
  
  return (
    <div>
      {data?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### useQuery com parâmetros dinâmicos

```tsx
function UserProfile({ userId }: { userId: string }) {
  const { data: user } = useQuery({
    queryKey: ['user', userId], // inclui o parâmetro na key
    queryFn: () => apiClient.get(`/users/${userId}`),
    enabled: !!userId, // só executa se userId existir
  })

  return <div>{user?.name}</div>
}
```

### Hooks customizados (recomendado)

```tsx
// Hook customizado
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get<User[]>('/users'),
  })
}

// Uso no componente
function UsersList() {
  const { data: users, isLoading, error, refetch } = useUsers()
  
  // Lógica do componente...
}
```

## 🔧 Principais opções do useQuery

### Opções de cache e refetch
```tsx
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,     // 5 minutos - tempo que dados ficam "frescos"
  gcTime: 10 * 60 * 1000,       // 10 minutos - tempo que dados ficam no cache
  refetchOnWindowFocus: false,   // não refaz a query quando foca a janela
  refetchOnReconnect: true,      // refaz quando reconecta à internet
  retry: 3,                      // tenta 3 vezes em caso de erro
})
```

### Execução condicional
```tsx
useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId && userIsLoggedIn, // só executa se condições forem verdadeiras
})
```

## 📊 Estados disponíveis

O useQuery retorna diversos estados úteis:

```tsx
const {
  data,           // dados retornados pela query
  isLoading,      // true na primeira execução
  isFetching,     // true sempre que está buscando dados (incluindo refetch)
  isError,        // true se houve erro
  error,          // objeto do erro
  isSuccess,      // true se a query foi bem-sucedida
  refetch,        // função para refazer a query manualmente
  dataUpdatedAt,  // timestamp da última atualização dos dados
  errorUpdatedAt, // timestamp do último erro
} = useQuery({...})
```

## 🔄 Mutations (para criar, atualizar, deletar)

Para operações que modificam dados, use `useMutation`:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateUserForm() {
  const queryClient = useQueryClient()
  
  const createUser = useMutation({
    mutationFn: (userData) => apiClient.post('/users', userData),
    onSuccess: () => {
      // Invalida e refaz a query de usuários
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleSubmit = (formData) => {
    createUser.mutate(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulário */}
      <button disabled={createUser.isPending}>
        {createUser.isPending ? 'Criando...' : 'Criar Usuário'}
      </button>
    </form>
  )
}
```

## 🛠️ DevTools

As DevTools do React Query estão habilitadas em desenvolvimento. Pressione o ícone do React Query no canto da tela para abrir o painel de debug.

## 📚 Exemplos práticos no projeto

Veja os arquivos:
- `/src/hooks/use-queries.ts` - Hooks para propriedades, inquilinos e dashboard
- `/src/components/example-query.tsx` - Exemplos completos de uso
- `/src/pages/modules/dashboard/screen/dashboard-screen.tsx` - Uso real no dashboard

## 🎯 Benefícios do useQuery

1. **Cache automático** - Dados são automaticamente cacheados
2. **Sincronização** - Dados são automaticamente sincronizados entre componentes
3. **Loading states** - Estados de carregamento são gerenciados automaticamente
4. **Error handling** - Tratamento de erros built-in
5. **Background refetching** - Dados são atualizados em background
6. **Request deduplication** - Múltiplas requests idênticas são combinadas
7. **Pagination** - Suporte nativo para paginação
8. **Optimistic updates** - Atualizações otimistas para melhor UX

## 📖 Documentação oficial

Para mais detalhes, consulte a [documentação oficial do TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview).
