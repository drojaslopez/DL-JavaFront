# Contrato del backend (API REST)

Este documento define qué debe exponer el backend (Java / Spring Boot) para que el frontend
los consuma. Los servicios del frontend ya están listos y apuntan a estas rutas; solo falta
implementarlas en el servidor.

## Cómo conectar el frontend

1. Implementa los endpoints de abajo.
2. Levanta el backend.
3. En `src/services/config.ts`:
   - `baseUrl`: URL de tu API (ej. `http://localhost:8080/api`).
   - `enabled`: cambia a `true`.

> Si `enabled` es `false`, o el backend no responde, el frontend usa automáticamente los
> datos estáticos de `src/data/mock.ts` y avisa en consola con `[API]`.

## Convenciones generales

- Todas las respuestas y peticiones son JSON (`application/json`).
- Errores: HTTP con código de estado adecuado (`400`, `404`, `500`, ...) y cuerpo opcional.
- Los códigos de estado esperados por el frontend:
  - `200` / `201` → éxito con cuerpo.
  - `204` → éxito sin cuerpo (DELETE).
  - Cualquier `4xx`/`5xx` → se trata como error y se cae al mock (si el flag está activo).
- CORS: si el frontend corre en otro puerto (`http://localhost:5173`), el backend debe
  permitir CORS para ese origen.
- Los IDs usados por el frontend son `string`. En el back puedes usar `Long`, `UUID`, etc.,
  y serializar como string (la API Java devuelve números, el frontend los convierte o
  acepta el tipo `number` en JSON — define el ID como string en el DTO para evitar líos).

## Equipos — `GET /api/equipos`

Lista todos los equipos.

```json
[
  {
    "id": "eq-001",
    "codigo": "CM-001",
    "nombre": "Camión Komatsu 930E",
    "marca": "Komatsu",
    "modelo": "930E-4",
    "categoria": "camion_minero",
    "estado": "operativo",
    "horasOperacion": 18420,
    "ubicacion": "Faena Norte",
    "fechaAdquisicion": "2021-03-15",
    "anioFabricacion": 2021
  }
]
```

Valores de enumerados:
- `categoria`: `camion_minero | cargador | excavadora | perforadora | bulldozer | molino | chancador`
- `estado`: `operativo | en_mantenimiento | fuera_de_servicio | baja`

Endpoints del recurso:

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| GET | `/api/equipos` | — | `200` `Equipo[]` |
| GET | `/api/equipos/{id}` | — | `200` `Equipo` \| `404` |
| POST | `/api/equipos` | `Equipo` sin `id` | `201` `Equipo` |
| PUT | `/api/equipos/{id}` | `Equipo` parcial | `200` `Equipo` \| `404` |
| DELETE | `/api/equipos/{id}` | — | `204` \| `404` |

## Repuestos — `GET /api/repuestos`

```json
[
  {
    "id": "rp-001",
    "codigo": "RP-001",
    "nombre": "Filtro de aire primario",
    "categoria": "Filtros",
    "proveedor": "Komatsu Repuestos",
    "stockActual": 42,
    "stockMinimo": 20,
    "costoUnitario": 18500,
    "ubicacion": "Bodega A-1"
  }
]
```

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| GET | `/api/repuestos` | — | `200` `Repuesto[]` |
| GET | `/api/repuestos/{id}` | — | `200` `Repuesto` \| `404` |
| POST | `/api/repuestos` | `Repuesto` sin `id` | `201` `Repuesto` |
| PUT | `/api/repuestos/{id}` | `Repuesto` parcial | `200` `Repuesto` \| `404` |
| DELETE | `/api/repuestos/{id}` | — | `204` \| `404` |

> Sugerencia de regla de negocio (el frontend ya la aplica al mostrar alertas):
> bajo stock cuando `stockActual <= stockMinimo`.

## Órdenes de mantenimiento — `GET /api/ordenes-mantenimiento`

```json
[
  {
    "id": "om-001",
    "numero": "OM-2026-001",
    "equipoId": "eq-002",
    "tipo": "correctivo",
    "prioridad": "critica",
    "estado": "en_proceso",
    "descripcion": "Falla en motor de tracción.",
    "tecnico": "Pedro Rojas",
    "fechaSolicitud": "2026-07-28",
    "fechaInicio": "2026-07-29",
    "fechaFin": null,
    "costoManoObra": 320000,
    "costoRepuestos": 1450000
  }
]
```

Valores de enumerados:
- `tipo`: `preventivo | correctivo | predictivo`
- `prioridad`: `baja | media | alta | critica`
- `estado`: `pendiente | en_proceso | completada | cancelada`

| Método | Ruta | Cuerpo | Respuesta |
| --- | --- | --- | --- |
| GET | `/api/ordenes-mantenimiento` | — | `200` `OrdenMantenimiento[]` |
| GET | `/api/ordenes-mantenimiento/{id}` | — | `200` `OrdenMantenimiento` \| `404` |
| POST | `/api/ordenes-mantenimiento` | sin `id` | `201` `OrdenMantenimiento` |
| PUT | `/api/ordenes-mantenimiento/{id}` | parcial | `200` `OrdenMantenimiento` \| `404` |
| DELETE | `/api/ordenes-mantenimiento/{id}` | — | `204` \| `404` |

