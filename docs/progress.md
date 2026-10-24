# Progreso del proyecto

Bitácora de funcionalidades completadas, pendientes y decisiones técnicas.
Última actualización: 2026-10-23.

## Estado por fase

| Fase | Estado | Notas |
|---|---|---|
| 0 — Repositorio y flujo | ✅ Completada | Repo público recreado, documentación base y flujo con ramas/PR |
| 1 — Análisis y diseño | ✅ Completada | Modelo de datos, contrato de API, pantallas y ADRs |
| 2 — Configuración | ✅ Completada | Next.js, shadcn, Prisma, Better Auth, WSL2, Docker y MySQL 8.4 con migración aplicada |
| 3 — Dominio y API | 🟡 En curso | API `/api/v1` de categorías, gastos y presupuestos implementada y probada sobre MySQL; falta OpenAPI |
| 4 — Autenticación y UI | 🟡 Implementada, revisión final pendiente | 12 pantallas, shell privado responsive, CRUD conectado y temas; recorridos de navegador comprobados |
| 5 — Analítica y simulador | 🟡 Implementada, contrato OpenAPI pendiente | Agregaciones mensuales/anuales, resumen LifeDashboard, gráficos y simulación con ajustes por categoría |
| 6 — Calidad y despliegue | ⬜ Pendiente | CI, Dockerfile y documentación final |

## Pivotes registrados

1. **Django + DRF + React/Vite → Next.js full-stack.** El trabajo de diseño se conservó y la
   implementación se reinició sobre App Router.
2. **PostgreSQL → MySQL 8.4.** Decisión del autor para trabajar con MySQL Workbench. Se evaluó el
   costo y se ejecutó antes de tener datos. Ver [ADR-0012](adr/0012-mysql.md).

## Completado

- **2026-10-23** — Inspección del entorno: Node 26.8, npm 11.19, PostgreSQL 18 y MySQL 26.7 locales,
  Docker Desktop 4.96.3.
- **2026-10-23** — Next.js 16.4.2 con TypeScript, App Router, Tailwind 4 y Turbopack. Build de
  producción en verde.
- **2026-10-23** — shadcn/ui (preset Nova, base Radix) con 38 componentes.
- **2026-10-23** — Repositorio recreado. El anterior (andamiaje de Django y 36 issues) se renombró a
  `gastos-hormiga-archivo` y se archivó; `gastos-hormiga` nace limpio.
- **2026-10-23** — **WSL2 instalado y Docker Desktop operativo** (motor 29.9.2, Compose 5.6.1).
- **2026-10-23** — **MySQL 8.4 LTS en Docker** en `:3307`, con volumen persistente, charset utf8mb4
  y healthcheck.
- **2026-10-23** — Esquema Prisma migrado a MySQL: `CHAR(36)` para UUID, `VARCHAR` con longitudes
  explícitas, `DATETIME(3)` y `DECIMAL(12,2)`.
- **2026-10-23** — Migración inicial aplicada: tablas de Better Auth y dominio, más un índice único
  funcional para el presupuesto general y `CHECK` de monto, mes, año, color y descripción.
- **2026-10-23** — Better Auth con proveedor MySQL, IDs UUID y hook que crea las 9 categorías
  predeterminadas al registrarse.
- **2026-10-23** — Validadores Zod, servicios con aislamiento por `userId`, rutas `/api/v1` de
  categorías, gastos y presupuestos, sobre de error uniforme y protección CSRF por origen.
- **2026-10-23** — **18 pruebas unitarias** y **9 pruebas de integración** contra MySQL, incluida la
  verificación de que no se pueden crear dos presupuestos generales para el mismo período.
- **2026-10-23** — `npm run build`, `typecheck`, `lint`, `test` y `test:integration` en verde.
- **2026-10-23** — Dirección visual confirmada por el autor: **La tira de sumar**.
  Landing de máquina verde, cinta de papel, Archivo + Doto y total rojo. Contexto de producto
  confirmado en `PRODUCT.md`, sin testimonios ni cifras comerciales inventadas.
