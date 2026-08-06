/**
 * Configuración de conexión con el backend.
 *
 * CÓMO CONECTAR EL BACKEND (Java / Spring Boot):
 * 1. Implementa en el back los endpoints REST documentados en
 *    `docs/backend-api.md` (los que "debe tener" cada servicio).
 * 2. Levanta el backend y ajusta `baseUrl` a su URL (sin barra final).
 * 3. Cambia `enabled` a `true`.
 *
 * Comportamiento:
 * - `enabled: false` -> todos los servicios usan los datos estáticos
 *   de `src/data/mock.ts` (sin tocar la red).
 * - `enabled: true`  -> se llama al backend; si la petición falla
 *   (servidor caído, red, timeout, HTTP != 2xx) cada servicio cae
 *   automáticamente al mock y avisa por consola con `[API]`.
 *
 * Ejemplo: API en el puerto 8080 -> baseUrl: 'http://localhost:8080/api'
 */
export const API_CONFIG = {
  /** Flag maestro: activa el consumo del backend real. */
  enabled: false,
  /** URL base del backend. Debe exponer los endpoints de docs/backend-api.md. */
  baseUrl: 'http://localhost:8080/api',
  /** Tiempo máximo de espera por petición (ms). */
  timeoutMs: 5000,
}
