export type Vista =
  | 'dashboard'
  | 'maquinaria'
  | 'inventario'
  | 'ordenes'
  | 'costos'
  | 'configuracion'

/**
 * Rol dinámico: se crea y edita desde Configuración. Un rol define a qué
 * vistas puede acceder y si puede escribir (crear/editar).
 */
export interface Rol {
  id: string
  nombre: string
  vistas: Vista[]
  escribir: boolean
  /** Rol del sistema (administrador/administrativo/visita): no se puede eliminar. */
  sistema?: boolean
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  /** Un usuario puede pertenecer a más de un rol. */
  roles: string[]
  proveedor: 'google' | 'local'
  activo: boolean
}

export interface RegistroDatos {
  nombre: string
  email: string
  password: string
}

export interface DatosUsuario {
  nombre: string
  email: string
  /** Obligatoria al crear; opcional al editar (se conserva la existente). */
  password?: string
  roles: string[]
  activo: boolean
}

export interface ResultadoAuth {
  ok: boolean
  mensaje?: string
}
