# Archivos del proyecto

Descripción de cada archivo fuente. Ordenados por responsabilidad.

## Entrada y configuración

| Archivo | Descripción |
| --- | --- |
| `index.html` | HTML raíz. Idioma `es`, título "Portal de Mantenimiento Minero", punto de montaje `#root`. |
| `vite.config.ts` | Configuración de Vite: plugins de React y Tailwind CSS. |
| `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` | Configuración de TypeScript (modo estricto para la app). |
| `.oxlintrc.json` | Reglas de Oxlint: react, typescript, oxc. |
| `src/main.tsx` | Punto de entrada. Monta `<App />` dentro de `<BrowserRouter>` y `<AuthProvider>`, con `StrictMode`. |
| `src/index.css` | Import de Tailwind (`@import "tailwindcss"`) y tokens de tema con `@theme`. Base `#root` a altura completa. |

## Núcleo de la app

| Archivo | Descripción |
| --- | --- |
| `src/App.tsx` | Definición de rutas. `/login` y `/registro` públicas; el resto protegidas con `RequiereAuth` y `RequierePermiso`. La ruta `*` va a `NotFoundPage`. |
| `src/layouts/MainLayout.tsx` | Layout principal: sidebar fija (overlay en móvil) filtrada por permisos, header con título, usuario y botón de cerrar sesión, y `<Outlet />` para el contenido. |

## Componentes reutilizables

| Archivo | Descripción |
| --- | --- |
| `src/components/StatusBadge.tsx` | Badge de estado con punto de color. Recibe `label`, `tone` y `dot`. |
| `src/components/StatCard.tsx` | Tarjeta de KPI: título, valor, subtítulo e icono de Lucide. |
| `src/components/PageHeader.tsx` | Encabezado de página con título, descripción y zona de acciones. |
| `src/components/LoadState.tsx` | Indicador de carga (spinner) o de error al obtener datos. |
| `src/components/Modal.tsx` | Diálogo modal reutilizable (título, botón cerrar, ancho) para los formularios de los mantenedores. |
| `src/components/GoogleModal.tsx` | Selector de cuentas simulado de Google (OAuth) + `GoogleLogo`. |
| `src/components/TemaToggle.tsx` | Botón para alternar entre modo claro y oscuro (sol/luna). |
| `src/components/RequerirAcceso.tsx` | Guards `RequiereAuth` (sesión) y `RequierePermiso` (permiso de vista). |

## Páginas

| Archivo | Descripción |
| --- | --- |
| `src/pages/LoginPage.tsx` | Página pública de login: botón "Continuar con Google" (abre el modal) y formulario local con email/contraseña. |
| `src/pages/RegistroPage.tsx` | Registro público: nombre, email y contraseña. La cuenta se crea siempre con rol `visita` (el administrador asigna más permisos luego). |
| `src/pages/DashboardPage.tsx` | KPIs (flota, órdenes abiertas, bajo stock, costo del mes) + listas de órdenes abiertas y equipos fuera de servicio. Carga datos vía servicios. |
| `src/pages/MaquinariaPage.tsx` | Tabla de equipos con búsqueda por texto y filtros de estado/categoría. Botón "Registrar equipo" visible solo si el usuario tiene un rol con escritura. |
| `src/pages/InventarioPage.tsx` | Tabla de repuestos, filtro "solo bajo stock" y alerta de repuestos críticos. Botón de alta solo con rol de escritura. |
| `src/pages/OrdenesPage.tsx` | Tabla de órdenes con búsqueda y filtro por estado; ordenadas por fecha de solicitud. Botón de alta solo con rol de escritura. |
| `src/pages/CostosPage.tsx` | Tarjetas de totales y barras mensuales mano de obra / repuestos. Carga vía `listarCostosMensuales`. |
| `src/pages/ConfiguracionPage.tsx` | Mantenedores del sistema: tabs de Usuarios y Roles. |
| `src/pages/AccesoDenegadoPage.tsx` | Página 403 cuando los roles del usuario no dan permiso para la vista. |
| `src/pages/NotFoundPage.tsx` | Página 404 con enlace de regreso al dashboard. |

## Mantenedores de Configuración

