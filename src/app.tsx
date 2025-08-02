import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginScreen } from './pages/modules/login/screen/login-screen'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LoginScreen />} path="/login" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
