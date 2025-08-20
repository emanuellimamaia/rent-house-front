import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/hooks/use-queries'
import { apiClient } from '@/lib/api-client'

interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalRentals: number
  activeRentals: number
  totalProperties_rented: number
  totalProperties_available: number
  totalPayments: number
  totalRevenue: number
}
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: () => apiClient.get<DashboardStats>('/dashboard/my-stats'),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}
