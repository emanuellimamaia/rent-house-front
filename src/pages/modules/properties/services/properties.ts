import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface Property {
  id: string
  name: string
  address: string
  price: number
}

interface CreatePropertyData {
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
