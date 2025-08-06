import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface Property {
  id: string
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
