import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  NOMBRES_ESTADO_ORDEN,
  NOMBRES_PRIORIDAD,
  type EstadoOrden,
  type TipoMantenimiento,
} from '../types/domain'
import { listarEquipos } from '../services/equiposService'
import { listarOrdenesMantenimiento } from '../services/ordenesService'
import { useRecurso } from '../hooks/useRecurso'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { LoadState } from '../components/LoadState'
import { useAuth } from '../auth/contexto'
import { puedeEscribir } from '../auth/permisos'
import { ordenTone, prioridadTone } from '../utils/tones'

export default function OrdenesPage() {
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoOrden | 'todos'>('todos')
  const {
    datos: ordenes,
    cargando,
    error,
  } = useRecurso(listarOrdenesMantenimiento)
  const { datos: equipos } = useRecurso(listarEquipos)
  const { usuario, roles } = useAuth()

  const ordenesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return ordenes
      .filter((orden) => {
        const equipo = equipos.find((e) => e.id === orden.equipoId)
        const coincideTexto =
          !termino ||
          orden.numero.toLowerCase().includes(termino) ||
          orden.descripcion.toLowerCase().includes(termino) ||
          equipo?.nombre.toLowerCase().includes(termino) ||
          orden.tecnico.toLowerCase().includes(termino)
        const coincideEstado =
          estadoFiltro === 'todos' || orden.estado === estadoFiltro
        return coincideTexto && coincideEstado
      })
      .sort((a, b) => b.fechaSolicitud.localeCompare(a.fechaSolicitud))
  }, [busqueda, estadoFiltro, ordenes, equipos])

  return (
    <div>
      <PageHeader
        title="Órdenes de mantenimiento"
        description="Trabajos preventivos, correctivos y predictivos de la flota"
        actions={
          puedeEscribir(roles, usuario) && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Nueva orden
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
                placeholder="Buscar por número, equipo o técnico..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
            <select
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value as EstadoOrden | 'todos')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="todos">Todos los estados</option>
              {(Object.keys(NOMBRES_ESTADO_ORDEN) as EstadoOrden[]).map((estado) => (
                <option key={estado} value={estado}>
                  {NOMBRES_ESTADO_ORDEN[estado]}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Orden</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">Tipo</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Prioridad
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Técnico
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Solicitud
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {ordenesFiltradas.map((orden) => {
                    const equipo = equipos.find((e) => e.id === orden.equipoId)
                    return (
                      <tr key={orden.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{orden.numero}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {equipo?.nombre ?? 'Equipo no encontrado'}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                          {tipoMantenimiento(orden.tipo)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            label={NOMBRES_PRIORIDAD[orden.prioridad]}
                            tone={prioridadTone(orden.prioridad)}
                            dot={false}
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{orden.tecnico}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {formatFecha(orden.fechaSolicitud)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            label={NOMBRES_ESTADO_ORDEN[orden.estado]}
                            tone={ordenTone(orden.estado)}
                          />
                        </td>
                      </tr>
                    )
                  })}
                  {ordenesFiltradas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                      >
                        Sin órdenes con esos filtros. Como el plan de mantenimiento,
                        parece.
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

function tipoMantenimiento(tipo: TipoMantenimiento) {
  const nombres: Record<TipoMantenimiento, string> = {
    preventivo: 'Preventivo',
    correctivo: 'Correctivo',
    predictivo: 'Predictivo',
  }
  return nombres[tipo]
}

function formatFecha(fecha: string) {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CL')
}
