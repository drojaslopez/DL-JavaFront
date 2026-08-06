import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { listarCuentasGoogle } from '../auth/almacen'
import { useAuth } from '../auth/contexto'
import { nombresRoles } from '../auth/permisos'
import type { Usuario } from '../types/auth'

export function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

interface GoogleModalProps {
  onCerrar: () => void
}

/** Simulación del selector de cuentas de Google mientras no haya backend. */
export function GoogleModal({ onCerrar }: GoogleModalProps) {
  const { iniciarSesionGoogle, roles } = useAuth()
  const navigate = useNavigate()

  const cuentasGoogle = listarCuentasGoogle()

  const elegirCuenta = (cuenta: Usuario) => {
    iniciarSesionGoogle(cuenta)
    onCerrar()
    navigate('/', { replace: true })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <GoogleLogo />
          <span className="text-base font-medium text-gray-700 dark:text-gray-200">Elige una cuenta</span>
          <button
            type="button"
            aria-label="Cerrar"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={onCerrar}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {cuentasGoogle.map((cuenta) => (
            <button
              key={cuenta.id}
              type="button"
              className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
              onClick={() => elegirCuenta(cuenta)}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-semibold text-white">
                {iniciales(cuenta.nombre)}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {cuenta.nombre}
                </span>
                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {cuenta.email}
                </span>
              </span>
              <span className="ml-auto shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {nombresRoles(roles, cuenta.roles).join(', ')}
              </span>
            </button>
          ))}
        </div>

        <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400 dark:border-gray-700 dark:text-gray-500">
          Simulación de OAuth. En producción, el backend valida el token de Google y la
          cuenta se crea desde el servidor.
        </p>
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
