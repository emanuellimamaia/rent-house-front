import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Toaster } from '@/components/ui/sonner'
import { AppLayout } from './components/layout/app-layout'
import { queryClient } from './lib/query-client'
import { LoginScreen } from './pages/modules/auth/screen/login-screen'
import { DashboardScreen } from './pages/modules/dashboard/screen/dashboard-screen'

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
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                      <h2 className="font-bold text-2xl text-gray-900">
                        Propriedades
                      </h2>
                      <p className="text-gray-600">
                        Esta página ainda está em desenvolvimento
                      </p>
                    </div>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
            path="/properties"
          />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                      <h2 className="font-bold text-2xl text-gray-900">
                        Inquilinos
                      </h2>
                      <p className="text-gray-600">
                        Esta página ainda está em desenvolvimento
                      </p>
                    </div>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
            path="/tenants"
          />
          <Route element={<Navigate replace to="/dashboard" />} path="/" />
        </Routes>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
