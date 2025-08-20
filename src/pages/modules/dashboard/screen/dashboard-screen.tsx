import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '../service/dashboard-service'

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export default function DashboardScreen() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const calculateOccupancyRate = () => {
    if (!stats?.totalProperties || stats.totalProperties === 0) {
      return '0%'
    }
    return `${((stats.totalProperties_rented / stats.totalProperties) * 100).toFixed(1)}%`
  }

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Visão geral do seu sistema de aluguel</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: only used for skeleton loading
            <Skeleton className="h-24" key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (statsError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Visão geral do seu sistema de aluguel</p>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">
            Erro ao carregar dados do dashboard. Tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-bold text-2xl text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu sistema de aluguel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Total de Propriedades
            </h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">
              {stats?.totalProperties ?? 0}
            </div>
            <p className="text-muted-foreground text-xs">
              Total de propriedades cadastradas
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Total de Usuários
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">{stats?.totalUsers ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              Total de usuários cadastrados
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Locações Ativas
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">
              {stats?.activeRentals ?? 0}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats?.totalRentals ?? 0} locações no total
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Receita Total
            </h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">
              {stats?.totalRevenue
                ? formatCurrency(stats.totalRevenue)
                : 'R$ 0,00'}
            </div>
            <p className="text-muted-foreground text-xs">
              {stats?.totalPayments ?? 0} pagamentos registrados
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Taxa de Ocupação
            </h3>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">{calculateOccupancyRate()}</div>
            <p className="text-muted-foreground text-xs">
              {stats?.totalProperties_rented ?? 0} de{' '}
              {stats?.totalProperties ?? 0} propriedades
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Resumo de Propriedades</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Total de Propriedades:
              </span>
              <span className="font-bold">{stats?.totalProperties ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Propriedades Alugadas:
              </span>
              <span className="font-bold text-green-600">
                {stats?.totalProperties_rented ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Propriedades Disponíveis:
              </span>
              <span className="font-bold text-blue-600">
                {stats?.totalProperties_available ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Resumo de Locações</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Total de Locações:
              </span>
              <span className="font-bold">{stats?.totalRentals ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Locações Ativas:
              </span>
              <span className="font-bold text-green-600">
                {stats?.activeRentals ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Total de Pagamentos:
              </span>
              <span className="font-bold text-blue-600">
                {stats?.totalPayments ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
