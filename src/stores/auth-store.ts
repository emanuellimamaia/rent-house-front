import Cookies from 'js-cookie'
import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  initialize: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,

  login: (user: User, token: string) => {
    // Salva o token no cookie
    Cookies.set('token', token, { expires: 7 })
    Cookies.set('userId', user.id, { expires: 7 })
    Cookies.set('userRole', user.role, { expires: 7 })
    Cookies.set('userName', user.name, { expires: 7 })
    Cookies.set('userEmail', user.email, { expires: 7 })

    // Atualiza o estado global
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
    })
  },

  logout: () => {
    // Remove todos os cookies
    Cookies.remove('token')
    Cookies.remove('userId')
    Cookies.remove('userRole')
    Cookies.remove('userName')
    Cookies.remove('userEmail')

    // Limpa o estado
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
    })
  },

  initialize: () => {
    const { isInitialized } = get()

    // Só inicializa se ainda não foi inicializado
    if (isInitialized) {
      return
    }

    // Verifica se existe token nos cookies
    const token = Cookies.get('token')
    const userId = Cookies.get('userId')
    const userRole = Cookies.get('userRole')
    const userName = Cookies.get('userName')
    const userEmail = Cookies.get('userEmail')

    // Verifica se todos os dados necessários estão presentes
    if (token && userId && userName && userEmail) {
      // Reconstrói o estado a partir dos cookies
      const user: User = {
        id: userId,
        name: userName,
        email: userEmail,
        role: userRole || 'user',
      }

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      })
    } else {
      // Se algum dado está faltando, limpa tudo para garantir consistência
      Cookies.remove('token')
      Cookies.remove('userId')
      Cookies.remove('userRole')
      Cookies.remove('userName')
      Cookies.remove('userEmail')

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
      })
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  },
}))
