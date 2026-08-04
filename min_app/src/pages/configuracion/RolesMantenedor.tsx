import { useState } from 'react'
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { useAuth } from '../../auth/contexto'
import { NOMBRES_VISTA } from '../../auth/permisos'
import type { Rol } from '../../types/auth'
import RolFormulario from './RolFormulario'

export default function RolesMantenedor() {
  const { roles, usuarios, eliminarRol } = useAuth()
  const [formulario, setFormulario] = useState<{ rol: Rol | null } | null>(null)
  const [confirmarId, setConfirmarId] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<string | null>(null)

  const borrar = (id: string) => {
    const resultado = eliminarRol(id)
    if (!resultado.ok) {
      setMensaje(resultado.mensaje ?? 'No se pudo eliminar el rol.')
      return
    }
    setMensaje(null)
    setConfirmarId(null)
  }

  const contarMiembros = (id: string) =>
    usuarios.filter((usuario) => usuario.roles.includes(id)).length

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {roles.length} roles definidos. Crea roles para dar acceso a ventanas específicas.
        </p>
        <button
          type="button"
          onClick={() => setFormulario({ rol: null })}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="size-4" />
          Nuevo rol
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
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Acceso a ventanas</th>
              <th className="px-4 py-3 font-medium">Escritura</th>
              <th className="px-4 py-3 font-medium">Miembros</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {roles.map((rol) => (
              <tr key={rol.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3">
                  <p className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                    {rol.nombre}
                    {rol.sistema && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        <ShieldCheck className="size-3" />
                        Sistema
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">id: {rol.id}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex max-w-72 flex-wrap gap-1">
                    {rol.vistas.map((vista) => (
                      <span
                        key={vista}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {NOMBRES_VISTA[vista]}
                      </span>
                    ))}
                    {rol.vistas.length === 0 && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">Sin acceso</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      rol.escribir
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {rol.escribir ? 'Sí' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{contarMiembros(rol.id)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      title="Editar"
                      aria-label={`Editar rol ${rol.nombre}`}
                      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-blue-600"
                      onClick={() => setFormulario({ rol })}
                    >
                      <Pencil className="size-4" />
                    </button>
                    {confirmarId === rol.id ? (
                      <button
                        type="button"
                        className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700"
                        onClick={() => borrar(rol.id)}
                      >
                        ¿Eliminar?
                      </button>
                    ) : (
                      <button
                        type="button"
                        title={rol.sistema ? 'Rol de sistema, no se elimina' : 'Eliminar'}
                        aria-label={`Eliminar rol ${rol.nombre}`}
                        className={`rounded-lg p-2 ${
                          rol.sistema
                            ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-600'
                        }`}
                        onClick={() => !rol.sistema && setConfirmarId(rol.id)}
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
        <RolFormulario rol={formulario.rol} onCerrar={() => setFormulario(null)} />
      )}
    </div>
  )
}
