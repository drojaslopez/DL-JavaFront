# Autenticación y permisos

Cómo funciona la seguridad del portal, los roles y los mantenedores de Configuración.

## Tema claro/oscuro

El portal incluye un interruptor de tema en la barra superior (al lado del usuario) y en
las páginas de login/registro. Se persiste en `localStorage` (`portal.tema`). Por defecto
respeta la preferencia del sistema operativo del usuario. El toggle usa `dark:` variants de
Tailwind y añade la clase `.dark` al elemento `<html>`.

## Modelo de acceso

Todas las vistas requieren sesión iniciada. Cada vista exige permiso, y ese permiso viene
de los **roles** del usuario:

- Un **rol** se define con las **ventanas a las que da acceso** y si permite **escribir**
  (crear/editar). Los roles se administran desde Configuración → Roles.
- Un **usuario puede pertenecer a más de un rol**; el acceso se acumula: ve una vista si
  al menos uno de sus roles la concede, y puede escribir si al menos uno lo permite.

### Roles de sistema

Vienen creados por defecto y no se pueden eliminar, pero sí editar (nombre, ventanas y
escritura):

| Rol | Acceso inicial | Escritura |
| --- | --- | --- |
| **administrador** | Todas las vistas. | Sí |
| **administrativo** | Dashboard, Maquinaria, Inventario, Órdenes, Costos. | No |
| **visita** | Dashboard y Costos. | No |

> Si se crea un rol nuevo, en su formulario se indica a qué ventanas tiene acceso y qué
> usuarios pertenecen a él (los "miembros"). Marcar un usuario lo agrega; desmarcarlo lo quita.

## Registro de cuentas

El formulario de registro (`/registro`) solo pide nombre, email y contraseña: **la cuenta
se crea siempre con el rol `visita`**. Para dar más permisos, un administrador edita al
usuario desde Configuración → Usuarios (o agrega el usuario como miembro de otro rol en
Configuración → Roles).

## Cómo se protegen las rutas

- `RequiereAuth` (envuelve todo el layout): sin sesión → redirige a `/login` recordando el
  destino (`state.desde`).
- `RequierePermiso` (por ruta): sin sesión → `/login`; sin permiso para la vista → `/acceso-denegado`.
- La sidebar filtra los enlaces según los permisos del usuario, y los botones de creación
  ("Registrar equipo", "Ingresar repuesto", "Nueva orden") solo se muestran a usuarios con
  un rol que tenga escritura.

## Configuración (mantenedores)

La página `/configuracion` (visible solo para quien tiene la vista `configuracion`) tiene
dos mantenedores:

- **Usuarios**: crear usuarios (con roles y estado activo/inactivo), editar nombre, email,
  contraseña, roles y estado; eliminar usuarios. Aquí se cambia el perfil del administrador.
- **Roles**: crear/editar roles con sus ventanas de acceso, flag de escritura y miembros;
  eliminar roles (excepto los de sistema).

### Cuentas demo (local)

| Email | Contraseña | Rol |
| --- | --- | --- |
| `admin@mineria.cl` | `admin123` | administrador |
| `administrativo@mineria.cl` | `adm123` | administrativo |
| `visita@mineria.cl` | `visita123` | visita |

### Cuentas Google demo

El botón "Continuar con Google" abre un modal (`GoogleModal`) que simula el selector de
cuentas de Google. Cada cuenta demo entra con un rol distinto para poder probar los
perfiles. La sesión resultante tiene `proveedor: 'google'`.

> Esto es una simulación sin backend. Cuando exista el backend real:
> 1. El frontend redirige al flujo OAuth (Authorization Code + PKCE) o envía el ID token
>    al endpoint `POST /api/auth/google`.
> 2. El backend valida el token contra Google y devuelve un JWT propio con los roles.
> 3. El `AuthProvider` debe sustituir el `localStorage` por el token/JWT y la carga del
>    usuario desde `/api/usuarios/me`.

## Cómo conectar el backend de auth

Endpoints requeridos (detalle en [backend-api.md](backend-api.md), sección Autenticación):

- `POST /api/auth/login` — email/contraseña → JWT + usuario.
- `POST /api/auth/registro` — crea usuario (el rol lo asigna el servidor, por defecto `visita`).
- `POST /api/auth/google` — valida ID token de Google → JWT + usuario.
- `GET /api/usuarios/me` — perfil del usuario autenticado (roles y permisos).
- `GET /api/usuarios`, `POST/PUT/DELETE /api/usuarios/:id` — administración (solo admin).
- `GET/POST/PUT/DELETE /api/roles` — administración de roles dinámicos (solo admin).

Las contraseñas nunca deben vivir en el frontend ni en `localStorage` en producción.
