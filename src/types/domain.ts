export type EstadoEquipo =
  | 'operativo'
  | 'en_mantenimiento'
  | 'fuera_de_servicio'
  | 'baja'

export type TipoMantenimiento = 'preventivo' | 'correctivo' | 'predictivo'

export type EstadoOrden =
  | 'pendiente'
  | 'en_proceso'
  | 'completada'
  | 'cancelada'

export type Prioridad = 'baja' | 'media' | 'alta' | 'critica'

export type CategoriaEquipo =
  | 'camion_minero'
  | 'cargador'
  | 'excavadora'
  | 'perforadora'
  | 'bulldozer'
  | 'molino'
  | 'chancador'

export interface Equipo {
  id: string
  codigo: string
  nombre: string
  marca: string
  modelo: string
  categoria: CategoriaEquipo
  estado: EstadoEquipo
  horasOperacion: number
  ubicacion: string
  fechaAdquisicion: string
  anioFabricacion: number
}

export interface Repuesto {
  id: string
  codigo: string
  nombre: string
  categoria: string
  proveedor: string
  stockActual: number
  stockMinimo: number
  costoUnitario: number
  ubicacion: string
}

export interface OrdenMantenimiento {
  id: string
  numero: string
  equipoId: string
  tipo: TipoMantenimiento
  prioridad: Prioridad
  estado: EstadoOrden
  descripcion: string
  tecnico: string
  fechaSolicitud: string
  fechaInicio: string | null
  fechaFin: string | null
  costoManoObra: number
  costoRepuestos: number
}

export interface CostoResumen {
  mes: string
  manoObra: number
  repuestos: number
  total: number
}

export const NOMBRES_ESTADO_EQUIPO: Record<EstadoEquipo, string> = {
  operativo: 'Operativo',
  en_mantenimiento: 'En mantenimiento',
  fuera_de_servicio: 'Fuera de servicio',
  baja: 'Baja',
}

export const NOMBRES_ESTADO_ORDEN: Record<EstadoOrden, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completada: 'Completada',
  cancelada: 'Cancelada',
}

export const NOMBRES_CATEGORIA_EQUIPO: Record<CategoriaEquipo, string> = {
  camion_minero: 'Camión minero',
  cargador: 'Cargador',
  excavadora: 'Excavadora',
  perforadora: 'Perforadora',
  bulldozer: 'Bulldozer',
  molino: 'Molino',
  chancador: 'Chancador',
}

export const NOMBRES_PRIORIDAD: Record<Prioridad, string> = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  critica: 'Crítica',
}
