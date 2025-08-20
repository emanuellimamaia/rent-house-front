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

// Query Keys - importante para cache management
export const queryKeys = {
  properties: ['properties'] as const,
  property: (id: string) => ['properties', id] as const,
  tenants: ['tenants'] as const,
  tenant: (id: string) => ['tenants', id] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
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
