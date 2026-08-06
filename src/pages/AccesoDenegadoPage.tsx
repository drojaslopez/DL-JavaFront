import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { useAuth } from '../auth/contexto'
import { nombresRoles } from '../auth/permisos'

export default function AccesoDenegadoPage() {
  const { usuario, roles } = useAuth()

  const rolesDeUsuario = usuario ? nombresRoles(roles, usuario.roles) : []

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-16 text-center">
      <ShieldX className="size-12 text-red-400" />
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Acceso denegado</h2>
      <p className="mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
        {usuario ? (
          <>
            Tus roles ({rolesDeUsuario.join(', ')}) no tienen permiso para esta vista.
            Pide más permisos al administrador o vete a mirar lo que sí puedes ver.
          </>
        ) : (
          'Inicia sesión para continuar.'
        )}
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Volver al dashboard
      </Link>
    </div>
  )
}
