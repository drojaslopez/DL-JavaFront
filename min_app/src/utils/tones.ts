import type { EstadoEquipo, EstadoOrden, Prioridad } from '../types/domain'

export type BadgeTone = 'gray' | 'green' | 'amber' | 'red' | 'blue' | 'purple'

export function equipoTone(estado: EstadoEquipo): BadgeTone {
  switch (estado) {
    case 'operativo':
      return 'green'
    case 'en_mantenimiento':
      return 'amber'
    case 'fuera_de_servicio':
      return 'red'
    case 'baja':
      return 'gray'
  }
}

export function ordenTone(estado: EstadoOrden): BadgeTone {
  switch (estado) {
    case 'pendiente':
      return 'amber'
    case 'en_proceso':
      return 'blue'
    case 'completada':
      return 'green'
    case 'cancelada':
      return 'gray'
  }
}

export function prioridadTone(prioridad: Prioridad): BadgeTone {
  switch (prioridad) {
    case 'baja':
      return 'gray'
    case 'media':
      return 'blue'
    case 'alta':
      return 'amber'
    case 'critica':
      return 'red'
  }
}
