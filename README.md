# 🏠 HogarGastos — Frontend

> Sistema de gestión de cuentas del hogar. Control de gastos, usuarios, categorías y reportes con gráficas.

**HogarGastos** es una aplicación web SPA (Single Page Application) para el control financiero del hogar. Permite gestionar usuarios, categorías y compras —incluyendo compras con cuotas—, y ofrece un dashboard con KPIs, gráficas de gastos y proyección de compromisos futuros.

Se comunica vía REST con un backend en **Java / Spring Boot** (`DL-BackJava`) que corre en `http://localhost:8080`.

---

## ✨ Funcionalidades

- 📊 **Dashboard y reportes**: KPIs del mes, gráficas por tipo de gasto, alcance y categoría, y proyección de compromisos a futuro.
- 🛒 **Compras**: registro de compras con método de pago, institución financiera y sistema de cuotas (cálculo automático de montos mensuales). Filtro por usuario.
- 👥 **Usuarios**: gestión de miembros del hogar (crear, editar, desactivar/activar).
- 🏷️ **Categorías**: clasificación de gastos por categoría.
- 🌙 **Diseño**: interfaz en español con tema oscuro y sidebar de navegación.

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|------------|
| UI | React 18 (SPA) |
| Lenguaje | TypeScript (modo estricto) |
| Bundler | Vite 5 |
| Estilos | Tailwind CSS 3 (dark mode) |
| Gráficas | Recharts |
| HTTP | Axios |
| Navegación | React Router 7 |

---

## 📋 Requisitos previos

- **Node.js** >= 18
- **Backend** `DL-BackJava` corriendo en `http://localhost:8080`

---

## 🚀 Inicio rápido

```bash
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`. En desarrollo, Vite proxea las llamadas `/api` hacia el backend en `localhost:8080`.

---

## 📜 Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con recarga en caliente (HMR) |
| `npm run build` | Build de producción (verificación de tipos + bundle) |
| `npm run preview` | Servir el build de producción localmente |

---

## 🗂️ Estructura del proyecto

```
src/
├── main.tsx                    # Punto de entrada de React
├── App.tsx                     # Router + layout con sidebar
├── components/
│   ├── categories/             # Modal de creación/edición de categorías
│   ├── purchases/              # Modal de creación/edición de compras
│   └── users/                  # Modal de creación/edición de usuarios
├── context/
│   └── HouseholdBudget/domain/ # Modelado DDD (entidades y value objects)
├── pages/
│   ├── DashboardPage.tsx       # KPIs, gráficas y proyecciones
│   ├── PurchasesPage.tsx       # Gestión de compras
│   ├── UsersPage.tsx           # Gestión de usuarios
│   └── CategoriesPage.tsx      # Gestión de categorías
├── services/                   # Capa de acceso a la API (axios)
│   ├── api.ts                  # Instancia axios + interceptor de errores
│   ├── reportService.ts
│   ├── userService.ts
│   ├── categoryService.ts
│   └── purchaseService.ts
├── types/                      # Contratos TypeScript del dominio
│   └── index.ts
└── ui/
    └── components/             # Componentes UI adicionales
```

### Arquitectura

Aplicación SPA con **arquitectura por capas orientada a features**:

- `pages/` → vistas a nivel de ruta
- `components/` → componentes UI reutilizables (modales)
- `services/` → abstracción de la API (un servicio por recurso del backend)
- `types/` → contratos TypeScript que reflejan los DTOs del backend
- `context/` → inicio de modelado DDD dentro de bounded contexts

Estado local mediante hooks de React (`useState`/`useEffect`) con fetching manual en cada página.

---

## 🔌 API Backend

El frontend consume la API REST de `DL-BackJava`. Se define `baseURL: '/api/v1'` en `src/services/api.ts` y Vite proxea `/api` → `localhost:8080` en desarrollo.

Endpoints principales:

| Método | Endpoint |
|--------|----------|
| GET / POST | `/api/v1/users` |
| GET / POST | `/api/v1/categories` |
| GET / POST / PUT / DELETE | `/api/v1/purchases` |
| GET | `/api/v1/reports/dashboard` |
| GET | `/api/v1/reports/projection` |

---

## 🏗️ Scripts de configuración

- `vite.config.ts` → plugin React + proxy de `/api` al backend
- `tailwind.config.js` → tema oscuro y colores personalizados (`darkBg`, `cardBg`)
- `tsconfig.json` → TypeScript en modo estricto

---

## 🔒 Integración y despliegue

El build de producción se genera en `dist/` con `npm run build` y puede servirse con `npm run preview` o cualquier servidor estático. Actualmente no hay CI/CD configurado.

---

## 📄 Licencia

Proyecto privado.
