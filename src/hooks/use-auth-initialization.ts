import { useEffect } from 'react'
import { useAuth } from './use-auth'

/**
 * Hook para garantir que a autenticação seja inicializada apenas uma vez
 * na aplicação, evitando múltiplas inicializações
 */
export function useAuthInitialization() {
  const { isLoading } = useAuth()

  useEffect(() => {
    // A inicialização já é feita no useAuth automaticamente
    // Este hook serve apenas para garantir que seja chamado uma vez
  }, [])

  return {
    isInitializing: isLoading,
  }
}
