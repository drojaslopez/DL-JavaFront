import { createContext, useContext } from 'react'
import type {
  DatosUsuario,
  RegistroDatos,
  ResultadoAuth,
  Rol,
  Usuario,
} from '../types/auth'

export interface AuthContextValue {
  usuario: Usuario | null
  /** Roles del sistema (se crean/editan desde Configuración). */
  roles: Rol[]
  /** Todos los usuarios gestionables (incluye cuentas demo). */
  usuarios: Usuario[]
  iniciarSesionLocal: (email: string, password: string) => ResultadoAuth
  iniciarSesionGoogle: (usuario: Usuario) => void
  registrarse: (datos: RegistroDatos) => ResultadoAuth
  cerrarSesion: () => void
  guardarRol: (rol: Rol, miembroIds: string[]) => ResultadoAuth
  eliminarRol: (id: string) => ResultadoAuth
  crearUsuario: (datos: DatosUsuario) => ResultadoAuth
  actualizarUsuario: (id: string, cambios: Partial<DatosUsuario>) => ResultadoAuth
  eliminarUsuario: (id: string) => ResultadoAuth
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return contexto
}
