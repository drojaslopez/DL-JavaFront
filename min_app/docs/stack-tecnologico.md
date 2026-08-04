# Stack tecnológico

Resumen de las tecnologías del proyecto y el rol de cada una. Versiones según
`package.json` al momento de escribir esto.

## Dependencias principales

| Tecnología | Versión | Rol |
| --- | --- | --- |
| React | ^19.2.8 | UI declarativa con componentes funcionales y hooks. |
| TypeScript | ~6.0.2 | Tipado estricto de todo el código. |
| Vite | ^8.2.0 | Bundler y servidor de desarrollo. |
| React Router DOM | ^7.18.2 | Rutas del SPA y navegación. |
| Tailwind CSS | ^4.3.3 | Estilos utilitarios; se configura en CSS con `@theme`. |
| Lucide React | ^1.28.0 | Iconografía del sistema. |

## Herramientas de desarrollo

| Herramienta | Rol |
| --- | --- |
| Oxlint | Linter (`npm run lint`), basado en Oxc. |
| @vitejs/plugin-react | Transformación JSX/HMR para React. |
| @tailwindcss/vite | Integración de Tailwind con Vite. |
| autoprefixer / postcss | Post-procesamiento de CSS. |

## Decisiones técnicas

- **TypeScript estricto:** `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`
  y `erasableSyntaxOnly` activos en `tsconfig.app.json`. El que deje una variable sin usar,
  que no se sorprenda.
- **Tailwind 4 sin `tailwind.config.js`:** los tokens (fuentes, colores) se declaran en CSS
  con la directiva `@theme`. Ver `src/index.css`.
- **`react/only-export-components`:** cada archivo exporta solo componentes (o constantes
  declaradas con `export const`), para que el Fast Refresh funcione. Las funciones helper
  viven en `src/utils/`.
- **Formato de moneda:** `Intl.NumberFormat` con `es-CL` y `CLP`. Los millones se ven como
  se deben ver: grandes y dolorosos.

## Scripts

```bash
npm run dev       # desarrollo con HMR
npm run build     # tsc -b && vite build
npm run lint      # oxlint
npm run preview   # servir el build
```
