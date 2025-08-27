import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from '@/hooks/use-auth'
import { AppLayout } from './components/layout/app-layout'
import { queryClient } from './lib/query-client'
import { LoginScreen } from './pages/modules/auth/screen/login-screen'
import DashboardScreen from './pages/modules/dashboard/screen/dashboard-screen'
import PropertiesScreen from './pages/modules/properties/screen/properties-screen'
import RentalsScreen from './pages/modules/rentals/screen/rentals-screen'
import TenantScreen from './pages/modules/tenant/screen/tenant-screen'

function ProtectedDashboardRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          <p className="mt-2 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? (
    <Navigate replace to="/dashboard" />
  ) : (
    <Navigate replace to="/login" />
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<LoginScreen />} path="/login" />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardScreen />
                </AppLayout>
              </ProtectedRoute>
            }
            path="/dashboard"
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PropertiesScreen />
                </AppLayout>
              </ProtectedRoute>
            }
            path="/properties"
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TenantScreen />
                </AppLayout>
              </ProtectedRoute>
            }
            path="/tenants"
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout>
                  <RentalsScreen />
                </AppLayout>
              </ProtectedRoute>
            }
            path="/rentals"
          />
          <Route element={<ProtectedDashboardRedirect />} path="/" />
        </Routes>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
