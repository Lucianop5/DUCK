# 0011 — Evaluación de Drizzle ORM y decisión de mantener Prisma

- **Fecha:** 2026-10-23
- **Estado:** Aceptada
- **Contexto:** Antes de la primera migración se evaluó reemplazar Prisma por Drizzle ORM.

## Contexto

Gastos Hormiga necesita dos cosas que Prisma no expresa de forma nativa en `schema.prisma`:

1. Un índice único para el presupuesto general. En MySQL los `NULL` no colisionan y no existen
   índices parciales, así que se resuelve con un índice funcional sobre `COALESCE(categoryId, …)`.
2. Restricciones `CHECK` de dominio (`amount > 0`, mes entre 1 y 12, color hexadecimal).

Además, la Fase 5 requiere agregaciones mensuales, comparaciones entre meses y rankings.

Drizzle 0.45 expresa índices parciales y `CHECK` directamente en el esquema TypeScript, genera SQL
legible y devuelve los `numeric` como texto, lo que evita pérdida de precisión. Better Auth tiene
adaptador oficial para Drizzle.

## Alternativas

| Opción | Ventaja principal | Costo |
|---|---|---|
| Mantener Prisma | Ya está configurado y verificado; Prisma Studio y ecosistema mayor | Índices funcionales y `CHECK` requieren SQL manual en la migración |
| Migrar a Drizzle | Restricciones en el esquema y SQL tipado de primera clase | Rehacer esquema, adaptador, migraciones y documentación (~2 h) |
| Prisma + SQL explícito | Mantiene el CRUD cómodo y resuelve la analítica con `$queryRaw` | Dos lenguajes de consulta conviviendo |

## Decisión

Se mantiene **Prisma 6** para el MVP y se escribe la analítica compleja con SQL explícito en
`lib/services/analytics.ts` cuando llegue la Fase 5.

## Consecuencias

- La migración inicial incluye a mano el índice funcional y los `CHECK`; cualquier cambio futuro en
  esas restricciones exige editar el SQL de la migración.
- El CRUD se beneficia de `include`, filtros tipados y Prisma Studio.
- Las consultas de analítica documentarán su SQL y se probarán contra MySQL real.
- Se reevalúa Drizzle si el proyecto crece en reportes o si se despliega en un entorno serverless
  donde el peso del motor de Prisma importe.

## Referencias

- `docs/adr/0003-postgresql-prisma.md`
- `docs/adr/0012-mysql.md`
- `prisma/migrations/20261023000000_init/migration.sql`
