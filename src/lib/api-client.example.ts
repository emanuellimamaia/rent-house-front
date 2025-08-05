// Exemplo de como usar o apiClient em outros serviços
// Este arquivo serve como exemplo e documentação

import { apiClient } from '@/lib/api-client'

// Exemplo 1: Serviço de Propriedades
export const propertyService = {
  // Lista todas as propriedades
  getAll: () => {
    return apiClient.get('/properties')
  },

  // Busca uma propriedade por ID
  getById: (id: string) => {
    return apiClient.get(`/properties/${id}`)
  },

  // Cria uma nova propriedade
  create: (data: unknown) => {
    return apiClient.post('/properties', data)
  },

  // Atualiza uma propriedade
  update: (id: string, data: unknown) => {
    return apiClient.put(`/properties/${id}`, data)
  },

  // Remove uma propriedade
  delete: (id: string) => {
    return apiClient.delete(`/properties/${id}`)
  },
}

// Exemplo 2: Serviço de Inquilinos
export const tenantService = {
  getAll: () => apiClient.get('/tenants'),
  getById: (id: string) => apiClient.get(`/tenants/${id}`),
  create: (data: unknown) => apiClient.post('/tenants', data),
  update: (id: string, data: unknown) => apiClient.put(`/tenants/${id}`, data),
  delete: (id: string) => apiClient.delete(`/tenants/${id}`),
}

// Exemplo 3: Uso direto em componentes
/*
import { propertyService } from '@/services/property.service'

export function PropertiesComponent() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await propertyService.getAll()
        setProperties(data)
      } catch (error) {
        // O interceptor já tratou erros 401/403 automaticamente
        toast.error('Erro ao carregar propriedades')
      } finally {
        setLoading(false)
      }
    }

    loadProperties()
  }, [])

  // ... resto do componente
}
*/
