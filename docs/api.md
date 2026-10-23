# Contrato de la API

Documentación resumida de `/api/v1/`. La fuente de verdad ejecutable será el OpenAPI 3.1 en
`/api/openapi` (Fase 3).

## Convenciones

- JSON UTF-8; fechas `YYYY-MM-DD`; zona `America/Santiago`.
- Autenticación: sesión de Better Auth (cookie `HttpOnly`).
- Paginación: `?page=1&pageSize=20` → `{ data, page, pageSize, total, totalPages }`.
- Errores:

```json
{
  "detail": "No se pudo procesar la solicitud.",
  "code": "validation_error",
  "errors": { "amount": ["El monto debe ser mayor que cero."] }
}
```

- Recursos de otro usuario: `404`.
- Códigos: `400` validación, `401` sin sesión, `403` permiso, `404` inexistente, `409` conflicto,
  `429` rate limit, `500` error interno.

## Endpoints

| Método | Ruta | Estado |
|---|---|---|
| GET, POST | `/api/v1/categories` | Planificado |
| GET, PATCH, DELETE | `/api/v1/categories/{id}` | Planificado |
| GET, POST | `/api/v1/expenses` | Planificado |
| GET, PATCH, DELETE | `/api/v1/expenses/{id}` | Planificado |
| GET, POST | `/api/v1/budgets` | Planificado |
| GET, PATCH, DELETE | `/api/v1/budgets/{id}` | Planificado |
| GET | `/api/v1/budgets/status` | Planificado |
| GET | `/api/v1/analytics/summary` | Planificado |
| GET | `/api/v1/analytics/categories` | Planificado |
| GET | `/api/v1/analytics/trends` | Planificado |
| GET | `/api/v1/analytics/frequent` | Planificado |
| GET | `/api/v1/analytics/top` | Planificado |
| POST | `/api/v1/simulator` | Planificado |
| GET | `/api/v1/health` | Planificado |

### Filtros de gastos

`from`, `to` (fechas), `categoryId`, `paymentMethod`, `search` (descripción),
`sort` (`date|-date|amount|-amount`) y paginación.

### Simulador

```json
{ "name": "Café", "unitPrice": 2500, "frequency": 20, "unit": "month" }
```

```json
{ "name": "Café", "monthly": 50000, "yearly": 600000, "currency": "CLP" }
```

Frecuencia `day` se anualiza con 365/12 y `week` con 52/12; el resultado se redondea a peso entero.

## Integración futura con LifeDashboard

Fuera del MVP. OAuth 2.0 Authorization Code + PKCE (o client credentials en servidor a servidor),
scope `finance:read`, sobre un endpoint estable:

```http
GET /api/v1/integrations/finance-summary?from=2026-10-01&to=2026-10-31
Authorization: Bearer <access_token>
```

```json
{
  "user": { "id": "uuid" },
  "period": { "from": "2026-10-01", "to": "2026-10-31" },
  "currency": "CLP",
  "totals": { "spent": 425000, "expenseCount": 87, "dailyAverage": 13710 },
  "previousPeriod": { "spent": 398000, "variationPct": 6.8 },
  "topCategory": { "id": "uuid", "name": "Alimentación", "total": 152000 },
  "budget": { "amount": 500000, "usedPct": 85.0, "status": "warning" }
}
```

Sin compartir base de datos, contraseñas ni claves privadas entre proyectos.
