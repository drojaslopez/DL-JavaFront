import { useState, type FormEvent } from 'react'
import { Save, UserPlus } from 'lucide-react'
import { useAuth } from '../../auth/contexto'
import type { Usuario } from '../../types/auth'
import { Modal } from '../../components/Modal'

interface UsuarioFormularioProps {
  /** Usuario a editar; `null` crea uno nuevo. */
  usuario: Usuario | null
  onCerrar: () => void
}

export default function UsuarioFormulario({ usuario, onCerrar }: UsuarioFormularioProps) {
  const { roles, crearUsuario, actualizarUsuario } = useAuth()
  const esNuevo = usuario === null

  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [password, setPassword] = useState('')
  const [rolesSeleccionados, setRolesSeleccionados] = useState<string[]>(
    usuario?.roles ?? ['visita'],
  )
  const [activo, setActivo] = useState(usuario?.activo ?? true)
  const [error, setError] = useState<string | null>(null)

  const alternarRol = (id: string) => {
    setRolesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    )
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const datos = { nombre, email, password, roles: rolesSeleccionados, activo }
    const resultado = esNuevo
      ? crearUsuario(datos)
      : actualizarUsuario(usuario.id, datos)
    if (!resultado.ok) {
      setError(resultado.mensaje ?? 'No se pudo guardar el usuario.')
      return
    }
    onCerrar()
  }

  return (
    <Modal titulo={esNuevo ? 'Nuevo usuario' : 'Editar usuario'} onCerrar={onCerrar}>
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label htmlFor="u-nombre" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre
          </label>
          <input
            id="u-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan Pérez"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="u-email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="u-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@mineria.cl"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="u-password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Contraseña {esNuevo ? '' : '(dejar en blanco para no cambiarla)'}
          </label>
          <input
            id="u-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={esNuevo ? 'Mínimo 6 caracteres' : '••••••••'}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Roles</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {roles.map((rol) => (
              <label
                key={rol.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={rolesSeleccionados.includes(rol.id)}
                  onChange={() => alternarRol(rol.id)}
                  className="size-4 accent-blue-600"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">{rol.nombre}</span>
              </label>
            ))}
          </div>
          {rolesSeleccionados.length === 0 && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Asigna al menos un rol.</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="size-4 accent-blue-600"
          />
          Usuario activo (puede iniciar sesión)
        </label>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {esNuevo ? <UserPlus className="size-4" /> : <Save className="size-4" />}
          {esNuevo ? 'Crear usuario' : 'Guardar cambios'}
        </button>
      </form>
    </Modal>
  )
}
