import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, initialize } =
    useAuthStore()

  // Inicializa apenas uma vez quando o hook é usado
  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    // Estado
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    logout,

    // Computed values
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user',
    userName: user?.name || '',
    userEmail: user?.email || '',
  }
}
