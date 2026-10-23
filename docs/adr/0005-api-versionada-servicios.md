# ADR-0005 — API REST versionada con servicios compartidos

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

La interfaz necesita leer y mutar datos, y LifeDashboard necesitará un contrato estable. Duplicar
la lógica entre Server Components, Server Actions y rutas de API genera divergencias.

## Alternativas

1. Solo Server Actions: excelente para la UI, pero no constituye una API reutilizable.
2. Solo rutas de API: contrato claro, pero la UI paga un salto HTTP interno innecesario.
3. **Servicios compartidos + rutas `/api/v1`:** la UI y la API usan el mismo código de negocio.

## Decisión

`src/lib/services` concentra validación de negocio, permisos y consultas. Las rutas
`src/app/api/v1/*` autentican, validan con Zod y delegan. Los Server Components llaman a los
servicios directamente.

## Consecuencias

- Una sola implementación de cada regla, con pruebas unitarias.
- El contrato `/api/v1` se documenta con OpenAPI 3.1 generado desde Zod.
- Las mutaciones desde el cliente usan `fetch` con `credentials: "include"`.
