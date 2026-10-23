# Arquitectura — Gastos Hormiga

Diseño vigente de la aplicación. Reemplaza el diseño anterior basado en Django, descartado al
adoptar Next.js full-stack (ver ADR-0001).

## 1. Visión general

Aplicación full-stack en Next.js: la interfaz y la API conviven en el mismo despliegue y comparten
la capa de servicios y el acceso a datos.

```text
Navegador
   │  HTTPS, cookie de sesión HttpOnly
   ▼
Next.js (App Router)
   ├── Server Components  ──┐
   ├── Client Components  ──┤
   └── /api/v1/* ───────────┴──► lib/services ──► Prisma ──► MySQL
```

- **Una sola fuente de verdad:** las reglas de negocio viven en `src/lib/services`; las rutas de
  API solo validan, autentican y delegan. Los Server Components usan los mismos servicios sin pasar
  por HTTP.
- **API pública y estable:** `/api/v1/` es el contrato para integraciones futuras (LifeDashboard).
- **Aislamiento por usuario:** todo servicio recibe `userId` desde la sesión y lo aplica en cada
  consulta. Un recurso ajeno responde `404`.
- **Sin caché de datos privados:** el contenido financiero se renderiza en cada request.

## 2. Estructura

```text
src/
├── app/
│   ├── (public)/              landing, login, registro, recuperación
│   ├── (app)/                 área privada con sidebar
│   ├── api/auth/[...all]/     Better Auth
│   └── api/v1/                expenses, categories, budgets, analytics, simulator, integrations
├── components/
│   ├── ui/                    shadcn/ui
│   ├── charts/                gráficos Recharts
│   ├── expenses/              tabla, filtros, formulario
│   └── layout/                sidebar, header, tema
├── lib/
│   ├── prisma.ts              cliente único
│   ├── auth.ts / auth-client  Better Auth
│   ├── money.ts               Decimal y formato CLP
│   ├── dates.ts               períodos en America/Santiago
│   ├── validators/            esquemas Zod
│   └── services/              lógica de negocio
├── hooks/
└── styles/
```

## 3. Modelo de datos

```text
User ─1:N─ Category ─1:N─ Expense
  │            └──1:N─ Budget (categoryId NULL ⇒ presupuesto general)
  └─1:N────────────── Budget
```

| Tabla | Campos principales | Reglas |
|---|---|---|
| `user` | id UUID, name, email único, emailVerified, image, timezone | Better Auth |
| `session` | id, token único, expiresAt, userId | Better Auth, sesiones en BD |
| `account` | id, providerId, accountId, password (hash), userId | Better Auth |
| `verification` | id, identifier, value, expiresAt | Recuperación de contraseña |
| `category` | id UUID, userId, name, color, icon, isDefault | único `(userId, name)`, color `#RRGGBB` |
| `expense` | id UUID, userId, categoryId, amount, description, date, paymentMethod | `NUMERIC(12,2) > 0`, FK `RESTRICT` |
| `budget` | id UUID, userId, categoryId?, year, month, amount | único `(userId, year, month, categoryId)` |

Detalles:

- **Montos:** `Decimal(12,2)` en Prisma/MySQL. Nunca `float`. La UI muestra CLP sin decimales.
- **Fechas:** `date` es `DATE` (día calendario), no timestamp. Los períodos se calculan en
  `America/Santiago`.
- **Índices:** `(userId, date DESC)`, `(userId, categoryId, date DESC)`, `(userId, amount DESC)`.
- **Presupuesto general:** `categoryId` nulo. MySQL considera los `NULL` distintos y no tiene
  índices parciales, así que la migración crea un índice único funcional
  `(userId, year, month, COALESCE(categoryId, '000…'))` que garantiza un solo presupuesto general
  por período.
- **Borrado de categoría con gastos:** la FK `RESTRICT` lo impide; la API responde `409` con el
  conteo y permite reasignar.
- **Borrado de usuario:** MySQL no garantiza el orden de las cascadas; si se añade esa función, hay
  que borrar gastos, presupuestos y categorías dentro de una transacción antes que el usuario.

## 4. API REST

| Método | Ruta | Descripción |
|---|---|---|
| `*` | `/api/auth/[...all]` | Better Auth (registro, login, logout, sesión) |
| GET, POST | `/api/v1/categories` | Listar / crear |
| GET, PATCH, DELETE | `/api/v1/categories/{id}` | Detalle, edición, borrado |
| GET, POST | `/api/v1/expenses` | Listar con filtros / crear |
| GET, PATCH, DELETE | `/api/v1/expenses/{id}` | Detalle, edición, borrado |
| GET, PUT | `/api/v1/budgets` | Listar con gasto real / crear o reemplazar |
| GET, PATCH, DELETE | `/api/v1/budgets/{id}` | Detalle, cambio de monto, borrado |
| GET | `/api/v1/analytics/summary` | KPIs del período |
| GET | `/api/v1/analytics/categories` | Distribución por categoría |
| GET | `/api/v1/analytics/trends` | Serie temporal |
| GET | `/api/v1/analytics/frequent` | Gastos más repetidos |
| GET | `/api/v1/analytics/top` | Mayores montos |
| POST | `/api/v1/simulator` | Simulación mensual y anual |
| GET | `/api/v1/health` | Healthcheck |
| GET | `/api/openapi`, `/api/docs` | OpenAPI 3.1 y Swagger UI |

Convenciones: paginación `page`/`perPage` (20, máximo 100), errores
`{ error: { code, message, details } }`, `404` para recursos ajenos, validación con Zod en el borde
y rechazo de escrituras con `Origin` ajeno.

Categorías, gastos y presupuestos ya están implementados en `src/app/api/v1/`; la analítica, el
simulador y el OpenAPI quedan para las fases 3 y 5.

## 5. Autenticación y seguridad

- Better Auth con sesiones persistidas en MySQL y cookie `HttpOnly`, `SameSite=Lax`,
  `Secure` en producción.
- Contraseñas con el hash por defecto de Better Auth (scrypt), nunca en texto plano.
- Protección de rutas en el layout privado y, sobre todo, en cada servicio y ruta de API.
- Validación doble: Zod en el cliente y en el servidor.
- Rate limiting en login y recuperación (Better Auth + límite por IP en producción).
- Secretos solo en `.env`; `.env.example` sin valores reales.
- Respuestas de error sin filtrar existencia de recursos de otros usuarios.

## 6. Decisiones

Ver [`docs/adr/`](adr/). Resumen: Next.js full-stack, TypeScript, Prisma/MySQL, Better Auth,
API versionada con servicios compartidos, montos decimales, UUID, shadcn/ui, renderizado sin caché
privada y MySQL 8.4 en Docker publicado en `:3307`.
