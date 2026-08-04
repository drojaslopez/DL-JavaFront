import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Box,
  DollarSign,
  HardHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Truck,
  Wrench,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '../auth/contexto'
import { nombresRoles, tienePermiso } from '../auth/permisos'
import { TemaToggle } from '../components/TemaToggle'
import type { Vista } from '../types/auth'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  vista: Vista
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, vista: 'dashboard' },
  { to: '/maquinaria', label: 'Maquinaria', icon: Truck, vista: 'maquinaria' },
  { to: '/inventario', label: 'Inventario', icon: Box, vista: 'inventario' },
  { to: '/ordenes', label: 'Órdenes de Mantenimiento', icon: Wrench, vista: 'ordenes' },
  { to: '/costos', label: 'Costos', icon: DollarSign, vista: 'costos' },
  { to: '/configuracion', label: 'Configuración', icon: Settings, vista: 'configuracion' },
]

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/maquinaria': 'Maquinaria',
  '/inventario': 'Inventario de Repuestos',
  '/ordenes': 'Órdenes de Mantenimiento',
  '/costos': 'Costos',
  '/configuracion': 'Configuración',
}

interface SidebarProps {
  onNavigate?: () => void
}

function SidebarContent({ onNavigate }: SidebarProps) {
  const { usuario, roles } = useAuth()

  const itemsVisibles = usuario
    ? NAV_ITEMS.filter((item) => tienePermiso(roles, usuario, item.vista))
    : []

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-amber-400 text-gray-900">
          <HardHat className="size-5" />
        </span>
        <div>
          <p className="text-sm font-bold text-white">Mantención Minera</p>
          <p className="text-xs text-gray-400">Gestión de flota</p>
        </div>
      </div>

      <nav className="mt-2 flex-1 space-y-1 px-3">
        {itemsVisibles.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white dark:bg-gray-700'
                  : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-100'
              }`
            }
          >
            <item.icon className="size-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 px-5 py-4">
        <p className="text-xs text-gray-500">Superintendencia de Mantenimiento</p>
        <p className="mt-0.5 text-sm font-medium text-gray-300">
          Minería S.A. — División Norte
        </p>
      </div>
    </div>
  )
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, roles, cerrarSesion } = useAuth()

  const title = ROUTE_TITLES[location.pathname] ?? 'Portal'
  const rolesDeUsuario = usuario ? nombresRoles(roles, usuario.roles) : []

  const salir = () => {
    cerrarSesion()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-900">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gray-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-gray-900">
            <button
              type="button"
              aria-label="Cerrar menú"
              className="absolute right-3 top-4 text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800 sm:px-6">
          <button
            type="button"
            aria-label="Abrir menú"
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            <TemaToggle />
            {usuario && (
              <>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{usuario.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{rolesDeUsuario.join(', ')}</p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {iniciales(usuario.nombre)}
                </span>
                <button
                  type="button"
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  onClick={salir}
                >
                  <LogOut className="size-4.5" />
                </button>
              </>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function iniciales(nombre: string) {
  return nombre
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
