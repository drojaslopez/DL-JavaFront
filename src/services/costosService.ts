import type { CostoResumen } from '../types/domain'
import { costosMensuales as costosMock } from '../data/mock'
import { conFallback, httpGet } from './apiClient'

/**
 * Servicio de costos (agregados mensuales).
 *
 * Endpoint que debe exponer el backend (docs/backend-api.md):
 *   GET /api/costos/mensuales -> CostoResumen[]
 */
const RUTA = '/costos/mensuales'

export function listarCostosMensuales(): Promise<CostoResumen[]> {
  return conFallback(() => httpGet<CostoResumen[]>(RUTA), () => costosMock)
}
