# Portal de Mantenimiento Minero — Especificación de Requerimientos

Estatus: **Aprobado** · Ámbito: Sistema completo (front-end + contrato de API con backend)

## Contexto

Sistema web para gestionar el mantenimiento de maquinaria de una minera:
maquinaria, inventario de repuestos, órdenes de mantenimiento, costos y
administración de usuarios/roles. El front-end funciona hoy con datos estáticos
(`API_CONFIG.enabled = false`) pero está preparado para consumir un backend REST
(Java / Spring Boot) sin cambios de interfaz.

---

## 1. Roles y actores

### Requirement: Roles dinámicos multi-rol

El sistema SHALL administrar permisos mediante roles dinámicos definidos por el
administrador. Cada rol SHALL definir un subconjunto de vistas accesibles
(`dashboard`, `maquinaria`, `inventario`, `ordenes`, `costos`, `configuracion`)
y un flag de escritura. Un usuario SHALL poder pertenecer a más de un rol, y sus
permisos SHALL ser la unión de los permisos de sus roles.

#### Scenario: Acceso por unión de roles

- GIVEN un usuario con los roles `operador` (vista `maquinaria`) y `bodega`
  (vista `inventario`)
- WHEN el usuario navega al Dashboard
- THEN el menú muestra Maquinaria e Inventario
- AND el usuario no ve Costos ni Configuración

#### Scenario: Escritura por unión de roles

- GIVEN un usuario con un rol de solo lectura y otro con `escribir = true`
- WHEN el usuario intenta crear una máquina
- THEN la operación está permitida

### Requirement: Roles de sistema no eliminables

El sistema SHALL incluir tres roles de sistema marcados con `sistema = true`
(`administrador`, `administrativo`, `visita`) que NO podrán eliminarse. El rol
`administrador` SHALL otorgar acceso a todas las vistas con escritura. El rol
`administrativo` SHALL otorgar acceso a todas las vistas excepto
`configuracion`, en modo solo lectura. El rol `visita` SHALL otorgar acceso solo
a `dashboard` y `costos`, en modo solo lectura.

#### Scenario: Protección de roles del sistema

- GIVEN un administrador en Configuración → Roles
- WHEN intenta eliminar el rol `administrador`
- THEN la operación es rechazada
- AND se muestra un mensaje indicando que es un rol del sistema

### Requirement: Resguardo contra bloqueo del administrador

El sistema SHALL impedir que un usuario administrador pierda el acceso a
`configuracion` como resultado de una edición de rol o de usuario. Antes de
guardar, el sistema SHALL verificar que, si el usuario activo es administrador,
al menos uno de sus roles conserve la vista `configuracion`.

#### Scenario: Edición de rol que deja al admin sin Configuración

- GIVEN el usuario activo es administrador con el rol `administrador`
- WHEN edita el rol `administrador` y le quita la vista `configuracion`
- THEN el guardián lo impide
- AND la edición no se aplica y se informa al usuario

---

## 2. Autenticación

### Requirement: Inicio de sesión local

El sistema SHALL autenticar usuarios mediante email y contraseña. Un login
exitoso SHALL iniciar sesión y persistirla. Un login con credenciales inválidas
o con cuenta desactivada SHALL mostrar un mensaje de error y NO iniciar sesión.

#### Scenario: Login correcto

- WHEN el usuario ingresa `admin@mineria.cl` / `admin123`
- THEN el sistema inicia sesión
- AND redirige al Dashboard
- AND el menú muestra las vistas del rol administrador

#### Scenario: Login con credenciales inválidas

- WHEN el usuario ingresa un email o contraseña incorrectos
- THEN el sistema muestra "Credenciales inválidas"
- AND la sesión no se inicia

#### Scenario: Login de cuenta desactivada

- GIVEN una cuenta marcada como inactiva en Configuración
- WHEN el usuario intenta iniciar sesión
- THEN el sistema muestra "Cuenta desactivada"
- AND la sesión no se inicia

### Requirement: Registro limitado a visita

El sistema SHALL permitir el registro de nuevas cuentas únicamente con el rol
`visita`. El formulario de registro SHALL solicitar nombre, email y contraseña
sin selector de rol. El alta de cuentas con otros roles SHALL realizarse
exclusivamente desde Configuración por un usuario con permiso.

#### Scenario: Registro de nueva cuenta

- WHEN un usuario completa el registro con datos válidos
- THEN la cuenta se crea con el rol `visita`
- AND se muestra un mensaje de éxito y se redirige al login
- AND el administrador puede asignarle más roles desde Configuración

#### Scenario: Registro con email duplicado

