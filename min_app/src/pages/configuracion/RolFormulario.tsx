import { useState, type FormEvent } from 'react'
import { Save, ShieldPlus } from 'lucide-react'
import { useAuth } from '../../auth/contexto'
import { NOMBRES_VISTA, VISTAS } from '../../auth/permisos'
import type { Rol, Vista } from '../../types/auth'
import { Modal } from '../../components/Modal'

interface RolFormularioProps {
  /** Rol a editar; `null` crea uno nuevo. */
  rol: Rol | null
  onCerrar: () => void
}

export default function RolFormulario({ rol, onCerrar }: RolFormularioProps) {
  const { usuarios, guardarRol } = useAuth()
  const esNuevo = rol === null

  const [nombre, setNombre] = useState(rol?.nombre ?? '')
  const [vistas, setVistas] = useState<Vista[]>(rol?.vistas ?? [])
  const [escribir, setEscribir] = useState(rol?.escribir ?? false)
  const [miembros, setMiembros] = useState<string[]>(() =>
    rol ? usuarios.filter((u) => u.roles.includes(rol.id)).map((u) => u.id) : [],
  )
  const [error, setError] = useState<string | null>(null)

  const alternarVista = (vista: Vista) => {
    setVistas((prev) =>
      prev.includes(vista) ? prev.filter((v) => v !== vista) : [...prev, vista],
    )
  }

  const alternarMiembro = (id: string) => {
    setMiembros((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    )
  }

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const rolGuardado: Rol = {
      id: rol?.id ?? '',
      nombre,
      vistas,
      escribir,
      sistema: rol?.sistema ?? false,
    }
    const resultado = guardarRol(rolGuardado, miembros)
    if (!resultado.ok) {
      setError(resultado.mensaje ?? 'No se pudo guardar el rol.')
      return
    }
    onCerrar()
  }

  return (
    <Modal
      titulo={esNuevo ? 'Nuevo rol' : `Editar rol: ${rol?.nombre ?? ''}`}
      onCerrar={onCerrar}
      ancho="lg"
    >
      <form onSubmit={enviar} className="space-y-5">
        <div>
          <label htmlFor="r-nombre" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nombre del rol
          </label>
          <input
            id="r-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="p. ej. Operador de grúa"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Ventanas a las que tiene acceso
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {VISTAS.map((vista) => (
              <label
                key={vista}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={vistas.includes(vista)}
                  onChange={() => alternarVista(vista)}
                  className="size-4 accent-blue-600"
                />
                <span className="font-medium text-gray-800 dark:text-gray-200">{NOMBRES_VISTA[vista]}</span>
              </label>
            ))}
          </div>
          {vistas.length === 0 && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">Elige al menos una vista.</p>
          )}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={escribir}
            onChange={(e) => setEscribir(e.target.checked)}
            className="size-4 accent-blue-600"
          />
          Puede escribir (crear y editar registros)
        </label>

        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            ¿Quién pertenece a este rol?
          </span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {usuarios.map((usuario) => (
              <label
                key={usuario.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={miembros.includes(usuario.id)}
                  onChange={() => alternarMiembro(usuario.id)}
                  className="size-4 accent-blue-600"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-gray-800 dark:text-gray-200">
                    {usuario.nombre}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{usuario.email}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Marcar un usuario lo agrega al rol; desmarcarlo lo quita.
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          {esNuevo ? <ShieldPlus className="size-4" /> : <Save className="size-4" />}
          {esNuevo ? 'Crear rol' : 'Guardar cambios'}
        </button>
      </form>
    </Modal>
  )
}
