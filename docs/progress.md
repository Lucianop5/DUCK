# Progreso del proyecto

Bitácora de funcionalidades completadas, pendientes y decisiones técnicas.
Última actualización: 2026-10-23.

## Estado por fase

| Fase | Estado | Notas |
|---|---|---|
| 0 — Repositorio y flujo | ✅ Completada | Repo público, documentación base y flujo con ramas/PR |
| 1 — Análisis y diseño | ✅ Completada | Modelo de datos, contrato de API, pantallas y ADRs |
| 2 — Configuración | 🟡 En curso | Next.js, shadcn, Prisma y Better Auth listos; falta Docker y migración |
| 3 — Dominio y API | ⬜ Pendiente | Categorías, gastos, presupuestos, validación y permisos |
| 4 — Autenticación y UI | ⬜ Pendiente | Layout, pantallas de acceso y CRUD conectado |
| 5 — Analítica y simulador | ⬜ Pendiente | Agregaciones, gráficos y simulador |
| 6 — Calidad y despliegue | ⬜ Pendiente | Pruebas, CI, Dockerfile y documentación final |

## Pivote de arquitectura (2026-10-23)

El diseño inicial contemplaba Django + DRF + React/Vite. Se descartó por decisión del autor para
adoptar **Next.js full-stack**, que concentra interfaz y API en un solo despliegue. El trabajo de
diseño (modelo, contrato, pantallas) se conservó; la implementación se reinició.

## Completado

- **2026-10-23** — Inspección del entorno: Node 26.8, npm 11.19, Python 3.12, PostgreSQL 18 local en
  `:5432`, Docker Desktop pendiente de instalación.
- **2026-10-23** — Next.js 16.4.2 con TypeScript, App Router, Tailwind 4 y Turbopack. Build de
  producción en verde.
- **2026-10-23** — shadcn/ui (preset Nova, base Radix) con 30+ componentes: formularios, tablas,
  diálogos, sidebar, gráficos y estados vacíos.
- **2026-10-23** — Prisma 6.19.3 con PostgreSQL: modelos de Better Auth y de dominio, índices y
  `Decimal(12,2)` para montos.
- **2026-10-23** — Better Auth 1.7.12 con sesiones en base de datos, hash de contraseñas y cliente
  React.
- **2026-10-23** — Docker Compose con PostgreSQL 18 en `:5433` para no chocar con el servicio local.
- **2026-10-23** — Vitest, Testing Library y Playwright preparados como dependencias.

## Pendientes inmediatos

1. Instalar Docker Desktop (WSL2 + permisos de administrador) y levantar `docker compose up -d`.
2. Generar la primera migración de Prisma e incluir los índices únicos parciales de presupuestos.
3. Implementar seed de categorías predeterminadas y datos de ejemplo identificados.
4. Fase 3: servicios y rutas `/api/v1/` con Zod y pruebas.

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

## Riesgos abiertos

- **Docker Desktop no instalado:** bloquea la migración y las pruebas de integración.
- **8 vulnerabilidades altas en `npm audit`:** todas en herramientas de desarrollo (Prisma CLI,
  ESLint y sus dependencias). No se ejecutará `npm audit fix --force` para evitar upgrades mayores
  sin revisión; se reevalúan en Fase 6.
- **shadcn/ui vendorizado:** el CSS base (`src/styles/shadcn-base.css`) se copió para no incluir el
  CLI como dependencia de runtime. Al añadir componentes nuevos con `npx shadcn@latest add`, revisar
  que no reintroduzca el import `shadcn/tailwind.css`.
- **Versiones muy recientes:** Next 16.4, Prisma 6.19 y Better Auth 1.7 se fijaron tras verificar
  compatibilidad; cualquier actualización requiere repetir build y pruebas.
