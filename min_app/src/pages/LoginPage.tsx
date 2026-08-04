import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HardHat, LogIn, Mail } from 'lucide-react'
import { useAuth } from '../auth/contexto'
import { GoogleLogo, GoogleModal } from '../components/GoogleModal'
import { TemaToggle } from '../components/TemaToggle'

export default function LoginPage() {
  const { iniciarSesionLocal } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [googleAbierto, setGoogleAbierto] = useState(false)

  const desde = (location.state as { desde?: string } | null)?.desde ?? '/'

  const enviar = (e: FormEvent) => {
    e.preventDefault()
    const resultado = iniciarSesionLocal(email, password)
    if (!resultado.ok) {
      setError(resultado.mensaje ?? 'Error al iniciar sesión.')
      return
    }
    navigate(desde, { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="absolute right-4 top-4">
        <TemaToggle />
      </div>
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-amber-400 text-gray-900">
            <HardHat className="size-7" />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            Portal de Mantenimiento Minero
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Inicia sesión para continuar</p>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          onClick={() => setGoogleAbierto(true)}
        >
          <GoogleLogo />
          Continuar con Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          o con tu cuenta del portal
          <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@mineria.cl"
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <LogIn className="size-4" />
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Regístrate
          </Link>
        </p>
      </div>

      {googleAbierto && <GoogleModal onCerrar={() => setGoogleAbierto(false)} />}
    </div>
  )
}
