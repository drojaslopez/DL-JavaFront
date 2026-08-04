import { useState, type ReactNode } from 'react'
import type {
  DatosUsuario,
  RegistroDatos,
  ResultadoAuth,
  Rol,
  Usuario,
} from '../types/auth'
import {
  actualizarCuenta,
  buscarCuenta,
  crearCuenta,
  crearUsuarioAdmin,
  eliminarCuenta,
  eliminarRolDeUsuarios,
  guardarRolEnAlmacen,
  guardarSesion,
  leerSesion,
  limpiarSesion,
  listarRoles,
  listarUsuarios,
  quitarRolDelAlmacen,
  sincronizarMiembros,
} from './almacen'
import { AuthContext } from './contexto'
import { tienePermiso } from './permisos'

/** Genera un id único y legible para un rol nuevo a partir de su nombre. */
function siguienteIdRol(nombre: string, roles: Rol[]): string {
  const base =
    nombre
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'rol'
  let id = base
  let n = 2
  while (roles.some((r) => r.id === id)) {
    id = `${base}-${n}`
    n += 1
  }
  return id
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => leerSesion())
  const [roles, setRoles] = useState<Rol[]>(() => listarRoles())
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => listarUsuarios())

  const refrescarDesdeAlmacen = (): void => {
    setRoles(listarRoles())
    setUsuarios(listarUsuarios())
    const sesion = leerSesion()
    setUsuario(sesion)
  }

  const iniciarSesionLocal = (email: string, password: string): ResultadoAuth => {
    const encontrado = buscarCuenta(email, password)
    if (!encontrado) return { ok: false, mensaje: 'Credenciales incorrectas.' }
    setUsuario(encontrado)
    guardarSesion(encontrado)
    return { ok: true }
  }

  const iniciarSesionGoogle = (usuarioGoogle: Usuario): void => {
    setUsuario(usuarioGoogle)
    guardarSesion(usuarioGoogle)
  }

  const registrarse = (datos: RegistroDatos): ResultadoAuth => {
    if (datos.nombre.trim() === '' || datos.email.trim() === '') {
      return { ok: false, mensaje: 'Completa nombre y email.' }
    }
    if (datos.password.length < 6) {
      return { ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' }
    }
    const resultado = crearCuenta(datos)
    if (!resultado.ok) return resultado
    setUsuarios(listarUsuarios())
    const nuevo = buscarCuenta(datos.email, datos.password)
    if (nuevo) {
      setUsuario(nuevo)
      guardarSesion(nuevo)
    }
    return { ok: true }
  }

  const cerrarSesion = (): void => {
    setUsuario(null)
    limpiarSesion()
  }

  const guardarRol = (rol: Rol, miembroIds: string[]): ResultadoAuth => {
    if (rol.nombre.trim() === '') {
      return { ok: false, mensaje: 'El rol necesita un nombre.' }
    }
    if (rol.vistas.length === 0) {
      return { ok: false, mensaje: 'Elige al menos una vista de acceso.' }
    }
    const rolFinal: Rol = rol.id
      ? rol
      : { ...rol, id: siguienteIdRol(rol.nombre, roles) }

    if (usuario) {
      const rolesProspecto = roles.some((r) => r.id === rolFinal.id)
        ? roles.map((r) => (r.id === rolFinal.id ? rolFinal : r))
        : [...roles, rolFinal]
      const esMiembroAntes = usuario.roles.includes(rolFinal.id)
      const esMiembro = miembroIds.includes(usuario.id)
      let rolesUsuario = usuario.roles
      if (esMiembro !== esMiembroAntes) {
        rolesUsuario = esMiembro
          ? [...usuario.roles, rolFinal.id]
          : usuario.roles.filter((r) => r !== rolFinal.id)
      }
      if (
        !tienePermiso(
          rolesProspecto,
          { ...usuario, roles: rolesUsuario },
          'configuracion',
        )
      ) {
        return {
          ok: false,
          mensaje: 'Este cambio te dejaría sin acceso a Configuración.',
        }
      }
    }

    guardarRolEnAlmacen(rolFinal)
    sincronizarMiembros(rolFinal.id, miembroIds)
    refrescarDesdeAlmacen()
    return { ok: true }
  }

  const eliminarRol = (id: string): ResultadoAuth => {
    const rol = roles.find((r) => r.id === id)
    if (!rol) return { ok: false, mensaje: 'El rol no existe.' }
    if (rol.sistema) {
      return { ok: false, mensaje: 'Este rol es del sistema y no se puede eliminar.' }
    }
    if (usuario?.roles.includes(id)) {
      const usuarioAfectado: Usuario = {
        ...usuario,
        roles: usuario.roles.filter((r) => r !== id),
      }
      if (!tienePermiso(roles.filter((r) => r.id !== id), usuarioAfectado, 'configuracion')) {
        return {
          ok: false,
          mensaje: 'No puedes eliminar el rol que te da acceso a Configuración.',
        }
      }
    }
    quitarRolDelAlmacen(id)
    eliminarRolDeUsuarios(id)
    refrescarDesdeAlmacen()
    return { ok: true }
  }

  const crearUsuario = (datos: DatosUsuario): ResultadoAuth => {
    if (datos.nombre.trim() === '' || datos.email.trim() === '') {
      return { ok: false, mensaje: 'Completa nombre y email.' }
    }
    if (!datos.password || datos.password.length < 6) {
      return { ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' }
    }
    if (datos.roles.length === 0) {
      return { ok: false, mensaje: 'Asigna al menos un rol.' }
    }
    const resultado = crearUsuarioAdmin(datos)
    if (!resultado.ok) return resultado
    setUsuarios(listarUsuarios())
    return { ok: true }
  }

  const actualizarUsuario = (
    id: string,
    cambios: Partial<DatosUsuario>,
  ): ResultadoAuth => {
    const objetivo = usuarios.find((u) => u.id === id)
    if (!objetivo) return { ok: false, mensaje: 'El usuario no existe.' }

    const emailNuevo = (cambios.email ?? objetivo.email).trim().toLowerCase()
    const emailDuplicado = usuarios.some(
      (u) => u.email.toLowerCase() === emailNuevo && u.id !== id,
    )
    if (emailDuplicado) {
      return { ok: false, mensaje: 'Ya existe un usuario con ese email.' }
    }

    const rolesNuevos = cambios.roles ?? objetivo.roles
    if (
      id === usuario?.id &&
      !tienePermiso(roles, { ...objetivo, roles: rolesNuevos }, 'configuracion')
    ) {
      return {
        ok: false,
        mensaje: 'No puedes quitarte el acceso a Configuración a ti mismo.',
      }
    }

    const cambiosFinales = { ...cambios }
    if (!cambiosFinales.password) delete cambiosFinales.password
    if (cambiosFinales.email) cambiosFinales.email = cambiosFinales.email.trim().toLowerCase()
    actualizarCuenta(id, cambiosFinales)
    setUsuarios(listarUsuarios())
    if (id === usuario?.id) {
      const sesion = leerSesion()
      if (sesion) {
        setUsuario(sesion)
        guardarSesion(sesion)
      }
    }
    return { ok: true }
  }

  const eliminarUsuario = (id: string): ResultadoAuth => {
    if (id === usuario?.id) {
      return { ok: false, mensaje: 'No puedes eliminarte a ti mismo.' }
    }
    const resultado = eliminarCuenta(id)
    if (!resultado.ok) return resultado
    setUsuarios(listarUsuarios())
    return { ok: true }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        roles,
        usuarios,
        iniciarSesionLocal,
        iniciarSesionGoogle,
        registrarse,
        cerrarSesion,
        guardarRol,
        eliminarRol,
        crearUsuario,
        actualizarUsuario,
        eliminarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
