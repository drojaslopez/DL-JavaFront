# Documentación

Índice de la documentación del Portal de Mantenimiento Minero.

| Documento | Contenido |
| --- | --- |
| [Stack tecnológico](stack-tecnologico.md) | Tecnologías, versiones y por qué se eligieron. |
| [Estructura del proyecto](estructura.md) | Organización de directorios y cómo fluyen las rutas. |
| [Modelo de datos](modelo-datos.md) | Entidades del dominio y sus relaciones. |
| [Autenticación y permisos](auth.md) | Roles, login, OAuth de Google y cómo conectar el backend. |
| [Archivos del proyecto](archivos.md) | Descripción de cada archivo fuente, uno por uno. |
| [Contrato del backend](backend-api.md) | Rutas REST y payloads que debe exponer el backend. |

## Convenciones

- Todo el código de UI está en español (etiquetas, mensajes y placeholder).
- Los identificadores técnicos (tipos, variables, rutas) están en inglés.
- Iconos provienen exclusivamente de `lucide-react`.
- Los tipos del dominio viven en `src/types/domain.ts`; no se definen tipos duplicados en los componentes.
