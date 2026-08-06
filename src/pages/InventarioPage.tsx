import { useMemo, useState } from 'react'
import { AlertTriangle, Plus, Search } from 'lucide-react'
import { listarRepuestos } from '../services/repuestosService'
import { useRecurso } from '../hooks/useRecurso'
import { PageHeader } from '../components/PageHeader'
import { StatusBadge } from '../components/StatusBadge'
import { LoadState } from '../components/LoadState'
import { useAuth } from '../auth/contexto'
import { puedeEscribir } from '../auth/permisos'

const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

export default function InventarioPage() {
  const [busqueda, setBusqueda] = useState('')
  const [soloBajoStock, setSoloBajoStock] = useState(false)
  const { datos: repuestos, cargando, error } = useRecurso(listarRepuestos)
  const { usuario, roles } = useAuth()

  const repuestosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return repuestos.filter((repuesto) => {
      const coincideTexto =
        !termino ||
        repuesto.nombre.toLowerCase().includes(termino) ||
        repuesto.codigo.toLowerCase().includes(termino) ||
        repuesto.categoria.toLowerCase().includes(termino)
      const coincideStock =
        !soloBajoStock || repuesto.stockActual <= repuesto.stockMinimo
      return coincideTexto && coincideStock
    })
  }, [busqueda, soloBajoStock, repuestos])

  const repuestosBajoStock = repuestos
    .filter((r) => r.stockActual <= r.stockMinimo)
    .map((r) => r.nombre)

  return (
    <div>
      <PageHeader
        title="Inventario de repuestos"
        description="Control de stock y reposición de partes críticas"
        actions={
          puedeEscribir(roles, usuario) && (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="size-4" />
              Ingresar repuesto
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
                placeholder="Buscar repuesto, código o categoría..."
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={soloBajoStock}
                onChange={(e) => setSoloBajoStock(e.target.checked)}
                className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Solo bajo stock
            </label>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Repuesto
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500 dark:text-gray-400">
                      Costo unitario
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
                  {repuestosFiltrados.map((repuesto) => {
                    const bajoStock = repuesto.stockActual <= repuesto.stockMinimo
                    return (
                      <tr key={repuesto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-gray-100">{repuesto.nombre}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {repuesto.codigo} · {repuesto.proveedor}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{repuesto.categoria}</td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {repuesto.stockActual}{' '}
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            / mín. {repuesto.stockMinimo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {formatoCLP.format(repuesto.costoUnitario)}
                        </td>
                        <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{repuesto.ubicacion}</td>
                        <td className="px-4 py-3">
                          {bajoStock ? (
                            <StatusBadge label="Bajo stock" tone="red" dot={false} />
                          ) : (
                            <StatusBadge label="Disponible" tone="green" dot={false} />
                          )}
                        </td>
                      </tr>
                    )
                  })}
                  {repuestosFiltrados.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-sm text-gray-400 dark:text-gray-500"
                      >
                        Nada por aquí. Al menos el bodeguero duerme tranquilo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {repuestosBajoStock.length > 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-medium">
                  Atención, {repuestosBajoStock.length} repuesto(s) crítico(s):
                </p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                  {repuestosBajoStock.join(', ')}. Recomendación: emitir orden de
                  compra antes de que la flota se detenga sola.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
