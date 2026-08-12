# Gastos

Registro minimalista de gastos diarios, semanales y mensuales. Sin backend ni base de datos: todo se guarda en `localStorage` del navegador.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Recharts

## Funcionalidades

- Añadir, editar y borrar gastos (importe, categoría, fecha, nota).
- Vistas por **día**, **semana** y **mes** con navegación entre periodos.
- Totales, media y número de movimientos del periodo.
- Gráfico de reparto por categoría y evolución diaria.
- Exportar / importar los datos en JSON como copia de seguridad.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run lint     # oxlint
npm run build    # typecheck + build de producción
npm run preview  # previsualizar el build
```

El build genera archivos estáticos en `dist/`, desplegables en cualquier hosting estático (Vercel, Netlify, GitHub Pages).
