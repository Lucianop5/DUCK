# DUCK

Aplicación web de finanzas personales para registrar, administrar y analizar los pequeños gastos
cotidianos —los "gastos hormiga"— que suelen pasar desapercibidos. Pensada para usuarios de Chile,
con el peso chileno (CLP) como moneda principal.

> **Estado:** Gastos Hormiga tiene interfaz y API conectadas sobre MySQL 8.4: autenticación,
> gastos, categorías, presupuestos, analítica y simulador. Pendientes OpenAPI/Swagger,
> una suite E2E mantenida y la preparación para despliegue público.
> Avance detallado en [`docs/progress.md`](docs/progress.md).

---

## El problema

Un café de $2.500 comprado 20 veces al mes son $50.000 mensuales y $600.000 al año. Cada compra
individual parece insignificante, así que nadie percibe el patrón. Gastos Hormiga lo hace visible:
registra los gastos, los agrupa por categoría, los compara con presupuestos y proyecta cuánto podrías
ahorrar si cambias un hábito.

## Características del MVP

- [x] Registro e inicio de sesión con sesiones en base de datos (Better Auth).
- [x] CRUD de gastos con filtros por fecha/categoría, búsqueda y orden; método de pago en la API.
- [x] Categorías con color e ícono, más 9 categorías predeterminadas por usuario.
- [x] Presupuestos mensuales generales y por categoría, con alertas al 80 % y 100 %.
- [ ] Dashboard con gasto de hoy, semana y mes, comparación mensual y promedio diario.
- [x] Evolución con Recharts, distribución por categoría y ranking de gastos frecuentes.
- [x] Simulador de gastos hormiga (mensual y anual) sin guardar transacciones.
- [x] Modo claro/oscuro, diseño responsive y estados de carga, vacío y error.
- [ ] API REST versionada, documentada con OpenAPI 3.1.

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 4 + shadcn/ui (Radix) |
| Formularios | react-hook-form + Zod |
| Gráficos | Recharts |
| Iconos | Lucide |
| Base de datos | MySQL 8.4 (Docker) |
| ORM | Prisma 6 |
| Autenticación | Better Auth (sesiones en MySQL) |
| Pruebas | Vitest + Testing Library + Playwright |
| Calidad | ESLint, TypeScript estricto |

Decisiones y alternativas descartadas: [`docs/adr/`](docs/adr/).

## Arquitectura

```text
DUCK/
├── src/
│   ├── app/
│   │   ├── page.tsx           landing
│   │   ├── (auth)/            login y registro
│   │   ├── (app)/             dashboard, gastos, categorías, presupuestos, estadísticas
│   │   └── api/
│   │       ├── auth/[...all]/ Better Auth
│   │       └── v1/            API REST versionada
│   ├── components/ui/         shadcn/ui
│   ├── lib/                   prisma, auth, dinero, fechas, validadores, servicios
│   └── hooks/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/                     Vitest
├── docker-compose.yml         MySQL 8.4 en :3307
└── docs/
```

El repositorio **DUCK** está destinado a los cuatro proyectos del ecosistema: Gastos Hormiga,
WarrantyTracker, FuelTracker y LifeDashboard. Por ahora, la implementación en la raíz es
**Gastos Hormiga**; las otras aplicaciones aún no están implementadas. La integración futura
con LifeDashboard mediante OAuth 2.0 / OpenID Connect está prevista, no implementada.

Detalle en [`docs/architecture.md`](docs/architecture.md).

## Instalación

Requisitos: Node.js ≥ 20.9, Docker Desktop y Git.

```bash
git clone https://github.com/Lucianop5/DUCK.git
cd DUCK
npm install
cp .env.example .env        # completar secretos locales; nunca commitear .env
npm run db:generate         # genera el cliente de Prisma
docker compose up -d        # MySQL 8.4 en localhost:3307
npm run db:migrate          # aplica las migraciones
npm run db:seed             # categorías predeterminadas de usuarios existentes
npm run dev                 # http://localhost:3000
```

### Conexión para MySQL Workbench

| Campo | Valor |
|---|---|
| Hostname | `127.0.0.1` |
| Port | `3307` |
| Username | `gastos_hormiga` |
| Password | la definida en `MYSQL_PASSWORD` dentro de `.env` |
| Default schema | `gastos_hormiga` |

El contenedor usa `:3307` en el host para no chocar con el servicio MySQL local de Windows en
`:3306`.

### Sin Docker (MySQL local)

Si prefieres el MySQL instalado en Windows, crea la base y el usuario desde Workbench:

```sql
CREATE DATABASE gastos_hormiga
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER 'gastos_hormiga'@'localhost'
  IDENTIFIED BY 'gastos_hormiga_dev';
GRANT ALL PRIVILEGES ON gastos_hormiga.* TO 'gastos_hormiga'@'localhost';
FLUSH PRIVILEGES;
```

Luego apunta `DATABASE_URL` a `127.0.0.1:3306`. Docker con MySQL 8.4 es la vía recomendada porque es
la versión que Prisma soporta oficialmente.

Variables principales (ver `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` y las credenciales de MySQL para Compose.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos |
| `npm test` | Pruebas unitarias con Vitest |
| `npm run test:integration` | Pruebas contra MySQL real (aislamiento entre usuarios) |
| `npm run db:migrate` | Aplicar migraciones (`prisma migrate deploy`) |
| `npm run db:migrate:dev` | Crear migraciones en desarrollo (requiere shadow database) |
| `npm run db:studio` | Explorar la base de datos |
| `npm run db:seed` | Crear las categorías predeterminadas faltantes |

## API

Bajo `/api/v1/`, con JSON, errores uniformes y sesión de Better Auth.
Contrato en [`docs/api.md`](docs/api.md); OpenAPI en `/api/openapi` y Swagger UI en `/api/docs`
(a partir de la Fase 3).

## Pruebas

```bash
npm test                 # unitarias (sin base de datos)
npm run test:integration # requieren DATABASE_URL accesible
npx playwright test      # E2E (Fase 6)
```

## Roadmap

- **Fase 0** — Repositorio, flujo de trabajo y documentación base.
- **Fase 1** — Análisis y diseño (modelo de datos, API, pantallas, ADRs).
- **Fase 2** — Configuración: Next.js, Tailwind, shadcn, Prisma, Better Auth, MySQL y Docker.
- **Fase 3** — Dominio y API: categorías, gastos, presupuestos, validación y permisos.
- **Fase 4** — Autenticación, layout y pantallas conectadas.
- **Fase 5** — Analítica, gráficos y simulador.
- **Fase 6** — Pruebas, CI, despliegue y documentación final.

Después del MVP: gastos recurrentes, notificaciones, importación de cartolas, presupuestos
compartidos e integración con LifeDashboard.

## Licencia

MIT — ver [LICENSE](LICENSE).
