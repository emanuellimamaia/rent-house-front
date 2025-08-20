import { useMutation, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { queryClient } from '@/lib/query-client'

export interface Rental {
  id: string
  propertyId: string
  startDate: string
  endDate?: string
  dueDay: number
  created_at: string
  updated_at: string
}

interface CreateRentalData {
  propertyId: string
  startDate: string
  dueDay: number
  tenantId: string
}

export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: () => apiClient.get<Rental[]>('/rentals'),
    staleTime: 2 * 60 * 1000,
  })
}

export const useFinishRental = () => {
  return useMutation({
    mutationFn: ({ rentalId, endDate }: { rentalId: string; endDate: Date }) =>
      apiClient.patch(`/rentals/${rentalId}/end`, { endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
    },
  })
}

export const useRentalsByProperty = (propertyId: string) => {
  return useQuery({
    queryKey: ['rentals', 'property', propertyId],
    queryFn: () => apiClient.get<Rental[]>(`/rentals/property/${propertyId}`),
    staleTime: 2 * 60 * 1000,
    enabled: !!propertyId,
  })
}

export const useCreateRental = () => {
  return useMutation({
    mutationFn: (data: CreateRentalData) =>
      apiClient.post<Rental>('/rentals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
