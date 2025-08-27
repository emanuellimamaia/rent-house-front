import { useAuth } from './use-auth'

export function useTokenValidation() {
  const { token, isAuthenticated, isLoading } = useAuth()

  return {
    isValidToken: !!token && isAuthenticated,
    isLoading,
    hasToken: !!token,
  }
}
