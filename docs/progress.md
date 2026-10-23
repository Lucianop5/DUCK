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
| 4 — Autenticación y UI | ⬜ Pendiente | Layout, pantallas de acceso y CRUD conectado |
| 5 — Analítica y simulador | ⬜ Pendiente | Agregaciones, gráficos y simulador |
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

## Pendientes inmediatos

1. Fase 4: layout privado, landing, registro, login y pantallas de gastos, categorías y presupuestos.
2. Fase 5: analítica con `DATE_FORMAT`/agregaciones SQL y simulador.
3. Publicar OpenAPI 3.1 y Swagger UI en `/api/openapi` y `/api/docs`.

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
