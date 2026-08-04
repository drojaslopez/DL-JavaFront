import { API_CONFIG } from './config'

type MetodoHttp = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface OpcionesPeticion {
  metodo: MetodoHttp
  cuerpo?: unknown
}

async function peticion<T>(ruta: string, opciones: OpcionesPeticion): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_CONFIG.timeoutMs)
  try {
    const respuesta = await fetch(`${API_CONFIG.baseUrl}${ruta}`, {
      method: opciones.metodo,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(opciones.cuerpo !== undefined
          ? { 'Content-Type': 'application/json' }
          : {}),
      },
      body:
        opciones.cuerpo !== undefined ? JSON.stringify(opciones.cuerpo) : undefined,
    })
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status} en ${respuesta.url}`)
    }
    if (respuesta.status === 204) return undefined as T
    return (await respuesta.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export function httpGet<T>(ruta: string): Promise<T> {
  return peticion<T>(ruta, { metodo: 'GET' })
}

export function httpPost<T>(ruta: string, cuerpo: unknown): Promise<T> {
  return peticion<T>(ruta, { metodo: 'POST', cuerpo })
}

export function httpPut<T>(ruta: string, cuerpo: unknown): Promise<T> {
  return peticion<T>(ruta, { metodo: 'PUT', cuerpo })
}

export function httpDelete(ruta: string): Promise<void> {
  return peticion<void>(ruta, { metodo: 'DELETE' })
}

/**
 * Ejecuta `peticion` contra el backend. Si `API_CONFIG.enabled` es false
 * o la petición falla, devuelve el `respaldo` (datos estáticos).
 */
export async function conFallback<T>(
  peticion: () => Promise<T>,
  respaldo: () => T,
): Promise<T> {
  if (!API_CONFIG.enabled) return respaldo()
  try {
    return await peticion()
  } catch (error) {
    console.warn('[API] El backend no respondió; usando datos estáticos.', error)
    return respaldo()
  }
}
