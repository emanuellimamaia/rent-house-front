import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/app-layout'
import { DashboardScreen } from './pages/modules/dashboard/screen/dashboard-screen'
import { LoginScreen } from './pages/modules/login/screen/login-screen'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginScreen />} path="/login" />
        <Route
          element={
            <AppLayout>
              <DashboardScreen />
            </AppLayout>
          }
          path="/dashboard"
        />
        <Route
          element={
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
          }
          path="/properties"
        />
        <Route
          element={
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
          }
          path="/tenants"
        />
        <Route element={<Navigate replace to="/dashboard" />} path="/" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
