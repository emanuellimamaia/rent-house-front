import { apiClient } from '@/lib/api-client'
import type { AuthResponse } from '../types/auth-type'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export const authService = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data)
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data)
  },

  logout: (): Promise<void> => {
    return apiClient.post<void>('/auth/logout')
  },
}
