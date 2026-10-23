# Progreso del proyecto

Bitácora de funcionalidades completadas, pendientes y decisiones técnicas.
Última actualización: 2026-10-23.

## Estado por fase

| Fase | Estado | Notas |
|---|---|---|
| 0 — Repositorio y flujo | ✅ Completada | Repo público recreado, documentación base y flujo con ramas/PR |
| 1 — Análisis y diseño | ✅ Completada | Modelo de datos, contrato de API, pantallas y ADRs |
| 2 — Configuración | 🟡 Casi completa | Next.js, shadcn, Prisma, Better Auth y migración listos; falta aplicar la migración |
| 3 — Dominio y API | 🟡 En curso | API `/api/v1` de categorías, gastos y presupuestos implementada y probada |
| 4 — Autenticación y UI | ⬜ Pendiente | Layout, pantallas de acceso y CRUD conectado |
| 5 — Analítica y simulador | ⬜ Pendiente | Agregaciones, gráficos y simulador |
| 6 — Calidad y despliegue | ⬜ Pendiente | CI, Dockerfile y documentación final |

## Pivote de arquitectura (2026-10-23)

El diseño inicial contemplaba Django + DRF + React/Vite. Se descartó por decisión del autor para
adoptar **Next.js full-stack**, que concentra interfaz y API en un solo despliegue. El trabajo de
diseño (modelo, contrato, pantallas) se conservó; la implementación se reinició.

## Completado

- **2026-10-23** — Inspección del entorno: Node 26.8, npm 11.19, PostgreSQL 18 local en `:5432`,
  Docker Desktop 4.96.3 instalado.
- **2026-10-23** — Next.js 16.4.2 con TypeScript, App Router, Tailwind 4 y Turbopack. Build de
  producción en verde.
- **2026-10-23** — shadcn/ui (preset Nova, base Radix) con 38 componentes: formularios, tablas,
  diálogos, sidebar, gráficos y estados vacíos.
- **2026-10-23** — Prisma 6.19.3 con PostgreSQL: modelos de Better Auth y de dominio, índices y
  `Decimal(12,2)` para montos.
- **2026-10-23** — Better Auth 1.7.12 con sesiones en base de datos, hash de contraseñas y cliente
  React.
- **2026-10-23** — Repositorio recreado. El anterior (con el andamiaje de Django y 36 issues) se
  renombró a `gastos-hormiga-archivo` y se archivó; `gastos-hormiga` nace limpio con el commit de
  bootstrap.
- **2026-10-23** — Migración inicial generada **sin base de datos** con `prisma migrate diff`,
  incluyendo índice único parcial del presupuesto general y `CHECK` de monto, mes, año, color y
  descripción.
- **2026-10-23** — Seed idempotente de las 9 categorías predeterminadas y hook de Better Auth que
  las crea al registrarse.
- **2026-10-23** — Validadores Zod para categorías, gastos y presupuestos; servicios con
  aislamiento por `userId`; rutas `/api/v1` de categorías, gastos y presupuestos con sobre de error
  uniforme y protección CSRF por origen.
- **2026-10-23** — 18 pruebas unitarias (validadores y CSRF) y 8 pruebas de integración de
  aislamiento entre usuarios (se ejecutan con `npm run test:integration`).
- **2026-10-23** — `npm run build`, `typecheck`, `lint` y `test` en verde.

## Pendientes inmediatos

1. **Obtener acceso a PostgreSQL.** Docker no puede iniciar porque WSL no está instalado; la
   instancia local usa `scram-sha-256` y se desconoce la contraseña. Opciones:
   - crear un rol y una base dedicados en el servicio local (`:5432`) y ajustar `DATABASE_URL`; o
   - instalar WSL2 (requiere administrador y reinicio) y usar `docker compose up -d` (`:5433`).
2. Aplicar `prisma migrate deploy` y ejecutar `npm run db:seed`.
3. Registrar un usuario real y verificar que recibe sus 9 categorías.
4. Ejecutar `npm run test:integration` contra la base real.
5. Publicar el OpenAPI 3.1 y Swagger UI en `/api/openapi` y `/api/docs`.

## Decisiones técnicas

| Fecha | Decisión | ADR |
|---|---|---|
| 2026-10-23 | Next.js full-stack, sin backend separado | 0001 |
| 2026-10-23 | TypeScript en todo el proyecto | 0002 |
| 2026-10-23 | PostgreSQL + Prisma | 0003 |
| 2026-10-23 | Better Auth con sesiones en base de datos | 0004 |
| 2026-10-23 | API REST versionada con servicios compartidos | 0005 |
| 2026-10-23 | Montos `Decimal(12,2)` y CLP | 0006 |
| 2026-10-23 | UUID como clave primaria | 0007 |
| 2026-10-23 | shadcn/ui + Tailwind 4 + RHF/Zod | 0008 |
| 2026-10-23 | Renderizado dinámico sin caché privada | 0009 |
| 2026-10-23 | PostgreSQL en Docker en `:5433` | 0010 |
| 2026-10-23 | Mantener Prisma tras evaluar Drizzle | 0011 |

## Riesgos abiertos

- **Docker Desktop sin WSL:** el motor no inicia (`wsl is not installed`). Instalar WSL2 exige
  administrador y reinicio; no se hace de forma automática.
- **Contraseña de PostgreSQL desconocida:** el servicio local usa `scram-sha-256`. Se necesita un
  rol dedicado para el proyecto.
- **Clúster PostgreSQL portable descartado:** al ejecutarlo desde esta sesión, un worker de
  autovacuum murió con `0xC0000142` y el servidor se reinició. No es una vía confiable en este
  entorno.
- **8 vulnerabilidades altas en `npm audit`:** todas en herramientas de desarrollo (Prisma CLI,
  ESLint y sus dependencias). No se ejecutará `npm audit fix --force` para evitar upgrades mayores
  sin revisión; se reevalúan en Fase 6.
- **shadcn/ui vendorizado:** el CSS base (`src/styles/shadcn-base.css`) se copió para no incluir el
  CLI como dependencia de runtime. Al añadir componentes nuevos, revisar que no reintroduzca el
  import `shadcn/tailwind.css`.
- **Versiones muy recientes:** Next 16.4, Prisma 6.19 y Better Auth 1.7 se fijaron tras verificar
  compatibilidad; cualquier actualización requiere repetir build y pruebas.
