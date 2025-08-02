import { Building2, DollarSign, TrendingUp, Users } from 'lucide-react'

export function DashboardScreen() {
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
            <div className="font-bold text-2xl">24</div>
            <p className="text-muted-foreground text-xs">
              +2 desde o mês passado
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
            <div className="font-bold text-2xl">18</div>
            <p className="text-muted-foreground text-xs">
              +1 desde o mês passado
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
            <div className="font-bold text-2xl">R$ 45.280</div>
            <p className="text-muted-foreground text-xs">
              +8% desde o mês passado
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
            <div className="font-bold text-2xl">75%</div>
            <p className="text-muted-foreground text-xs">
              +5% desde o mês passado
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo adicional */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Propriedades Recentes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Apartamento Centro</p>
                <p className="text-muted-foreground text-sm">
                  Rua das Flores, 123
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs">
                Ocupado
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Casa Jardins</p>
                <p className="text-muted-foreground text-sm">
                  Av. Principal, 456
                </p>
              </div>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                Disponível
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Apartamento Vila</p>
                <p className="text-muted-foreground text-sm">
                  Rua Secundária, 789
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 text-xs">
                Ocupado
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h3 className="mb-4 font-semibold text-lg">Atividades Recentes</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <div>
                <p className="font-medium text-sm">Novo contrato assinado</p>
                <p className="text-muted-foreground text-xs">
                  João Silva - Apartamento Centro
                </p>
                <p className="text-muted-foreground text-xs">há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
              <div>
                <p className="font-medium text-sm">Pagamento recebido</p>
                <p className="text-muted-foreground text-xs">
                  Maria Santos - R$ 2.500,00
                </p>
                <p className="text-muted-foreground text-xs">há 4 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
              <div>
                <p className="font-medium text-sm">Propriedade cadastrada</p>
                <p className="text-muted-foreground text-xs">
                  Casa Jardins - Av. Principal, 456
                </p>
                <p className="text-muted-foreground text-xs">há 1 dia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
