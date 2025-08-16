import { useAuthStore } from '@/stores/auth-store'

/**
 * Interceptor para requisições HTTP que adiciona automaticamente o token
 * e trata respostas 401/403 fazendo logout automático
 */
export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = import.meta.env.VITE_API_URL) {
    this.baseURL = baseURL
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const { token, logout } = useAuthStore.getState()

    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(url, config)

    // Se receber 401 ou 403, faz logout automático
    if (response.status === 401 || response.status === 403) {
      logout()
      window.location.href = '/login'
      throw new Error('Token inválido ou expirado')
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// Instância global do cliente API
export const apiClient = new ApiClient()
