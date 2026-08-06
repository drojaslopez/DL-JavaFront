import { LoaderCircle, ServerOff } from 'lucide-react'

interface LoadStateProps {
  cargando: boolean
  error: string | null
}

export function LoadState({ cargando, error }: LoadStateProps) {
  if (cargando) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-500 dark:text-gray-400">
        <LoaderCircle className="size-5 animate-spin" />
        Cargando datos...
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        <ServerOff className="mt-0.5 size-4 shrink-0" />
        <div>
          <p className="font-medium">No se pudieron cargar los datos</p>
          <p className="mt-0.5">{error}</p>
        </div>
      </div>
    )
  }
  return null
}
