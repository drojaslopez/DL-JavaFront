import type { DatosUsuario, RegistroDatos, Rol, Usuario } from '../types/auth'
import { VISTAS } from './permisos'

const CLAVE_CUENTAS = 'auth.cuentas'
const CLAVE_SESION = 'auth.sesion'
const CLAVE_ROLES = 'auth.roles'

interface CuentaAlmacenada extends Usuario {
  password?: string
}

/**
 * Roles iniciales. Son "de sistema" (no se eliminan) pero se pueden editar
 * (nombre, vistas, escritura) desde Configuración. Todo cambio queda en
 * localStorage; si un rol con el mismo id existe en el almacenamiento,
 * la versión guardada gana.
 */
const ROLES_INICIALES: Rol[] = [
  {
    id: 'administrador',
    nombre: 'Administrador',
    vistas: [...VISTAS],
    escribir: true,
    sistema: true,
  },
  {
    id: 'administrativo',
    nombre: 'Administrativo',
    vistas: ['dashboard', 'maquinaria', 'inventario', 'ordenes', 'costos'],
    escribir: false,
    sistema: true,
  },
  {
    id: 'visita',
    nombre: 'Visita',
    vistas: ['dashboard', 'costos'],
    escribir: false,
    sistema: true,
  },
]

/**
 * Usuarios iniciales (demo): tres locales con contraseña y tres de Google.
 * Igual que con los roles, viven en localStorage y la versión guardada gana.
 *
 * admin@mineria.cl / admin123            -> administrador
 * administrativo@mineria.cl / adm123     -> administrativo
 * visita@mineria.cl / visita123          -> visita
 */
const CUENTAS_INICIALES: CuentaAlmacenada[] = [
  {
    id: 'u-admin',
    nombre: 'Admin Demo',
    email: 'admin@mineria.cl',
    roles: ['administrador'],
    proveedor: 'local',
    activo: true,
    password: 'admin123',
  },
  {
    id: 'u-adm',
    nombre: 'Adm. Demo',
    email: 'administrativo@mineria.cl',
    roles: ['administrativo'],
    proveedor: 'local',
    activo: true,
    password: 'adm123',
  },
  {
    id: 'u-visita',
    nombre: 'Visita Demo',
    email: 'visita@mineria.cl',
    roles: ['visita'],
    proveedor: 'local',
    activo: true,
    password: 'visita123',
  },
  {
    id: 'g-admin',
    nombre: 'Ana Torres',
    email: 'ana.torres@gmail.com',
    roles: ['administrador'],
    proveedor: 'google',
    activo: true,
  },
  {
    id: 'g-adm',
    nombre: 'Luis Muñoz',
    email: 'luis.munoz@gmail.com',
    roles: ['administrativo'],
    proveedor: 'google',
    activo: true,
  },
  {
    id: 'g-visita',
    nombre: 'Carmen Soto',
    email: 'carmen.soto@gmail.com',
    roles: ['visita'],
    proveedor: 'google',
    activo: true,
  },
]

/** Ids de las cuentas demo: no se pueden eliminar (se evita quedar sin acceso). */
const IDS_DEMO = new Set(CUENTAS_INICIALES.map((c) => c.id))

type CrudoCuenta = Partial<CuentaAlmacenada> & { rol?: string }

/** Normaliza una cuenta leída de localStorage (migra el formato viejo con `rol`). */
function normalizarCuenta(cuenta: CrudoCuenta): CuentaAlmacenada {
  return {
    id: cuenta.id ?? `u-${Date.now()}-${Math.random()}`,
    nombre: cuenta.nombre ?? 'Sin nombre',
    email: (cuenta.email ?? '').toLowerCase(),
    roles: cuenta.roles ?? (cuenta.rol ? [cuenta.rol] : ['visita']),
    proveedor: cuenta.proveedor === 'google' ? 'google' : 'local',
    activo: cuenta.activo ?? true,
    password: cuenta.password,
  }
}

function normalizarRol(rol: Rol): Rol {
  return { ...rol, sistema: rol.sistema ?? false }
}

function leerCuentas(): CuentaAlmacenada[] {
  const crudo = localStorage.getItem(CLAVE_CUENTAS)
  let almacenadas: CuentaAlmacenada[] = []
  if (crudo) {
    try {
      const parseado = JSON.parse(crudo) as CrudoCuenta[]
      if (Array.isArray(parseado)) almacenadas = parseado.map(normalizarCuenta)
    } catch {
      // se ignora el dato corrupto y se parte de las cuentas iniciales
    }
  }
  const porId = new Map<string, CuentaAlmacenada>()
  for (const cuenta of [...CUENTAS_INICIALES, ...almacenadas]) {
    porId.set(cuenta.id, cuenta)
  }
  return [...porId.values()]
}

function guardarCuentas(cuentas: CuentaAlmacenada[]): void {
  localStorage.setItem(CLAVE_CUENTAS, JSON.stringify(cuentas))
}

