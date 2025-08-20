import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface Rental {
  id: string
  propertyId: string
  startDate: string
  dueDay: number
  createdAt: string
  updatedAt: string
}

interface CreateRentalData {
  propertyId: string
  startDate: string
  dueDay: number
  tenantId: string
}

interface UpdateRentalData {
  startDate: string
  dueDay: number
}

export const useRentals = () => {
  return useQuery({
    queryKey: ['rentals'],
    queryFn: () => apiClient.get<Rental[]>('/rentals'),
    staleTime: 2 * 60 * 1000,
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
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRentalData) =>
      apiClient.post<Rental>('/rentals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

export const useUpdateRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRentalData }) =>
      apiClient.put<Rental>(`/rentals/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
    },
  })
}

export const useDeleteRental = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/rentals/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rentals'] })
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}
