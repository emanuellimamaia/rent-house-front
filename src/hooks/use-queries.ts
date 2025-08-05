import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

// Tipos para demonstração - você pode ajustar conforme sua API
export interface Property {
  id: string
  title: string
  address: string
  price: number
  type: 'apartment' | 'house' | 'studio'
  status: 'available' | 'rented' | 'maintenance'
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  email: string
  phone: string
  propertyId?: string
  rentStartDate?: string
  rentEndDate?: string
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalProperties: number
  rentedProperties: number
  availableProperties: number
  totalTenants: number
  monthlyRevenue: number
  occupancyRate: number
}

// Query Keys - importante para cache management
export const queryKeys = {
  properties: ['properties'] as const,
  property: (id: string) => ['properties', id] as const,
  tenants: ['tenants'] as const,
  tenant: (id: string) => ['tenants', id] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
}

// Hook para buscar estatísticas do dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => apiClient.get<DashboardStats>('/dashboard/stats'),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}

// Hook para buscar todas as propriedades
export const useProperties = () => {
  return useQuery({
    queryKey: queryKeys.properties,
    queryFn: () => apiClient.get<Property[]>('/properties'),
  })
}

// Hook para buscar uma propriedade específica
export const useProperty = (id: string) => {
  return useQuery({
    queryKey: queryKeys.property(id),
    queryFn: () => apiClient.get<Property>(`/properties/${id}`),
    enabled: !!id, // só executa se o id existir
  })
}

// Hook para buscar todos os inquilinos
export const useTenants = () => {
  return useQuery({
    queryKey: queryKeys.tenants,
    queryFn: () => apiClient.get<Tenant[]>('/tenants'),
  })
}

// Hook para buscar um inquilino específico
export const useTenant = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tenant(id),
    queryFn: () => apiClient.get<Tenant>(`/tenants/${id}`),
    enabled: !!id,
  })
}

// Mutation para criar uma nova propriedade
export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Property>('/properties', data),
    onSuccess: () => {
      // Invalida e refetch a lista de propriedades
      queryClient.invalidateQueries({ queryKey: queryKeys.properties })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Mutation para atualizar uma propriedade
export const useUpdateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      apiClient.put<Property>(`/properties/${id}`, data),
    onSuccess: (updatedProperty) => {
      // Atualiza o cache da propriedade específica
      queryClient.setQueryData(
        queryKeys.property(updatedProperty.id),
        updatedProperty
      )
      // Invalida a lista de propriedades para refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.properties })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Mutation para deletar uma propriedade
export const useDeleteProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/properties/${id}`),
    onSuccess: (_, deletedId) => {
      // Remove do cache
      queryClient.removeQueries({ queryKey: queryKeys.property(deletedId) })
      // Invalida a lista
      queryClient.invalidateQueries({ queryKey: queryKeys.properties })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Mutation para criar um novo inquilino
export const useCreateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) =>
      apiClient.post<Tenant>('/tenants', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Mutation para atualizar um inquilino
export const useUpdateTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tenant> }) =>
      apiClient.put<Tenant>(`/tenants/${id}`, data),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        queryKeys.tenant(updatedTenant.id),
        updatedTenant
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}

// Mutation para deletar um inquilino
export const useDeleteTenant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/tenants/${id}`),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: queryKeys.tenant(deletedId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenants })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats })
    },
  })
}
