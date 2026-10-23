# ADR-0001 — Next.js full-stack sin backend separado

- **Fecha:** 2026-10-23
- **Estado:** Aceptada (reemplaza el diseño Django + React/Vite)

## Contexto

El diseño inicial usaba Django REST + React/Vite. El autor decidió concentrar el proyecto en
Next.js, buscando un solo despliegue, un solo lenguaje y menos infraestructura que mantener.

## Alternativas

1. Django + DRF como API y Next.js como frontend: dos despliegues, dos lenguajes y CORS/sesión
   entre dominios.
2. Django + React/Vite: el diseño original, con SPA separada.
3. **Next.js full-stack:** interfaz, rutas de API y acceso a datos en el mismo proyecto.

## Decisión

Opción 3. La lógica de negocio vive en `src/lib/services`, las rutas `/api/v1/*` son el contrato
público y los Server Components consumen los mismos servicios sin HTTP.

## Consecuencias

- Un solo `npm run build` y un solo contenedor.
- La API sigue versionada y documentada para LifeDashboard.
- Se pierde el ecosistema Django (admin, DRF, drf-spectacular, pytest); se sustituye con Prisma,
  Zod/OpenAPI y Vitest/Playwright.
