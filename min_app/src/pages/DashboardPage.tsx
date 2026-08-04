import { Link } from 'react-router-dom'
import { AlertTriangle, Box, Clock, DollarSign, Truck, Wrench } from 'lucide-react'
import {
  NOMBRES_CATEGORIA_EQUIPO,
  NOMBRES_ESTADO_EQUIPO,
  NOMBRES_ESTADO_ORDEN,
  NOMBRES_PRIORIDAD,
} from '../types/domain'
import { listarEquipos } from '../services/equiposService'
import { listarRepuestos } from '../services/repuestosService'
import { listarOrdenesMantenimiento } from '../services/ordenesService'
import { useRecurso } from '../hooks/useRecurso'
import { StatCard } from '../components/StatCard'
import { StatusBadge } from '../components/StatusBadge'
import { LoadState } from '../components/LoadState'
import { equipoTone, ordenTone, prioridadTone } from '../utils/tones'

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export default function DashboardPage() {
  const { datos: equipos, cargando, error } = useRecurso(listarEquipos)
  const {
    datos: ordenes,
    cargando: cargandoOrdenes,
    error: errorOrdenes,
  } = useRecurso(listarOrdenesMantenimiento)
  const {
    datos: repuestos,
    cargando: cargandoRepuestos,
    error: errorRepuestos,
  } = useRecurso(listarRepuestos)

  const equiposEnMantenimiento = equipos.filter(
    (e) => e.estado === 'en_mantenimiento' || e.estado === 'fuera_de_servicio',
  )
  const ordenesAbiertas = ordenes.filter(
    (o) => o.estado === 'pendiente' || o.estado === 'en_proceso',
  )
  const repuestosBajoStock = repuestos.filter(
    (r) => r.stockActual <= r.stockMinimo,
  )

  const costoTotalMes = ordenes
    .filter((o) => o.estado === 'completada')
    .reduce((acc, o) => acc + o.costoManoObra + o.costoRepuestos, 0)

  const cargandoTotal = cargando || cargandoOrdenes || cargandoRepuestos
  const errorTotal = error ?? errorOrdenes ?? errorRepuestos

  return (
    <div className="space-y-6">
      <LoadState cargando={cargandoTotal} error={errorTotal} />
      {!cargandoTotal && !errorTotal && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Equipos en flota"
              value={String(equipos.length)}
              subtitle={`${equiposEnMantenimiento.length} no operativos`}
              icon={Truck}
              iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
            />
            <StatCard
              title="Órdenes abiertas"
              value={String(ordenesAbiertas.length)}
              subtitle="pendientes o en proceso"
              icon={Wrench}
              iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
            />
            <StatCard
              title="Repuestos bajo stock"
              value={String(repuestosBajoStock.length)}
              subtitle={`de ${repuestos.length} referencias`}
              icon={Box}
              iconClassName="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300"
            />
            <StatCard
              title="Costo mes actual"
              value={formatoCLP.format(costoTotalMes)}
              subtitle="solo órdenes completadas"
              icon={DollarSign}
              iconClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <Clock className="size-4 text-amber-600" />
                  Órdenes abiertas
                </h3>
                <Link
                  to="/ordenes"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Ver todas
                </Link>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {ordenesAbiertas.slice(0, 5).map((orden) => {
                  const equipo = equipos.find((e) => e.id === orden.equipoId)
                  return (
                    <li key={orden.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {orden.numero} — {equipo?.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{orden.descripcion}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge
                          label={NOMBRES_PRIORIDAD[orden.prioridad]}
                          tone={prioridadTone(orden.prioridad)}
                          dot={false}
                        />
                        <StatusBadge
                          label={NOMBRES_ESTADO_ORDEN[orden.estado]}
                          tone={ordenTone(orden.estado)}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700/50">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                  <AlertTriangle className="size-4 text-red-600" />
                  Equipos fuera de servicio
                </h3>
                <Link
                  to="/maquinaria"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Ver flota
                </Link>
              </div>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {equiposEnMantenimiento.slice(0, 5).map((equipo) => (
                  <li key={equipo.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{equipo.nombre}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {NOMBRES_CATEGORIA_EQUIPO[equipo.categoria]} · {equipo.ubicacion}
                      </p>
                    </div>
                    <StatusBadge
                      label={NOMBRES_ESTADO_EQUIPO[equipo.estado]}
                      tone={equipoTone(equipo.estado)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