- WHEN el email ya existe en el sistema
- THEN el registro se rechaza
- AND se muestra "Ya existe una cuenta con ese email"

### Requirement: Validación de contraseña

El sistema SHALL exigir contraseñas de al menos 6 caracteres en registro y en
cambio de contraseña. Contraseñas más cortas SHALL rechazarse con mensaje claro.

#### Scenario: Contraseña muy corta

- WHEN un usuario registra con una contraseña de menos de 6 caracteres
- THEN el sistema muestra "La contraseña debe tener al menos 6 caracteres"
- AND la cuenta no se crea

### Requirement: Inicio de sesión con Google (simulado)

El sistema SHALL ofrecer inicio de sesión con Google mediante cuentas demo
preconfiguradas. En el front-end este flujo SHALL ser una simulación local;
en producción, el backend SHALL validar el token OAuth y devolver la identidad.

#### Scenario: Login Google demo

- WHEN el usuario selecciona "Continuar con Google" y elige una cuenta demo
- THEN el sistema inicia sesión con esa identidad
- AND redirige al Dashboard

### Requirement: Cierre de sesión

El sistema SHALL permitir cerrar sesión desde cualquier página. El cierre SHALL
eliminar la sesión local y redirigir al login.

#### Scenario: Cierre de sesión

- WHEN un usuario autenticado presiona "Cerrar sesión"
- THEN la sesión se elimina
- AND el sistema redirige a `/login`
- AND las rutas protegidas exigen autenticarse nuevamente

### Requirement: Persistencia y migración de sesión

El sistema SHALL persistir la sesión en `localStorage` (`auth.sesion`). Al cargar
la aplicación SHALL normalizar cuentas y roles almacenados, migrando el formato
legado `rol` (único) al formato multi-rol `roles[]`, sin pérdida de acceso.

#### Scenario: Restauración de sesión tras recargar

- WHEN un usuario autenticado recarga la página
- THEN el sistema restaura la sesión
- AND el usuario continúa en la página sin volver a autenticarse

#### Scenario: Migración de formato legado

- GIVEN una cuenta guardada con el formato viejo (`rol: 'administrador'`)
- WHEN la aplicación carga
- THEN la cuenta queda con `roles: ['administrador']`
- AND conserva los mismos permisos

---

## 3. Navegación y control de acceso

### Requirement: Rutas protegidas

El sistema SHALL proteger todas las rutas internas excepto `/login`, `/registro`
y `/acceso-denegado`. Un usuario sin sesión que accede a una ruta protegida
SHALL ser redirigido a `/login`.

#### Scenario: Acceso anónimo a ruta protegida

- WHEN un usuario sin sesión accede a `/maquinaria`
- THEN el sistema redirige a `/login`
- AND tras iniciar sesión devuelve al usuario a la ruta solicitada

### Requirement: Control de acceso por vista

El sistema SHALL impedir el acceso a una vista si ningún rol del usuario la
incluye. El intento SHALL redirigir a `/acceso-denegado` (o a una vista permitida
si se intenta la ruta raíz).

#### Scenario: Vista no permitida

- GIVEN un usuario `visita`
- WHEN accede a `/configuracion`
- THEN el sistema muestra `/acceso-denegado`

#### Scenario: Ruta raíz de un usuario con permisos parciales

- GIVEN un usuario sin acceso a `dashboard`
- WHEN accede a `/`
- THEN el sistema redirige a la primera vista que sí le está permitida

### Requirement: Menú según permisos

El sistema SHALL mostrar en el menú lateral únicamente las vistas permitidas por
los roles del usuario autenticado.

#### Scenario: Menú del rol administrativo

- GIVEN un usuario con rol `administrativo`
- THEN el menú muestra Dashboard, Maquinaria, Inventario y Órdenes
- AND NO muestra Costos ni Configuración

---

## 4. Dashboard

### Requirement: Resumen del estado

El sistema SHALL mostrar en el Dashboard indicadores clave: total de máquinas,
órdenes activas, repuestos bajo stock mínimo y costo acumulado del mes. Cada
indicador SHALL enlazar a su vista correspondiente.

#### Scenario: Carga del Dashboard

- WHEN un usuario con permiso abre el Dashboard
- THEN se muestran los 4 indicadores con sus valores calculados
- AND cada indicador es un enlace a su vista

### Requirement: Listados recientes

El sistema SHALL mostrar en el Dashboard listados de las máquinas más recientes,
las últimas órdenes de mantenimiento y los repuestos con stock crítico.

#### Scenario: Repuestos con stock crítico