| Archivo | Descripción |
| --- | --- |
| `src/pages/configuracion/UsuariosMantenedor.tsx` | Listado de usuarios con roles, proveedor y estado; acciones editar/eliminar (borrado en dos pasos) y alta de usuario. |
| `src/pages/configuracion/UsuarioFormulario.tsx` | Alta/edición de usuario: nombre, email, contraseña (opcional al editar), roles con checkboxes y estado activo. |
| `src/pages/configuracion/RolesMantenedor.tsx` | Listado de roles con ventanas, escritura, miembros y badge de sistema; acciones editar/eliminar y alta de rol. |
| `src/pages/configuracion/RolFormulario.tsx` | Alta/edición de rol: nombre, ventanas de acceso, flag de escritura y selección de miembros (quién pertenece al rol). |

## Seguridad (auth)

| Archivo | Descripción |
| --- | --- |
| `src/types/auth.ts` | Tipos de autenticación: `Rol` (dinámico, con `vistas` y `escribir`), `Vista`, `Usuario` (con `roles: string[]`, multi-rol), `RegistroDatos`, `DatosUsuario`, `ResultadoAuth`. |
| `src/auth/permisos.ts` | Helpers sobre roles dinámicos: `VISTAS`, `NOMBRES_VISTA`, `tienePermiso(roles, usuario, vista)`, `puedeEscribir(roles, usuario)`, `nombresRoles`. |
| `src/auth/contexto.ts` | Contexto de autenticación y hook `useAuth`: expone sesión, roles, usuarios y las operaciones de los mantenedores. |
| `src/auth/AuthProvider.tsx` | Proveedor de sesión (login local, login Google, registro, cierre) + CRUD de usuarios y roles con salvaguardas (no quedarse sin acceso a Configuración, no eliminar roles de sistema ni cuentas demo). |
| `src/auth/almacen.ts` | Persistencia en `localStorage` de roles y usuarios (claves `auth.roles`, `auth.cuentas`, `auth.sesion`), con migración del formato antiguo de un solo rol. |

## Capa de datos (servicios)

| Archivo | Descripción |
| --- | --- |
| `src/services/config.ts` | Configuración de conexión: flag `enabled` (usa backend o no), `baseUrl` y timeout. Es el único lugar que se toca para conectar el backend. |
| `src/services/apiClient.ts` | Cliente HTTP basado en `fetch` (`httpGet`, `httpPost`, `httpPut`, `httpDelete`) y `conFallback`, que usa datos estáticos si el backend no responde. |
| `src/services/equiposService.ts` | CRUD de equipos con fallback al mock. |
| `src/services/repuestosService.ts` | CRUD de repuestos con fallback al mock. |
| `src/services/ordenesService.ts` | CRUD de órdenes de mantenimiento con fallback al mock. |
| `src/services/costosService.ts` | Costos mensuales (solo lectura) con fallback al mock. |
| `src/hooks/useRecurso.ts` | Hook genérico que ejecuta un servicio y expone `{ datos, cargando, error }`. La función pasada debe ser estable (función de módulo o `useCallback`). |
| `src/hooks/useTema.ts` | Hook para el modo claro/oscuro: lee/prefiere preferencia del sistema, alterna `.dark` en `<html>` y persiste en `localStorage`. |

## Datos y lógica

| Archivo | Descripción |
| --- | --- |
| `src/types/domain.ts` | Tipos del dominio (`Equipo`, `Repuesto`, `OrdenMantenimiento`, `CostoResumen`, enums) y sus diccionarios de nombres en español. |
| `src/types/auth.ts` | Tipos de autenticación (descritos en la sección Seguridad). |
| `src/data/mock.ts` | Datos estáticos de respaldo: 8 equipos, 8 repuestos, 8 órdenes y 6 meses de costos. Se usan cuando el backend no está activo. |
| `src/utils/tones.ts` | Helpers `equipoTone`, `ordenTone`, `prioridadTone` y el tipo `BadgeTone`. Se mantienen aparte para respetar el Fast Refresh de React. |

## Documentación

| Archivo | Descripción |
| --- | --- |
| `docs/backend-api.md` | Contrato de la API REST que debe implementar el backend (rutas, payloads, ejemplos, autenticación). |
| `docs/auth.md` | Autenticación y permisos: roles, credenciales demo, OAuth y cómo conectar el backend. |
