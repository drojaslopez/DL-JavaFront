import { useState } from 'react'
import { Settings, Shield, Users } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import UsuariosMantenedor from './configuracion/UsuariosMantenedor'
import RolesMantenedor from './configuracion/RolesMantenedor'

type Pestana = 'usuarios' | 'roles'

export default function ConfiguracionPage() {
  const [pestana, setPestana] = useState<Pestana>('usuarios')

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Mantenedores de usuarios y roles del sistema"
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setPestana('usuarios')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            pestana === 'usuarios'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Users className="size-4" />
          Usuarios
        </button>
        <button
          type="button"
          onClick={() => setPestana('roles')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
            pestana === 'roles'
              ? 'bg-blue-600 text-white'
              : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <Shield className="size-4" />
          Roles
        </button>
      </div>

      {pestana === 'usuarios' ? <UsuariosMantenedor /> : <RolesMantenedor />}

      <div className="mt-8 flex items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
        <Settings className="size-4 text-gray-400 dark:text-gray-500" />
        Próximamente: mantenedores de faenas, proveedores y alarmas de stock.
      </div>
    </div>
  )
}
