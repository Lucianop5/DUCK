# ADR-0010 — PostgreSQL en Docker publicado en :5433

- **Fecha:** 2026-10-23
- **Estado:** Superada por [ADR-0012](0012-mysql.md)

> El contenedor pasó de PostgreSQL en `:5433` a MySQL 8.4 en `:3307`.

## Contexto

El equipo ya tiene PostgreSQL 18 como servicio local en `:5432`. El proyecto necesita un entorno
reproducible con Docker Compose y no debe interferir con otros proyectos.

## Alternativas

1. Detener el servicio local y usar `:5432`: invasivo.
2. **Publicar el contenedor en `:5433`**: aislado y explícito.
3. Sin Docker: se pierde reproducibilidad.

## Decisión

Servicio `db` con `postgres:18-alpine`, volumen persistente, healthcheck y `ports: "5433:5432"`.
La cadena de conexión vive en `DATABASE_URL`.

## Consecuencias

- Conviven ambos PostgreSQL sin conflicto.
- `.env.example` documenta el puerto 5433.
- Docker Desktop debe estar instalado para el flujo principal.
