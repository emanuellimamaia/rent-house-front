import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { queryClient } from '@/lib/query-client'

export interface Tenant {
  id: string
  name: string
  email: string
  phoneNumber: string
  isActive: boolean
}

interface CreateTenat {
  name: string
  email: string
  phoneNumber: string
  password: string
  ownerId: string
}

interface UpdateTenant {
  id: string
  name: string
  email: string
  phoneNumber: string
}
export const useTenants = () => {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => apiClient.get<Tenant[]>('/users-owner'),
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateTenant = () => {
  return useMutation({
    mutationFn: (data: CreateTenat) =>
      apiClient.post<Tenant>('/create-tenant-user', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}

export const useUpdateTenant = () => {
  return useMutation({
    mutationFn: (data: UpdateTenant) =>
      apiClient.patch<Tenant>(`/users/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
    },
  })
}
