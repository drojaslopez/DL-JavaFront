import type { Rol, Usuario, Vista } from '../types/auth'

/** Todas las vistas del sistema, en el orden en que se muestran. */
export const VISTAS: Vista[] = [
  'dashboard',
  'maquinaria',
  'inventario',
  'ordenes',
  'costos',
  'configuracion',
]

export const NOMBRES_VISTA: Record<Vista, string> = {
  dashboard: 'Dashboard',
  maquinaria: 'Maquinaria',
  inventario: 'Inventario',
  ordenes: 'Órdenes de Mantenimiento',
  costos: 'Costos',
  configuracion: 'Configuración',
}

/**
 * Verifica si un usuario puede acceder a una vista. Accede si al menos uno
 * de sus roles otorga esa vista.
 */
export function tienePermiso(
  roles: Rol[],
  usuario: Usuario | null,
  vista: Vista,
): boolean {
  if (!usuario) return false
  return usuario.roles.some((id) => {
    const rol = roles.find((r) => r.id === id)
    return rol ? rol.vistas.includes(vista) : false
  })
}

/** Permiso de escritura (crear/editar): si alguno de sus roles lo permite. */
export function puedeEscribir(roles: Rol[], usuario: Usuario | null): boolean {
  if (!usuario) return false
  return usuario.roles.some((id) => roles.find((r) => r.id === id)?.escribir)
}

/** Nombres en pantalla de los roles de un usuario (resuelve ids a nombres). */
export function nombresRoles(roles: Rol[], ids: string[]): string[] {
  return ids
    .map((id) => roles.find((r) => r.id === id)?.nombre)
    .filter((nombre): nombre is string => Boolean(nombre))
}
