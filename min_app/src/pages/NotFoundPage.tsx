import { Link } from 'react-router-dom'
import { HardHat } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center text-center">
      <HardHat className="size-12 text-gray-300 dark:text-gray-600" />
      <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">404</h2>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Esta página se perdió, probablemente junto a la llave del 24.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Volver al dashboard
      </Link>
    </div>
  )
}
