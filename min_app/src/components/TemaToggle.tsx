import { Moon, Sun } from 'lucide-react'
import { useTema } from '../hooks/useTema'

export function TemaToggle() {
  const { modo, alternar } = useTema()

  return (
    <button
      type="button"
      onClick={alternar}
      title={modo === 'claro' ? 'Modo oscuro' : 'Modo claro'}
      aria-label={modo === 'claro' ? 'Activar modo oscuro' : 'Activar modo claro'}
      className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
    >
      {modo === 'claro' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
    </button>
  )
}
