import type { Equipo } from '../types/domain'
import { equipos as equiposMock } from '../data/mock'
import { conFallback, httpDelete, httpGet, httpPost, httpPut } from './apiClient'

/**
 * Servicio de equipos.
 *
 * Endpoints que debe exponer el backend (docs/backend-api.md):
 *   GET    /api/equipos           -> Equipo[]
 *   GET    /api/equipos/:id       -> Equipo
 *   POST   /api/equipos           -> 201 Equipo
 *   PUT    /api/equipos/:id       -> Equipo
 *   DELETE /api/equipos/:id       -> 204
 */
const RUTA = '/equipos'

export function listarEquipos(): Promise<Equipo[]> {
  return conFallback(() => httpGet<Equipo[]>(RUTA), () => equiposMock)
}

export function obtenerEquipo(id: string): Promise<Equipo> {
  return conFallback(
    () => httpGet<Equipo>(`${RUTA}/${id}`),
    () => {
      const equipo = equiposMock.find((e) => e.id === id)
      if (!equipo) throw new Error(`Equipo ${id} no encontrado`)
      return equipo
    },
  )
}

export function crearEquipo(datos: Omit<Equipo, 'id'>): Promise<Equipo> {
  return conFallback(
    () => httpPost<Equipo>(RUTA, datos),
    () => ({ ...datos, id: crypto.randomUUID() }),
  )
}

export function actualizarEquipo(id: string, cambios: Partial<Equipo>): Promise<Equipo> {
  return conFallback(
    () => httpPut<Equipo>(`${RUTA}/${id}`, cambios),
    () => {
      const equipo = equiposMock.find((e) => e.id === id)
      if (!equipo) throw new Error(`Equipo ${id} no encontrado`)
      return { ...equipo, ...cambios }
    },
  )
}

export function eliminarEquipo(id: string): Promise<void> {
  return conFallback(() => httpDelete(`${RUTA}/${id}`), () => undefined)
}
