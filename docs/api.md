# Contrato de la API

Documentación de `/api/v1/`. La especificación OpenAPI 3.1 se publicará en `/api/openapi` y la
interfaz Swagger en `/api/docs` durante la Fase 3.

## Convenciones

- JSON UTF-8; fechas de calendario `YYYY-MM-DD`; moneda CLP.
- Autenticación: sesión de Better Auth (cookie `HttpOnly` + `SameSite=Lax`).
- Toda consulta se filtra por el usuario de la sesión. Un recurso de otro usuario responde `404`,
  nunca `403`, para no filtrar su existencia.
- Las escrituras rechazan peticiones con `Origin` ajeno (protección CSRF).
- Paginación: `?page=1&perPage=20` (máximo 100).

### Respuesta exitosa

```json
{ "data": { } }
```

### Lista paginada

```json
{
  "data": {
    "items": [],
    "meta": { "page": 1, "perPage": 20, "total": 0, "totalPages": 1 }
  }
}
```

### Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Revisa los datos enviados.",
    "details": [{ "path": "amount", "message": "El monto debe ser mayor que cero" }]
  }
}
```

Códigos HTTP: `400` JSON inválido, `401` sin sesión, `403` origen no permitido, `404` inexistente,
`409` conflicto, `422` validación, `500` error interno.

## Endpoints

| Método | Ruta | Estado |
|---|---|---|
| GET, POST | `/api/v1/categories` | Implementado |
| GET, PATCH, DELETE | `/api/v1/categories/{id}` | Implementado |
| GET, POST | `/api/v1/expenses` | Implementado |
| GET, PATCH, DELETE | `/api/v1/expenses/{id}` | Implementado |
| GET, PUT | `/api/v1/budgets` | Implementado |
| GET, PATCH, DELETE | `/api/v1/budgets/{id}` | Implementado |
| GET | `/api/v1/analytics/summary` | Planificado |
| GET | `/api/v1/analytics/categories` | Planificado |
| GET | `/api/v1/analytics/trends` | Planificado |
| GET | `/api/v1/analytics/frequent` | Planificado |
| GET | `/api/v1/analytics/top` | Planificado |
| POST | `/api/v1/simulator` | Planificado |
| GET | `/api/v1/health` | Planificado |
| GET | `/api/openapi` | Planificado |

### Categorías

`GET /api/v1/categories` devuelve las categorías del usuario con `_count.expenses`, ordenadas por
predeterminadas y luego por nombre.

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Alimentación",
      "color": "#F97316",
      "icon": "utensils",
      "isDefault": true,
      "_count": { "expenses": 12 }
    }
  ]
}
```

`POST` crea una categoría personalizada:

```json
{ "name": "Café", "color": "#92400E", "icon": "coffee" }
```

`PATCH` acepta cualquiera de esos campos. `DELETE` responde `409` si la categoría tiene gastos o
presupuestos asociados.

### Gastos

`GET /api/v1/expenses` acepta:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `page`, `perPage` | entero | Paginación (`perPage` ≤ 100) |
| `from`, `to` | fecha | Rango inclusivo |
| `categoryId` | UUID | Filtra por categoría |
| `paymentMethod` | enum | `CASH`, `DEBIT`, `CREDIT`, `TRANSFER`, `WALLET`, `OTHER` |
| `q` | texto | Búsqueda parcial sin distinguir mayúsculas (máx. 80) |
| `sort` | enum | `date_desc` (defecto), `date_asc`, `amount_desc`, `amount_asc` |

```json
{
  "amount": 2500,
  "description": "Café con leche",
  "date": "2026-10-23",
  "categoryId": "uuid",
  "paymentMethod": "DEBIT"
}
```

El monto debe ser positivo, con hasta dos decimales y un máximo de `9.999.999.999,99`.

### Presupuestos

`GET /api/v1/budgets?year=2026&month=10` devuelve el presupuesto general (`categoryId: null`) y los
presupuestos por categoría, con el gasto real del mes ya calculado:

```json
{
  "data": [
    {
      "id": "uuid",
      "categoryId": null,
      "category": null,
      "year": 2026,
      "month": 10,
      "amount": 500000,
      "spent": 425000,
      "remaining": 75000,
      "percentage": 85,
      "status": "warning"
    }
  ]
}
```

`status` es `ok` (< 80 %), `warning` (≥ 80 %) o `exceeded` (≥ 100 %).

`PUT /api/v1/budgets` crea o reemplaza un presupuesto. Es idempotente por
`(usuario, año, mes, categoría)`, donde `categoryId: null` representa el presupuesto general.

```json
{ "year": 2026, "month": 10, "categoryId": null, "amount": 500000 }
```

`PATCH /api/v1/budgets/{id}` solo cambia el monto; `DELETE` lo elimina.

## Simulador

```json
{ "name": "Café", "unitPrice": 2500, "frequency": 20, "unit": "month" }
```

```json
{ "name": "Café", "monthly": 50000, "yearly": 600000, "currency": "CLP" }
```

Frecuencia `day` se anualiza con 365/12 y `week` con 52/12; el resultado se redondea a peso entero.
No guarda transacciones.

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