- **2026-10-23** — Landing, registro en dos pasos con presupuesto inicial opcional, login,
  dashboard privado, historial con filtros/paginación, alta/edición/eliminación de gastos,
  gabinete editable de categorías, presupuestos, analítica, simulador y ajustes de cuenta.
- **2026-10-23** — Temas claro/oscuro, navegación móvil, estados de carga/error/vacío y
  tablas alternativas accesibles a los gráficos. Formularios conectados a la API existente;
  cambio de nombre y contraseña a través de Better Auth.
- **2026-10-23** — Endpoints `/api/v1/analytics`, `/analytics/year`, `/summary` y `/simulator`.
  El resumen es privado por sesión; OAuth 2.0 no está implementado.
- **2026-10-23** — **14 pruebas de integración** contra MySQL (9 de aislamiento y 5 de analítica).
  Las **18 pruebas unitarias** existentes siguen pasando.
- **2026-10-23** — Recorrido Playwright con Edge: registro y presupuesto inicial, crear/editar/
  buscar/eliminar gasto, crear/editar/eliminar categoría, foco al editar, simulación −20 % con
  resultado esperado, cambio de tema, logout y login. Siete pantallas privadas sin desborde
  horizontal a 390 px. Cuentas de prueba eliminadas al terminar.
- **2026-10-23** — Revisión visual independiente: cinco correcciones resueltas (contraste de
  placeholders, etiquetas rojas, foco al editar categoría, encabezados redundantes y sombras).
  Veredicto **ship** limitado a esas cinco correcciones, no auditoría integral del producto.
  Detector de diseño sin hallazgos; ESLint de `src` y `tests` sin errores.
- **2026-10-23** — Sistema visual documentado desde el código en `DESIGN.md` y
  `.impeccable/design.json`. Build final de producción correcto; vista local en
  `http://localhost:3000/`.
- **2026-10-23** — Repositorio de GitHub renombrado a **`Lucianop5/DUCK`**, remoto local y
  enlaces de instalación actualizados. Código, documentación, capturas y configuración de
  herramientas guardados en commits temáticos; archivos de entorno y estado local excluidos.

## Revisión inicial de Dependabot

Se revisaron los cinco cambios de manifiesto. Los PR #3 y #4 fueron probados localmente y
fusionados con autorización del autor. Los PR #1, #2 y #5 siguen abiertos, sin fusionar.
Resolvers 6 se validó en `chore/dependabot-resolvers6`; #5 sigue pendiente de validación.
La migración de #2 está committeada por separado en `chore/dependabot-prisma7` y no forma
parte de esta rama. No hay comprobaciones de CI en GitHub para estos PR.

