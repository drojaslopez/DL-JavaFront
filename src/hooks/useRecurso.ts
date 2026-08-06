import { useEffect, useState } from 'react'

export interface EstadoRecurso<T> {
  datos: T[]
  cargando: boolean
  error: string | null
}

/**
 * Carga asíncrona de un listado de recursos.
 *
 * @param cargar Función que devuelve la Promesa del listado (un servicio).
 *
 * IMPORTANTE: `cargar` debe ser estable para que el efecto se ejecute una sola
 * vez. Pasa la función de módulo directamente (`useRecurso(listarEquipos)`) o
 * envuélvela con `useCallback` si necesita dependencias. No pases funciones
 * inline creadas en cada render o recargarás en bucle.
 *
 * Uso:
 *   const { datos, cargando, error } = useRecurso(listarEquipos)
 */
export function useRecurso<T>(cargar: () => Promise<T[]>): EstadoRecurso<T> {
  const [datos, setDatos] = useState<T[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let activo = true
    setCargando(true)
    cargar()
      .then((resultado) => {
        if (activo) {
          setDatos(resultado)
          setError(null)
        }
      })
      .catch((motivo: unknown) => {
        if (activo) {
          setError(motivo instanceof Error ? motivo.message : 'Error desconocido')
        }
      })
      .finally(() => {
        if (activo) setCargando(false)
      })
    return () => {
      activo = false
    }
  }, [cargar])

  return { datos, cargando, error }
}
