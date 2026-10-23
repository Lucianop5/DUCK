# ADR-0012 — MySQL 8.4 en Docker como base de datos

- **Fecha:** 2026-10-23
- **Estado:** Aceptada
- **Reemplaza:** [ADR-0003](0003-postgresql-prisma.md) y [ADR-0010](0010-postgresql-docker.md)

## Contexto

El proyecto se diseñó inicialmente sobre PostgreSQL. El autor prefiere trabajar con **MySQL** y
**MySQL Workbench**, y el equipo ya tenía MySQL Server 26.7 como servicio local en `:3306`.
Tras instalar WSL2, Docker Desktop quedó operativo, lo que permite usar una versión de MySQL
soportada oficialmente por Prisma en lugar de depender de la versión local.

## Alternativas

| Opción | Ventaja | Problema |
|---|---|---|
| Mantener PostgreSQL | Índices parciales y `date_trunc` nativos | No es la preferencia del autor |
| MySQL local 26.7 en `:3306` | Ya instalado y visible en Workbench | Prisma 6.19 no declara soporte para esa versión |
| **MySQL 8.4 LTS en Docker en `:3307`** | Versión soportada, reproducible, aislada del servicio local | Ocupa un puerto adicional |

## Decisión

- **MySQL 8.4 LTS** en Docker Compose, publicado en `:3307` para convivir con el MySQL local.
- Prisma con `provider = "mysql"` y Better Auth con `provider: "mysql"`.
- Workbench se conecta a `127.0.0.1:3307` con el usuario `gastos_hormiga`.

## Consecuencias

- **UUID como `CHAR(36)`**: MySQL no tiene tipo UUID nativo. Prisma genera el UUID en la aplicación
  y lo almacena como texto de 36 caracteres.
- **Sin índices parciales**: el único del presupuesto general se implementa con un índice funcional
  `(userId, year, month, COALESCE(categoryId, '0000…'))` en la migración.
- **`CHECK` nativos**: MySQL 8.0.16+ los aplica; la validación de color usa `REGEXP` en lugar de `~`.
- **Collation `utf8mb4_unicode_ci`**: los textos son case-insensitive. Esto conviene para emails y
  nombres de categoría, pero cambia la semántica respecto de PostgreSQL.
- **Búsqueda**: `contains` funciona sin `mode: "insensitive"`; la collation ya ignora mayúsculas.
- **Analítica**: se usará `DATE_FORMAT(date, '%Y-%m')`, `YEAR()` y `MONTH()` en lugar de
  `date_trunc`.
- **Migraciones**: se aplican con `prisma migrate deploy` (sin shadow database). Para generar una
  migración nueva con `prisma migrate dev` hace falta un usuario con privilegios para crear bases;
  por eso el flujo documentado es `migrate diff` + edición manual del SQL.
- **Borrado en cascada**: MySQL no garantiza el orden de las cascadas. Si se implementa eliminación
  de cuenta, hay que borrar gastos, presupuestos y categorías en una transacción antes del usuario.
- El servicio MySQL local en `:3306` queda intacto para otros proyectos.
