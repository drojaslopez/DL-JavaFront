import { DollarSign, HardHat, Wrench } from 'lucide-react'
import { listarCostosMensuales } from '../services/costosService'
import { useRecurso } from '../hooks/useRecurso'
import { PageHeader } from '../components/PageHeader'
import { StatCard } from '../components/StatCard'
import { LoadState } from '../components/LoadState'

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export default function CostosPage() {
  const { datos: costosMensuales, cargando, error } =
    useRecurso(listarCostosMensuales)

  const totalManoObra = costosMensuales.reduce((acc, c) => acc + c.manoObra, 0)
  const totalRepuestos = costosMensuales.reduce((acc, c) => acc + c.repuestos, 0)
  const totalGeneral = totalManoObra + totalRepuestos
  const maxTotal = Math.max(...costosMensuales.map((c) => c.total))

  return (
    <div>
      <PageHeader
        title="Costos de mantenimiento"
        description="Evolución mensual de mano de obra y repuestos"
      />

      <LoadState cargando={cargando} error={error} />

      {!cargando && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total semestre"
              value={formatoCLP.format(totalGeneral)}
              subtitle="febrero a julio"
              icon={DollarSign}
              iconClassName="bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
            />
            <StatCard
              title="Mano de obra"
              value={formatoCLP.format(totalManoObra)}
              subtitle={`${pct(totalManoObra, totalGeneral)} del total`}
              icon={HardHat}
              iconClassName="bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"
            />
            <StatCard
              title="Repuestos"
              value={formatoCLP.format(totalRepuestos)}
              subtitle={`${pct(totalRepuestos, totalGeneral)} del total`}
              icon={Wrench}
              iconClassName="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300"
            />
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">Costo mensual total</h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              Mano de obra + repuestos por mes
            </p>

            <div className="space-y-4">
              {costosMensuales.map((mes) => (
                <div key={mes.mes}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{mes.mes}</span>
                    <span className="text-gray-500 dark:text-gray-400">{formatoCLP.format(mes.total)}</span>
                  </div>
                  <div className="flex h-6 gap-0.5 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-700">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${pctAncho(mes.manoObra, maxTotal)}%` }}
                      title={`Mano de obra: ${formatoCLP.format(mes.manoObra)}`}
                    />
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${pctAncho(mes.repuestos, maxTotal)}%` }}
                      title={`Repuestos: ${formatoCLP.format(mes.repuestos)}`}
                    />
                  </div>
                  <div className="mt-1 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-full bg-blue-500" /> Mano de obra:{' '}
                      {formatoCLP.format(mes.manoObra)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-500" /> Repuestos:{' '}
                      {formatoCLP.format(mes.repuestos)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function pct(parte: number, total: number) {
  if (total === 0) return '0%'
  return `${Math.round((parte / total) * 100)}%`
}

function pctAncho(valor: number, maximo: number) {
  if (maximo === 0) return 0
  return Math.max(2, (valor / maximo) * 100)
}
