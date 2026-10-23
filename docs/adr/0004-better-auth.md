# ADR-0004 — Better Auth con sesiones en base de datos

- **Fecha:** 2026-10-23
- **Estado:** Aceptada

## Contexto

Se necesita registro, login, logout, recuperación de contraseña y sesiones seguras sin escribir
criptografía a mano. La app es de finanzas personales: la sesión debe poder revocarse.

## Alternativas

1. **Auth.js (NextAuth):** estándar, pero el proveedor Credentials obliga a sesiones JWT y el
   registro/reset se implementan a mano.
2. Autenticación propia con Argon2 y tabla de sesiones: máximo control, mayor superficie de error.
3. **Better Auth:** email/contraseña, sesiones en base de datos, hash seguro, rate limiting y
   plugins oficiales para Next.js.

## Decisión

Better Auth 1.7 con adaptador Prisma y cookie `HttpOnly`, `SameSite=Lax`, `Secure` en producción.
La sesión se valida contra la base de datos, por lo que el logout y la revocación son inmediatos.

## Consecuencias

- Tablas `user`, `session`, `account` y `verification` gestionadas por la librería.
- El campo `timezone` se agregó como campo adicional del usuario.
- Para LifeDashboard se usará OAuth 2.0 con scopes, nunca la sesión de un usuario.
