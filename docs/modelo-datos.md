# Modelo de datos

Entidades del dominio definidas en `src/types/domain.ts` y los datos de ejemplo en
`src/data/mock.ts`.

## Entidades

### Equipo

Máquina o activo de la flota.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` | `string` | Identificador único. |
| `codigo` | `string` | Código interno (ej. `CM-001`). |
| `nombre` | `string` | Nombre comercial (ej. "Camión Komatsu 930E"). |
| `marca` / `modelo` | `string` | Marca y modelo del fabricante. |
| `categoria` | `CategoriaEquipo` | camion_minero, cargador, excavadora, perforadora, bulldozer, molino, chancador. |
| `estado` | `EstadoEquipo` | operativo, en_mantenimiento, fuera_de_servicio, baja. |
| `horasOperacion` | `number` | Horómetro acumulado. |
| `ubicacion` | `string` | Faena o taller donde se encuentra. |
| `fechaAdquisicion` | `string` | Fecha ISO de compra. |
| `anioFabricacion` | `number` | Año de fabricación. |

### Repuesto

Parte o insumo del inventario.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` / `codigo` | `string` | Identificador y código interno. |
| `nombre` | `string` | Descripción de la parte. |
| `categoria` | `string` | Familia (filtros, frenos, lubricantes, etc.). |
| `proveedor` | `string` | Proveedor de origen. |
| `stockActual` / `stockMinimo` | `number` | Cantidad en bodega y mínimo de reposición. |
| `costoUnitario` | `number` | Costo en CLP. |
| `ubicacion` | `string` | Bodega o sector de almacenaje. |

> Regla de negocio: si `stockActual <= stockMinimo` se considera **bajo stock** y dispara
> alerta de reposición.

### OrdenMantenimiento

Trabajo de mantención sobre un equipo.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `id` / `numero` | `string` | Identificador y número de orden (ej. `OM-2026-001`). |
| `equipoId` | `string` | Referencia al `Equipo` atendido. |
| `tipo` | `TipoMantenimiento` | preventivo, correctivo, predictivo. |
| `prioridad` | `Prioridad` | baja, media, alta, critica. |
| `estado` | `EstadoOrden` | pendiente, en_proceso, completada, cancelada. |
| `descripcion` | `string` | Detalle del trabajo. |
| `tecnico` | `string` | Responsable asignado. |
| `fechaSolicitud` | `string` | Fecha de creación (ISO). |
| `fechaInicio` / `fechaFin` | `string \| null` | Fechas reales de ejecución. |
| `costoManoObra` / `costoRepuestos` | `number` | Costos en CLP. |

### CostoResumen

Agregado mensual para la vista de costos.

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `mes` | `string` | Etiqueta del mes (ej. "Jul"). |
| `manoObra` / `repuestos` | `number` | Total del mes por concepto, en CLP. |
| `total` | `number` | Suma de ambos. |

## Enumeraciones

Valores y sus etiquetas en español, centralizados en `domain.ts`:

- `EstadoEquipo` → `NOMBRES_ESTADO_EQUIPO`
- `EstadoOrden` → `NOMBRES_ESTADO_ORDEN`
- `CategoriaEquipo` → `NOMBRES_CATEGORIA_EQUIPO`
- `Prioridad` → `NOMBRES_PRIORIDAD`

## Relaciones

```
Equipo 1 ── * OrdenMantenimiento
```

Una orden pertenece a un solo equipo (`equipoId`). En el mock las órdenes referencian a los
equipos; las páginas hacen el `find` para desplegar el nombre del equipo. No existe aún
relación formal entre `Repuesto` y `OrdenMantenimiento` (los repuestos usados no se registran
por orden).
