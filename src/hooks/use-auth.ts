import { useAuthStore } from '@/stores/auth-store'

let isInitialized = false

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, initialize } =
    useAuthStore()

  // Inicializa apenas uma vez
  if (!isInitialized) {
    initialize()
    isInitialized = true
  }

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
