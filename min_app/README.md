# Portal de Mantenimiento Minero

Sistema de gestión de mantenimiento para flota minera de equipo pesado. Permite controlar
maquinaria, inventario de repuestos, órdenes de mantenimiento y los costos asociados, todo
en un solo panel operativo.

> Construido para que el superintendente sepa quién, qué y cuánto le cuesta mantener la
> flota. Si un equipo se detiene, que sea por mantención programada y no por sorpresa.
>
> Incluye modo claro/oscuro con toggle en la barra superior. La preferencia se guarda en
> `localStorage` y por defecto respeta la del sistema.

## Módulos

| Módulo | Ruta | Descripción |
| --- | --- | --- |
| Dashboard | `/` | KPIs de la operación: flota, órdenes abiertas, stock y costos. |
| Maquinaria | `/maquinaria` | Flota de equipos con filtros por estado y categoría. |
| Inventario | `/inventario` | Repuestos, stock y alertas de reposición. |
| Órdenes de Mantenimiento | `/ordenes` | Trabajos preventivos, correctivos y predictivos. |
| Costos | `/costos` | Evolución mensual de mano de obra y repuestos. |
| Configuración | `/configuracion` | Parámetros del sistema (en construcción). |

## Documentación

- [Índice de documentación](docs/README.md)
- [Stack tecnológico](docs/stack-tecnologico.md)
- [Estructura del proyecto](docs/estructura.md)
- [Modelo de datos](docs/modelo-datos.md)
- [Autenticación y permisos](docs/auth.md)
- [Archivos del proyecto](docs/archivos.md)
- [Contrato del backend](docs/backend-api.md)

## Acceso y roles

El portal exige iniciar sesión para todo. Hay login local (con registro, que siempre crea
cuentas de **visita**) y un botón de **Continuar con Google** (simulado por ahora, listo
para OAuth real con el backend).

Los **roles son dinámicos**: se administran desde Configuración → Roles (ventanas de acceso,
escritura y miembros), y un **usuario puede tener más de un rol**. Roles de sistema:

| Rol | Acceso | Escritura |
| --- | --- | --- |
| **administrador** | Todas las vistas. | Sí |
| **administrativo** | Todo menos Configuración. | No |
| **visita** | Solo Dashboard y Costos. | No |

Cuentas demo (detalle en [docs/auth.md](docs/auth.md)): `admin@mineria.cl / admin123`,
`administrativo@mineria.cl / adm123`, `visita@mineria.cl / visita123`. En Configuración →
Usuarios puedes crear usuarios y cambiar perfiles (por ejemplo, el del administrador).

## Datos y backend

El frontend usa una capa de servicios (`src/services/`) que deja listo el puente con un
backend REST futuro. Los métodos que debe implementar el backend están en
[`docs/backend-api.md`](docs/backend-api.md).

Para conectar el backend:

1. Implementa los endpoints documentados.
2. En `src/services/config.ts`:
   - `baseUrl` → URL de tu API (ej. `http://localhost:8080/api`).
   - `enabled` → cámbialo a `true`.

Si `enabled` es `false` (o el backend no responde), la app usa automáticamente los datos
estáticos de `src/data/mock.ts` — la flota nunca se queda sin números.

## Requisitos

- Node.js 20+ (o el que Vite 8 te pida, que seguro es el más nuevo).
- npm instalado.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Scripts

| Script | Comando | Qué hace |
| --- | --- | --- |
| Desarrollo | `npm run dev` | Servidor de desarrollo con HMR. |
| Build | `npm run build` | Typecheck (`tsc -b`) + build de producción (`vite build`). |
| Lint | `npm run lint` | Oxlint sobre todo el código. |
| Preview | `npm run preview` | Sirve el build de producción localmente. |

## Estado actual

Frontend funcional con carga de datos dinámica: la capa de servicios (`src/services/`) está
lista y documentada para consumir el backend REST cuando exista; hoy usa datos estáticos
(`enabled: false`). La autenticación usa cuentas y roles guardados en `localStorage`, con
mantenedores de usuarios y roles en Configuración. Los formularios de alta/edición de
equipos, repuestos y órdenes (CRUD en la UI) siguen pendientes.
