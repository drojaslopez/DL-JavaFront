import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import { RequiereAuth, RequierePermiso } from './components/RequerirAcceso'
import DashboardPage from './pages/DashboardPage'
import MaquinariaPage from './pages/MaquinariaPage'
import InventarioPage from './pages/InventarioPage'
import OrdenesPage from './pages/OrdenesPage'
import CostosPage from './pages/CostosPage'
import ConfiguracionPage from './pages/ConfiguracionPage'
import LoginPage from './pages/LoginPage'
import RegistroPage from './pages/RegistroPage'
import AccesoDenegadoPage from './pages/AccesoDenegadoPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route
        element={
          <RequiereAuth>
            <MainLayout />
          </RequiereAuth>
        }
      >
        <Route
          index
          element={
            <RequierePermiso vista="dashboard">
              <DashboardPage />
            </RequierePermiso>
          }
        />
        <Route
          path="maquinaria"
          element={
            <RequierePermiso vista="maquinaria">
              <MaquinariaPage />
            </RequierePermiso>
          }
        />
        <Route
          path="inventario"
          element={
            <RequierePermiso vista="inventario">
              <InventarioPage />
            </RequierePermiso>
          }
        />
        <Route
          path="ordenes"
          element={
            <RequierePermiso vista="ordenes">
              <OrdenesPage />
            </RequierePermiso>
          }
        />
        <Route
          path="costos"
          element={
            <RequierePermiso vista="costos">
              <CostosPage />
            </RequierePermiso>
          }
        />
        <Route
          path="configuracion"
          element={
            <RequierePermiso vista="configuracion">
              <ConfiguracionPage />
            </RequierePermiso>
          }
        />
        <Route path="acceso-denegado" element={<AccesoDenegadoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
