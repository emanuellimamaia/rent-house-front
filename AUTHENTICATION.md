# Sistema de Autenticação - Middleware e Proteção de Rotas

Este documento explica como funciona o sistema de autenticação implementado na aplicação, incluindo middleware, proteção de rotas e gerenciamento de tokens.

## 📋 Visão Geral

O sistema de autenticação está baseado em **JWT tokens** armazenados em **cookies** e utiliza middleware para proteger rotas automaticamente.

## 🔐 Componentes Principais

### 1. **AuthStore** (`src/stores/auth-store.ts`)
- **Zustand store** que gerencia o estado global de autenticação
- **Persistência**: Salva token e dados do usuário nos cookies
- **Inicialização**: Reconstrói o estado a partir dos cookies ao carregar a aplicação
- **Cookies utilizados**: `token`, `userId`, `userRole`, `userName`, `userEmail`

### 2. **ProtectedRoute** (`src/components/auth/protected-route.tsx`)
- **Middleware de rota** que protege páginas que requerem autenticação
- **Redirecionamento inteligente**: Salva a URL original e redireciona após login
- **Loading state**: Mostra carregamento enquanto verifica autenticação
- **Controle de roles**: Pode verificar permissões específicas por role

### 3. **Token Validation** (`src/hooks/use-token-validation.ts`)
- **Validação automática** de token a cada 5 minutos
- **Logout automático** se token for inválido ou expirado
- **Integrado no AppLayout** para funcionar em todas as páginas protegidas

### 4. **API Client** (`src/lib/api-client.ts`)
- **Interceptor HTTP** que adiciona token automaticamente nas requisições
- **Tratamento automático** de respostas 401/403 (logout + redirecionamento)
- **Interface unificada** para todas as chamadas da API

## 🚀 Como Funciona

### Fluxo de Login
1. Usuário faz login em `/login`
2. Token é salvo nos cookies pelo `AuthStore`
3. Estado global é atualizado
4. Usuário é redirecionado para a página original ou `/dashboard`

### Fluxo de Proteção de Rotas
1. Usuário tenta acessar uma rota protegida
2. `ProtectedRoute` verifica se está autenticado
3. Se não autenticado: redireciona para `/login` salvando a URL original
4. Se autenticado: renderiza o componente normalmente

### Fluxo de Validação Automática
1. `useTokenValidation` verifica token a cada 5 minutos
2. Se token inválido: faz logout automático e redireciona
3. Funciona em todas as páginas protegidas via `AppLayout`

### Fluxo de Requisições HTTP
1. Qualquer requisição via `apiClient` inclui token automaticamente
2. Se receber 401/403: faz logout e redireciona para login
3. Tratamento transparente sem necessidade de verificação manual

## 📁 Estrutura de Arquivos

```
src/
├── stores/
│   └── auth-store.ts           # Estado global de autenticação
├── hooks/
│   ├── use-auth.ts             # Hook para acessar auth store
│   └── use-token-validation.ts # Validação automática de token
├── components/
│   └── auth/
│       └── protected-route.tsx # Middleware de proteção
├── lib/
│   ├── api-client.ts           # Cliente HTTP com interceptors
│   └── api-client.example.ts   # Exemplos de uso
└── pages/modules/auth/
    ├── service/
    │   └── auth.service.ts     # Serviços de autenticação
    └── screen/
        └── login-screen.tsx    # Tela de login
```

## 🛠️ Como Usar

### 1. Proteger uma Nova Rota

```tsx
// Em app.tsx
<Route
  path="/nova-pagina"
  element={
    <ProtectedRoute>
      <AppLayout>
        <NovaPagina />
      </AppLayout>
    </ProtectedRoute>
  }
/>
```

### 2. Proteger com Role Específica

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AppLayout>
        <AdminPage />
      </AppLayout>
    </ProtectedRoute>
  }
/>
```

### 3. Fazer Requisições HTTP

```tsx
import { apiClient } from '@/lib/api-client'

// O token é incluído automaticamente
const data = await apiClient.get('/properties')
const newProperty = await apiClient.post('/properties', propertyData)
```

### 4. Criar Novos Serviços

```tsx
export const myService = {
  getAll: () => apiClient.get('/my-endpoint'),
  create: (data) => apiClient.post('/my-endpoint', data),
  // Token incluído automaticamente, logout automático em caso de erro 401/403
}
```

## ⚙️ Configurações

### Variáveis de Ambiente
```env
VITE_API_URL=http://localhost:3000/api
```

### Configuração de Cookies
- **Expiração**: 7 dias
- **HttpOnly**: Não (cookies acessíveis via JavaScript)
- **Secure**: Automático baseado no ambiente

## 🔄 Estados de Autenticação

| Estado | Descrição | Ação |
|--------|-----------|------|
| `isLoading: true` | Verificando autenticação inicial | Mostra loading |
| `isAuthenticated: false` | Usuário não autenticado | Redireciona para login |
| `isAuthenticated: true` | Usuário autenticado | Permite acesso |
| `token inválido` | Token expirado/inválido | Logout automático |

## 🛡️ Segurança

- ✅ **Logout automático** em caso de token inválido
- ✅ **Validação periódica** de token (5 min)
- ✅ **Interceptação automática** de respostas 401/403
- ✅ **Redirecionamento inteligente** após login
- ✅ **Limpeza completa** de dados ao fazer logout
- ✅ **Persistência segura** em cookies

## 🚨 Importante

1. **Backend deve implementar**: `/auth/validate` endpoint
2. **Todas as rotas protegidas** devem usar `ProtectedRoute`
3. **Todas as requisições** devem usar `apiClient`
4. **Token validation** é automático via `AppLayout`

Este sistema garante que o usuário seja sempre redirecionado para login quando não autenticado, mantendo uma experiência fluida e segura.
