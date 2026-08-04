import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  NOMBRES_CATEGORIA_EQUIPO,
  NOMBRES_ESTADO_EQUIPO,
  type CategoriaEquipo,
  type EstadoEquipo,
} from '../types/domain'
import { listarEquipos } from '../services/equiposService'
import { useRecurso } from '../hooks/useRecurso'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { LoadState } from '../components/LoadState'
import { useAuth } from '../auth/contexto'
import { puedeEscribir } from '../auth/permisos'
import { equipoTone } from '../utils/tones'

const formatoHrs = new Intl.NumberFormat('es-CL')

export default function MaquinariaPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEquipo | 'todos'>('todos')
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaEquipo | 'todas'>(
    'todas',
  )
  const { datos: equipos, cargando, error } = useRecurso(listarEquipos)
  const { usuario, roles } = useAuth()

  const equiposFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return equipos.filter((equipo) => {
      const coincideTexto =
        !termino ||
        equipo.nombre.toLowerCase().includes(termino) ||
        equipo.codigo.toLowerCase().includes(termino) ||
        equipo.marca.toLowerCase().includes(termino)
      const coincideEstado =
        estadoFiltro === 'todos' || equipo.estado === estadoFiltro
      const coincideCategoria =
        categoriaFiltro === 'todas' || equipo.categoria === categoriaFiltro
      return coincideTexto && coincideEstado && coincideCategoria
    })
  }, [busqueda, estadoFiltro, categoriaFiltro, equipos])

  return (
    <div>
      <PageHeader
        title="Flota de equipos"
        description={`${equipos.length} equipos registrados en la división`}
        actions={
          puedeEscribir(roles, usuario) && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Registrar equipo
            </button>
          )
        }
      />

      <LoadState cargando={cargando} error={error} />

      {!cargando && !error && (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-64 flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, código o marca..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as EstadoEquipo | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="todos">Todos los estados</option>
              {(Object.keys(NOMBRES_ESTADO_EQUIPO) as EstadoEquipo[]).map((estado) => (
                <option key={estado} value={estado}>
                  {NOMBRES_ESTADO_EQUIPO[estado]}
                </option>
              ))}
            </select>
            <select
              value={categoriaFiltro}
              onChange={(e) =>
                setCategoriaFiltro(e.target.value as CategoriaEquipo | 'todas')
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="todas">Todas las categorías</option>
              {(Object.keys(NOMBRES_CATEGORIA_EQUIPO) as CategoriaEquipo[]).map(
                (categoria) => (
                  <option key={categoria} value={categoria}>
                    {NOMBRES_CATEGORIA_EQUIPO[categoria]}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Equipo
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Horas operación
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Ubicación
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {equiposFiltrados.map((equipo) => (
                    <tr key={equipo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{equipo.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {equipo.codigo} · {equipo.marca} {equipo.modelo}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {NOMBRES_CATEGORIA_EQUIPO[equipo.categoria]}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {formatoHrs.format(equipo.horasOperacion)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{equipo.ubicacion}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label={NOMBRES_ESTADO_EQUIPO[equipo.estado]}
                          tone={equipoTone(equipo.estado)}
                        />
                      </td>
                    </tr>
                  ))}
                  {equiposFiltrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                      >
                        Sin resultados. Prueba otro filtro o búscate una vida.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
