import type { OrdenMantenimiento } from '../types/domain'
import { ordenesMantenimiento as ordenesMock } from '../data/mock'
import { conFallback, httpDelete, httpGet, httpPost, httpPut } from './apiClient'

/**
 * Servicio de órdenes de mantenimiento.
 *
 * Endpoints que debe exponer el backend (docs/backend-api.md):
 *   GET    /api/ordenes-mantenimiento           -> OrdenMantenimiento[]
 *   GET    /api/ordenes-mantenimiento/:id       -> OrdenMantenimiento
 *   POST   /api/ordenes-mantenimiento           -> 201 OrdenMantenimiento
 *   PUT    /api/ordenes-mantenimiento/:id       -> OrdenMantenimiento
 *   DELETE /api/ordenes-mantenimiento/:id       -> 204
 */
const RUTA = '/ordenes-mantenimiento'

export function listarOrdenesMantenimiento(): Promise<OrdenMantenimiento[]> {
  return conFallback(
    () => httpGet<OrdenMantenimiento[]>(RUTA),
    () => ordenesMock,
  )
}

export function obtenerOrdenMantenimiento(id: string): Promise<OrdenMantenimiento> {
  return conFallback(
    () => httpGet<OrdenMantenimiento>(`${RUTA}/${id}`),
    () => {
      const orden = ordenesMock.find((o) => o.id === id)
      if (!orden) throw new Error(`Orden ${id} no encontrada`)
      return orden
    },
  )
}

export function crearOrdenMantenimiento(
  datos: Omit<OrdenMantenimiento, 'id'>,
): Promise<OrdenMantenimiento> {
  return conFallback(
    () => httpPost<OrdenMantenimiento>(RUTA, datos),
    () => ({ ...datos, id: crypto.randomUUID() }),
  )
}

export function actualizarOrdenMantenimiento(
  id: string,
  cambios: Partial<OrdenMantenimiento>,
): Promise<OrdenMantenimiento> {
  return conFallback(
    () => httpPut<OrdenMantenimiento>(`${RUTA}/${id}`, cambios),
    () => {
      const orden = ordenesMock.find((o) => o.id === id)
      if (!orden) throw new Error(`Orden ${id} no encontrada`)
      return { ...orden, ...cambios }
    },
  )
}

export function eliminarOrdenMantenimiento(id: string): Promise<void> {
  return conFallback(() => httpDelete(`${RUTA}/${id}`), () => undefined)
}
