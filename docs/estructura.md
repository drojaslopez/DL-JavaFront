# Estructura del proyecto

Organización de `src/` y cómo fluyen los datos y la navegación.

## Árbol de directorios

```
src/
├── main.tsx                 # Punto de entrada: monta <App /> con BrowserRouter + AuthProvider
├── App.tsx                  # Definición de rutas (públicas y protegidas)
├── index.css                # Import de Tailwind + tokens de tema (@theme)
│
├── layouts/
│   └── MainLayout.tsx       # Layout principal: sidebar filtrada por rol + header con usuario
│
├── components/              # Componentes reutilizables de UI
│   ├── StatusBadge.tsx      # Badge de estado con punto de color
│   ├── StatCard.tsx         # Tarjeta de KPI con icono
│   ├── PageHeader.tsx       # Encabezado de página (título + descripción + acciones)
│   ├── LoadState.tsx        # Indicador de carga / error al traer datos
│   ├── Modal.tsx            # Diálogo modal reutilizable (mantenedores)
│   ├── TemaToggle.tsx       # Botón de alternar modo claro/oscuro
│   ├── GoogleModal.tsx      # Simulación del selector de cuentas de Google (OAuth)
│   └── RequerirAcceso.tsx   # Guards: RequiereAuth y RequierePermiso
│
├── pages/                   # Una página por módulo
│   ├── LoginPage.tsx
│   ├── RegistroPage.tsx     # Registro: la cuenta se crea siempre como visita
│   ├── DashboardPage.tsx
│   ├── MaquinariaPage.tsx
│   ├── InventarioPage.tsx
│   ├── OrdenesPage.tsx
│   ├── CostosPage.tsx
│   ├── ConfiguracionPage.tsx    # Tabs de mantenedores (usuarios / roles)
│   ├── AccesoDenegadoPage.tsx
│   ├── NotFoundPage.tsx
│   └── configuracion/            # Mantenedores de Configuración
│       ├── UsuariosMantenedor.tsx  # Listado y acciones de usuarios
│       ├── UsuarioFormulario.tsx   # Alta/edición de usuario (roles multi-selección)
│       ├── RolesMantenedor.tsx     # Listado y acciones de roles
│       └── RolFormulario.tsx       # Alta/edición de rol (ventanas + miembros)
│
├── hooks/
│   ├── useRecurso.ts        # Hook genérico: carga un listado con estados loading/error
│   └── useTema.ts           # Hook de tema: alterna modo claro/oscuro y persiste preferencia
│
├── auth/                    # Seguridad y sesión
│   ├── contexto.ts          # Contexto de auth + hook useAuth (sesión, roles, usuarios)
│   ├── AuthProvider.tsx     # Proveedor: sesión + CRUD de usuarios y roles
│   ├── permisos.ts          # Helpers: tienePermiso, puedeEscribir, nombresRoles
│   └── almacen.ts           # Roles y usuarios en localStorage (con migración)
│
├── services/                # Capa de datos: puente con el backend
│   ├── config.ts            # Flag de conexión + URL base + timeout
│   ├── apiClient.ts         # Cliente HTTP (fetch) + fallback a datos estáticos
│   ├── equiposService.ts    # CRUD de equipos (usa /api/equipos)
│   ├── repuestosService.ts  # CRUD de repuestos (usa /api/repuestos)
│   ├── ordenesService.ts    # CRUD de órdenes (usa /api/ordenes-mantenimiento)
│   └── costosService.ts     # Costos mensuales (usa /api/costos/mensuales)
│
├── types/
│   ├── domain.ts            # Tipos del dominio + diccionarios en español
│   └── auth.ts              # Tipos de auth: Rol (dinámico), Vista, Usuario (multi-rol)
│
├── data/
│   └── mock.ts              # Datos estáticos de respaldo (usados si no hay backend)
│
└── utils/
    └── tones.ts             # Funciones helper: tono de color por estado/prioridad
```

## Flujo de navegación

1. `main.tsx` monta `<BrowserRouter>` con `<AuthProvider>` y `<App />`.
2. `App.tsx` define las rutas. `/login` y `/registro` son públicas; el resto cuelga de
   `RequiereAuth` (sin sesión → `/login`) y cada ruta se envuelve en `RequierePermiso`
   (sin permiso → `/acceso-denegado`).
3. `MainLayout` pinta la sidebar (fija en escritorio, overlay en móvil) filtrando los
   enlaces según los permisos del usuario, y el header con el título de la ruta activa,
   el usuario y sus roles. La navegación usa `NavLink` y la ruta `*` cae en `NotFoundPage`.

Detalle de seguridad en [auth.md](auth.md).

## Flujo de datos

1. Las páginas cargan sus datos con el hook `useRecurso`, pasando la función de un
   servicio (ej. `listarEquipos`). El hook expone `{ datos, cargando, error }`.
2. Cada servicio intenta el backend a través de `apiClient` (fetch). Si
   `API_CONFIG.enabled` es `false`, o la petición falla, `conFallback` devuelve los datos
   de `src/data/mock.ts` y avisa en consola.
3. Las páginas filtran/computan localmente con `useMemo` sobre `datos`.
4. Mientras `cargando`, se muestra `<LoadState />`; si `error`, se muestra el mensaje.

El contrato del backend (rutas y payloads) está en [backend-api.md](backend-api.md).
Para conectar el back: implementar los endpoints, ajustar `baseUrl` y poner
`enabled: true` en `src/services/config.ts`.

## Convenciones de archivos

- Nombres de componentes en `PascalCase.tsx`.
- Páginas con sufijo `Page`.
- Un componente o página por archivo.
- Import de tipos con `import type { ... }` (obligado por `verbatimModuleSyntax`).
- Los servicios no hablan con la UI: devuelven `Promise<T>` y las páginas los consumen.
