# Portal de Mantenimiento Minero — Especificaciones Técnicas

Estatus: **Aprobado** · Ámbito: Arquitectura e implementación del front-end y
contrato con el backend REST.

## 1. Arquitectura general

- **SPA** construida con **React 19**, **Vite 8** y **TypeScript 6** en modo
  estricto.
- **Tailwind CSS 4** para estilos, configurado por CSS (`@theme`) sin
  `tailwind.config`. Vite exige el plugin `@tailwindcss/vite` en
  `vite.config.ts`.
- **Enrutamiento** con **react-router-dom 7** y rutas protegidas por un
  layout de autenticación.
- **Iconos**: **lucide-react** (imports verificados contra la versión
  instalada).
- **Estado**: contexto de React (`AuthProvider`) para sesión, usuarios y roles.
  Los datos de dominio se cargan con hooks y servicios.
- **Capa de datos desacoplada**: los servicios consultan un backend REST; si
  `API_CONFIG.enabled = false` (o la petición falla), usan los datos estáticos
  de `src/data/mock.ts`. Esto permite conectar el backend Java sin tocar la
  interfaz.

```
┌─────────────────────────── UI (React) ───────────────────────────┐
│  Páginas ─► hooks (useRecurso) ─► services (equipos/repuestos…)  │
│  AuthContext (sesión, usuarios, roles)    useTema (claro/oscuro) │
└───────────────────────────┬──────────────────────────────────────┘
                            │ API_CONFIG.enabled
                 ┌──────────┴──────────┐
                 ▼                     ▼
          Backend REST (Java)   Datos estáticos (mock)
          /api/...              + fallback automático [API]
```

## 2. Estructura de carpetas

```
min_app/
├─ index.html
├─ vite.config.ts          # plugins: react + @tailwindcss/vite
├─ src/
│  ├─ main.tsx             # init síncrono del tema + render de la App
│  ├─ App.tsx              # definición de rutas (públicas y protegidas)
│  ├─ index.css            # @theme, @custom-variant dark, utilidades
│  ├─ types/               # auth.ts (Vista, Rol, Usuario, DatosUsuario)
│  ├─ data/mock.ts         # datos estáticos de dominio
│  ├─ auth/                # permisos.ts, almacen.ts, contexto.ts, AuthProvider.tsx
│  ├─ services/            # config.ts, apiClient.ts, *Service.ts
│  ├─ hooks/               # useRecurso.ts, useTema.ts
│  ├─ components/          # Modal, LoadState, TemaToggle, RequerirAcceso, GoogleModal
│  ├─ layouts/MainLayout.tsx
│  └─ pages/               # Login, Registro, AccesoDenegado, Dashboard,
│                          # Maquinaria, Inventario, Ordenes, Costos,
│                          # Configuracion + configuracion/ (mantenedores)
```

Detalle completo de archivos en `docs/archivos.md` y `docs/estructura.md`.

## 3. Modelo de datos

### 3.1 Autenticación y roles (`types/auth.ts`)

```ts
type Vista = 'dashboard' | 'maquinaria' | 'inventario' | 'ordenes' |
             'costos' | 'configuracion'

interface Rol { id: string; nombre: string; vistas: Vista[];
                escribir: boolean; sistema?: boolean }

interface Usuario { id: string; nombre: string; email: string;
                    roles: string[]; proveedor: 'google' | 'local';
                    activo: boolean }

interface RegistroDatos { nombre: string; email: string; password: string }
interface DatosUsuario { nombre: string; email: string; password?: string;
                         roles: string[]; activo: boolean }
```

- Los permisos se resuelven por **unión de roles** (`tienePermiso`,
  `puedeEscribir`, `nombresRoles` en `auth/permisos.ts`).
- Roles de sistema: `administrador` (todas + escritura), `administrativo`
  (todas menos config, solo lectura), `visita` (dashboard + costos, solo
  lectura).

### 3.2 Persistencia en `localStorage`

| Clave            | Contenido                                    |
|------------------|----------------------------------------------|
| `auth.sesion`    | sesión del usuario autenticado               |
| `auth.cuentas`   | usuarios (merge con CUENTAS_INICIALES)       |
| `auth.roles`     | roles (merge con ROLES_INICIALES)            |
| `portal.tema`    | tema: `'claro'` \| `'oscuro'`                |