- GIVEN repuestos cuyo stock está en o bajo su mínimo
- WHEN se carga el Dashboard
- THEN esos repuestos aparecen en la sección de stock crítico con su cantidad

---

## 5. Maquinaria

### Requirement: Listado, búsqueda y filtros

El sistema SHALL listar las máquinas con búsqueda por texto (código, nombre,
marca) y filtro por estado operativo.

#### Scenario: Búsqueda de máquina

- WHEN el usuario escribe "CAM" en el buscador
- THEN solo se muestran las máquinas cuyo código/nombre/marca contienen "CAM"

### Requirement: Crear, editar y eliminar

El sistema SHALL permitir crear, editar y eliminar máquinas únicamente a
usuarios con permiso de escritura. La eliminación SHALL confirmarse antes de
ejecutarse.

#### Scenario: Creación de máquina

- WHEN un usuario con escritura completa el formulario y guarda
- THEN la máquina aparece en el listado

#### Scenario: Intento de escritura sin permiso

- GIVEN un usuario de solo lectura
- WHEN intenta crear o editar una máquina
- THEN la interfaz oculta/deshabilita las acciones de escritura

#### Scenario: Eliminación confirmada

- WHEN un usuario con escritura elimina una máquina
- THEN el sistema pide confirmación
- AND si el usuario confirma, la máquina desaparece del listado

### Requirement: Cambio de estado operativo

El sistema SHALL permitir cambiar el estado de una máquina (por ejemplo:
operativa, en mantenimiento, fuera de servicio) y reflejarlo en el listado.

#### Scenario: Máquina en mantenimiento

- WHEN un usuario con escritura cambia el estado a "en mantenimiento"
- THEN el listado muestra el nuevo estado
- AND el Dashboard refleja la actualización en sus indicadores

---

## 6. Inventario de repuestos

### Requirement: Listado con filtros y alertas

El sistema SHALL listar repuestos con búsqueda por texto y filtro por categoría.
Los repuestos cuyo stock está en o bajo el mínimo SHALL marcarse visualmente
como críticos.

#### Scenario: Marca de stock crítico

- GIVEN un repuesto con stock menor o igual a su stock mínimo
- WHEN se muestra el listado
- THEN el repuesto se destaca con indicación de stock bajo

### Requirement: Gestión de stock

El sistema SHALL permitir crear, editar y eliminar repuestos con permiso de
escritura. Al editar SHALL permitir ajustar cantidad, ubicación y stock mínimo.

#### Scenario: Actualización de stock

- WHEN un usuario con escritura guarda un repuesto con stock 50
- THEN el listado muestra stock 50
- AND si 50 > mínimo, la alerta crítica desaparece

### Requirement: Salidas de repuestos

El sistema SHALL registrar salidas de repuestos asociadas a órdenes de
mantenimiento, descontando el stock y validando disponibilidad.

#### Scenario: Salida con stock insuficiente

- WHEN se intenta sacar más unidades de las disponibles
- THEN el sistema rechaza la salida
- AND muestra un mensaje de stock insuficiente

---

## 7. Órdenes de mantenimiento

### Requirement: Ciclo de vida del estado

El sistema SHALL modelar una orden de mantenimiento con estados (por ejemplo:
pendiente, en curso, completada, cancelada) y permitir avanzarla según permiso
de escritura.

#### Scenario: Avance de estado

- WHEN un usuario con escritura marca una orden como "completada"
- THEN el estado se actualiza en el listado
- AND la orden puede afectar el estado de la máquina asociada

### Requirement: Asociación con máquina y repuestos

El sistema SHALL permitir asociar una orden a una máquina y registrar los
repuestos utilizados con sus cantidades.

#### Scenario: Orden con repuestos

- WHEN un usuario crea una orden y registra repuestos usados
- THEN los repuestos quedan asociados a la orden
- AND el stock se descuenta si aplica

### Requirement: Listado y filtros

El sistema SHALL listar órdenes con filtro por estado y por máquina.

#### Scenario: Filtro por estado

- WHEN el usuario filtra por estado "en curso"
- THEN solo se muestran las órdenes en curso

---

## 8. Costos

### Requirement: Visualización de costos

El sistema SHALL mostrar el desglose de costos por categoría (mano de obra,
repuestos, otros) y por máquina, con resumen mensual.

#### Scenario: Resumen mensual

- WHEN un usuario con permiso abre Costos
- THEN se muestran totales mensuales y desglose por categoría y máquina

### Requirement: Registro de costos

El sistema SHALL permitir registrar costos (asociados a órdenes o directos) con
permiso de escritura.

#### Scenario: Registro de un costo

