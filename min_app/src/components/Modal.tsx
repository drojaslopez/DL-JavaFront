import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  titulo: string
  onCerrar: () => void
  children: ReactNode
  ancho?: 'md' | 'lg'
}

/** Diálogo modal reutilizable para los formularios de los mantenedores. */
export function Modal({ titulo, onCerrar, children, ancho = 'md' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
      onClick={onCerrar}
    >
      <div
        className={`my-8 w-full ${ancho === 'lg' ? 'max-w-2xl' : 'max-w-md'} rounded-xl bg-white shadow-xl dark:bg-gray-800`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{titulo}</h3>
          <button
            type="button"
            aria-label="Cerrar"
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            onClick={onCerrar}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
