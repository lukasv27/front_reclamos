import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import HistorialGeneral from './pages/HistorialGeneral'
import HistorialCliente from './pages/HistorialCliente'
import NuevoReclamo from './pages/NuevoReclamo'
import EnProgreso from './pages/EnProgreso'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route index element={<Login />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/historial" element={<HistorialGeneral />} />
          <Route path="/clientes" element={<HistorialCliente />} />
          <Route path="/nuevo-reclamo" element={<NuevoReclamo />} />
          <Route path="/configuracion" element={<EnProgreso />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