function leerRoles(): Rol[] {
  const crudo = localStorage.getItem(CLAVE_ROLES)
  let almacenados: Rol[] = []
  if (crudo) {
    try {
      const parseado = JSON.parse(crudo) as Rol[]
      if (Array.isArray(parseado)) almacenados = parseado.map(normalizarRol)
    } catch {
      // se ignora el dato corrupto y se parte de los roles iniciales
    }
  }
  const porId = new Map<string, Rol>()
  for (const rol of [...ROLES_INICIALES, ...almacenados]) {
    porId.set(rol.id, rol)
  }
  return [...porId.values()]
}

function guardarRoles(roles: Rol[]): void {
  localStorage.setItem(CLAVE_ROLES, JSON.stringify(roles))
}

function sinPassword(cuenta: CuentaAlmacenada): Usuario {
  const { password: _password, ...usuario } = cuenta
  return usuario
}

export function listarUsuarios(): Usuario[] {
  return leerCuentas().map(sinPassword)
}

export function listarCuentasGoogle(): Usuario[] {
  return listarUsuarios().filter((u) => u.proveedor === 'google')
}

export function listarRoles(): Rol[] {
  return leerRoles()
}

export function buscarCuenta(email: string, password: string): Usuario | null {
  const cuenta = leerCuentas().find(
    (c) => c.email === email.trim().toLowerCase() && c.password === password,
  )
  return cuenta && cuenta.activo ? sinPassword(cuenta) : null
}

export function crearCuenta(datos: RegistroDatos): { ok: boolean; mensaje?: string } {
  const email = datos.email.trim().toLowerCase()
  const existe = leerCuentas().some((c) => c.email === email)
  if (existe) return { ok: false, mensaje: 'Ya existe una cuenta con ese email.' }
  const cuenta: CuentaAlmacenada = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre: datos.nombre.trim(),
    email,
    roles: ['visita'],
    proveedor: 'local',
    activo: true,
    password: datos.password,
  }
  guardarCuentas([...leerCuentas(), cuenta])
  return { ok: true }
}

export function crearUsuarioAdmin(datos: DatosUsuario): {
  ok: boolean
  mensaje?: string
} {
  const email = datos.email.trim().toLowerCase()
  const existe = leerCuentas().some((c) => c.email === email)
  if (existe) return { ok: false, mensaje: 'Ya existe un usuario con ese email.' }
  const cuenta: CuentaAlmacenada = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    nombre: datos.nombre.trim(),
    email,
    roles: datos.roles,
    proveedor: 'local',
    activo: datos.activo,
    password: datos.password,
  }
  guardarCuentas([...leerCuentas(), cuenta])
  return { ok: true }
}

export function actualizarCuenta(
  id: string,
  cambios: Partial<CuentaAlmacenada>,
): void {
  const cuentas = leerCuentas().map((cuenta) =>
    cuenta.id === id ? { ...cuenta, ...cambios } : cuenta,
  )
  guardarCuentas(cuentas)
}

export function eliminarCuenta(id: string): { ok: boolean; mensaje?: string } {
  if (IDS_DEMO.has(id)) {
    return { ok: false, mensaje: 'Las cuentas demo no se pueden eliminar.' }
  }
  guardarCuentas(leerCuentas().filter((cuenta) => cuenta.id !== id))
  return { ok: true }
}

/** Deja exactamente los usuarios indicados como miembros del rol (añade o quita). */
export function sincronizarMiembros(rolId: string, miembroIds: string[]): void {
  const cuentas = leerCuentas().map((cuenta) => {
    const deberiaPertenecer = miembroIds.includes(cuenta.id)
    const pertenece = cuenta.roles.includes(rolId)
    if (deberiaPertenecer === pertenece) return cuenta
    const roles = deberiaPertenecer
      ? [...cuenta.roles, rolId]
      : cuenta.roles.filter((id) => id !== rolId)
    return { ...cuenta, roles }
  })
  guardarCuentas(cuentas)
}

export function eliminarRolDeUsuarios(rolId: string): void {
  const cuentas = leerCuentas().map((cuenta) => ({
    ...cuenta,
    roles: cuenta.roles.filter((id) => id !== rolId),
  }))
  guardarCuentas(cuentas)
}

export function guardarRolEnAlmacen(rol: Rol): void {
  const roles = leerRoles()
  const indice = roles.findIndex((r) => r.id === rol.id)
  if (indice >= 0) roles[indice] = rol
  else roles.push(rol)
  guardarRoles(roles)
}

export function quitarRolDelAlmacen(id: string): void {
  guardarRoles(leerRoles().filter((rol) => rol.id !== id))
}

export function leerSesion(): Usuario | null {
  const crudo = localStorage.getItem(CLAVE_SESION)
  if (!crudo) return null
  try {
    const guardado = JSON.parse(crudo) as Usuario
    // Se resuelve contra las cuentas actuales para que los cambios de rol
    // hechos en Configuración se reflejen en la sesión.
    const actual = leerCuentas().find((c) => c.id === guardado.id)
    return actual ? sinPassword(actual) : guardado
  } catch {
    return null
  }
}

export function guardarSesion(usuario: Usuario): void {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function limpiarSesion(): void {
  localStorage.removeItem(CLAVE_SESION)
}
