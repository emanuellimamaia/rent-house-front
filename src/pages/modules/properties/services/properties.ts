import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface Property {
  id: string
  name: string
  address: string
  price: number
  rented: boolean
}

interface CreatePropertyData {
  name: string
  address: string
  price: number
}

interface UpdatePropertyData {
  name: string
  address: string
  price: number
}

export const usePropertiesOwner = () => {
  return useQuery({
    queryKey: ['properties', 'user'],
    queryFn: () => apiClient.get<Property[]>('/properties/owner'),
    staleTime: 2 * 60 * 1000,
  })
}

export const useCreateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePropertyData) =>
      apiClient.post<Property>('/properties', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] })
    },
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePropertyData }) =>
      apiClient.put<Property>(`/properties/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] })
    },
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/properties/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', 'user'] })
    },
  })
}
