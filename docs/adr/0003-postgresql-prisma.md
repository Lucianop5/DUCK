# ADR-0003 — PostgreSQL + Prisma

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

El dominio es relacional (usuarios, categorías, gastos, presupuestos) y requiere agregaciones por
fecha y restricciones de integridad. Docker permite cualquier motor, pero no todos sirven igual.

## Alternativas

1. **PostgreSQL:** `NUMERIC` exacto, índices únicos parciales, `date_trunc` para series temporales,
   constraints y concurrencia real.
2. MySQL: no soporta índices únicos parciales, necesarios para el presupuesto general por mes.
3. SQLite: sin concurrencia real ni tipos avanzados; útil solo para prototipos.
4. MongoDB: obliga a resolver integridad y agregaciones en la aplicación.

## Decisión

PostgreSQL 18 en Docker, con Prisma 6.19.3 como ORM y migraciones versionadas.

## Consecuencias

- El dinero usa `Decimal(12,2)` mapeado a `NUMERIC(12,2)`.
- Los índices únicos parciales de `budget` se agregan con SQL en la migración, porque Prisma no los
  expresa en el schema.
- Prisma 8 está en RC: se fija la última versión estable (6.19.3).