- WHEN un usuario con escritura guarda un costo
- THEN el total mensual se recalcula e incluye el nuevo valor

---

## 9. Configuración

### Requirement: Mantenedor de usuarios

El sistema SHALL permitir, con permiso, listar, crear, editar y eliminar
usuarios. La edición SHALL incluir asignación multi-rol y activación/
desactivación de la cuenta. Las cuentas demo preconfiguradas SHALL ser
eliminables solo si el guardián lo permite (no deben dejarse sin cuentas demo
que rompan el inicio de sesión documentado).

#### Scenario: Asignación de roles a un usuario

- WHEN un administrador edita un usuario y le asigna los roles
  `administrador` y `bodega`
- THEN el usuario conserva ambos roles
- AND su menú refleja la unión de permisos

#### Scenario: Desactivación de cuenta

- WHEN un administrador desactiva una cuenta
- THEN esa cuenta no puede iniciar sesión
- AND el mensaje de login indica cuenta desactivada

### Requirement: Mantenedor de roles

El sistema SHALL permitir, con permiso, listar, crear, editar y eliminar roles.
La edición SHALL incluir la selección de vistas, el flag de escritura y la
asignación de miembros. Al eliminar un rol SHALL removerse de los usuarios que
lo tenían.

#### Scenario: Creación de rol personalizado

- WHEN un administrador crea el rol `bodega` con vista `inventario`
- THEN el rol aparece en el listado
- AND puede asignarse a usuarios

#### Scenario: Eliminación de rol en uso

- GIVEN un rol asignado a usuarios
- WHEN el administrador lo elimina
- THEN el rol desaparece
- AND los usuarios que lo tenían quedan sin ese rol (sus demás roles se mantienen)

### Requirement: Guardián de escritura en Configuración

El sistema SHALL ocultar las acciones de crear/editar/eliminar en Configuración
para usuarios sin permiso de escritura.

#### Scenario: Visita en Configuración

- GIVEN un usuario sin acceso a `configuracion`
- WHEN intenta abrir la ruta
- THEN el sistema redirige a `/acceso-denegado`

---

## 10. Apariencia

### Requirement: Modo claro y oscuro

El sistema SHALL soportar modo claro y modo oscuro con conmutador en el header.
La preferencia SHALL persistir en `localStorage` (`portal.tema`). Si no hay
preferencia guardada, SHALL seguir `prefers-color-scheme` del sistema. La
inicialización SHALL ocurrir antes del primer render para evitar parpadeo.

#### Scenario: Cambio de tema

- WHEN el usuario presiona el conmutador
- THEN toda la interfaz cambia al tema opuesto al instante
- AND la preferencia queda guardada

#### Scenario: Preferencia del sistema

- GIVEN un usuario sin preferencia guardada en el dispositivo en modo oscuro
- WHEN abre la aplicación
- THEN la interfaz carga en modo oscuro sin parpadeo de claro

### Requirement: Diseño responsive

El sistema SHALL adaptar la interfaz a pantallas de escritorio y móviles,
colapsando el menú lateral en pantallas pequeñas.

---

## 11. Requerimientos no funcionales

### Requirement: Rendimiento

El sistema SHALL cargar la aplicación inicial en menos de 3 segundos en una
conexión promedio. Los listados SHALL responder sin bloqueo de la interfaz.

### Requirement: Resiliencia de datos (fallback)

Con `API_CONFIG.enabled = true`, si una petición al backend falla (servidor
caído, timeout, HTTP != 2xx), el sistema SHALL degradar a datos estáticos y
avisar por consola con prefijo `[API]`, manteniendo la interfaz usable.

#### Scenario: Backend caído

- GIVEN `API_CONFIG.enabled = true` y el backend sin servicio
- WHEN un usuario abre Maquinaria
- THEN se muestran los datos estáticos de respaldo
- AND la consola registra el error con `[API]`

### Requirement: Accesibilidad

El sistema SHALL usar etiquetas semánticas, contraste suficiente en ambos temas
y foco visible en todos los controles interactivos.

### Requirement: Seguridad de la interfaz

El sistema SHALL NO exponer ni persistir contraseñas en texto plano en el
cliente: las contraseñas se guardan solo en `localStorage` de forma ofuscada
(acuerdo de desarrollo), y en producción SHALL validarlas el backend. Las
comunicaciones de producción SHALL usar HTTPS.

### Requirement: Mantenibilidad

El código SHALL estar tipado con TypeScript estricto (`verbatimModuleSyntax`,
`noUnusedLocals`), pasar `oxlint` sin errores y seguir la estructura de carpetas
documentada en `docs/estructura.md`.
