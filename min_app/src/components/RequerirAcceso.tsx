import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Vista } from '../types/auth'
import { useAuth } from '../auth/contexto'
import { tienePermiso } from '../auth/permisos'

interface GuardProps {
  children: ReactNode
}

/** Exige sesión iniciada; si no, redirige al login recordando el destino. */
export function RequiereAuth({ children }: GuardProps) {
  const { usuario } = useAuth()
  const location = useLocation()
  if (!usuario) {
    return <Navigate to="/login" state={{ desde: location.pathname }} replace />
  }
  return <>{children}</>
}

/** Exige sesión iniciada y permiso sobre la vista indicada. */
export function RequierePermiso({ vista, children }: GuardProps & { vista: Vista }) {
  const { usuario, roles } = useAuth()
  const location = useLocation()
  if (!usuario) {
    return <Navigate to="/login" state={{ desde: location.pathname }} replace />
  }
  if (!tienePermiso(roles, usuario, vista)) {
    return <Navigate to="/acceso-denegado" replace />
  }
  return <>{children}</>
}
