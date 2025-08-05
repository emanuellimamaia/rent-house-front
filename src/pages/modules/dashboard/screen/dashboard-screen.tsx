/** biome-ignore-all lint/style/useBlockStatements: <explanation> */
import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats, useProperties } from '@/hooks/use-queries'

export function DashboardScreen() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats()
  const {
    data: properties,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useProperties()

  // Loading state
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-bold text-2xl text-gray-900">Dashboard</h2>
          <p className="text-gray-600">Visão geral do seu sistema de aluguel</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton className="h-24" key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Error state
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
      {/* Header */}
      <div>
        <h2 className="font-bold text-2xl text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Visão geral do seu sistema de aluguel</p>
      </div>

      {/* Cards de estatísticas */}
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
              Inquilinos Ativos
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">{stats?.totalTenants ?? 0}</div>
            <p className="text-muted-foreground text-xs">
              Total de inquilinos cadastrados
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Receita Mensal
            </h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">
              {stats?.monthlyRevenue
                ? new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(stats.monthlyRevenue)
                : 'R$ 0,00'}
            </div>
            <p className="text-muted-foreground text-xs">
              Receita do mês atual
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="font-medium text-sm tracking-tight">
              Taxa de Ocupação
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-2xl">
              {stats?.occupancyRate
                ? `${stats.occupancyRate.toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-muted-foreground text-xs">
              Propriedades ocupadas
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo adicional */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Propriedades Recentes</h3>
          {propertiesLoading && (
            <div className="space-y-3">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          )}

          {propertiesError && (
            <p className="text-muted-foreground text-sm">
              Erro ao carregar propriedades
            </p>
          )}

          {!(propertiesLoading || propertiesError) &&
            properties &&
            properties.length > 0 && (
              <div className="space-y-3">
                {properties.slice(0, 3).map((property) => {
                  const getStatusColor = (status: string) => {
                    // biome-ignore lint/style/useBlockStatements: <explanation>
                    if (status === 'rented')
                      return 'bg-green-100 text-green-800'
                    if (status === 'available')
                      return 'bg-yellow-100 text-yellow-800'
                    return 'bg-red-100 text-red-800'
                  }

                  const getStatusText = (status: string) => {
                    if (status === 'rented') return 'Ocupado'
                    if (status === 'available') return 'Disponível'
                    return 'Manutenção'
                  }

                  return (
                    <div
                      className="flex items-center justify-between"
                      key={property.id}
                    >
                      <div>
                        <p className="font-medium">{property.title}</p>
                        <p className="text-muted-foreground text-sm">
                          {property.address}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${getStatusColor(property.status)}`}
                      >
                        {getStatusText(property.status)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

          {!(propertiesLoading || propertiesError) &&
            (!properties || properties.length === 0) && (
              <p className="text-muted-foreground text-sm">
                Nenhuma propriedade encontrada
              </p>
            )}
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Atividades Recentes</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <p className="font-medium text-sm">Sistema atualizado</p>
                <p className="text-muted-foreground text-xs">
                  TanStack Query configurado com sucesso
                </p>
                <p className="text-muted-foreground text-xs">agora</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
