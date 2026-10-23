# Gastos Hormiga

Aplicación web de finanzas personales para registrar, administrar y analizar los pequeños gastos
cotidianos —los "gastos hormiga"— que suelen pasar desapercibidos. Pensada para usuarios de Chile,
con el peso chileno (CLP) como moneda principal.

> **Estado:** Fase 3 en curso. La API de categorías, gastos y presupuestos está implementada y el
> build pasa; falta aplicar la migración a una base de datos real y construir la interfaz.
> Avance detallado en [`docs/progress.md`](docs/progress.md).

---

## El problema

Un café de $2.500 comprado 20 veces al mes son $50.000 mensuales y $600.000 al año. Cada compra
individual parece insignificante, así que nadie percibe el patrón. Gastos Hormiga lo hace visible:
registra los gastos, los agrupa por categoría, los compara con presupuestos y proyecta cuánto podrías
ahorrar si cambias un hábito.

## Características del MVP

- [ ] Registro e inicio de sesión con sesiones en base de datos (Better Auth).
- [ ] CRUD de gastos con filtros por fecha, categoría y método de pago, búsqueda y orden.
- [ ] Categorías con color e ícono, más 9 categorías predeterminadas por usuario.
- [ ] Presupuestos mensuales generales y por categoría, con alertas al 80 % y 100 %.
- [ ] Dashboard con gasto de hoy, semana y mes, comparación mensual y promedio diario.
- [ ] Evolución y distribución de gastos con Recharts, más ranking de gastos frecuentes.
- [ ] Simulador de gastos hormiga (mensual y anual) sin guardar transacciones.
- [ ] Modo claro/oscuro, diseño responsive y estados de carga, vacío y error.
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
| Base de datos | PostgreSQL 18 (Docker) |
| ORM | Prisma 6 |
| Autenticación | Better Auth (sesiones en PostgreSQL) |
| Pruebas | Vitest + Testing Library + Playwright |
| Calidad | ESLint, TypeScript estricto |

Decisiones y alternativas descartadas: [`docs/adr/`](docs/adr/).

## Arquitectura

```text
gastos-hormiga/
├── src/
│   ├── app/
│   │   ├── (public)/          landing, login, registro, recuperación
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
├── docker-compose.yml         PostgreSQL 18 en :5433
└── docs/
```

La carpeta local se llama `DUCK` porque alojará los cuatro proyectos del ecosistema
(Gastos Hormiga, WarrantyTracker, FuelTracker y LifeDashboard). **Este repositorio corresponde
únicamente a Gastos Hormiga**, una aplicación independiente cuya API queda preparada para una
integración futura con LifeDashboard mediante OAuth 2.0 / OpenID Connect.

Detalle en [`docs/architecture.md`](docs/architecture.md).

## Instalación

Requisitos: Node.js ≥ 20.9, Docker Desktop y Git.

```bash
git clone https://github.com/Lucianop5/gastos-hormiga.git
cd gastos-hormiga
npm install
cp .env.example .env        # completar secretos locales; nunca commitear .env
docker compose up -d        # PostgreSQL 18 en localhost:5433
npm run db:migrate          # crea las tablas
npm run db:seed             # categorías predeterminadas de usuarios existentes
npm run dev                 # http://localhost:3000
```

### Sin Docker (alternativa local)

Si Docker no puede iniciar su motor, usa el PostgreSQL instalado en el sistema. Crea un rol y una
base dedicados (no reutilices el superusuario):

```sql
CREATE ROLE gastos_hormiga LOGIN PASSWORD 'gastos_hormiga_dev';
CREATE DATABASE gastos_hormiga OWNER gastos_hormiga;
```

Luego ajusta `DATABASE_URL` a `localhost:5432` en `.env`. El resto de los comandos es idéntico.

Variables principales (ver `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` y las credenciales de PostgreSQL para Compose.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos |
| `npm test` | Pruebas unitarias con Vitest |
| `npm run test:integration` | Pruebas contra PostgreSQL real (aislamiento entre usuarios) |
| `npm run db:migrate` | Crear y aplicar migraciones |
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
- **Fase 2** — Configuración: Next.js, Tailwind, shadcn, Prisma, Better Auth y Docker.
- **Fase 3** — Dominio y API: categorías, gastos, presupuestos, validación y permisos.
- **Fase 4** — Autenticación, layout y pantallas conectadas.
- **Fase 5** — Analítica, gráficos y simulador.
- **Fase 6** — Pruebas, CI, despliegue y documentación final.

Después del MVP: gastos recurrentes, notificaciones, importación de cartolas, presupuestos
compartidos e integración con LifeDashboard.

## Licencia

MIT — ver [LICENSE](LICENSE).
