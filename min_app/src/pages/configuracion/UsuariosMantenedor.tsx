import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/contexto'
import { nombresRoles } from '../../auth/permisos'
import type { Usuario } from '../../types/auth'
import UsuarioFormulario from './UsuarioFormulario'

export default function UsuariosMantenedor() {
  const { usuarios, roles, usuario: sesion, eliminarUsuario } = useAuth()
  const [formulario, setFormulario] = useState<{ usuario: Usuario | null } | null>(null)
  const [confirmarId, setConfirmarId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const borrar = (id: string) => {
    const resultado = eliminarUsuario(id)
    if (!resultado.ok) {
      setMensaje(resultado.mensaje ?? 'No se pudo eliminar el usuario.')
      return
    }
    setMensaje(null)
    setConfirmarId(null)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {usuarios.length} usuarios registrados en el sistema.
        </p>
        <button
          type="button"
          onClick={() => setFormulario({ usuario: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Nuevo usuario
        </button>
      </div>

      {mensaje && (
        <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {mensaje}
        </p>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Roles</th>
              <th className="px-4 py-3 font-medium">Proveedor</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{usuario.nombre}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{usuario.email}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {nombresRoles(roles, usuario.roles).map((nombre) => (
                      <span
                        key={nombre}
                        className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800"
                      >
                        {nombre}
                      </span>
                    ))}
                    {usuario.roles.length === 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Sin roles</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs uppercase text-gray-500 dark:text-gray-400">{usuario.proveedor}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      usuario.activo
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800'
                        : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800'
                    }`}
                  >
                    {usuario.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Editar"
                      aria-label={`Editar a ${usuario.nombre}`}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-600"
                      onClick={() => setFormulario({ usuario })}
                    >
                      <Pencil className="size-4" />
                    </button>
                    {confirmarId === usuario.id ? (
                      <button
                        type="button"
                        className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        onClick={() => borrar(usuario.id)}
                      >
                        ¿Eliminar?
                      </button>
                    ) : (
                      <button
                        type="button"
                        title={sesion?.id === usuario.id ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}
                        aria-label={`Eliminar a ${usuario.nombre}`}
                        className={`rounded-lg p-2 ${
                          sesion?.id === usuario.id
                            ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-600'
                        }`}
                        onClick={() =>
                          sesion?.id !== usuario.id && setConfirmarId(usuario.id)
                        }
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {formulario && (
        <UsuarioFormulario usuario={formulario.usuario} onCerrar={() => setFormulario(null)} />
      )}
    </div>
  )
}