| PR | Actualización | Recomendación inicial |
|---|---|---|
| [#1](https://github.com/Lucianop5/DUCK/pull/1) | `@hookform/resolvers` 5.9.2 → 6.0.0 | Validado en rama separada y autorizado para integración |
| [#2](https://github.com/Lucianop5/DUCK/pull/2) | `@prisma/client` 6.19.3 → 7.10.1 | No fusionar aisladamente: el CLI `prisma` permanece en 6; requiere migración coordinada |
| [#3](https://github.com/Lucianop5/DUCK/pull/3) | `recharts` 3.8.0 → 3.10.1 | Fusionado tras build, pruebas y comprobación de gráficos en navegador |
| [#4](https://github.com/Lucianop5/DUCK/pull/4) | `react` y `react-dom` 19.3.0 → 19.3.1 | Fusionado; se añadió React DOM a la actualización y se probó el conjunto |
| [#5](https://github.com/Lucianop5/DUCK/pull/5) | `typescript` 5 → 7 | Migración mayor: verificar compatibilidad de Next.js, herramientas y tipos |

**Validación de #3 y #4, por separado:** build de producción, ESLint de `src`/`tests`,
18 pruebas unitarias y 14 pruebas de integración MySQL. En Edge con Playwright se comprobó
registro de una cuenta temporal, creación de datos, renderizado de ambos gráficos con barras,
vista móvil de 390 px, dashboard, navegación y alta de gasto mediante formulario, sin
excepciones del navegador. Las cuentas temporales se eliminaron. Esta comprobación no cubre
todos los recorridos E2E ni constituye una auditoría completa de accesibilidad.

**Validación de #1 (2026-10-23):** `@hookform/resolvers` 6.0.0 compatible con las versiones
instaladas de React Hook Form 7.90.0 y Zod 4.6.7. La app aún no usa `zodResolver` en sus
formularios; se añadieron cinco pruebas directas con el esquema de gastos para cubrir
transformaciones, valores por defecto, errores por campo en modos async/sync y `raw`.
Pasaron build de producción, ESLint de `src`/`tests`, 23 pruebas unitarias y 14 de integración
MySQL. Edge/Playwright comprobó registro, gastos, dashboard, gráficos y móvil sin excepciones;
la cuenta temporal se eliminó. `npm audit` conserva tres alertas altas de Prisma 6 y sus
dependencias, preexistentes y resueltas en la rama separada de #2, no por resolvers 6.

**Configuración pnpm:** lockfile guardado y permisos `allowBuilds` convertidos de textos
provisionales a booleanos para los seis paquetes de herramientas ya instalados. Se validó
con `pnpm install --lockfile-only --ignore-scripts`, sin ejecutar scripts de instalación.

## Pendientes inmediatos

1. Publicar OpenAPI 3.1 y Swagger UI en `/api/openapi` y `/api/docs`, incluidos los nuevos endpoints.
2. Consolidar E2E repetibles en el repositorio y ampliar cobertura de presupuestos, paginación,
   cambio de contraseña, teclado, zoom y temas. La comprobación manual/automatizada de esta
   sesión no sustituye una suite mantenida.
3. Fase 6: CI, despliegue y revisión de seguridad/accesibilidad antes de abrir el uso al público.

## Decisiones técnicas

| Fecha | Decisión | ADR |
|---|---|---|
| 2026-10-23 | Next.js full-stack, sin backend separado | 0001 |
| 2026-10-23 | TypeScript en todo el proyecto | 0002 |
| 2026-10-23 | PostgreSQL + Prisma (reemplazada) | 0003 |
| 2026-10-23 | Better Auth con sesiones en base de datos | 0004 |
| 2026-10-23 | API REST versionada con servicios compartidos | 0005 |
| 2026-10-23 | Montos `Decimal(12,2)` y CLP | 0006 |
| 2026-10-23 | UUID como clave primaria | 0007 |
| 2026-10-23 | shadcn/ui + Tailwind 4 + RHF/Zod | 0008 |
| 2026-10-23 | Renderizado dinámico sin caché privada | 0009 |
| 2026-10-23 | PostgreSQL en Docker en `:5433` (reemplazada) | 0010 |
| 2026-10-23 | Mantener Prisma tras evaluar Drizzle | 0011 |
| 2026-10-23 | MySQL 8.4 en Docker en `:3307` | 0012 |

## Riesgos abiertos

- **Índice funcional fuera del schema.prisma:** Prisma no lo conoce. Si se genera una migración con
  `prisma migrate dev` o `db pull`, hay que revisar que no intente eliminarlo. El flujo seguro es
  `migrate diff` + edición manual del SQL, como en la migración inicial.
- **MySQL no garantiza el orden de las cascadas:** al implementar borrado de cuenta habrá que
  eliminar gastos, presupuestos y categorías dentro de una transacción.
- **Servicio MySQL local en `:3306`:** queda intacto y no lo usa la aplicación; el proyecto vive en
  el contenedor de `:3307`. No detenerlo salvo que se quiera liberar el puerto.
- **8 vulnerabilidades altas en `npm audit`:** todas en herramientas de desarrollo (Prisma CLI,
  ESLint y sus dependencias). No se ejecutará `npm audit fix --force`; se reevalúan en Fase 6.
- **shadcn/ui vendorizado:** el CSS base (`src/styles/shadcn-base.css`) se copió para no incluir el
  CLI como dependencia de runtime. Al añadir componentes nuevos, evitar el import
  `shadcn/tailwind.css`.
- **Versiones muy recientes:** Next 16.4, Prisma 6.19, Better Auth 1.7 y MySQL 8.4 se fijaron tras
  verificar compatibilidad; cualquier actualización requiere repetir build y pruebas.
