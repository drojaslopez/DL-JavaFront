import { useState, useEffect, useCallback } from 'react'

export type Modo = 'claro' | 'oscuro'

const CLAVE_TEMA = 'portal.tema'

function preferenciaInicial(): Modo {
  const guardado = localStorage.getItem(CLAVE_TEMA)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

export function useTema() {
  const [modo, setModo] = useState<Modo>(preferenciaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', modo === 'oscuro')
    localStorage.setItem(CLAVE_TEMA, modo)
  }, [modo])

  const alternar = useCallback(() => {
    setModo((prev) => (prev === 'claro' ? 'oscuro' : 'claro'))
  }, [])

  return { modo, alternar }
}
