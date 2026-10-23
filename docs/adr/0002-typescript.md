# ADR-0002 — TypeScript en todo el proyecto

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Next.js y shadcn/ui tienen TypeScript como opción por defecto. El dominio maneja dinero, fechas y
contratos de API donde un error de tipo silencioso cuesta caro.

## Alternativas

1. JavaScript: menos ceremonia, sin verificación estática.
2. TypeScript: tipado en modelos, validadores, respuestas y props.

## Decisión

TypeScript con `strict` activo, sin `any` implícitos. Los tipos del dominio se derivan de Prisma y
de los esquemas Zod para evitar duplicación.

## Consecuencias

- `npm run typecheck` es parte del flujo y de CI.
- Los montos se tipan como `Decimal`/`string`, nunca `number` para cálculos monetarios.