## Costos mensuales — `GET /api/costos/mensuales`

Agregado mensual para la vista de costos.

```json
[
  {
    "mes": "Jul",
    "manoObra": 22600000,
    "repuestos": 38900000,
    "total": 61500000
  }
]
```

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/costos/mensuales` | `200` `CostoResumen[]` |

> El frontend consume este recurso de solo lectura; no necesita POST/PUT/DELETE.

## Esquema de las clases Java sugeridas

Un punto de partida para los DTO/entidad de Spring Boot (los campos usados por el frontend):

```java
public class EquipoDto {
    private Long id;            // se serializa como número; el frontend usa string
    private String codigo;
    private String nombre;
    private String marca;
    private String modelo;
    private String categoria;   // camion_minero | cargador | ...
    private String estado;      // operativo | en_mantenimiento | ...
    private long horasOperacion;
    private String ubicacion;
    private String fechaAdquisicion; // o LocalDate con @JsonFormat
    private int anioFabricacion;
}
```

Mismo patrón para `RepuestoDto`, `OrdenMantenimientoDto` (con `equipoId`) y
`CostoResumenDto`. Puedes usar enums en Java y que Jackson los serialice como texto con
`@JsonValue` o `@JsonProperty`, siempre que los valores coincidan con los que espera el
frontend (sin tildes, en minúscula).

## Controlador de ejemplo (Spring Boot)

```java
@RestController
@RequestMapping("/api/equipos")
public class EquipoController {
    @GetMapping
    public List<EquipoDto> listar() { /* ... */ }
}
```

## Autenticación y usuarios

El frontend tiene un `AuthProvider` (`src/auth/`) que hoy usa `localStorage` con roles y
cuentas demo (los roles son dinámicos y un usuario puede tener varios). Para producción, el
backend debe exponer estos endpoints y el frontend pasa a usar el JWT devuelto. Detalle de
roles y permisos en [auth.md](auth.md).

### `POST /api/auth/login`

Autentica con credenciales locales. Cuerpo:

```json
{ "email": "admin@mineria.cl", "password": "..." }
```

Respuesta `200`:

```json
{
  "token": "<jwt>",
  "usuario": {
    "id": "u-1",
    "nombre": "Admin",
    "email": "admin@mineria.cl",
    "roles": ["administrador"],
    "proveedor": "local",
    "activo": true
  }
}
```

Errores: `401` si las credenciales son inválidas o la cuenta está inactiva.

### `POST /api/auth/registro`

Crea una cuenta local. Cuerpo:

```json
{ "nombre": "Juan Pérez", "email": "juan@mineria.cl", "password": "..." }
```

> El rol NO lo elige el cliente: el servidor lo asigna (por defecto `visita`). Respuesta:
> `201` con el mismo formato de `/login` (token + usuario). `409` si el email ya existe.

### `POST /api/auth/google`

Recibe el ID token de Google (flujo de OAuth desde el frontend) y lo valida contra Google:

```json
{ "tokenId": "<id-token-de-google>" }
```

Respuesta `200` con `{ token, usuario }` (mismo formato que `/login`). Si el email del
usuario de Google no existe en el sistema, el backend lo crea con rol `visita` o lo rechaza
según la política definida.

### `GET /api/usuarios/me`

Perfil del usuario autenticado. Header `Authorization: Bearer <jwt>`.

```json
{
  "id": "u-1",
  "nombre": "Admin",
  "email": "admin@mineria.cl",
  "roles": ["administrador"],
  "proveedor": "local",
  "activo": true
}
```

### `GET /api/usuarios` (solo admin)

Lista usuarios para administración. `403` si el usuario no tiene permiso.

### `POST /api/usuarios` y `PUT/DELETE /api/usuarios/:id` (solo admin)

Alta, edición y baja de usuarios (nombre, email, contraseña, `roles[]` y `activo`). El
backend valida que al menos un rol tenga acceso a la vista `configuracion` para el usuario
que se edita a sí mismo (para no dejar la administración sin dueño).

### `GET/POST /api/roles` y `PUT/DELETE /api/roles/:id` (solo admin)

Administración de roles dinámicos. Un rol se modela como:

```json
{
  "id": "operador-grua",
  "nombre": "Operador de grúa",
  "vistas": ["dashboard", "maquinaria"],
  "escribir": false,
  "sistema": false
}
```

La pertenencia de usuarios al rol se resuelve por el campo `roles[]` de cada usuario.

## Roles

Los roles son datos dinámicos (en el frontend viven en `localStorage` bajo `auth.roles`).
Vienen tres roles de sistema que no se eliminan: `administrador` (todas las vistas +
escritura), `administrativo` (todo excepto Configuración, solo lectura) y `visita` (solo
Dashboard y Costos). Se pueden crear más roles con sus ventanas de acceso y su lista de
miembros desde Configuración → Roles.

> CORS y seguridad: en desarrollo el frontend corre en `http://localhost:5173` y el backend
> en otro puerto; habilita CORS para ese origen. Protege los endpoints de negocio con el JWT
> (`Authorization: Bearer ...`) y valida roles con Spring Security.