- **Migración**: `normalizarCuenta` convierte el formato legado
  (`rol: 'administrador'`) a `roles: ['administrador']`; `leerCuentas` y
  `leerRoles` hacen merge entre datos iniciales y almacenados.
- **Guardián anti-lockout** en `AuthProvider`: no se permite guardar/eliminar
  un rol, ni editar un usuario, si la operación dejaría al administrador activo
  sin acceso a `configuracion`. Las cuentas demo (`IDS_DEMO`) tienen reglas
  propias de eliminación.

## 4. Autenticación y sesión

- `AuthProvider` expone: sesión, login, logout, registro (solo `visita`),
  y CRUD de usuarios y roles.
- **Login local**: verifica email/contraseña contra `localStorage`
  (o backend en producción), valida cuenta activa.
- **Registro**: crea cuentas solo con rol `visita`; sin selector de rol.
- **Google (simulado)**: modal con cuentas demo; en producción el backend
  valida el token OAuth y devuelve identidad.
- **Rutas**:
  - Públicas: `/login`, `/registro`.
  - Protegidas: el resto bajo `RequiereAuth` + `RequierePermiso`.
  - `/acceso-denegado` para usuarios sin permiso de la vista.
  - Ruta raíz `/`: redirige a la primera vista permitida.

## 5. Capa de servicios y backend REST

### 5.1 `services/config.ts`

```ts
export const API_CONFIG = {
  enabled: false,                 // flag maestro
  baseUrl: 'http://localhost:8080/api',
  timeoutMs: 5000,
}
```

### 5.2 Patrón `apiClient.ts`

`conFallback(servicio, ruta, mock)` intenta el backend cuando
`enabled = true`; ante fallo (red, timeout, HTTP != 2xx) cae al `mock` y loguea
`[API]`. Cada servicio (`equiposService`, `repuestosService`,
`ordenesService`, `costosService`) expone operaciones CRUD con esta envoltura.
`useRecurso` provee estado de carga, datos y recarga (`cargar` estable vía
`useCallback`).

### 5.3 Contrato REST (resumen)

Documentado íntegramente en `docs/backend-api.md`:

| Recurso            | Endpoints REST                                   |
|--------------------|--------------------------------------------------|
| Auth               | `POST /api/auth/login`, `POST /api/auth/registro`|
| Maquinaria         | `GET/POST /api/equipos`, `PUT/DELETE /api/equipos/:id` |
| Repuestos          | `GET/POST /api/repuestos`, `PUT/DELETE /api/repuestos/:id` |
| Órdenes            | `GET/POST /api/ordenes`, `PUT/DELETE /api/ordenes/:id` |
| Costos             | `GET/POST /api/costos`                            |
| Usuarios / Roles   | `GET/POST/PUT/DELETE /api/usuarios`, `/api/roles` |

Formato de error estándar: `{ status, mensaje }` con códigos HTTP apropiados
(400, 401, 403, 404, 409, 500).

## 6. Estilos y tema

- **Tailwind 4 vía CSS**: `@theme` define tokens; `@custom-variant dark
  (&:where(.dark, .dark *));` habilita variantes `dark:`.
- **`useTema`**: lee `localStorage` (`portal.tema`) y `prefers-color-scheme` en
  orden, expone `tema`, `alternarTema`, `aplicarTema`.
- **Sin parpadeo**: `main.tsx` aplica la clase `dark` al `<html>` de forma
  síncrona antes del primer render.
- **`TemaToggle`**: botón sol/luna en el header del layout.

## 7. Configuración (mantenedores)

- **Usuarios**: `UsuariosMantenedor` + `UsuarioFormulario` (asignación
  multi-rol con checkboxes, activo/inactivo, contraseña opcional al editar).
- **Roles**: `RolesMantenedor` + `RolFormulario` (vistas, flag de escritura,
  miembros). `sincronizarMiembros` actualiza los usuarios al guardar.
- **Guardas**: se valida la pérdida de acceso del admin activo; al eliminar un
  rol se remueve de los usuarios (`eliminarRolDeUsuarios`).

## 8. Calidad y verificación

- `npm run build` ejecuta `tsc -b` + `vite build` (0 errores esperados).
- `npm run lint` ejecuta `oxlint` (reglas estrictas: hooks,
  exports de componentes).
- Estructura y responsabilidades por archivo en `docs/archivos.md`.
