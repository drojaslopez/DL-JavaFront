import type { Repuesto } from '../types/domain'
import { repuestos as repuestosMock } from '../data/mock'
import { conFallback, httpDelete, httpGet, httpPost, httpPut } from './apiClient'

/**
 * Servicio de repuestos.
 *
 * Endpoints que debe exponer el backend (docs/backend-api.md):
 *   GET    /api/repuestos           -> Repuesto[]
 *   GET    /api/repuestos/:id       -> Repuesto
 *   POST   /api/repuestos           -> 201 Repuesto
 *   PUT    /api/repuestos/:id       -> Repuesto
 *   DELETE /api/repuestos/:id       -> 204
 */
const RUTA = '/repuestos'

export function listarRepuestos(): Promise<Repuesto[]> {
  return conFallback(() => httpGet<Repuesto[]>(RUTA), () => repuestosMock)
}

export function obtenerRepuesto(id: string): Promise<Repuesto> {
  return conFallback(
    () => httpGet<Repuesto>(`${RUTA}/${id}`),
    () => {
      const repuesto = repuestosMock.find((r) => r.id === id)
      if (!repuesto) throw new Error(`Repuesto ${id} no encontrado`)
      return repuesto
    },
  )
}

export function crearRepuesto(datos: Omit<Repuesto, 'id'>): Promise<Repuesto> {
  return conFallback(
    () => httpPost<Repuesto>(RUTA, datos),
    () => ({ ...datos, id: crypto.randomUUID() }),
  )
}

export function actualizarRepuesto(
  id: string,
  cambios: Partial<Repuesto>,
): Promise<Repuesto> {
  return conFallback(
    () => httpPut<Repuesto>(`${RUTA}/${id}`, cambios),
    () => {
      const repuesto = repuestosMock.find((r) => r.id === id)
      if (!repuesto) throw new Error(`Repuesto ${id} no encontrado`)
      return { ...repuesto, ...cambios }
    },
  )
}

export function eliminarRepuesto(id: string): Promise<void> {
  return conFallback(() => httpDelete(`${RUTA}/${id}`), () => undefined)
}
